import React from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Handshake, Megaphone, Store, Users, CheckCircle2, TrendingUp, Instagram, Eye, UserCheck } from 'lucide-react';

interface ParceirosProps {
  onNavigate: (page: string) => void;
}

export function Parceiros({ onNavigate }: ParceirosProps) {
  const currentPartners = [
    { name: 'Kuboo', category: 'Seguros e Consórcios', logo: 'KB' },
    { name: 'Família Animal', category: 'Veterinária', logo: 'FA' },
    { name: 'Diggos Burguer', category: 'Alimentação', logo: 'DB' },
    { name: 'Sharks', category: 'Barbearia', logo: 'SH' },
    { name: 'Aqui Vale', category: 'Serviços', logo: 'AV' },
    { name: 'Boali', category: 'Lifestyle', logo: 'BL' },
    { name: 'ArtWalk', category: 'Arte e Cultura', logo: 'AW' },
    { name: 'My Choice', category: 'Açaí', logo: 'MC' },
    { name: 'Além da Raiz', category: 'Alimentação Natural', logo: 'AR' },
    { name: 'Mercadinho do Japonês', category: 'Mercearia', logo: 'MJ' },
    { name: '96 Skills', category: 'Educação e Esportes', logo: '96' }
  ];

  const benefits = [
    {
      icon: Megaphone,
      title: 'Exposição da marca',
      description: 'Logo em materiais digitais, painel TV e redes sociais'
    },
    {
      icon: Users,
      title: 'Acesso direto ao público',
      description: 'Contato direto com praticantes de basquete urbano'
    },
    {
      icon: Store,
      title: 'Ativações no evento',
      description: 'Espaço para demonstrações, testes de produto e vendas'
    },
    {
      icon: Handshake,
      title: 'Associação positiva',
      description: 'Marca conectada a esporte, comunidade e tecnologia'
    }
  ];

  const packages = [
    {
      name: 'Apoiador',
      price: 'R$ 500/evento',
      features: [
        'Logo no painel TV',
        'Menção nas redes sociais',
        'Logo no site',
        '1 post dedicado'
      ]
    },
    {
      name: 'Patrocinador',
      price: 'R$ 1.500/evento',
      features: [
        'Todos os benefícios de Apoiador',
        'Espaço para stand no evento',
        'Logo em destaque',
        '3 posts dedicados',
        'Vídeo de recap do evento'
      ],
      highlighted: true
    },
    {
      name: 'Naming Rights',
      price: 'A combinar',
      features: [
        'Todos os benefícios de Patrocinador',
        'Nome no título do evento',
        'Exclusividade de categoria',
        'Ativação premium',
        'Campanha completa de marketing'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container-main">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-white mb-6">Parceiros</h1>
          <p className="text-gray-400 text-xl max-w-3xl mx-auto">
            Conecte sua marca ao basquete urbano, tecnologia e uma comunidade 
            engajada e autêntica.
          </p>
        </div>

        {/* Current Partners */}
        <section className="mb-20">
          <h2 className="text-white text-center mb-12">Quem já está com a gente</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {currentPartners.map((partner, index) => (
              <Card key={index} className="p-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-black text-xl">{partner.logo}</span>
                  </div>
                  <p className="text-white font-semibold text-sm mb-1">{partner.name}</p>
                  <p className="text-gray-500 text-xs">{partner.category}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="mb-20">
          <h2 className="text-white text-center mb-12">Por que ser parceiro?</h2>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="p-8">
                  <Icon className="w-12 h-12 text-white mb-4" />
                  <h4 className="text-white mb-3">{benefit.title}</h4>
                  <p className="text-gray-400">{benefit.description}</p>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Partnership Packages */}
        <section className="mb-20">
          <h2 className="text-white text-center mb-12">Como se tornar parceiro</h2>
          
          <Card className="p-12 text-center max-w-3xl mx-auto">
            <h3 className="text-white mb-6">Interessado em parceria?</h3>
            <p className="text-gray-400 text-lg mb-8">
              Entre em contato para conhecer as oportunidades de parceria 
              e entender como podemos trabalhar juntos para fortalecer o basquete.
            </p>
            <Button 
              variant="accent"
              onClick={() => onNavigate('contato')}
            >
              Entrar em contato
            </Button>
          </Card>
        </section>

        {/* Stats */}
        <section className="mb-20">
          <Card className="p-12">
            <h3 className="text-white text-center mb-12">Nosso alcance</h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-lg mb-4">
                  <UserCheck className="w-8 h-8 text-black" />
                </div>
                <div className="text-4xl font-black text-white mb-2">+150</div>
                <div className="text-gray-400">Jogadores por evento</div>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-lg mb-4">
                  <Instagram className="w-8 h-8 text-black" />
                </div>
                <div className="text-4xl font-black text-white mb-2">+1K</div>
                <div className="text-gray-400">Seguidores no Instagram</div>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-lg mb-4">
                  <Eye className="w-8 h-8 text-black" />
                </div>
                <div className="text-4xl font-black text-white mb-2">+270K</div>
                <div className="text-gray-400">Impressões mensais</div>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-lg mb-4">
                  <TrendingUp className="w-8 h-8 text-black" />
                </div>
                <div className="text-4xl font-black text-white mb-2">16-45</div>
                <div className="text-gray-400">Anos (público)</div>
              </div>
            </div>
          </Card>
        </section>

        {/* CTA */}
        <section className="text-center">
          <Card className="p-12 md:p-16">
            <h2 className="text-white mb-6">Vamos conversar?</h2>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Entre em contato para conhecer melhor o projeto e criar uma parceria personalizada.
            </p>
            <Button 
              variant="accent"
              onClick={() => onNavigate('contato')}
              className="text-lg px-8 py-4"
            >
              Entrar em contato
            </Button>
          </Card>
        </section>
      </div>
    </div>
  );
}