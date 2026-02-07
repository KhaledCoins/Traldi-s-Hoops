import React from 'react';
import { Badge } from './Badge';
import { Card } from './Card';
import { Users, User } from 'lucide-react';

interface PlayerCardProps {
  position: number;
  name: string;
  isTeam: boolean;
  teamSize?: number;
  status: 'playing' | 'next' | 'waiting';
  onClick?: () => void;
}

export function PlayerCard({ 
  position, 
  name, 
  isTeam, 
  teamSize,
  status,
  onClick 
}: PlayerCardProps) {
  return (
    <Card 
      variant={status === 'playing' ? 'active' : onClick ? 'hover' : 'default'}
      className="p-4"
      onClick={onClick}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Position Number */}
          <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center border-2 ${
            status === 'playing' 
              ? 'bg-black text-white border-black' 
              : 'bg-gray-800 text-white border-gray-700'
          }`}>
            <span className="font-black text-lg">{position}</span>
          </div>

          {/* Player/Team Info */}
          <div className="flex-1 min-w-0">
            <div className={`font-bold text-lg truncate ${status === 'playing' ? 'text-black' : 'text-white'}`}>
              {name}
            </div>
            <div className="flex items-center gap-2 mt-1">
              {isTeam ? (
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <Users className="w-4 h-4" />
                  <span>{teamSize || 5} jogadores</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <User className="w-4 h-4" />
                  <span>Avulso</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex-shrink-0">
          {status === 'playing' && <Badge variant="playing">Jogando</Badge>}
          {status === 'next' && <Badge variant="next">Próximo</Badge>}
          {status === 'waiting' && <Badge variant="waiting">Na fila</Badge>}
        </div>
      </div>
    </Card>
  );
}
