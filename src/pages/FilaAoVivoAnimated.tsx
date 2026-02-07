import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getMockRealtimeClient, type QueueState } from '../lib/realtime-mock';
import { useQueue } from '../hooks/useQueue';
import { Activity, Users, Trophy, Clock, AlertCircle } from 'lucide-react';

interface FilaAoVivoAnimatedProps {
  eventId?: string;
  onNavigate: (page: string) => void;
}

export function FilaAoVivoAnimated({ eventId, onNavigate }: FilaAoVivoAnimatedProps) {
  const { event, soloQueue, teamsQueue, loading } = useQueue(eventId || '');
  const [queueState, setQueueState] = useState<QueueState | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'reconnecting'>('disconnected');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [eventLog, setEventLog] = useState<string[]>([]);
  const [client, setClient] = useState<any>(null);
  const [showDebug, setShowDebug] = useState(false);
  const [toasts, setToasts] = useState<Array<{id: string; message: string; type: 'success' | 'info'}>>([]);

  const useRealtime = !!eventId;

  // Log events
  const addLog = useCallback((message: string) => {
    setEventLog(prev => [`${new Date().toLocaleTimeString()} - ${message}`, ...prev.slice(0, 9)]);
  }, []);

  // Toast functions
  const showToast = useCallback((message: string, type: 'success' | 'info' = 'info') => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  // Converte dados do useQueue para QueueState (formato do mock)
  const queueStateFromSupabase: QueueState | null = useRealtime && !loading
    ? {
        totalTeams: teamsQueue.length,
        agora: (() => {
          const playing = teamsQueue.filter((t) => t.status === 'playing');
          if (playing.length === 2) {
            return {
              teamA: { id: playing[0].id, name: playing[0].name, players: Array(5).fill({ name: 'Jogador' }) },
              teamB: { id: playing[1].id, name: playing[1].name, players: Array(5).fill({ name: 'Jogador' }) },
              startedAt: new Date().toISOString(),
            };
          }
          return {};
        })(),
        proximos: teamsQueue
          .filter((t) => t.status === 'waiting')
          .sort((a, b) => (a.position || 0) - (b.position || 0))
          .map((t) => ({
            id: t.id,
            name: t.name,
            type: t.type === 'team' ? 'pronto' : 'aleatorio',
            players: Array(5).fill({ name: 'Jogador' }),
          })),
      }
    : null;

  // Initialize realtime mock client (apenas quando não há eventId)
  useEffect(() => {
    if (useRealtime) {
      setConnectionStatus('connected');
      return;
    }
    const mockClient = getMockRealtimeClient();
    setClient(mockClient);

    mockClient.on('all', (ev: { type: string; payload: any }) => {
      console.log('Realtime event:', ev);

      switch (ev.type) {
        case 'connection_status':
          setConnectionStatus(ev.payload.status);
          addLog(`Status: ${ev.payload.status}`);
          if (ev.payload.status === 'connected') {
            showToast('Conectado ao sistema em tempo real', 'info');
          }
          break;

        case 'queue_updated':
          setQueueState(ev.payload);
          setLastUpdate(new Date());
          addLog(`Fila atualizada - ${ev.payload.totalTeams} times`);
          break;

        case 'team_joined':
          showToast(`${ev.payload.team.name} entrou na fila — Posição #${ev.payload.position}`, 'success');
          addLog(`Time entrou: ${ev.payload.team.name}`);
          break;

        case 'game_started':
          showToast(`Novo jogo: ${ev.payload.agora.teamA.name} vs ${ev.payload.agora.teamB.name}`, 'info');
          addLog(`Jogo iniciado: ${ev.payload.agora.teamA.name} vs ${ev.payload.agora.teamB.name}`);
          break;

        case 'game_ended':
          showToast(`${ev.payload.winner.name} venceu!`, 'success');
          addLog(`Jogo finalizado - Vencedor: ${ev.payload.winner.name}`);
          break;
      }
    });

    mockClient.connect();
    addLog('Sistema inicializado');
    setQueueState(mockClient.getQueueState());

    return () => {
      mockClient.disconnect();
      addLog('Sistema desconectado');
    };
  }, [addLog, showToast, useRealtime]);

  // Update elapsed time
  useEffect(() => {
    if (!displayState?.agora.startedAt) return;

    const interval = setInterval(() => {
      const startTime = new Date(displayState.agora.startedAt!);
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [displayState?.agora.startedAt]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatElapsedTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const displayState = useRealtime ? queueStateFromSupabase : queueState;

  if (useRealtime && loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner w-12 h-12 mx-auto mb-4" />
          <p className="text-gray-400">Carregando fila...</p>
        </div>
      </div>
    );
  }

  if (!displayState) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner w-12 h-12 mx-auto mb-4" />
          <p className="text-gray-400">Carregando fila...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8 md:py-12">
      {/* Connection Status */}
      {connectionStatus !== 'connected' && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-lg border-2 ${
          connectionStatus === 'reconnecting' ? 'border-yellow-500 bg-yellow-500/10' : 'border-red-500 bg-red-500/10'
        }`}>
          <span className={`text-sm font-semibold ${
            connectionStatus === 'reconnecting' ? 'text-yellow-500' : 'text-red-500'
          }`}>
            {connectionStatus === 'reconnecting' ? 'Reconectando...' : 'Conexão perdida'}
          </span>
        </div>
      )}

      {/* Toasts */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={`p-4 rounded-lg border-2 min-w-[300px] ${
                toast.type === 'success' ? 'border-green-500 bg-green-500/10' : 'border-blue-500 bg-blue-500/10'
              }`}
            >
              <p className="text-white text-sm">{toast.message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="container-main">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Activity className="w-8 h-8 text-green-500" />
            <h1 className="text-white">Fila ao Vivo</h1>
          </div>
          <p className="text-gray-400 text-lg md:text-xl mb-6">
            Acompanhe os jogos em tempo real
          </p>
          
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-500/10 border-2 border-green-500 rounded-lg">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span className="text-green-500 font-semibold">
              Sistema ativo • Fila atualizada automaticamente
            </span>
          </div>
        </div>

        {/* Current Match */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-7 h-7 text-white" />
            <h2 className="text-white">JOGANDO AGORA</h2>
          </div>
          
          {displayState.agora.teamA && displayState.agora.teamB && (
            <div className="card p-6 md:p-10 border-white bg-gradient-to-br from-gray-900 to-black">
              <div className="flex items-center justify-center gap-2 mb-6">
                <Clock className="w-5 h-5 text-gray-400" />
                <span className="text-gray-400 text-lg">
                  Tempo de jogo: <span className="text-white font-semibold">{formatElapsedTime(elapsedTime)}</span>
                </span>
              </div>

              <div className="bg-gray-800 rounded-xl p-6 md:p-8 border-2 border-gray-700">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex-1 text-center w-full">
                    <div className="text-white font-black text-2xl md:text-4xl mb-2 leading-tight">
                      {displayState.agora.teamA.name}
                    </div>
                    <div className="text-gray-400 text-lg">
                      {displayState.agora.teamA.players.length} jogadores
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <div 
                      className="text-white font-black text-3xl md:text-5xl px-6 py-3 bg-gray-700 rounded-lg"
                      style={{ 
                        fontFamily: 'Impact, "Arial Black", sans-serif',
                        letterSpacing: '0.1em'
                      }}
                    >
                      VS
                    </div>
                  </div>
                  
                  <div className="flex-1 text-center w-full">
                    <div className="text-white font-black text-2xl md:text-4xl mb-2 leading-tight">
                      {displayState.agora.teamB.name}
                    </div>
                    <div className="text-gray-400 text-lg">
                      {displayState.agora.teamB.players.length} jogadores
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Upcoming Matches */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-white" />
            <h3 className="text-white">PRÓXIMOS NA FILA</h3>
            <span className="text-gray-500 text-sm">
              ({displayState.proximos.length} times aguardando)
            </span>
          </div>
          
          <div className="grid gap-3">
            {displayState.proximos.map((team, index) => (
              <div
                key={team.id}
                className={`card p-4 md:p-6 hover:border-white transition-colors ${
                  index === 0 ? 'border-gray-500' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-gray-700 rounded-lg flex-shrink-0">
                    <span className="text-white font-black text-xl md:text-2xl">{index + 1}</span>
                  </div>
                  
                  <div className="flex-1 flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                      <span className="text-white font-semibold text-lg md:text-xl">
                        {team.name}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {team.players.length} jogadores
                      </span>
                      {team.type === 'aleatorio' && (
                        <span className="px-2 py-1 bg-yellow-500/10 border border-yellow-500 rounded text-yellow-500 text-xs font-semibold">
                          Aleatório
                        </span>
                      )}
                    </div>
                    
                    {index === 0 && (
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/10 border border-yellow-500 rounded text-yellow-500 text-sm font-semibold">
                        Próximo jogo
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="card p-6 bg-gray-900/50 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-400">
              <p className="mb-2">
                <strong className="text-white">Ordem justa. Sem furo de fila.</strong>
              </p>
              <p>
                Após jogar, seu time volta automaticamente para o final da fila. A ordem é controlada pelo sistema e não pode ser alterada manualmente.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center text-gray-500 text-sm mb-6">
          Última atualização: {formatTime(lastUpdate)}
        </div>

        {/* Debug Panel */}
        <div>
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="w-full p-4 bg-gray-900 border-2 border-gray-700 rounded-lg text-left hover:border-gray-600 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-500" />
                <span className="text-white font-semibold">Painel de Monitoramento</span>
                <span className="text-xs text-gray-500">(Clique para {showDebug ? 'ocultar' : 'mostrar'})</span>
              </div>
              <svg 
                className={`w-5 h-5 text-gray-400 transition-transform ${showDebug ? 'rotate-180' : ''}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          {showDebug && (
            <div className="mt-4 grid md:grid-cols-2 gap-4">
              <div className="card p-4 bg-gray-950">
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-green-500" />
                  Log de Eventos (Últimos 10)
                </h4>
                <div className="space-y-1 max-h-[300px] overflow-y-auto">
                  {eventLog.length === 0 ? (
                    <p className="text-gray-500 text-sm">Nenhum evento ainda...</p>
                  ) : (
                    eventLog.map((log, index) => (
                      <div
                        key={index}
                        className="text-xs text-gray-400 font-mono py-1 border-b border-gray-800"
                      >
                        {log}
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="card p-4 bg-gray-950">
                  <h4 className="text-white font-semibold mb-3">Status do Sistema</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Conexão:</span>
                      <span className={`font-semibold ${
                        connectionStatus === 'connected' ? 'text-green-500' : 
                        connectionStatus === 'reconnecting' ? 'text-yellow-500' : 
                        'text-red-500'
                      }`}>
                        {connectionStatus === 'connected' ? '🟢 Conectado' : 
                         connectionStatus === 'reconnecting' ? '🟡 Reconectando' : 
                         '🔴 Desconectado'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total de times:</span>
                      <span className="text-white font-semibold">{displayState.totalTeams}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Na fila:</span>
                      <span className="text-white font-semibold">{displayState.proximos.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Jogando agora:</span>
                      <span className="text-white font-semibold">2 times</span>
                    </div>
                  </div>
                </div>

                {!useRealtime && (
                  <div className="card p-4 bg-gray-950">
                    <h4 className="text-white font-semibold mb-3">Teste Manual</h4>
                    <p className="text-gray-400 text-sm mb-3">
                      Força um evento para testar o sistema (modo demo)
                    </p>
                    <button
                      onClick={() => client?.triggerGameEnd()}
                      className="btn-secondary w-full text-sm"
                    >
                      Simular Fim de Jogo
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
