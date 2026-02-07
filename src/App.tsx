import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Eventos } from './pages/Eventos';
import { Evento } from './pages/Evento';
import { Fila } from './pages/Fila';
import { FilaAoVivoAnimated } from './pages/FilaAoVivoAnimated';
import { PainelTV } from './pages/PainelTV';
import { PainelAdmin } from './pages/PainelAdmin';
import { Projeto } from './pages/Projeto';
import { Parceiros } from './pages/Parceiros';
import { Contato } from './pages/Contato';
import { Memorias } from './pages/Memorias';

type Page = 
  | 'home' 
  | 'eventos' 
  | 'evento' 
  | 'fila'
  | 'fila-ao-vivo'
  | 'painel-tv' 
  | 'painel-admin'
  | 'projeto'
  | 'parceiros'
  | 'contato'
  | 'memorias';

// Parse hash (#painel-tv) and query (?event=xxx) from URL
function parseUrlRoute(): { page: Page; eventId: string | null } {
  const hash = window.location.hash.slice(1) || 'home';
  const [pagePart, queryPart] = hash.split('?');
  const page = (pagePart || 'home') as Page;
  let eventId: string | null = null;
  if (queryPart) {
    const params = new URLSearchParams(queryPart);
    eventId = params.get('event');
  }
  const validPages: Page[] = ['home', 'eventos', 'evento', 'fila', 'fila-ao-vivo', 'painel-tv', 'painel-admin', 'projeto', 'parceiros', 'contato', 'memorias'];
  return {
    page: validPages.includes(page) ? page : 'home',
    eventId,
  };
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>(() => parseUrlRoute().page);
  const [currentEventId, setCurrentEventId] = useState<string | null>(() => parseUrlRoute().eventId);

  // Ler URL quando hash mudar (permite abrir links diretos)
  useEffect(() => {
    const applyRoute = () => {
      const { page, eventId } = parseUrlRoute();
      setCurrentPage(page);
      setCurrentEventId(eventId);
    };
    applyRoute();
    window.addEventListener('hashchange', applyRoute);
    return () => window.removeEventListener('hashchange', applyRoute);
  }, []);

  const handleNavigate = (page: string, eventId?: string) => {
    setCurrentPage(page as Page);
    if (eventId) {
      setCurrentEventId(eventId);
    } else if (page === 'eventos' || page === 'home' || page === 'projeto' || page === 'parceiros' || page === 'contato' || page === 'memorias' || page === 'fila-ao-vivo') {
      setCurrentEventId(null);
    }
    // Atualizar URL hash para links compartilháveis
    const hash = eventId ? `${page}?event=${eventId}` : page;
    if (window.location.hash !== `#${hash}`) {
      window.location.hash = hash;
    }
    window.scrollTo(0, 0);
  };

  // Páginas sem Header/Footer (painéis de TV e admin)
  const fullscreenPages: Page[] = ['painel-tv', 'painel-admin'];
  const isFullscreen = fullscreenPages.includes(currentPage);

  // Renderizar página atual
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigate} />;
      
      case 'eventos':
        return <Eventos onNavigate={handleNavigate} />;
      
      case 'evento':
        return currentEventId ? (
          <Evento eventId={currentEventId} onNavigate={handleNavigate} />
        ) : (
          <Eventos onNavigate={handleNavigate} />
        );
      
      case 'fila':
        return currentEventId ? (
          <Fila eventId={currentEventId} onNavigate={handleNavigate} />
        ) : (
          <Eventos onNavigate={handleNavigate} />
        );
      
      case 'fila-ao-vivo':
        return <FilaAoVivoAnimated eventId={currentEventId ?? undefined} onNavigate={handleNavigate} />;
      
      case 'painel-tv':
        return currentEventId ? (
          <PainelTV eventId={currentEventId} />
        ) : (
          <Eventos onNavigate={handleNavigate} />
        );
      
      case 'painel-admin':
        return currentEventId ? (
          <PainelAdmin eventId={currentEventId} onNavigate={handleNavigate} />
        ) : (
          <Eventos onNavigate={handleNavigate} />
        );
      
      case 'projeto':
        return <Projeto onNavigate={handleNavigate} />;
      
      case 'parceiros':
        return <Parceiros onNavigate={handleNavigate} />;
      
      case 'contato':
        return <Contato />;
      
      case 'memorias':
        return <Memorias onNavigate={handleNavigate} />;
      
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  if (isFullscreen) {
    return <div className="min-h-screen">{renderPage()}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        onNavigate={handleNavigate} 
        currentPage={currentPage} 
      />
      
      <main className="flex-1">
        {renderPage()}
      </main>
      
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}