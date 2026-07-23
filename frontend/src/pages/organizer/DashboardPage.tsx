import { Link } from 'react-router-dom';
import {
  CalendarCheck, FileEdit, Users, Ticket, QrCode, PlusCircle, TrendingUp,
  AlertTriangle, CheckCircle2, ArrowRight,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge, Button, Skeleton, ErrorState } from '@/components/ui';
import { StatusEventoBadge } from '@/components/events/EventBits';
import { useEventosDoOrganizador } from '@/hooks/useOrganizer';
import { intervalo } from '@/utils/format';
import type { ReactNode } from 'react';

export function OrgDashboardPage() {
  const { data, estado, statusHttp, erro, recarregar } = useEventosDoOrganizador();

  if (estado === 'error') return <ErrorState status={statusHttp} mensagem={erro} onRetry={recarregar} />;

  const eventos = data ?? [];
  const publicados = eventos.filter((e) => e.status === 'PUBLICADO');
  const rascunhos = eventos.filter((e) => e.status === 'RASCUNHO');
  const encerrados = eventos.filter((e) => e.status === 'ENCERRADO');
  const cancelados = eventos.filter((e) => e.status === 'CANCELADO');
  const totalInscritos = eventos.reduce((s, e) => s + e.inscritos, 0);
  const agora = new Date(2026, 6, 10).getTime();
  const proximos = publicados
    .filter((e) => new Date(e.dataInicio).getTime() >= agora)
    .sort((a, b) => a.dataInicio.localeCompare(b.dataInicio))
    .slice(0, 4);

  const carregando = estado === 'loading' || estado === 'idle';

  return (
    <div>
      <PageHeader
        titulo="Dashboard"
        subtitulo="Visão geral dos seus eventos e da participação do público."
        acoes={<Link to="/organizador/eventos/novo"><Button iconeEsq={<PlusCircle size={16} />}>Criar evento</Button></Link>}
      />

      <div className="stats-grid mb-8">
        <Stat carregando={carregando} icone={<CalendarCheck size={20} />} cor="var(--brand-600)" label="Publicados" valor={publicados.length} />
        <Stat carregando={carregando} icone={<FileEdit size={20} />} cor="var(--warning-500)" label="Rascunhos" valor={rascunhos.length} />
        <Stat carregando={carregando} icone={<Users size={20} />} cor="var(--success-500)" label="Inscritos totais" valor={totalInscritos} />
        <Stat carregando={carregando} icone={<Ticket size={20} />} cor="var(--accent-500)" label="Encerrados" valor={encerrados.length} />
      </div>

      <div className="checkout-grid">
        <div className="painel">
          <div className="row-between mb-4">
            <strong>Próximos eventos</strong>
            <Link to="/organizador/eventos" className="sec-link">Ver todos <ArrowRight size={14} /></Link>
          </div>
          {carregando ? (
            <div className="col gap-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} h={64} />)}</div>
          ) : proximos.length === 0 ? (
            <p className="text-sm text-muted">Nenhum evento futuro publicado.</p>
          ) : (
            <div className="col gap-3">
              {proximos.map((e) => (
                <Link key={e.id} to={`/organizador/eventos/${e.id}/editar`} className="row-between painel" style={{ padding: 'var(--sp-3)' }}>
                  <div>
                    <strong className="text-sm">{e.titulo}</strong>
                    <div className="text-xs text-muted mt-1">{intervalo(e.dataInicio, e.dataFim)}</div>
                  </div>
                  <div className="row gap-3">
                    <span className="text-sm text-secondary row gap-1"><Users size={14} /> {e.inscritos}/{e.capacidade}</span>
                    <StatusEventoBadge status={e.status} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="col gap-4">
          <div className="painel">
            <strong className="text-sm">Alertas</strong>
            <div className="col gap-3 mt-3">
              {rascunhos.length > 0 && (
                <Alerta tom="aviso" icone={<AlertTriangle size={16} />}>
                  Você tem <strong>{rascunhos.length}</strong> evento(s) em rascunho aguardando publicação.
                </Alerta>
              )}
              {proximos.some((e) => e.inscritos / e.capacidade >= 0.9) && (
                <Alerta tom="perigo" icone={<TrendingUp size={16} />}>Há eventos quase lotados — considere aumentar a capacidade.</Alerta>
              )}
              {cancelados.length > 0 && (
                <Alerta tom="neutro" icone={<AlertTriangle size={16} />}>{cancelados.length} evento(s) cancelado(s) no histórico.</Alerta>
              )}
              {rascunhos.length === 0 && (
                <Alerta tom="sucesso" icone={<CheckCircle2 size={16} />}>Tudo em dia! Nenhuma pendência.</Alerta>
              )}
            </div>
          </div>
          <div className="painel">
            <strong className="text-sm">Ações rápidas</strong>
            <div className="col gap-2 mt-3">
              <Link to="/organizador/eventos/novo"><Button variante="secondary" bloco iconeEsq={<PlusCircle size={16} />}>Criar evento</Button></Link>
              <Link to="/organizador/checkin"><Button variante="secondary" bloco iconeEsq={<QrCode size={16} />}>Fazer check-in</Button></Link>
              <Link to="/organizador/cupons"><Button variante="secondary" bloco iconeEsq={<Ticket size={16} />}>Gerenciar cupons</Button></Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ icone, cor, label, valor, carregando }: { icone: ReactNode; cor: string; label: string; valor: number; carregando: boolean }) {
  return (
    <div className="stat-card">
      <div className="stat-card__top">
        <span className="stat-card__label">{label}</span>
        <span className="stat-card__icon" style={{ background: `color-mix(in srgb, ${cor} 14%, transparent)`, color: cor }}>{icone}</span>
      </div>
      {carregando ? <Skeleton h={32} w={60} /> : <span className="stat-card__num">{valor}</span>}
    </div>
  );
}

function Alerta({ tom, icone, children }: { tom: 'aviso' | 'perigo' | 'sucesso' | 'neutro'; icone: ReactNode; children: ReactNode }) {
  return (
    <div className="row gap-3" style={{ alignItems: 'flex-start', fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>
      <span style={{ color: `var(--${tom === 'perigo' ? 'danger' : tom === 'aviso' ? 'warning' : tom === 'sucesso' ? 'success' : 'gray'}-500)`, flexShrink: 0, marginTop: 2 }}>{icone}</span>
      <span>{children}</span>
    </div>
  );
}
