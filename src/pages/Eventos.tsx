import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { Calendar, MapPin, Users, Monitor } from 'lucide-react';
import { getEvents, type Event } from '../lib/supabase';

function formatEventDate(dateStr: string): string {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

function formatEventTime(timeStr: string): string {
  if (!timeStr) return '';
  return timeStr.slice(0, 5);
}

interface EventosProps {
  onNavigate: (page: string, eventId?: string) => void;
}

export function Eventos({ onNavigate }: EventosProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'upcoming' | 'finished'>('all');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEvents().then((data) => {
      setEvents(data);
      setLoading(false);
    });
  }, []);

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    return event.status === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-black py-12 flex items-center justify-center">
        <p className="text-gray-400">Carregando eventos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container-main">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-white mb-4">Eventos</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Todos os eventos Traldi's Hoops. Entre na fila dos eventos ativos.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          <Button
            variant={filter === 'all' ? 'primary' : 'secondary'}
            onClick={() => setFilter('all')}
          >
            Todos
          </Button>
          <Button
            variant={filter === 'active' ? 'primary' : 'secondary'}
            onClick={() => setFilter('active')}
          >
            Ativos
          </Button>
          <Button
            variant={filter === 'upcoming' ? 'primary' : 'secondary'}
            onClick={() => setFilter('upcoming')}
          >
            Próximos
          </Button>
          <Button
            variant={filter === 'finished' ? 'primary' : 'secondary'}
            onClick={() => setFilter('finished')}
          >
            Encerrados
          </Button>
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {filteredEvents.map((event) => (
            <Card 
              key={event.id}
              variant={event.status === 'active' ? 'hover' : 'default'}
              className="p-6"
              onClick={event.status !== 'finished' ? () => onNavigate('evento', event.id) : undefined}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <h4 className="text-white flex-1">{event.title}</h4>
                  {event.status === 'active' && (
                    <Badge variant="playing">Ao vivo</Badge>
                  )}
                  {event.status === 'upcoming' && (
                    <Badge variant="waiting">Em breve</Badge>
                  )}
                  {event.status === 'finished' && (
                    <Badge variant="solo">Encerrado</Badge>
                  )}
                </div>

                {/* Event Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">{formatEventDate(event.date)} • {formatEventTime(event.time)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">{event.location}, {event.address?.split(' - ').pop() || ''}</span>
                  </div>

                  {event.status === 'active' && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <Users className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">{event.max_players || 0} vagas</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-4 border-t-2 border-gray-800 space-y-2">
                  {event.status === 'active' && (
                    <>
                      <Button 
                        variant="accent" 
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate('evento', event.id);
                        }}
                      >
                        Entrar na fila
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate('painel-tv', event.id);
                        }}
                      >
                        <Monitor className="w-4 h-4" />
                        Ver Painel TV
                      </Button>
                    </>
                  )}
                  
                  {event.status === 'upcoming' && (
                    <p className="text-gray-500 text-sm text-center py-2">
                      Check-in abre no dia do evento
                    </p>
                  )}
                  
                  {event.status === 'finished' && (
                    <p className="text-gray-600 text-sm text-center py-2">
                      Evento encerrado
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum evento encontrado nesta categoria.</p>
          </div>
        )}
      </div>
    </div>
  );
}