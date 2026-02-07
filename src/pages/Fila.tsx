import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { RadioGroup } from '../components/RadioGroup';
import { Modal } from '../components/Modal';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { Users, User, Clock, AlertCircle, CheckCircle2, Monitor, Pause, Trophy } from 'lucide-react';
import { useQueue } from '../hooks/useQueue';

interface FilaProps {
  eventId: string;
  onNavigate: (page: string, eventId?: string) => void;
}

export function Fila({ eventId, onNavigate }: FilaProps) {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    instagram: '',
    playerType: 'solo',
    teamName: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Hook para gerenciar a fila com Supabase
  const { event, soloQueue, teamsQueue, loading, checkInAsSolo, checkInAsTeam } = useQueue(eventId);

  // Calcular estatísticas
  const soloNeededForTeam = Math.max(0, 5 - soloQueue.length);
  const playingTeams = teamsQueue.filter(t => t.status === 'playing');
  const waitingTeams = teamsQueue.filter(t => t.status === 'waiting');
  
  // Calcular posição do usuário se já fez check-in
  const myTeamPosition = null; // Por enquanto não rastreamos isso
  const mySoloPosition = isCheckedIn && formData.playerType === 'solo' ? soloQueue.length : null;

  const handleCheckIn = async () => {
    setError('');
    setSubmitting(true);
    
    try {
      if (!formData.name || !formData.phone) {
        setError('Preencha todos os campos obrigatórios');
        return;
      }

      if (formData.playerType === 'solo') {
        // Check-in como avulso
        await checkInAsSolo(formData.name, formData.phone, formData.instagram);
        setIsCheckedIn(true);
        setIsModalOpen(false);
      } else {
        // Para time pronto, precisaria coletar dados de 5 jogadores
        // Por enquanto, vamos simplificar
        setError('Check-in de time pronto deve ser feito no painel admin');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer check-in');
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  // Estado: Evento pausado
  if (event?.is_paused) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="p-12 max-w-md text-center">
          <Pause className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-white mb-4">Fila pausada</h3>
          <p className="text-gray-400">
            A organização pausou a fila temporariamente. Aguarde a retomada.
          </p>
        </Card>
      </div>
    );
  }

  // Estado: Evento encerrado
  if (event?.status === 'finished') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="p-12 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-white mb-4">Evento encerrado</h3>
          <p className="text-gray-400 mb-6">
            Este evento já foi encerrado. Confira os próximos eventos.
          </p>
          <Button variant="primary" onClick={() => onNavigate('eventos')}>
            Ver eventos
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8 pb-20">
      <div className="container-narrow">
        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => onNavigate('evento', eventId)}
            className="mb-4"
          >
            ← Voltar
          </Button>
          
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-white mb-1">Fila Digital</h3>
              <p className="text-gray-400 text-sm">{event?.title}</p>
            </div>
            <Button
              variant="ghost"
              onClick={() => onNavigate('painel-tv', eventId)}
            >
              <Monitor className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* User Status */}
        {!isCheckedIn ? (
          <Card className="p-6 mb-6 border-white">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800 rounded-full mb-2">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h5 className="text-white mb-2">Você ainda não está na fila</h5>
                <p className="text-gray-400 text-sm">
                  Faça o check-in para garantir sua posição
                </p>
              </div>
              <Button 
                variant="accent" 
                className="w-full"
                onClick={() => setIsModalOpen(true)}
              >
                Fazer check-in
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="p-6 mb-6 bg-white text-black border-white">
            <div className="flex items-center gap-4 mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600 flex-shrink-0" />
              <div className="flex-1">
                <h5 className="text-black mb-1">Check-in confirmado!</h5>
                <p className="text-gray-700 text-sm">
                  {formData.playerType === 'team' 
                    ? `Seu time está na posição #${myTeamPosition}` 
                    : `Você é o ${mySoloPosition}º avulso`}
                </p>
              </div>
            </div>
            
            {formData.playerType === 'solo' && soloNeededForTeam > 0 && (
              <div className="pt-4 border-t-2 border-gray-300">
                <p className="text-gray-700 text-sm">
                  <strong>Faltam {soloNeededForTeam} avulsos</strong> para formar o próximo time aleatório
                </p>
              </div>
            )}
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-black text-white mb-1">
                {teamsQueue.length}
              </div>
              <div className="text-gray-400 text-xs">Times na fila</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-black text-white mb-1">
                {soloQueue.length}
              </div>
              <div className="text-gray-400 text-xs">Avulsos</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-black text-white mb-1">
                {soloNeededForTeam}
              </div>
              <div className="text-gray-400 text-xs">Faltam</div>
            </div>
          </Card>
        </div>

        {/* Current Game */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-white" />
            <h5 className="text-white">Jogando agora</h5>
          </div>
          
          <Card className="p-6 bg-white text-black border-white">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-xs text-gray-600 mb-1">TIME 1</div>
                  <div className="font-black text-xl">{teamsQueue[0]?.name}</div>
                </div>
                <Badge variant="playing">Jogando</Badge>
              </div>
              
              <div className="text-center py-2">
                <span className="text-gray-400 font-black text-lg">VS</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-xs text-gray-600 mb-1">TIME 2</div>
                  <div className="font-black text-xl">{teamsQueue[1]?.name}</div>
                </div>
                <Badge variant="playing">Jogando</Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Teams Queue */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-white">Fila de times</h5>
            <Badge variant="next">Ao vivo</Badge>
          </div>

          {/* Alert */}
          <div className="flex items-start gap-3 bg-gray-900 border-2 border-gray-700 p-4 rounded-lg mb-4">
            <AlertCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-400">
              <strong className="text-white">Importante:</strong> A ordem é automática e imutável. Após jogar, o time volta para o final da fila.
            </div>
          </div>

          {/* Queue Items */}
          <div className="space-y-3">
            {teamsQueue.slice(2).map((team) => (
              <Card 
                key={team.id}
                variant={team.status === 'next' ? 'hover' : 'default'}
                className="p-4"
              >
                <div className="flex items-center gap-4">
                  {/* Position */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center border-2 ${
                    team.status === 'next'
                      ? 'bg-orange-600 border-orange-600'
                      : 'bg-gray-800 border-gray-700'
                  }`}>
                    <span className={`font-black text-lg ${
                      team.status === 'next' ? 'text-white' : 'text-white'
                    }`}>
                      {team.position}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className={`font-bold truncate ${
                      team.status === 'next' ? 'text-white text-lg' : 'text-white'
                    }`}>
                      {team.name}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`text-xs ${
                        team.status === 'next' ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        {team.type === 'team' ? 'Time pronto' : 'Time aleatório'}
                      </div>
                    </div>
                  </div>

                  {/* Badge */}
                  {team.status === 'next' && (
                    <Badge variant="next">Próximo</Badge>
                  )}
                </div>
              </Card>
            ))}

            {isCheckedIn && formData.playerType === 'team' && myTeamPosition && (
              <Card className="p-4 border-white">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-white rounded-lg flex items-center justify-center border-2 border-white">
                    <span className="font-black text-lg text-black">{myTeamPosition}</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-white">Seu time</div>
                    <div className="text-xs text-gray-400">Time pronto</div>
                  </div>
                  <Badge variant="waiting">Na fila</Badge>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Solo Queue */}
        {soloQueue.length > 0 && (
          <div className="mb-6">
            <h5 className="text-white mb-4">Avulsos (formando times)</h5>
            
            <Card className="p-6">
              <div className="space-y-4">
                {/* Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-bold">
                      {soloQueue.length}/5 jogadores
                    </span>
                    <span className="text-gray-400 text-sm">
                      {soloNeededForTeam > 0 
                        ? `Faltam ${soloNeededForTeam}` 
                        : 'Time completo!'}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white transition-all duration-500"
                      style={{ width: `${(soloQueue.length / 5) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Solo players list */}
                <div className="space-y-2">
                  {soloQueue.map((player, index) => (
                    <div 
                      key={player.id}
                      className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg"
                    >
                      <User className="w-5 h-5 text-gray-500" />
                      <span className="text-white font-medium">{player.name}</span>
                    </div>
                  ))}
                  
                  {isCheckedIn && formData.playerType === 'solo' && (
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                      <User className="w-5 h-5 text-black" />
                      <span className="text-black font-bold">Você</span>
                    </div>
                  )}
                </div>

                {soloNeededForTeam > 0 && (
                  <p className="text-gray-400 text-sm pt-2 border-t-2 border-gray-800">
                    Quando 5 avulsos completarem, será criado automaticamente um "Time Aleatório" 
                    e inserido no final da fila de times.
                  </p>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Rules */}
        <Card className="p-6 bg-gray-900">
          <h6 className="text-white mb-3">COMO FUNCIONA</h6>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-white">•</span>
              <span>Sempre jogam os times das posições 1 e 2</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-white">•</span>
              <span>Após o jogo, ambos os times voltam para o final da fila</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-white">•</span>
              <span>A cada 5 avulsos, um novo time aleatório é criado</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-white">•</span>
              <span>Não é possível furar a fila - sistema automático</span>
            </li>
          </ul>
        </Card>
      </div>

      {/* Check-in Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setError('');
        }}
        title="Check-in na fila"
      >
        <div className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border-2 border-red-500 rounded-lg p-4">
              <p className="text-red-500 font-semibold">{error}</p>
            </div>
          )}

          <RadioGroup
            label="Como você está vindo?"
            name="player-type"
            value={formData.playerType}
            onChange={(value) => setFormData({ ...formData, playerType: value })}
            options={[
              {
                value: 'solo',
                label: 'Avulso',
                description: 'Vou formar time aleatório no local'
              },
              {
                value: 'team',
                label: 'Time pronto',
                description: 'Já tenho 5 jogadores confirmados'
              }
            ]}
          />

          <Input
            label={formData.playerType === 'team' ? 'Nome do time' : 'Seu nome'}
            placeholder={formData.playerType === 'team' ? 'Nome do seu time' : 'Como quer ser chamado?'}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Input
            label="Telefone (WhatsApp)"
            placeholder="(11) 99999-9999"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            helperText="Usado apenas para comunicação do evento"
            required
          />

          <Input
            label="Instagram (opcional)"
            placeholder="seu_instagram"
            value={formData.instagram}
            onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
            helperText="Sem o @"
          />

          <div className="flex gap-3 pt-4">
            <Button 
              variant="accent" 
              className="flex-1"
              onClick={handleCheckIn}
              disabled={!formData.name || !formData.phone || submitting}
            >
              {submitting ? 'Enviando...' : 'Confirmar check-in'}
            </Button>
            <Button 
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                setError('');
              }}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}