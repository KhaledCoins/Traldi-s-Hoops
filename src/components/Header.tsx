import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './Button';
import logo from 'figma:asset/190696c41d91b73bdeaa93f8482abe1a77443990.png';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function Header({ onNavigate, currentPage }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Início' },
    { id: 'eventos', label: 'Eventos' },
    { id: 'fila-ao-vivo', label: 'Fila ao Vivo' },
    { id: 'memorias', label: 'Memórias' },
    { id: 'projeto', label: 'Projeto' },
    { id: 'parceiros', label: 'Parceiros' },
    { id: 'contato', label: 'Contato' },
  ];

  const handleNavigate = (page: string) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-black border-b-2 border-gray-800 sticky top-0 z-40">
      <div className="container-main">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button 
            onClick={() => handleNavigate('home')}
            className="hover:opacity-80 transition-opacity"
          >
            <img 
              src={logo} 
              alt="Traldi's Hoops" 
              className="h-10 md:h-12 w-auto"
            />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`text-sm font-semibold uppercase tracking-wide transition-colors ${
                  currentPage === item.id
                    ? 'text-white'
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white hover:bg-gray-900 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t-2 border-gray-800">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`text-left px-4 py-3 rounded-lg text-sm font-semibold uppercase tracking-wide transition-colors ${
                    currentPage === item.id
                      ? 'bg-white text-black'
                      : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}