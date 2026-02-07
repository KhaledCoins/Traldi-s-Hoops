import { useState, useEffect } from 'react';
import { 
  supabase, 
  getEvent, 
  getSoloQueue, 
  getTeamsQueue,
  subscribeToQueue,
  type Event,
  type QueuePlayer,
  type Team
} from '../lib/supabase';

export function useQueue(eventId: string) {
  const [event, setEvent] = useState<Event | null>(null);
  const [soloQueue, setSoloQueue] = useState<QueuePlayer[]>([]);
  const [teamsQueue, setTeamsQueue] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar dados iniciais
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [eventData, soloData, teamsData] = await Promise.all([
        getEvent(eventId),
        getSoloQueue(eventId),
        getTeamsQueue(eventId)
      ]);

      setEvent(eventData);
      setSoloQueue(soloData);
      setTeamsQueue(teamsData);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Erro ao carregar dados do evento');
    } finally {
      setLoading(false);
    }
  };

  // Fazer check-in como TIME PRONTO
  const checkInAsTeam = async (
    teamName: string,
    players: { name: string; phone: string; instagram?: string }[]
  ) => {
    if (!supabase) {
      throw new Error('Supabase não configurado');
    }

    try {
      // 1. Criar o time (Figma exige team_number, player_ids)
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

      // 2. Adicionar os 5 jogadores
      const playersData = players.map((player, i) => ({
        event_id: eventId,
        player_name: player.name,
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

      // Recarregar dados
      await loadData();

      return { success: true, teamId: team.id };
    } catch (err: any) {
      console.error('Erro no check-in:', err);
      throw new Error(err.message || 'Erro ao fazer check-in');
    }
  };

  // Fazer check-in como AVULSO
  const checkInAsSolo = async (
    name: string,
    phone: string,
    instagram?: string
  ) => {
    if (!supabase) {
      throw new Error('Supabase não configurado');
    }

    try {
      // Verificar se o telefone já está na fila
      const { data: existing } = await supabase
        .from('queue_players')
        .select('id')
        .eq('event_id', eventId)
        .eq('phone', phone)
        .eq('status', 'waiting')
        .single();

      if (existing) {
        throw new Error('Você já está na fila!');
      }

      // Adicionar jogador avulso (player_name obrigatório no schema Figma)
      const { count } = await supabase.from('queue_players').select('*', { count: 'exact', head: true }).eq('event_id', eventId);
      const { error } = await supabase
        .from('queue_players')
        .insert({
          event_id: eventId,
          player_name: name,
          name,
          phone,
          instagram: instagram || null,
          position: (count || 0) + 1,
          player_type: 'solo',
          status: 'waiting'
        });

      if (error) throw error;

      // Recarregar dados
      await loadData();

      // Verificar se formou time de 5
      await checkAndCreateRandomTeam();

      return { success: true };
    } catch (err: any) {
      console.error('Erro no check-in:', err);
      throw new Error(err.message || 'Erro ao fazer check-in');
    }
  };

  // Verificar e criar time aleatório quando tiver 5 avulsos
  const checkAndCreateRandomTeam = async () => {
    if (!supabase) return;

    try {
      // Buscar os 5 primeiros avulsos sem time
      const { data: solos, error: solosError } = await supabase
        .from('queue_players')
        .select('*')
        .eq('event_id', eventId)
        .eq('player_type', 'solo')
        .eq('status', 'waiting')
        .is('team_id', null)
        .order('checked_in_at', { ascending: true })
        .limit(5);

      if (solosError) throw solosError;

      if (solos && solos.length === 5) {
        // Contar quantos times aleatórios já existem
        const { count } = await supabase
          .from('teams')
          .select('*', { count: 'exact', head: true })
          .eq('event_id', eventId)
          .eq('type', 'random');

        const teamNumber = (count || 0) + 1;

        // Criar time aleatório (Figma exige team_number, player_ids)
        const { data: team, error: teamError } = await supabase
          .from('teams')
          .insert({
            event_id: eventId,
            team_number,
            player_ids: solos.map((s) => s.id),
            name: `Time Aleatório ${teamNumber}`,
            type: 'random',
            status: 'waiting',
            position: teamsQueue.length + 1
          })
          .select()
          .single();

        if (teamError) throw teamError;

        // Associar os 5 jogadores ao time
        const { error: updateError } = await supabase
          .from('queue_players')
          .update({ team_id: team.id })
          .in('id', solos.map(s => s.id));

        if (updateError) throw updateError;

        // Recarregar dados
        await loadData();
      }
    } catch (err) {
      console.error('Erro ao criar time aleatório:', err);
    }
  };

  // Subscribe para atualizações em tempo real
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
    loading,
    error,
    checkInAsTeam,
    checkInAsSolo,
    refresh: loadData
  };
}
