import React from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Target, Users, Zap, Shield, Trophy, Heart } from 'lucide-react';

interface ProjetoProps {
  onNavigate: (page: string) => void;
}

export function Projeto({ onNavigate }: ProjetoProps) {
  const values = [
    {
      icon: Shield,
      title: 'Transparência',
      description: 'Sistema digital elimina furo de fila e garante justiça para todos'
    },
    {
      icon: Users,
      title: 'Comunidade',
      description: 'Criamos espaços para o basquete urbano e conexões reais'
    },
    {
      icon: Zap,
      title: 'Eficiência',
      description: 'Tecnologia simples que funciona, sem complicação'
    },
    {
      icon: Heart,
      title: 'Paixão pelo jogo',
      description: 'Basquete como lifestyle, não apenas esporte'
    }
  ];

  const timeline = [
    { year: '2025', event: 'Primeira edição: Traldi\'s Hoops #1 - Quadra do Carrefour (16/11)' },
    { year: '2025', event: 'Segunda edição: Racha Natal Solidário - Quadra 31 de Março (21/12)' },
    { year: '2025', event: 'Desenvolvimento do sistema digital de fila' },
    { year: '2025', event: 'Expansão para novas quadras e cidades' }
  ];

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container-main">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-white mb-6">O Projeto</h1>
          <p className="text-gray-400 text-xl max-w-3xl mx-auto">
            Traldi's Hoops nasceu da necessidade de organizar eventos de basquete 
            com transparência, tecnologia e respeito ao jogo.
          </p>
        </div>

        {/* Mission */}
        <section className="mb-20">
          <Card className="p-12 md:p-16 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6">
              <Target className="w-10 h-10 text-black" />
            </div>
            <h2 className="text-white mb-6">Nossa missão</h2>
            <p className="text-gray-400 text-xl max-w-3xl mx-auto leading-relaxed">
              Organizar eventos de basquete presenciais com um sistema digital 
              que garante ordem, transparência e justiça. Queremos que todos joguem, 
              sem privilégios, sem furo de fila.
            </p>
          </Card>
        </section>

        {/* Values */}
        <section className="mb-20">
          <h2 className="text-white text-center mb-12">Nossos valores</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="p-8 text-center">
                  <Icon className="w-12 h-12 text-white mx-auto mb-4" />
                  <h5 className="text-white mb-3">{value.title}</h5>
                  <p className="text-gray-400 text-sm">{value.description}</p>
                </Card>
              );
            })}
          </div>
        </section>

        {/* How it started */}
        <section className="mb-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-white mb-6">Como começou</h2>
              <div className="space-y-4 text-gray-400">
                <p>
                  Em 2025, começamos organizando eventos de basquete em quadras públicas 
                  de São José dos Campos. O problema era sempre o mesmo: desorganização, furo de fila 
                  e falta de transparência.
                </p>
                <p>
                  Decidimos criar um sistema digital que resolvesse isso de uma vez por todas. 
                  Uma fila justa, visível para todos em tempo real, impossível de furar.
                </p>
                <p>
                  Hoje, o Traldi's Hoops é mais do que eventos. É uma comunidade que respeita 
                  o jogo e valoriza cada jogador.
                </p>
              </div>
            </div>
            
            <Card className="p-12 bg-gray-900">
              <Trophy className="w-16 h-16 text-white mb-6" />
              <h3 className="text-white mb-4">Resultados até agora</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b-2 border-gray-800">
                  <span className="text-gray-400">Eventos realizados</span>
                  <span className="text-white text-2xl font-black">2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Jogadores atendidos</span>
                  <span className="text-white text-2xl font-black">+250</span>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-20">
          <h2 className="text-white text-center mb-12">Linha do tempo</h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {timeline.map((item, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-20 h-20 bg-white rounded-lg flex items-center justify-center">
                    <span className="text-black font-black text-xl">{item.year}</span>
                  </div>
                  <div className="flex-1 pt-4">
                    <p className="text-white text-lg">{item.event}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <Card className="p-12 md:p-16">
            <h2 className="text-white mb-6">Quer fazer parte?</h2>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Seja participando dos eventos, se tornando parceiro ou trazendo 
              o sistema para sua cidade.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                variant="accent"
                onClick={() => onNavigate('eventos')}
              >
                Ver eventos
              </Button>
              <Button 
                variant="secondary"
                onClick={() => onNavigate('contato')}
              >
                Entrar em contato
              </Button>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}