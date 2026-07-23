import { CalendarDays, Users, Building2, Ticket, DollarSign, CheckCircle2 } from 'lucide-react';
import { services } from '@/services';
import { useAsync } from '@/hooks/useAsync';
import { PageHeader } from '@/components/layout/PageHeader';
import { Skeleton, ErrorState, Badge } from '@/components/ui';
import { StatusEventoBadge } from '@/components/events/EventBits';
import { useCatalog } from '@/contexts/CatalogContext';
import { moeda } from '@/utils/format';
import type { ReactNode } from 'react';

export function AdminOverviewPage() {
  const metricas = useAsync(() => services.admin.metricas(), []);
  const eventos = useAsync(() => services.events.listar({}, 1, 200), []);
  const { universidades } = useCatalog();

  if (metricas.estado === 'error') return <ErrorState onRetry={metricas.recarregar} />;

  const m = metricas.data;
  const distribuicao = (() => {
    const evs = eventos.data?.itens ?? [];
    const cont = { PUBLICADO: 0, RASCUNHO: 0, ENCERRADO: 0, CANCELADO: 0 };
    evs.forEach((e) => (cont[e.status] += 1));
    return cont;
  })();
  const totalEv = eventos.data?.total ?? 0;

  return (
    <div>
      <PageHeader titulo="Visão geral" subtitulo="Métricas gerais da plataforma Ágora." />

      <div className="stats-grid mb-8">
        <Stat carregando={!m} icone={<CalendarDays size={20} />} cor="var(--brand-600)" label="Eventos" valor={m?.totalEventos ?? 0} />
        <Stat carregando={!m} icone={<CheckCircle2 size={20} />} cor="var(--success-500)" label="Publicados" valor={m?.eventosPublicados ?? 0} />
        <Stat carregando={!m} icone={<Users size={20} />} cor="var(--info-500)" label="Usuários" valor={m?.totalUsuarios ?? 0} />
        <Stat carregando={!m} icone={<Building2 size={20} />} cor="var(--cat-cultural)" label="Organizadores" valor={m?.totalOrganizadores ?? 0} />
        <Stat carregando={!m} icone={<Ticket size={20} />} cor="var(--accent-500)" label="Ingressos vendidos" valor={m?.ingressosVendidos ?? 0} />
        <Stat carregando={!m} icone={<DollarSign size={20} />} cor="var(--warning-500)" label="Receita" valor={m ? moeda(m.receita) : '—'} />
      </div>

      <div className="checkout-grid">
        <div className="painel">
          <strong className="text-sm">Eventos por status</strong>
          {eventos.estado === 'loading' ? (
            <Skeleton h={180} />
          ) : (
            <div className="col gap-3 mt-4">
              {(Object.entries(distribuicao) as [keyof typeof distribuicao, number][]).map(([status, qtd]) => (
                <div key={status}>
                  <div className="row-between text-sm mb-1">
                    <StatusEventoBadge status={status} />
                    <span className="text-secondary">{qtd}</span>
                  </div>
                  <div className="barra-vagas"><span style={{ width: `${totalEv ? (qtd / totalEv) * 100 : 0}%`, background: 'var(--brand-500)' }} /></div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="painel">
          <strong className="text-sm">Universidades ativas</strong>
          <div className="col gap-3 mt-4">
            {universidades.map((u) => (
              <div key={u.id} className="row-between">
                <div className="row gap-2">
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: u.logoCor }} />
                  <span className="text-sm">{u.nome}</span>
                </div>
                <Badge tom="neutro">{u.sigla}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ icone, cor, label, valor, carregando }: { icone: ReactNode; cor: string; label: string; valor: ReactNode; carregando: boolean }) {
  return (
    <div className="stat-card">
      <div className="stat-card__top">
        <span className="stat-card__label">{label}</span>
        <span className="stat-card__icon" style={{ background: `color-mix(in srgb, ${cor} 14%, transparent)`, color: cor }}>{icone}</span>
      </div>
      {carregando ? <Skeleton h={30} w={64} /> : <span className="stat-card__num">{valor}</span>}
    </div>
  );
}
