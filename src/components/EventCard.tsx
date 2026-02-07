import React from 'react';
import { Card } from './Card';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { Badge } from './Badge';

interface EventCardProps {
  title: string;
  date: string;
  location: string;
  playersInQueue: number;
  status: 'active' | 'upcoming' | 'finished';
  onClick?: () => void;
}

export function EventCard({ 
  title, 
  date, 
  location, 
  playersInQueue,
  status,
  onClick 
}: EventCardProps) {
  return (
    <Card 
      variant={onClick ? 'hover' : 'default'}
      className="p-6"
      onClick={onClick}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <h4 className="text-white flex-1">{title}</h4>
          {status === 'active' && (
            <Badge variant="playing">Ao vivo</Badge>
          )}
          {status === 'upcoming' && (
            <Badge variant="waiting">Em breve</Badge>
          )}
        </div>

        {/* Event Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-400">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">{date}</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-400">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">{location}</span>
          </div>

          {status === 'active' && (
            <div className="flex items-center gap-2 text-gray-400">
              <Users className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">{playersInQueue} na fila</span>
            </div>
          )}
        </div>

        {/* Action hint */}
        {status === 'active' && onClick && (
          <div className="pt-2 border-t-2 border-gray-800">
            <span className="text-sm text-gray-500">
              Clique para entrar na fila →
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
