import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import foto1 from 'figma:asset/fe9ca1a0f4124243dfe43c53d3b1ca93d62ebc01.png';
import foto2 from 'figma:asset/4fbcff70e94e5d02928ebac2aff600218451ce96.png';
import foto3 from 'figma:asset/eceb0cbbd9f9d1487a3c472d2acc00209ea9b3bc.png';

interface MemoriasProps {
  onNavigate: (page: string) => void;
}

interface Photo {
  id: number;
  url: string;
  alt: string;
}

export function Memorias({ onNavigate }: MemoriasProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

  const photos: Photo[] = [
    {
      id: 1,
      url: foto1,
      alt: 'Racha Traldi\'s Hoops - Lance na quadra'
    },
    {
      id: 2,
      url: foto2,
      alt: 'Jogador Traldi\'s Hoops controlando a bola'
    },
    {
      id: 3,
      url: foto3,
      alt: 'Equipe Traldi\'s Hoops - Momento de amizade'
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1602619075255-d090a7443bfb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXQlMjBiYXNrZXRiYWxsJTIwZ2FtZXxlbnwxfHx8fDE3NjcxMTUzNDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      alt: 'Jogo de basquete de rua'
    },
    {
      id: 5,
      url: 'https://images.unsplash.com/photo-1693278861778-f0b286906cc0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdXRkb29yJTIwYmFza2V0YmFsbCUyMGNvdXJ0fGVufDF8fHx8MTc2NzExNTM0Mnww&ixlib=rb-4.1.0&q=80&w=1080',
      alt: 'Quadra ao ar livre'
    },
    {
      id: 6,
      url: 'https://images.unsplash.com/photo-1705594858888-90d164689257?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwcGxheWVycyUyMGFjdGlvbnxlbnwxfHx8fDE3NjcxMTUzNDN8MA&ixlib=rb-4.1.0&q=80&w=1080',
      alt: 'Jogadores em ação'
    },
    {
      id: 7,
      url: 'https://images.unsplash.com/photo-1759936802396-0177ea95a088?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwY2VsZWJyYXRpb258ZW58MXx8fHwxNzY3MTE1MzQzfDA&ixlib=rb-4.1.0&q=80&w=1080',
      alt: 'Celebração'
    },
    {
      id: 8,
      url: 'https://images.unsplash.com/photo-1713427508502-291a5b927df1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwZnJpZW5kc3xlbnwxfHx8fDE3NjcxMTUzNDN8MA&ixlib=rb-4.1.0&q=80&w=1080',
      alt: 'Amigos jogando'
    },
    {
      id: 9,
      url: 'https://images.unsplash.com/photo-1744455695626-7cc1b26f7adf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwY29tbXVuaXR5fGVufDF8fHx8MTc2NzExNTM0M3ww&ixlib=rb-4.1.0&q=80&w=1080',
      alt: 'Comunidade'
    },
    {
      id: 10,
      url: 'https://images.unsplash.com/photo-1676243185470-544231b5a2f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMGJhc2tldGJhbGx8ZW58MXx8fHwxNzY3MTE1MzQ0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      alt: 'Basquete urbano'
    },
    {
      id: 11,
      url: 'https://images.unsplash.com/photo-1608245449230-4ac19066d2d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwZHVua3xlbnwxfHx8fDE3NjcxMTUzNDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      alt: 'Enterrada'
    }
  ];

  const openLightbox = (photoId: number) => {
    setSelectedPhoto(photoId);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
    document.body.style.overflow = 'auto';
  };

  const goToPrevious = () => {
    if (selectedPhoto === null) return;
    const currentIndex = photos.findIndex(p => p.id === selectedPhoto);
    const prevIndex = currentIndex === 0 ? photos.length - 1 : currentIndex - 1;
    setSelectedPhoto(photos[prevIndex].id);
  };

  const goToNext = () => {
    if (selectedPhoto === null) return;
    const currentIndex = photos.findIndex(p => p.id === selectedPhoto);
    const nextIndex = currentIndex === photos.length - 1 ? 0 : currentIndex + 1;
    setSelectedPhoto(photos[nextIndex].id);
  };

  const selectedPhotoData = photos.find(p => p.id === selectedPhoto);

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container-main">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-white mb-6">Memórias de Quadra</h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">
            Onde o jogo vira conexão.
          </p>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <button
              key={photo.id}
              onClick={() => openLightbox(photo.id)}
              className="relative aspect-square overflow-hidden rounded-lg group cursor-pointer"
            >
              <img
                src={photo.url}
                alt={photo.alt}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </button>
          ))}
        </div>

        {/* Empty state for future photos */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            Mais memórias em breve. Cada racha conta uma história.
          </p>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto !== null && selectedPhotoData && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
            aria-label="Fechar"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Previous Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
            aria-label="Próximo"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Image */}
          <div 
            className="relative max-w-6xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedPhotoData.url}
              alt={selectedPhotoData.alt}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/10 rounded-full">
            <span className="text-white text-sm font-medium">
              {photos.findIndex(p => p.id === selectedPhoto) + 1} / {photos.length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}