import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { QRCodeGenerator } from '../components/QRCodeGenerator';
import { useAdmin } from '../hooks/useAdmin';
import { 
  Play, 
  Square, 
  Trash2, 
  UserPlus, 
  Monitor,
  Users,
  Clock,
  QrCode,
  Pause,
  PlayCircle,
  AlertTriangle,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

interface PainelAdminProps {
  eventId: string;
  onNavigate: (page: string, eventId?: string) => void;
}

export function PainelAdmin({ eventId, onNavigate }: PainelAdminProps) {
  const [activeTab, setActiveTab] = useState<'fila' | 'jogo'>('fila');
  
  // Hook do Supabase
  const {
    event,
    soloQueue,
    teamsQueue,
    currentMatch,
    loading,
    error,
    activateEvent,
    pauseQueue,
    resumeQueue,
    addSoloManually,
    startNextGame,
    endCurrentGame,
    removePlayer,
    removeTeam,
    clearQueue,
    refresh
  } = useAdmin(eventId);
  
  // Modals
  const [isAddSoloModalOpen, setIsAddSoloModalOpen] = useState(false);
  const [isStartGameModalOpen, setIsStartGameModalOpen] = useState(false);
  const [isEndGameModalOpen, setIsEndGameModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);
  const [isClearQueueModalOpen, setIsClearQueueModalOpen] = useState(false);
  const [isGenerateQRModalOpen, setIsGenerateQRModalOpen] = useState(false);
  
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    instagram: ''
  });

  // Calcular stats
  const stats = {
    totalTeams: teamsQueue.length,
    soloPlayers: soloQueue.length,
    playingTeams: teamsQueue.filter(t => t.status === 'playing').length,
    waitingTeams: teamsQueue.filter(t => t.status === 'waiting').length
  };

  const qrCodeUrl = `${window.location.origin}/#fila?event=${eventId}`;

  // Handlers
  const handleActivateEvent = async () => {
    setActionLoading(true);
    setActionError('');
    try {
      await activateEvent();
    } catch (err: any) {
      setActionError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handlePauseQueue = async () => {
    setActionLoading(true);
    setActionError('');
    try {
      await pauseQueue();
      setIsPauseModalOpen(false);
    } catch (err: any) {
      setActionError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleResumeQueue = async () => {
    setActionLoading(true);
    setActionError('');
    try {
      await resumeQueue();
    } catch (err: any) {
      setActionError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddSolo = async () => {
    setActionLoading(true);
    setActionError('');
    try {
      if (!formData.name || !formData.phone) {
        setActionError('Preencha nome e telefone');
        return;
      }
      await addSoloManually(formData.name, formData.phone, formData.instagram);
      setIsAddSoloModalOpen(false);
      setFormData({ name: '', phone: '', instagram: '' });
    } catch (err: any) {
      setActionError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleStartGame = async () => {
    setActionLoading(true);
    setActionError('');
    try {
      await startNextGame();
      setIsStartGameModalOpen(false);
    } catch (err: any) {
      setActionError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEndGame = async () => {
    setActionLoading(true);
    setActionError('');
    try {
      await endCurrentGame();
      setIsEndGameModalOpen(false);
    } catch (err: any) {
      setActionError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemove = async () => {
    setActionLoading(true);
    setActionError('');
    try {
      if (selectedItem?.type === 'player') {
        await removePlayer(selectedItem.id);
      } else if (selectedItem?.type === 'team') {
        await removeTeam(selectedItem.id);
      }
      setIsRemoveModalOpen(false);
      setSelectedItem(null);
    } catch (err: any) {
      setActionError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleClearQueue = async () => {
    setActionLoading(true);
    setActionError('');
    try {
      await clearQueue();
      setIsClearQueueModalOpen(false);
    } catch (err: any) {
      setActionError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Carregando painel...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="p-8 max-w-md text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-white mb-2">Erro ao carregar</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <Button onClick={refresh}>Tentar novamente</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="container-main">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-white mb-2">Painel Administrativo</h2>
            <p className="text-gray-400">{event?.title}</p>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={() => onNavigate('painel-tv', eventId)}
            >
              <Monitor className="w-5 h-5 mr-2" />
              Ver Painel TV
            </Button>
            <Button
              variant="ghost"
              onClick={refresh}
            >
              <RefreshCw className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Status do Evento */}
        <Card className="p-6 mb-6 border-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full ${
                event?.status === 'active' && !event?.is_paused 
                  ? 'bg-green-500' 
                  : event?.is_paused 
                  ? 'bg-yellow-500'
                  : 'bg-gray-500'
              }`} />
              <div>
                <div className="text-white font-bold">
                  {event?.is_paused 
                    ? 'FILA PAUSADA' 
                    : event?.status === 'active' 
                    ? 'EVENTO ATIVO'
                    : 'EVENTO INATIVO'}
                </div>
                <div className="text-gray-400 text-sm">
                  {event?.is_paused 
                    ? 'Check-ins bloqueados temporariamente'
                    : event?.status === 'active'
                    ? 'Check-ins liberados'
                    : 'Ative o evento para liberar check-ins'}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              {event?.status !== 'active' ? (
                <Button 
                  variant="accent"
                  onClick={handleActivateEvent}
                  disabled={actionLoading}
                >
                  <PlayCircle className="w-5 h-5 mr-2" />
                  Ativar Evento
                </Button>
              ) : event?.is_paused ? (
                <Button 
                  variant="accent"
                  onClick={handleResumeQueue}
                  disabled={actionLoading}
                >
                  <PlayCircle className="w-5 h-5 mr-2" />
                  Retomar Fila
                </Button>
              ) : (
                <Button 
                  variant="secondary"
                  onClick={() => setIsPauseModalOpen(true)}
                >
                  <Pause className="w-5 h-5 mr-2" />
                  Pausar Fila
                </Button>
              )}

              <Button
                variant="ghost"
                onClick={() => setIsGenerateQRModalOpen(true)}
              >
                <QrCode className="w-5 h-5 mr-2" />
                QR Code
              </Button>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="text-gray-400 text-sm mb-1">Times na fila</div>
            <div className="text-2xl font-black text-white">{stats.totalTeams}</div>
          </Card>
          <Card className="p-4">
            <div className="text-gray-400 text-sm mb-1">Avulsos</div>
            <div className="text-2xl font-black text-white">{stats.soloPlayers}</div>
          </Card>
          <Card className="p-4">
            <div className="text-gray-400 text-sm mb-1">Jogando</div>
            <div className="text-2xl font-black text-white">{stats.playingTeams}</div>
          </Card>
          <Card className="p-4">
            <div className="text-gray-400 text-sm mb-1">Aguardando</div>
            <div className="text-2xl font-black text-white">{stats.waitingTeams}</div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === 'fila' ? 'primary' : 'ghost'}
            onClick={() => setActiveTab('fila')}
          >
            <Users className="w-5 h-5 mr-2" />
            Gerenciar Fila
          </Button>
          <Button
            variant={activeTab === 'jogo' ? 'primary' : 'ghost'}
            onClick={() => setActiveTab('jogo')}
          >
            <Play className="w-5 h-5 mr-2" />
            Controle de Jogo
          </Button>
        </div>

        {/* Content */}
        {activeTab === 'fila' && (
          <div className="space-y-6">
            {/* Actions */}
            <Card className="p-6">
              <h5 className="text-white mb-4">Ações Rápidas</h5>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setIsAddSoloModalOpen(true)}
                  disabled={event?.status !== 'active' || event?.is_paused}
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  Adicionar Avulso
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setIsClearQueueModalOpen(true)}
                  disabled={stats.totalTeams === 0 && stats.soloPlayers === 0}
                >
                  <Trash2 className="w-5 h-5 mr-2" />
                  Limpar Fila
                </Button>
              </div>
            </Card>

            {/* Fila de Avulsos */}
            {soloQueue.length > 0 && (
              <div>
                <h5 className="text-white mb-4">Avulsos ({soloQueue.length}/5)</h5>
                <div className="space-y-3">
                  {soloQueue.map((player) => (
                    <Card key={player.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Users className="w-5 h-5 text-gray-500" />
                          <div>
                            <div className="text-white font-bold">{player.name}</div>
                            <div className="text-gray-400 text-sm">{player.phone}</div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setSelectedItem({ ...player, type: 'player' });
                            setIsRemoveModalOpen(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Fila de Times */}
            <div>
              <h5 className="text-white mb-4">Fila de Times ({stats.totalTeams})</h5>
              {teamsQueue.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-gray-400">Nenhum time na fila ainda</p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {teamsQueue.map((team) => (
                    <Card 
                      key={team.id} 
                      className={`p-4 ${team.status === 'playing' ? 'border-white' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0 w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center border-2 border-gray-700">
                            <span className="font-black text-white">{team.position}</span>
                          </div>
                          <div>
                            <div className="text-white font-bold">{team.name}</div>
                            <div className="text-gray-400 text-sm">
                              {team.type === 'team' ? 'Time pronto' : 'Time aleatório'}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {team.status === 'playing' && (
                            <Badge variant="playing">Jogando</Badge>
                          )}
                          {team.status === 'waiting' && team.position === 1 && (
                            <Badge variant="next">Próximo</Badge>
                          )}
                          <Button
                            variant="ghost"
                            onClick={() => {
                              setSelectedItem({ ...team, type: 'team' });
                              setIsRemoveModalOpen(true);
                            }}
                            disabled={team.status === 'playing'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'jogo' && (
          <div className="space-y-6">
            {/* Current Match */}
            {currentMatch ? (
              <Card className="p-6 bg-white text-black border-white">
                <div className="flex items-center justify-between mb-6">
                  <h5 className="text-black">Jogo em Andamento</h5>
                  <Badge variant="playing">Ao vivo</Badge>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
                    <div>
                      <div className="text-xs text-gray-600 mb-1">TIME A</div>
                      <div className="font-black text-xl">
                        {teamsQueue.find(t => t.id === currentMatch.team_a_id)?.name || 'Time A'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center py-2">
                    <span className="text-gray-400 font-black text-lg">VS</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
                    <div>
                      <div className="text-xs text-gray-600 mb-1">TIME B</div>
                      <div className="font-black text-xl">
                        {teamsQueue.find(t => t.id === currentMatch.team_b_id)?.name || 'Time B'}
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  variant="accent"
                  className="w-full"
                  onClick={() => setIsEndGameModalOpen(true)}
                >
                  <Square className="w-5 h-5 mr-2" />
                  Encerrar Partida
                </Button>
              </Card>
            ) : (
              <Card className="p-8 text-center">
                <Clock className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <h5 className="text-white mb-2">Nenhum jogo em andamento</h5>
                <p className="text-gray-400 mb-6">
                  {stats.waitingTeams >= 2 
                    ? 'Clique no botão abaixo para iniciar o próximo jogo'
                    : 'Aguardando pelo menos 2 times na fila'}
                </p>
                <Button
                  variant="accent"
                  onClick={() => setIsStartGameModalOpen(true)}
                  disabled={stats.waitingTeams < 2}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Iniciar Próximo Jogo
                </Button>
              </Card>
            )}

            {/* Next Teams */}
            {!currentMatch && stats.waitingTeams >= 2 && (
              <div>
                <h5 className="text-white mb-4">Próximos Times</h5>
                <div className="grid md:grid-cols-2 gap-4">
                  {teamsQueue.filter(t => t.status === 'waiting').slice(0, 2).map((team, index) => (
                    <Card key={team.id} className="p-6">
                      <div className="text-gray-400 text-sm mb-1">
                        TIME {index === 0 ? 'A' : 'B'}
                      </div>
                      <div className="text-white font-bold text-lg">{team.name}</div>
                      <div className="text-gray-400 text-sm mt-1">
                        {team.type === 'team' ? 'Time pronto' : 'Time aleatório'}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      
      {/* Add Solo Modal */}
      <Modal
        isOpen={isAddSoloModalOpen}
        onClose={() => {
          setIsAddSoloModalOpen(false);
          setFormData({ name: '', phone: '', instagram: '' });
          setActionError('');
        }}
        title="Adicionar Avulso"
      >
        <div className="space-y-4">
          {actionError && (
            <div className="bg-red-500/10 border-2 border-red-500 rounded-lg p-4">
              <p className="text-red-500">{actionError}</p>
            </div>
          )}

          <Input
            label="Nome"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Input
            label="Telefone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />

          <Input
            label="Instagram (opcional)"
            value={formData.instagram}
            onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
          />

          <div className="flex gap-3 pt-4">
            <Button
              variant="accent"
              className="flex-1"
              onClick={handleAddSolo}
              disabled={actionLoading || !formData.name || !formData.phone}
            >
              {actionLoading ? 'Adicionando...' : 'Adicionar'}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setIsAddSoloModalOpen(false);
                setFormData({ name: '', phone: '', instagram: '' });
                setActionError('');
              }}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Start Game Modal */}
      <Modal
        isOpen={isStartGameModalOpen}
        onClose={() => setIsStartGameModalOpen(false)}
        title="Iniciar Jogo"
      >
        <div className="space-y-4">
          {actionError && (
            <div className="bg-red-500/10 border-2 border-red-500 rounded-lg p-4">
              <p className="text-red-500">{actionError}</p>
            </div>
          )}

          <p className="text-gray-400">
            Os dois primeiros times da fila irão jogar agora. Confirmar?
          </p>

          {stats.waitingTeams >= 2 && (
            <div className="space-y-3">
              <Card className="p-4">
                <div className="text-gray-400 text-sm">TIME A</div>
                <div className="text-white font-bold">
                  {teamsQueue.filter(t => t.status === 'waiting')[0]?.name}
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-gray-400 text-sm">TIME B</div>
                <div className="text-white font-bold">
                  {teamsQueue.filter(t => t.status === 'waiting')[1]?.name}
                </div>
              </Card>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              variant="accent"
              className="flex-1"
              onClick={handleStartGame}
              disabled={actionLoading}
            >
              {actionLoading ? 'Iniciando...' : 'Iniciar Jogo'}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setIsStartGameModalOpen(false);
                setActionError('');
              }}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>

      {/* End Game Modal */}
      <Modal
        isOpen={isEndGameModalOpen}
        onClose={() => setIsEndGameModalOpen(false)}
        title="Encerrar Partida"
      >
        <div className="space-y-4">
          {actionError && (
            <div className="bg-red-500/10 border-2 border-red-500 rounded-lg p-4">
              <p className="text-red-500">{actionError}</p>
            </div>
          )}

          <p className="text-gray-400">
            Os dois times voltarão para o final da fila. Confirmar?
          </p>

          <div className="flex gap-3 pt-4">
            <Button
              variant="accent"
              className="flex-1"
              onClick={handleEndGame}
              disabled={actionLoading}
            >
              {actionLoading ? 'Encerrando...' : 'Encerrar Partida'}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setIsEndGameModalOpen(false);
                setActionError('');
              }}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Remove Modal */}
      <Modal
        isOpen={isRemoveModalOpen}
        onClose={() => {
          setIsRemoveModalOpen(false);
          setSelectedItem(null);
          setActionError('');
        }}
        title="Remover da Fila"
      >
        <div className="space-y-4">
          {actionError && (
            <div className="bg-red-500/10 border-2 border-red-500 rounded-lg p-4">
              <p className="text-red-500">{actionError}</p>
            </div>
          )}

          <p className="text-gray-400">
            Tem certeza que deseja remover <strong className="text-white">{selectedItem?.name}</strong> da fila?
          </p>

          <div className="flex gap-3 pt-4">
            <Button
              variant="accent"
              className="flex-1"
              onClick={handleRemove}
              disabled={actionLoading}
            >
              {actionLoading ? 'Removendo...' : 'Remover'}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setIsRemoveModalOpen(false);
                setSelectedItem(null);
                setActionError('');
              }}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Pause Queue Modal */}
      <Modal
        isOpen={isPauseModalOpen}
        onClose={() => setIsPauseModalOpen(false)}
        title="Pausar Fila"
      >
        <div className="space-y-4">
          {actionError && (
            <div className="bg-red-500/10 border-2 border-red-500 rounded-lg p-4">
              <p className="text-red-500">{actionError}</p>
            </div>
          )}

          <p className="text-gray-400">
            Ao pausar a fila, novos check-ins serão bloqueados temporariamente. Confirmar?
          </p>

          <div className="flex gap-3 pt-4">
            <Button
              variant="accent"
              className="flex-1"
              onClick={handlePauseQueue}
              disabled={actionLoading}
            >
              {actionLoading ? 'Pausando...' : 'Pausar Fila'}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setIsPauseModalOpen(false);
                setActionError('');
              }}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Clear Queue Modal */}
      <Modal
        isOpen={isClearQueueModalOpen}
        onClose={() => setIsClearQueueModalOpen(false)}
        title="Limpar Fila"
      >
        <div className="space-y-4">
          {actionError && (
            <div className="bg-red-500/10 border-2 border-red-500 rounded-lg p-4">
              <p className="text-red-500">{actionError}</p>
            </div>
          )}

          <div className="bg-red-500/10 border-2 border-red-500 rounded-lg p-4">
            <p className="text-red-500 font-bold">⚠️ ATENÇÃO</p>
            <p className="text-red-500 text-sm mt-2">
              Todos os jogadores e times serão removidos permanentemente da fila. Esta ação não pode ser desfeita.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="accent"
              className="flex-1"
              onClick={handleClearQueue}
              disabled={actionLoading}
            >
              {actionLoading ? 'Limpando...' : 'Confirmar Limpeza'}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setIsClearQueueModalOpen(false);
                setActionError('');
              }}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>

      {/* QR Code Modal */}
      <Modal
        isOpen={isGenerateQRModalOpen}
        onClose={() => setIsGenerateQRModalOpen(false)}
        title="QR Code do Evento"
      >
        <div className="text-center space-y-4">
          <p className="text-gray-400">
            Use este QR Code para os participantes acessarem a fila digital
          </p>
          
          <div className="bg-white p-6 rounded-lg inline-block">
            <QRCodeGenerator 
              value={qrCodeUrl}
              size={256}
            />
          </div>

          <div className="text-left">
            <p className="text-gray-400 text-sm mb-2">Link direto:</p>
            <div className="bg-gray-900 p-3 rounded-lg">
              <code className="text-white text-sm break-all">{qrCodeUrl}</code>
            </div>
          </div>

          <Button
            variant="secondary"
            className="w-full"
            onClick={() => setIsGenerateQRModalOpen(false)}
          >
            Fechar
          </Button>
        </div>
      </Modal>
    </div>
  );
}
