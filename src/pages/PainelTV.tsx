import React, { useState, useEffect } from 'react';
import { Badge } from '../components/Badge';
import { Trophy, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { useQueue } from '../hooks/useQueue';

interface PainelTVProps {
  eventId: string;
}

export function PainelTV({ eventId }: PainelTVProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Hook do Supabase com realtime
  const { event, soloQueue, teamsQueue, loading } = useQueue(eventId);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit',
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-16 h-16 text-white animate-spin mx-auto mb-4" />
          <p className="text-white text-2xl">Carregando fila...</p>
        </div>
      </div>
    );
  }

  // Estado: Fila pausada
  if (event?.is_paused) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-8">
        <div className="text-center">
          <AlertCircle className="w-32 h-32 text-gray-600 mx-auto mb-8" />
          <h1 className="text-white text-7xl mb-6">FILA PAUSADA</h1>
          <p className="text-gray-400 text-4xl">
            Aguarde retomada pela organização
          </p>
        </div>
      </div>
    );
  }

  // Times jogando
  const playingTeams = teamsQueue.filter(t => t.status === 'playing');
  const waitingTeams = teamsQueue.filter(t => t.status === 'waiting').sort((a, b) => (a.position || 0) - (b.position || 0));
  const nextTeam = waitingTeams[0];

  // Calcular próximos jogos
  const nextGames = [];
  for (let i = 0; i < Math.min(3, Math.floor(waitingTeams.length / 2)); i++) {
    const team1Index = i * 2;
    const team2Index = i * 2 + 1;
    if (waitingTeams[team1Index] && waitingTeams[team2Index]) {
      nextGames.push({
        game: i + 1,
        team1: waitingTeams[team1Index].name,
        team2: waitingTeams[team2Index].name
      });
    }
  }

  return (
    <div className="min-h-screen bg-black p-12">
      <div className="max-w-[1920px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12 pb-8 border-b-8 border-white">
          <div>
            <h6 className="text-white mb-3 text-2xl">TRALDI'S HOOPS</h6>
            <h1 className="text-white text-6xl font-black">{event?.title?.toUpperCase() || 'FILA DIGITAL'}</h1>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-4 justify-end mb-3">
              <Clock className="w-12 h-12 text-white" />
              <span className="text-white text-6xl font-black">
                {formatTime(currentTime)}
              </span>
            </div>
            <div className="flex items-center gap-3 justify-end">
              <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse" />
              <span className="text-gray-400 text-2xl">AO VIVO</span>
            </div>
          </div>
        </div>

        {/* Current Game */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-8">
            <Trophy className="w-12 h-12 text-white" />
            <h2 className="text-white text-5xl font-black">JOGANDO AGORA</h2>
          </div>

          {playingTeams.length === 2 ? (
            <div className="bg-white rounded-3xl p-12">
              <div className="space-y-8">
                {/* Team A */}
                <div className="flex items-center justify-between py-6 border-b-4 border-gray-300">
                  <div className="flex-1">
                    <div className="text-gray-600 text-xl mb-2">TIME A</div>
                    <div className="text-black text-6xl font-black">
                      {playingTeams[0].name.toUpperCase()}
                    </div>
                  </div>
                  <div className="px-8">
                    <Badge variant="playing" className="text-3xl px-8 py-4">
                      JOGANDO
                    </Badge>
                  </div>
                </div>

                {/* VS */}
                <div className="text-center py-4">
                  <span className="text-gray-400 font-black text-7xl">VS</span>
                </div>

                {/* Team B */}
                <div className="flex items-center justify-between py-6 border-t-4 border-gray-300">
                  <div className="flex-1">
                    <div className="text-gray-600 text-xl mb-2">TIME B</div>
                    <div className="text-black text-6xl font-black">
                      {playingTeams[1].name.toUpperCase()}
                    </div>
                  </div>
                  <div className="px-8">
                    <Badge variant="playing" className="text-3xl px-8 py-4">
                      JOGANDO
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-900 border-4 border-gray-800 rounded-3xl p-12 text-center">
              <AlertCircle className="w-24 h-24 text-gray-600 mx-auto mb-6" />
              <p className="text-gray-500 text-4xl">
                Aguardando início da partida
              </p>
            </div>
          )}
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-2 gap-12">
          {/* Teams Queue */}
          <div>
            <h3 className="text-white text-4xl font-black mb-8">
              PRÓXIMOS TIMES ({waitingTeams.length})
            </h3>

            {waitingTeams.length === 0 ? (
              <div className="bg-gray-900 border-4 border-gray-800 rounded-2xl p-8 text-center">
                <p className="text-gray-500 text-2xl">Nenhum time aguardando</p>
              </div>
            ) : (
              <div className="space-y-4">
                {waitingTeams.slice(0, 8).map((team) => (
                  <div
                    key={team.id}
                    className={`rounded-2xl p-6 border-4 transition-all ${
                      team.id === nextTeam?.id
                        ? 'bg-gradient-to-r from-orange-600 to-orange-500 border-orange-400'
                        : 'bg-gray-900 border-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-6">
                      {/* Position */}
                      <div
                        className={`flex-shrink-0 w-20 h-20 rounded-xl flex items-center justify-center border-4 ${
                          team.id === nextTeam?.id
                            ? 'bg-white border-white'
                            : 'bg-gray-800 border-gray-700'
                        }`}
                      >
                        <span
                          className={`font-black text-4xl ${
                            team.id === nextTeam?.id ? 'text-orange-600' : 'text-white'
                          }`}
                        >
                          {team.position}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div
                          className={`font-black text-3xl truncate ${
                            team.id === nextTeam?.id ? 'text-white' : 'text-white'
                          }`}
                        >
                          {team.name.toUpperCase()}
                        </div>
                        <div
                          className={`text-xl mt-1 ${
                            team.id === nextTeam?.id ? 'text-orange-100' : 'text-gray-500'
                          }`}
                        >
                          {team.type === 'team' ? 'Time pronto' : 'Time aleatório'}
                        </div>
                      </div>

                      {/* Badge */}
                      {team.id === nextTeam?.id && (
                        <Badge variant="next" className="text-2xl px-6 py-3">
                          PRÓXIMO
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}

                {waitingTeams.length > 8 && (
                  <div className="bg-gray-900 border-4 border-gray-800 rounded-2xl p-6 text-center">
                    <p className="text-gray-400 text-2xl">
                      +{waitingTeams.length - 8} times na fila
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-12">
            {/* Next Games Preview */}
            {nextGames.length > 0 && (
              <div>
                <h3 className="text-white text-4xl font-black mb-8">
                  PRÓXIMAS PARTIDAS
                </h3>
                <div className="space-y-4">
                  {nextGames.map((game) => (
                    <div
                      key={game.game}
                      className="bg-gray-900 border-4 border-gray-800 rounded-2xl p-6"
                    >
                      <div className="text-gray-500 text-xl mb-3">PARTIDA #{game.game}</div>
                      <div className="space-y-2">
                        <div className="text-white text-2xl font-bold truncate">
                          {game.team1}
                        </div>
                        <div className="text-gray-600 text-xl text-center">VS</div>
                        <div className="text-white text-2xl font-bold truncate">
                          {game.team2}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stats */}
            <div>
              <h3 className="text-white text-4xl font-black mb-8">ESTATÍSTICAS</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-900 border-4 border-gray-800 rounded-2xl p-6">
                  <div className="text-gray-500 text-xl mb-2">Times na fila</div>
                  <div className="text-white text-5xl font-black">{teamsQueue.length}</div>
                </div>
                <div className="bg-gray-900 border-4 border-gray-800 rounded-2xl p-6">
                  <div className="text-gray-500 text-xl mb-2">Avulsos</div>
                  <div className="text-white text-5xl font-black">{soloQueue.length}</div>
                </div>
                <div className="bg-gray-900 border-4 border-gray-800 rounded-2xl p-6">
                  <div className="text-gray-500 text-xl mb-2">Jogando</div>
                  <div className="text-white text-5xl font-black">{playingTeams.length}</div>
                </div>
                <div className="bg-gray-900 border-4 border-gray-800 rounded-2xl p-6">
                  <div className="text-gray-500 text-xl mb-2">Aguardando</div>
                  <div className="text-white text-5xl font-black">{waitingTeams.length}</div>
                </div>
              </div>
            </div>

            {/* Solo Queue Info */}
            {soloQueue.length > 0 && (
              <div>
                <h3 className="text-white text-4xl font-black mb-8">
                  FORMANDO TIMES
                </h3>
                <div className="bg-gray-900 border-4 border-gray-800 rounded-2xl p-8">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-white text-3xl font-bold">
                        {soloQueue.length}/5 jogadores
                      </span>
                      <span className="text-gray-400 text-2xl">
                        {Math.max(0, 5 - soloQueue.length) === 0 
                          ? 'Completo!' 
                          : `Faltam ${Math.max(0, 5 - soloQueue.length)}`}
                      </span>
                    </div>
                    <div className="h-6 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white transition-all duration-500"
                        style={{ width: `${(soloQueue.length / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-gray-400 text-xl">
                    Próximo time aleatório será formado automaticamente
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer - Rules */}
        <div className="mt-12 pt-12 border-t-4 border-gray-900">
          <div className="grid grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-white text-6xl font-black mb-2">1</div>
              <div className="text-gray-500 text-xl">
                Times das posições 1 e 2 jogam
              </div>
            </div>
            <div className="text-center">
              <div className="text-white text-6xl font-black mb-2">2</div>
              <div className="text-gray-500 text-xl">
                Após o jogo voltam pro final
              </div>
            </div>
            <div className="text-center">
              <div className="text-white text-6xl font-black mb-2">5</div>
              <div className="text-gray-500 text-xl">
                Avulsos formam time automático
              </div>
            </div>
            <div className="text-center">
              <div className="text-white text-6xl font-black mb-2">∞</div>
              <div className="text-gray-500 text-xl">
                Sem furo de fila - sistema justo
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
