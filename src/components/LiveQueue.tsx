import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { Activity, Users, Trophy, Clock } from 'lucide-react';
import { useQueue } from '../hooks/useQueue';

interface Team {
  name: string;
  players: number;
}

interface Match {
  teamA: Team;
  teamB: Team;
}

const MOCK_MATCHES: Match[] = [
  { teamA: { name: 'Time Relâmpago', players: 5 }, teamB: { name: 'Time Thunder', players: 5 } },
  { teamA: { name: 'Time Street Ballers', players: 5 }, teamB: { name: 'Time Warriors', players: 5 } },
  { teamA: { name: 'Time Rucker Park', players: 5 }, teamB: { name: 'Time Legacy', players: 5 } },
];

interface LiveQueueProps {
  eventId?: string;
  onJoinQueue?: () => void;
}

function LiveQueueWithSupabase({ eventId, onJoinQueue }: LiveQueueProps & { eventId: string }) {
  const { teamsQueue, loading } = useQueue(eventId);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const playingTeams = teamsQueue.filter((t) => t.status === 'playing');
  const waitingTeams = teamsQueue.filter((t) => t.status === 'waiting').sort((a, b) => (a.position || 0) - (b.position || 0));

  const currentMatch: Match | null = playingTeams.length === 2
    ? { teamA: { name: playingTeams[0].name, players: 5 }, teamB: { name: playingTeams[1].name, players: 5 } }
    : null;

  const upcomingMatches: Match[] = []
        .concat(
          ...Array.from({ length: Math.floor(waitingTeams.length / 2) }, (_, i) => {
            const a = waitingTeams[i * 2];
            const b = waitingTeams[i * 2 + 1];
            return a && b ? [{ teamA: { name: a.name, players: 5 }, teamB: { name: b.name, players: 5 } }] : [];
          })
        )
        .flat();

  useEffect(() => {
    const t = setInterval(() => setLastUpdate(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <p className="text-gray-400 text-center">Carregando fila...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com status */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white mb-2">Fila em tempo real</h3>
          <p className="text-gray-400">Ordem justa. Sem furo de fila.</p>
        </div>
        <div className="flex items-center gap-2">
          {onJoinQueue && (
            <button
              onClick={onJoinQueue}
              className="px-4 py-2 bg-white text-black text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            >
              Entrar na fila
            </button>
          )}
          <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border-2 border-green-500 rounded-lg">
            <Activity className="w-5 h-5 text-green-500 animate-pulse" />
            <span className="text-green-500 font-semibold text-sm">Fila ativa</span>
          </div>
        </div>
      </div>

      {/* Jogando agora */}
      <Card className="p-6 border-white">
        <div className="flex items-center gap-3 mb-4">
          <Trophy className="w-6 h-6 text-white" />
          <h4 className="text-white">JOGANDO AGORA</h4>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 text-center">
              <div className="text-white font-black text-xl mb-1">{currentMatch?.teamA.name || '-'}</div>
              <div className="text-gray-400 text-sm">{currentMatch?.teamA.players || 0} jogadores</div>
            </div>
            
            <div className="text-white text-2xl font-black px-4">VS</div>
            
            <div className="flex-1 text-center">
              <div className="text-white font-black text-xl mb-1">{currentMatch?.teamB.name || '-'}</div>
              <div className="text-gray-400 text-sm">{currentMatch?.teamB.players || 0} jogadores</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Próximos na fila */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-6 h-6 text-white" />
          <h4 className="text-white">PRÓXIMOS NA FILA</h4>
        </div>
        
        <div className="space-y-3">
          {upcomingMatches.map((match, index) => (
            <div 
              key={index}
              className="bg-gray-800 rounded-lg p-4 flex items-center gap-4 transition-all hover:bg-gray-700"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-gray-700 rounded-lg flex-shrink-0">
                <span className="text-white font-black">{index + 1}</span>
              </div>
              
              <div className="flex-1 flex items-center justify-between gap-2 text-sm">
                <span className="text-white font-semibold">{match.teamA.name}</span>
                <span className="text-gray-500">vs</span>
                <span className="text-white font-semibold">{match.teamB.name}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Última atualização */}
      <div className="text-center text-gray-500 text-sm">
        Última atualização: {formatTime(lastUpdate)}
      </div>
    </div>
  );
}

function LiveQueueMock({ onJoinQueue }: { onJoinQueue?: () => void }) {
  const [currentMatch] = useState<Match>(MOCK_MATCHES[0]);
  const [upcomingMatches] = useState<Match[]>(MOCK_MATCHES.slice(1));
  const [lastUpdate, setLastUpdate] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setLastUpdate(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const formatTime = (d: Date) => d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white mb-2">Fila em tempo real</h3>
          <p className="text-gray-400">Ordem justa. Sem furo de fila.</p>
        </div>
        <div className="flex items-center gap-2">
          {onJoinQueue && (
            <button onClick={onJoinQueue} className="px-4 py-2 bg-white text-black text-sm font-semibold rounded-lg hover:bg-gray-200">Entrar na fila</button>
          )}
          <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border-2 border-green-500 rounded-lg">
            <Activity className="w-5 h-5 text-green-500 animate-pulse" />
            <span className="text-green-500 font-semibold text-sm">Fila ativa</span>
          </div>
        </div>
      </div>
      <Card className="p-6 border-white">
        <div className="flex items-center gap-3 mb-4">
          <Trophy className="w-6 h-6 text-white" />
          <h4 className="text-white">JOGANDO AGORA</h4>
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 text-center">
              <div className="text-white font-black text-xl mb-1">{currentMatch.teamA.name}</div>
              <div className="text-gray-400 text-sm">{currentMatch.teamA.players} jogadores</div>
            </div>
            <div className="text-white text-2xl font-black px-4">VS</div>
            <div className="flex-1 text-center">
              <div className="text-white font-black text-xl mb-1">{currentMatch.teamB.name}</div>
              <div className="text-gray-400 text-sm">{currentMatch.teamB.players} jogadores</div>
            </div>
          </div>
        </div>
      </Card>
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-6 h-6 text-white" />
          <h4 className="text-white">PRÓXIMOS NA FILA</h4>
        </div>
        <div className="space-y-3">
          {upcomingMatches.map((match, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-4 flex items-center gap-4">
              <div className="flex justify-center w-10 h-10 bg-gray-700 rounded-lg flex-shrink-0 items-center">
                <span className="text-white font-black">{index + 1}</span>
              </div>
              <div className="flex-1 flex items-center justify-between gap-2 text-sm">
                <span className="text-white font-semibold">{match.teamA.name}</span>
                <span className="text-gray-500">vs</span>
                <span className="text-white font-semibold">{match.teamB.name}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <div className="text-center text-gray-500 text-sm">Última atualização: {formatTime(lastUpdate)}</div>
    </div>
  );
}

export function LiveQueue(props: LiveQueueProps) {
  if (props.eventId) {
    return <LiveQueueWithSupabase {...props} eventId={props.eventId} />;
  }
  return <LiveQueueMock onJoinQueue={props.onJoinQueue} />;
}