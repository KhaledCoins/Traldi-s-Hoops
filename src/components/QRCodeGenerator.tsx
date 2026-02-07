import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Card } from './Card';
import { Button } from './Button';
import { Download, Share2 } from 'lucide-react';

interface QRCodeGeneratorProps {
  eventId: string;
  eventTitle?: string;
}

export function QRCodeGenerator({ eventId, eventTitle = 'Evento' }: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const url = `${window.location.origin}/#fila/${eventId}`;

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
    }
  }, [url]);

  const handleDownload = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `qrcode-${eventTitle.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: eventTitle,
          text: `Entre na fila digital do ${eventTitle}`,
          url: url
        });
      } catch (err) {
        console.log('Erro ao compartilhar:', err);
      }
    } else {
      // Fallback: copiar para clipboard
      navigator.clipboard.writeText(url);
      alert('Link copiado para a área de transferência!');
    }
  };

  return (
    <Card className="p-6">
      <div className="text-center space-y-4">
        <h4 className="text-white">QR Code - Fila Digital</h4>
        <p className="text-gray-400 text-sm">
          Escaneie para acessar a fila digital
        </p>
        
        <div className="bg-white p-4 rounded-lg inline-block">
          <canvas ref={canvasRef} />
        </div>

        <div className="pt-4 space-y-2">
          <p className="text-gray-500 text-xs break-all">
            {url}
          </p>
          
          <div className="flex gap-2 justify-center">
            <Button 
              variant="secondary" 
              onClick={handleDownload}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Baixar
            </Button>
            <Button 
              variant="secondary" 
              onClick={handleShare}
              className="flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Compartilhar
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
