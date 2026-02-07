import { useState, useEffect } from 'react';
import { 
  supabase, 
  getEvent, 
  getSoloQueue, 
  getTeamsQueue,
  getCurrentMatch,
  updateEventStatus,
  subscribeToQueue,
  type Event,
  type QueuePlayer,
  type Team,
  type Match
} from '../lib/supabase';

export function useAdmin(eventId: string) {
  const [event, setEvent] = useState<Event | null>(null);
  const [soloQueue, setSoloQueue] = useState<QueuePlayer[]>([]);
  const [teamsQueue, setTeamsQueue] = useState<Team[]>([]);
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar dados
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [eventData, soloData, teamsData, matchData] = await Promise.all([
        getEvent(eventId),
        getSoloQueue(eventId),
        getTeamsQueue(eventId),
        getCurrentMatch(eventId)
      ]);

      setEvent(eventData);
      setSoloQueue(soloData);
      setTeamsQueue(teamsData);
      setCurrentMatch(matchData);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  // Ativar evento
  const activateEvent = async () => {
    if (!supabase) throw new Error('Supabase não configurado');
    
    const success = await updateEventStatus(eventId, 'active', false);
    if (success) {
      await loadData();
      return true;
    }
    throw new Error('Erro ao ativar evento');
  };

  // Pausar fila
  const pauseQueue = async () => {
    if (!supabase) throw new Error('Supabase não configurado');
    
    const success = await updateEventStatus(eventId, event?.status || 'active', true);
    if (success) {
      await loadData();
      return true;
    }
    throw new Error('Erro ao pausar fila');
  };

  // Retomar fila
  const resumeQueue = async () => {
    if (!supabase) throw new Error('Supabase não configurado');
    
    const success = await updateEventStatus(eventId, event?.status || 'active', false);
    if (success) {
      await loadData();
      return true;
    }
    throw new Error('Erro ao retomar fila');
  };

  // Adicionar time manualmente
  const addTeamManually = async (
    teamName: string,
    players: { name: string; phone: string; instagram?: string }[]
  ) => {
    if (!supabase) throw new Error('Supabase não configurado');

    try {
      // Criar o time (Figma exige team_number, player_ids)
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .insert({
          event_id: eventId,
          team_number: teamsQueue.length + 1,
          player_ids: [],
          name: teamName,
          type: 'team',
          status: 'waiting',
          position: teamsQueue.length + 1
        })
        .select()
        .single();

      if (teamError) throw teamError;

      // Adicionar jogadores
      const playersData = players.map((player, i) => ({
        event_id: eventId,
        name: player.name,
        phone: player.phone,
        instagram: player.instagram || null,
        position: i + 1,
        player_type: 'team',
        team_id: team.id,
        status: 'waiting'
      }));

      const { error: playersError } = await supabase
        .from('queue_players')
        .insert(playersData);

      if (playersError) throw playersError;

      await loadData();
      return { success: true };
    } catch (err: any) {
      throw new Error(err.message || 'Erro ao adicionar time');
    }
  };

  // Adicionar jogador avulso manualmente
  const addSoloManually = async (
    name: string,
    phone: string,
    instagram?: string
  ) => {
    if (!supabase) throw new Error('Supabase não configurado');

    try {
      const { count } = await supabase.from('queue_players').select('*', { count: 'exact', head: true }).eq('event_id', eventId);
      const { error } = await supabase
        .from('queue_players')
        .insert({
          event_id: eventId,
          name,
          phone,
          instagram: instagram || null,
          position: (count || 0) + 1,
          player_type: 'solo',
          status: 'waiting'
        });

      if (error) throw error;

      await loadData();
      await checkAndCreateRandomTeam();
      return { success: true };
    } catch (err: any) {
      throw new Error(err.message || 'Erro ao adicionar jogador');
    }
  };

  // Verificar e criar time aleatório
  const checkAndCreateRandomTeam = async () => {
    if (!supabase) return;

    try {
      const { data: solos } = await supabase
        .from('queue_players')
        .select('*')
        .eq('event_id', eventId)
        .eq('player_type', 'solo')
        .eq('status', 'waiting')
        .is('team_id', null)
        .order('checked_in_at', { ascending: true })
        .limit(5);

      if (solos && solos.length === 5) {
        const { count } = await supabase
          .from('teams')
          .select('*', { count: 'exact', head: true })
          .eq('event_id', eventId)
          .eq('type', 'random');

        const teamNumber = (count || 0) + 1;

        const { data: team, error: teamError } = await supabase
          .from('teams')
          .insert({
            event_id: eventId,
            team_number: teamNumber,
            player_ids: solos.map((s) => s.id),
            name: `Time Aleatório ${teamNumber}`,
            type: 'random',
            status: 'waiting',
            position: teamsQueue.length + 1
          })
          .select()
          .single();

        if (teamError) throw teamError;

        await supabase
          .from('queue_players')
          .update({ team_id: team.id })
          .in('id', solos.map(s => s.id));

        await loadData();
      }
    } catch (err) {
      console.error('Erro ao criar time aleatório:', err);
    }
  };

  // Iniciar próximo jogo
  const startNextGame = async () => {
    if (!supabase) throw new Error('Supabase não configurado');

    try {
      // Verificar se já tem jogo em andamento
      if (currentMatch) {
        throw new Error('Já existe um jogo em andamento');
      }

      // Pegar os 2 primeiros times da fila
      const waitingTeams = teamsQueue.filter(t => t.status === 'waiting');
      
      if (waitingTeams.length < 2) {
        throw new Error('Não há times suficientes na fila');
      }

      const [teamA, teamB] = waitingTeams;

      // Criar partida (schema Figma usa 'playing' para em andamento)
      const { data: match, error: matchError } = await supabase
        .from('matches')
        .insert({
          event_id: eventId,
          team_a_id: teamA.id,
          team_b_id: teamB.id,
          status: 'playing',
          started_at: new Date().toISOString()
        })
        .select()
        .single();

      if (matchError) throw matchError;

      // Atualizar status dos times para 'playing'
      await supabase
        .from('teams')
        .update({ status: 'playing' })
        .in('id', [teamA.id, teamB.id]);

      // Atualizar status dos jogadores para 'playing'
      await supabase
        .from('queue_players')
        .update({ status: 'playing' })
        .in('team_id', [teamA.id, teamB.id]);

      await loadData();
      return { success: true, match };
    } catch (err: any) {
      throw new Error(err.message || 'Erro ao iniciar jogo');
    }
  };

  // Encerrar partida atual
  const endCurrentGame = async () => {
    if (!supabase) throw new Error('Supabase não configurado');

    try {
      if (!currentMatch) {
        throw new Error('Não há jogo em andamento');
      }

      // Finalizar partida
      await supabase
        .from('matches')
        .update({ 
          status: 'finished',
          finished_at: new Date().toISOString()
        })
        .eq('id', currentMatch.id);

      // Pegar os times da partida
      const { data: teams } = await supabase
        .from('teams')
        .select('*')
        .in('id', [currentMatch.team_a_id, currentMatch.team_b_id]);

      if (teams && teams.length === 2) {
        // Atualizar status para 'finished' (schema Figma: waiting/playing/finished)
        await supabase
          .from('teams')
          .update({ status: 'finished' })
          .in('id', [currentMatch.team_a_id, currentMatch.team_b_id]);

        // Atualizar jogadores para 'played'
        await supabase
          .from('queue_players')
          .update({ status: 'played' })
          .in('team_id', [currentMatch.team_a_id, currentMatch.team_b_id]);

        // Reposicionar times no final da fila
        const maxPosition = Math.max(...teamsQueue.map(t => t.position || 0));
        
        await supabase
          .from('teams')
          .update({ 
            status: 'waiting',
            position: maxPosition + 1
          })
          .eq('id', currentMatch.team_a_id);

        await supabase
          .from('teams')
          .update({ 
            status: 'waiting',
            position: maxPosition + 2
          })
          .eq('id', currentMatch.team_b_id);

        await supabase
          .from('queue_players')
          .update({ status: 'waiting' })
          .in('team_id', [currentMatch.team_a_id, currentMatch.team_b_id]);
      }

      await loadData();
      return { success: true };
    } catch (err: any) {
      throw new Error(err.message || 'Erro ao encerrar jogo');
    }
  };

  // Remover jogador
  const removePlayer = async (playerId: string) => {
    if (!supabase) throw new Error('Supabase não configurado');

    try {
      await supabase
        .from('queue_players')
        .delete()
        .eq('id', playerId);

      await loadData();
      return { success: true };
    } catch (err: any) {
      throw new Error(err.message || 'Erro ao remover jogador');
    }
  };

  // Remover time
  const removeTeam = async (teamId: string) => {
    if (!supabase) throw new Error('Supabase não configurado');

    try {
      // Remover jogadores do time
      await supabase
        .from('queue_players')
        .delete()
        .eq('team_id', teamId);

      // Remover time
      await supabase
        .from('teams')
        .delete()
        .eq('id', teamId);

      await loadData();
      return { success: true };
    } catch (err: any) {
      throw new Error(err.message || 'Erro ao remover time');
    }
  };

  // Limpar fila completa
  const clearQueue = async () => {
    if (!supabase) throw new Error('Supabase não configurado');

    try {
      // Remover todos os jogadores
      await supabase
        .from('queue_players')
        .delete()
        .eq('event_id', eventId);

      // Remover todos os times
      await supabase
        .from('teams')
        .delete()
        .eq('event_id', eventId);

      await loadData();
      return { success: true };
    } catch (err: any) {
      throw new Error(err.message || 'Erro ao limpar fila');
    }
  };

  // Subscribe em tempo real
  useEffect(() => {
    loadData();

    if (supabase) {
      const unsubscribe = subscribeToQueue(eventId, loadData);
      return unsubscribe;
    }
  }, [eventId]);

  return {
    event,
    soloQueue,
    teamsQueue,
    currentMatch,
    loading,
    error,
    activateEvent,
    pauseQueue,
    resumeQueue,
    addTeamManually,
    addSoloManually,
    startNextGame,
    endCurrentGame,
    removePlayer,
    removeTeam,
    clearQueue,
    refresh: loadData
  };
}
