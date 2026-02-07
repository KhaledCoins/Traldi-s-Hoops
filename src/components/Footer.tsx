import React from 'react';
import { Instagram, Mail, MapPin } from 'lucide-react';
import { MotionToggle } from './MotionToggle';
import logo from 'figma:asset/190696c41d91b73bdeaa93f8482abe1a77443990.png';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-gray-900 border-t-2 border-gray-800 mt-20">
      <div className="container-main py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <img 
              src={logo} 
              alt="Traldi's Hoops" 
              className="h-10 w-auto mb-4"
            />
            <p className="text-gray-400 text-sm">
              Basquete + lifestyle. Organização de eventos presenciais com sistema digital de fila.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h6 className="text-white mb-4">NAVEGAÇÃO</h6>
            <nav className="flex flex-col gap-2">
              <button
                onClick={() => onNavigate('home')}
                className="text-gray-400 hover:text-white text-sm text-left transition-colors"
              >
                Início
              </button>
              <button
                onClick={() => onNavigate('eventos')}
                className="text-gray-400 hover:text-white text-sm text-left transition-colors"
              >
                Eventos
              </button>
              <button
                onClick={() => onNavigate('fila-ao-vivo')}
                className="text-gray-400 hover:text-white text-sm text-left transition-colors"
              >
                Fila ao Vivo
              </button>
              <button
                onClick={() => onNavigate('memorias')}
                className="text-gray-400 hover:text-white text-sm text-left transition-colors"
              >
                Memórias
              </button>
              <button
                onClick={() => onNavigate('projeto')}
                className="text-gray-400 hover:text-white text-sm text-left transition-colors"
              >
                Projeto
              </button>
              <button
                onClick={() => onNavigate('parceiros')}
                className="text-gray-400 hover:text-white text-sm text-left transition-colors"
              >
                Parceiros
              </button>
              <button
                onClick={() => onNavigate('contato')}
                className="text-gray-400 hover:text-white text-sm text-left transition-colors"
              >
                Contato
              </button>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h6 className="text-white mb-4">CONTATO</h6>
            <div className="space-y-3">
              <a
                href="https://instagram.com/traldishoops"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
              >
                <Instagram className="w-4 h-4" />
                @traldishoops
              </a>
              <a
                href="mailto:traldishoops@gmail.com"
                className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
              >
                <Mail className="w-4 h-4" />
                traldishoops@gmail.com
              </a>
              <div className="flex items-start gap-2 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>São José dos Campos, SP</span>
              </div>
            </div>
          </div>
        </div>

        <div className="divider" />

        {/* Motion Toggle */}
        <div className="flex justify-center mb-6">
          <MotionToggle />
        </div>

        <div className="text-center">
          <p className="text-gray-500 text-sm mb-3">
            © 2025 Traldi's Hoops. Todos os direitos reservados.
          </p>
          <p className="text-gray-400 text-sm">
            Site desenvolvido por <span className="text-white font-semibold">Eduardo Khaled</span>
          </p>
        </div>
      </div>
    </footer>
  );
}