import React, { useState, useEffect } from 'react';
import { AnimatedButton } from '../components/AnimatedButton';
import { AnimatedCard } from '../components/AnimatedCard';
import { EventCard } from '../components/EventCard';
import { Card } from '../components/Card';
import { CheckCircle2, Users, Trophy, QrCode } from 'lucide-react';
import logo from 'figma:asset/190696c41d91b73bdeaa93f8482abe1a77443990.png';
import { getEvents } from '../lib/supabase';

function formatEventDate(dateStr: string): string {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

function formatEventTime(timeStr: string): string {
  if (!timeStr) return '';
  return timeStr.slice(0, 5);
}

interface HomeProps {
  onNavigate: (page: string, eventId?: string) => void;
}

export function Home({ onNavigate }: HomeProps) {
  const [nextEvent, setNextEvent] = useState<{ id: string; title: string; date: string; time: string; location: string; status: 'active' | 'upcoming'; spotsLeft: number } | null>(null);

  useEffect(() => {
    getEvents().then((events) => {
      const activeOrUpcoming = events.find((e) => e.status === 'active' || e.status === 'upcoming');
      if (activeOrUpcoming) {
        setNextEvent({
          id: activeOrUpcoming.id,
          title: activeOrUpcoming.title,
          date: formatEventDate(activeOrUpcoming.date),
          time: formatEventTime(activeOrUpcoming.time),
          location: `${activeOrUpcoming.location}, ${activeOrUpcoming.address?.split(' - ').pop() || ''}`,
          status: activeOrUpcoming.status as 'active' | 'upcoming',
          spotsLeft: activeOrUpcoming.max_players || 0,
        });
      }
    });
  }, []);

  const howItWorks = [
    {
      icon: QrCode,
      step: '01',
      title: 'Escaneie o QR Code',
      description: 'No dia do evento, use o QR Code para acessar a fila digital'
    },
    {
      icon: Users,
      step: '02',
      title: 'Entre na fila',
      description: 'Informe se está com time pronto ou avulso. Sem furo de fila.'
    },
    {
      icon: Trophy,
      step: '03',
      title: 'Jogue e volte',
      description: 'Após jogar, você volta automaticamente para o final da fila'
    }
  ];

  const partners = [
    { name: 'Diggos Burguer', logo: 'DB' },
    { name: 'Kuboo', logo: 'KB' },
    { name: 'Sharks', logo: 'SH' },
    { name: 'Aqui Vale', logo: 'AV' }
  ];

  return (
    <div className="min-h-screen">
      {/* HERO SECTION */}
      <section className="bg-black py-24 md:py-40 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        
        <div className="container-main text-center relative z-10">
          {/* Logo */}
          <div className="mb-8">
            <img 
              src={logo} 
              alt="Traldi's Hoops" 
              className="h-24 md:h-32 lg:h-40 w-auto mx-auto"
            />
          </div>
          
          {/* Ball Don't Lie - com fonte display */}
          <div className="mb-8">
            <h1 
              className="text-white text-5xl md:text-7xl lg:text-8xl tracking-tighter"
              style={{ 
                fontFamily: 'Impact, "Arial Black", sans-serif',
                fontWeight: 900,
                letterSpacing: '-0.02em'
              }}
            >
              BALL DON'T LIE
            </h1>
          </div>

          {/* Divider */}
          <div className="w-24 h-1 bg-white mx-auto mb-8" />

          {/* Subtitle */}
          <p className="text-gray-400 text-xl md:text-2xl lg:text-3xl mb-12 max-w-3xl mx-auto font-light">
            Muito mais do que o esporte.<br className="md:hidden" /> Um movimento que transforma vidas!
          </p>
          
          {/* CTA */}
          <AnimatedButton 
            variant="accent" 
            onClick={() => onNavigate('eventos')}
            className="text-lg px-10 py-5 text-xl mb-4"
          >
            Ver Eventos
          </AnimatedButton>
          
          <div className="mt-4">
            <AnimatedButton 
              variant="secondary" 
              onClick={() => onNavigate('fila-ao-vivo')}
              className="text-base px-8 py-3"
            >
              Ver Fila ao Vivo
            </AnimatedButton>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-gray-900 py-16 md:py-24">
        <div className="container-main">
          <div className="text-center mb-12">
            <h2 className="text-white mb-4">Como funciona</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Sistema simples, rápido e transparente. Todos veem a fila em tempo real.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((item, index) => {
              const Icon = item.icon;
              return (
                <AnimatedCard key={index} className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-lg mb-6">
                    <Icon className="w-8 h-8 text-black" />
                  </div>
                  <div className="text-gray-500 text-sm font-black mb-2">
                    PASSO {item.step}
                  </div>
                  <h4 className="text-white mb-3">{item.title}</h4>
                  <p className="text-gray-400">{item.description}</p>
                </AnimatedCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* UPCOMING EVENTS */}
      <section className="bg-black py-16 md:py-24">
        <div className="container-main">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-white">Próximos eventos</h2>
            <AnimatedButton 
              variant="ghost" 
              onClick={() => onNavigate('eventos')}
            >
              Ver todos →
            </AnimatedButton>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {nextEvent ? (
              <EventCard
                key={nextEvent.id}
                title={nextEvent.title}
                date={`${nextEvent.date} • ${nextEvent.time}`}
                location={nextEvent.location}
                playersInQueue={nextEvent.spotsLeft}
                status={nextEvent.status}
                onClick={() => onNavigate('evento', nextEvent.id)}
              />
            ) : (
              <Card className="p-8 text-center">
                <p className="text-gray-500">Nenhum evento programado no momento</p>
                <AnimatedButton variant="ghost" onClick={() => onNavigate('eventos')} className="mt-4">
                  Ver eventos
                </AnimatedButton>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* MEMÓRIAS DE QUADRA CTA */}
      <section className="bg-gray-900 py-16 md:py-24 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        
        <div className="container-main text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-white mb-6">Memórias de Quadra</h2>
            <p className="text-gray-400 text-lg mb-8">
              Veja os melhores momentos dos rachas. Onde o jogo vira conexão.
            </p>
            <AnimatedButton 
              variant="secondary" 
              onClick={() => onNavigate('memorias')}
              className="text-lg px-8 py-4"
            >
              Ver Galeria
            </AnimatedButton>
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="bg-black py-16 md:py-24">{/* Changed from bg-gray-900 */}
        <div className="container-main">
          <h2 className="text-white text-center mb-12">Parceiros</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {partners.map((partner, index) => (
              <Card key={index} className="p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-800 rounded-lg flex items-center justify-center mb-3 mx-auto">
                    <span className="text-white font-black text-xl">{partner.logo}</span>
                  </div>
                  <p className="text-gray-500 text-xs font-semibold">{partner.name}</p>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <AnimatedButton 
              variant="secondary" 
              onClick={() => onNavigate('parceiros')}
            >
              Seja parceiro
            </AnimatedButton>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-black py-16 md:py-24 border-t-2 border-gray-800">
        <div className="container-main text-center">
          <h2 className="text-white mb-6">Pronto para jogar?</h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Confira os próximos eventos e garanta sua vaga na fila digital.
          </p>
          <AnimatedButton 
            variant="accent" 
            onClick={() => onNavigate('eventos')}
            className="text-lg px-8 py-4"
          >
            Ver Eventos Ativos
          </AnimatedButton>
        </div>
      </section>
    </div>
  );
}