import type { ReactNode } from 'react';
import {
  Inbox,
  WifiOff,
  Lock,
  ShieldAlert,
  SearchX,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { Button } from './Button';
import type { AsyncEstado } from '@/hooks/useAsync';

export function Spinner({ tamanho = 22 }: { tamanho?: number }) {
  return <span className="spinner" style={{ width: tamanho, height: tamanho }} role="status" aria-label="Carregando" />;
}

export function Skeleton({
  w = '100%',
  h = 16,
  radius,
  style,
}: {
  w?: number | string;
  h?: number | string;
  radius?: number | string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className="skeleton"
      style={{ display: 'block', width: w, height: h, borderRadius: radius, ...style }}
      aria-hidden
    />
  );
}

interface StatePanelProps {
  icone?: ReactNode;
  titulo: string;
  descricao?: string;
  acao?: ReactNode;
}

export function StatePanel({ icone, titulo, descricao, acao }: StatePanelProps) {
  return (
    <div className="state-panel">
      {icone && <div className="state-panel__icon">{icone}</div>}
      <h3>{titulo}</h3>
      {descricao && <p>{descricao}</p>}
      {acao && <div className="mt-2">{acao}</div>}
    </div>
  );
}

export function EmptyState({
  titulo = 'Nada por aqui ainda',
  descricao = 'Não encontramos resultados para os filtros atuais.',
  acao,
  icone,
}: Partial<StatePanelProps>) {
  return <StatePanel icone={icone ?? <Inbox size={28} />} titulo={titulo} descricao={descricao} acao={acao} />;
}

/**
 * Painel que traduz o status HTTP simulado em um estado visual apropriado
 * (401, 403, 404, offline, erro genérico). Preparação para a API real.
 */
export function ErrorState({
  status,
  mensagem,
  onRetry,
}: {
  status?: number | null;
  mensagem?: string | null;
  onRetry?: () => void;
}) {
  const mapa: Record<number, { icone: ReactNode; titulo: string; descricao: string }> = {
    401: { icone: <Lock size={28} />, titulo: 'Sessão necessária', descricao: 'Entre na sua conta para acessar este conteúdo.' },
    403: { icone: <ShieldAlert size={28} />, titulo: 'Acesso negado', descricao: 'Você não tem permissão para ver esta área.' },
    404: { icone: <SearchX size={28} />, titulo: 'Não encontrado', descricao: mensagem ?? 'O recurso que você procura não existe ou foi removido.' },
  };
  const cfg =
    (status && mapa[status]) ||
    ({
      icone: <AlertTriangle size={28} />,
      titulo: 'Algo deu errado',
      descricao: mensagem ?? 'Não foi possível carregar as informações.',
    } as const);

  return (
    <StatePanel
      icone={cfg.icone}
      titulo={cfg.titulo}
      descricao={cfg.descricao}
      acao={
        onRetry && (
          <Button variante="secondary" iconeEsq={<RefreshCw size={16} />} onClick={onRetry}>
            Tentar novamente
          </Button>
        )
      }
    />
  );
}

export function OfflineState({ onRetry }: { onRetry?: () => void }) {
  return (
    <StatePanel
      icone={<WifiOff size={28} />}
      titulo="Sem conexão"
      descricao="Verifique sua internet e tente novamente."
      acao={onRetry && <Button variante="secondary" onClick={onRetry}>Tentar novamente</Button>}
    />
  );
}

/**
 * Orquestra os estados de useAsync. Renderiza skeleton/erro/vazio/sucesso,
 * garantindo que toda tela ligada a um serviço trate todos os estados.
 */
export function AsyncBoundary<T>({
  estado,
  statusHttp,
  erro,
  onRetry,
  loading,
  vazio,
  children,
  data,
}: {
  estado: AsyncEstado;
  statusHttp?: number | null;
  erro?: string | null;
  onRetry?: () => void;
  loading: ReactNode;
  vazio?: ReactNode;
  data: T | null;
  children: (data: T) => ReactNode;
}) {
  if (estado === 'loading' || estado === 'idle') return <>{loading}</>;
  if (estado === 'error') return <ErrorState status={statusHttp} mensagem={erro} onRetry={onRetry} />;
  if (estado === 'empty') return <>{vazio ?? <EmptyState />}</>;
  return <>{data && children(data)}</>;
}
