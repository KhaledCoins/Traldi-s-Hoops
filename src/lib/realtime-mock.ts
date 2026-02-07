/**
 * Mock Realtime Client - Simula eventos em tempo real para demo/teste
 * Usado na página "Fila ao Vivo" quando não há eventId específico
 */

export interface QueueState {
  totalTeams: number;
  agora: {
    teamA?: { id: string; name: string; players: { name: string }[] };
    teamB?: { id: string; name: string; players: { name: string }[] };
    startedAt?: string;
  };
  proximos: { id: string; name: string; type: 'aleatorio' | 'pronto'; players: { name: string }[] }[];
}

type EventType = 'connection_status' | 'queue_updated' | 'team_joined' | 'game_started' | 'game_ended';
type Listener = (event: { type: EventType; payload: any }) => void;

const MOCK_TEAMS = [
  { id: '1', name: 'Time Relâmpago', type: 'pronto' as const, players: Array(5).fill({ name: 'Jogador' }) },
  { id: '2', name: 'Time Thunder', type: 'pronto' as const, players: Array(5).fill({ name: 'Jogador' }) },
  { id: '3', name: 'Time Street Ballers', type: 'aleatorio' as const, players: Array(5).fill({ name: 'Jogador' }) },
  { id: '4', name: 'Time Warriors', type: 'pronto' as const, players: Array(5).fill({ name: 'Jogador' }) },
  { id: '5', name: 'Time Rucker Park', type: 'aleatorio' as const, players: Array(5).fill({ name: 'Jogador' }) },
  { id: '6', name: 'Time Legacy', type: 'pronto' as const, players: Array(5).fill({ name: 'Jogador' }) },
];

function createInitialState(): QueueState {
  return {
    totalTeams: 6,
    agora: {
      teamA: MOCK_TEAMS[0],
      teamB: MOCK_TEAMS[1],
      startedAt: new Date().toISOString(),
    },
    proximos: MOCK_TEAMS.slice(2),
  };
}

export function getMockRealtimeClient() {
  let state = createInitialState();
  const listeners: Listener[] = [];
  let connected = false;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  const emit = (type: EventType, payload: any) => {
    listeners.forEach((fn) => fn({ type, payload }));
  };

  const connect = () => {
    if (connected) return;
    setTimeout(() => {
      connected = true;
      emit('connection_status', { status: 'connected' });
      emit('queue_updated', state);
    }, 500);
  };

  const disconnect = () => {
    connected = false;
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    emit('connection_status', { status: 'disconnected' });
  };

  const triggerGameEnd = () => {
    if (state.proximos.length < 2) return;
    const [team1, team2, ...rest] = state.proximos;
    const winner = team1;
    state = {
      totalTeams: state.totalTeams,
      agora: { teamA: team1, teamB: team2, startedAt: new Date().toISOString() },
      proximos: [...rest, state.agora.teamA!, state.agora.teamB!],
    };
    emit('game_ended', { winner });
    emit('game_started', { agora: { teamA: team1, teamB: team2 } });
    emit('queue_updated', state);
  };

  return {
    connect,
    disconnect,
    getQueueState: () => state,
    triggerGameEnd,
    on: (_event: string, fn: Listener) => {
      listeners.push(fn);
      return () => {
        const i = listeners.indexOf(fn);
        if (i >= 0) listeners.splice(i, 1);
      };
    },
  };
}
