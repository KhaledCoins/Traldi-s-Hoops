import React from 'react';
import { CheckCircle2, XCircle, AlertCircle, Loader, Pause, Trophy, Users } from 'lucide-react';

export type FeedbackType = 
  | 'check-in-success'
  | 'phone-duplicate'
  | 'queue-paused'
  | 'event-finished'
  | 'not-enough-teams'
  | 'queue-updated'
  | 'game-started'
  | 'game-ended'
  | 'player-removed'
  | 'team-formed'
  | 'error-generic';

interface SystemFeedbackProps {
  type: FeedbackType;
  customMessage?: string;
  playerName?: string;
  teamName?: string;
}

export function SystemFeedback({ type, customMessage, playerName, teamName }: SystemFeedbackProps) {
  const feedbackConfig = {
    'check-in-success': {
      icon: CheckCircle2,
      iconColor: 'text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500',
      title: 'Check-in confirmado',
      message: playerName 
        ? `${playerName}, você está na fila!` 
        : 'Você entrou na fila com sucesso.'
    },
    'phone-duplicate': {
      icon: XCircle,
      iconColor: 'text-red-500',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500',
      title: 'Telefone já cadastrado',
      message: 'Este número já está na fila. Use outro telefone ou verifique se você já fez check-in.'
    },
    'queue-paused': {
      icon: Pause,
      iconColor: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500',
      title: 'Fila pausada',
      message: 'A organização pausou a fila temporariamente. Check-ins estão bloqueados.'
    },
    'event-finished': {
      icon: AlertCircle,
      iconColor: 'text-gray-500',
      bgColor: 'bg-gray-500/10',
      borderColor: 'border-gray-500',
      title: 'Evento encerrado',
      message: 'Este evento já foi finalizado. Confira os próximos eventos.'
    },
    'not-enough-teams': {
      icon: AlertCircle,
      iconColor: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500',
      title: 'Times insuficientes',
      message: 'É necessário pelo menos 2 times na fila para iniciar uma partida.'
    },
    'queue-updated': {
      icon: Loader,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500',
      title: 'Fila atualizada',
      message: 'A fila foi atualizada em tempo real. Confira sua nova posição.'
    },
    'game-started': {
      icon: Trophy,
      iconColor: 'text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500',
      title: 'Partida iniciada',
      message: teamName 
        ? `${teamName}, seu jogo começou!`
        : 'A partida começou. Boa sorte!'
    },
    'game-ended': {
      icon: CheckCircle2,
      iconColor: 'text-white',
      bgColor: 'bg-gray-900',
      borderColor: 'border-gray-700',
      title: 'Partida encerrada',
      message: 'Os times voltaram para o final da fila automaticamente.'
    },
    'player-removed': {
      icon: XCircle,
      iconColor: 'text-red-500',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500',
      title: 'Removido da fila',
      message: playerName 
        ? `${playerName} foi removido da fila.`
        : 'Jogador removido da fila.'
    },
    'team-formed': {
      icon: Users,
      iconColor: 'text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500',
      title: 'Time formado!',
      message: teamName 
        ? `${teamName} foi criado e adicionado à fila.`
        : 'Um novo time aleatório foi formado com 5 avulsos.'
    },
    'error-generic': {
      icon: XCircle,
      iconColor: 'text-red-500',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500',
      title: 'Erro',
      message: 'Algo deu errado. Tente novamente.'
    }
  };

  const config = feedbackConfig[type];
  const Icon = config.icon;
  const message = customMessage || config.message;

  return (
    <div className={`${config.bgColor} border-2 ${config.borderColor} rounded-lg p-4`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-6 h-6 ${config.iconColor} flex-shrink-0 mt-0.5`} />
        <div className="flex-1">
          <h5 className="text-white font-bold mb-1">{config.title}</h5>
          <p className="text-gray-300 text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
}

// Componente para exibir feedback inline em cards
interface InlineFeedbackProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

export function InlineFeedback({ type, message }: InlineFeedbackProps) {
  const config = {
    success: {
      icon: CheckCircle2,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
      border: 'border-green-500'
    },
    error: {
      icon: XCircle,
      color: 'text-red-500',
      bg: 'bg-red-500/10',
      border: 'border-red-500'
    },
    warning: {
      icon: AlertCircle,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500'
    },
    info: {
      icon: AlertCircle,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500'
    }
  };

  const style = config[type];
  const Icon = style.icon;

  return (
    <div className={`${style.bg} border-2 ${style.border} rounded-lg p-3 flex items-start gap-3`}>
      <Icon className={`w-5 h-5 ${style.color} flex-shrink-0 mt-0.5`} />
      <p className="text-white text-sm">{message}</p>
    </div>
  );
}
