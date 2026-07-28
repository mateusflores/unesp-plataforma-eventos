import { Link } from 'react-router-dom';
import { Star, CalendarDays } from 'lucide-react';
import { services } from '@/services';
import { useAsync } from '@/hooks/useAsync';
import { PageHeader } from '@/components/layout/PageHeader';
import { Avatar, Badge, Button, Skeleton, ErrorState } from '@/components/ui';
import { tipoEntidadeRotulo } from '@/utils/dominio';

export function OrganizersPage() {
  const { data, estado, statusHttp, erro, recarregar } = useAsync(() => services.organizers.listar(), []);

  return (
    <div className="container section-sm">
      <PageHeader
        titulo="Organizadores"
        subtitulo="Atléticas, centros acadêmicos, empresas juniores e comissões que fazem o campus acontecer."
      />

      {estado === 'error' ? (
        <ErrorState status={statusHttp} mensagem={erro} onRetry={recarregar} />
      ) : estado === 'loading' ? (
<<<<<<< HEAD
        <div className="org-grid">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} h={200} radius="var(--radius-lg)" />)}
        </div>
      ) : (
        <div className="org-grid">
          {data?.map((o) => (
            <div key={o.id} className="org-card">
              <Avatar nome={o.nome} cor={o.avatarCor} tamanho={64} />
              <div className="org-card__nome">
                {o.nome.split('—')[0].trim()}
                {o.verificado && <Star size={15} fill="var(--brand-500)" color="var(--brand-500)" />}
              </div>
              <Badge tom="neutro">{o.entidade ? tipoEntidadeRotulo[o.entidade.tipo] : 'Organizador'}</Badge>
              <p className="org-card__desc clamp-3">{o.descricao}</p>
              <div className="org-card__meta row gap-1"><CalendarDays size={13} /> {o.eventosRealizados} eventos realizados</div>
              <Link to={`/explorar`} style={{ marginTop: 'var(--sp-3)', width: '100%' }}>
=======
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} h={200} radius="var(--radius-lg)" />)}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data?.map((o) => (
            <div key={o.id} className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
              <Avatar nome={o.nome} cor={o.avatarCor} tamanho={64} />
              <div className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white">
                {o.nome.split('—')[0].trim()}
                {o.verificado && <Star size={15} className="fill-brand-500 text-brand-500" />}
              </div>
              <Badge tom="neutro">{o.entidade ? tipoEntidadeRotulo[o.entidade.tipo] : 'Organizador'}</Badge>
              <p className="text-sm text-slate-600 line-clamp-3 dark:text-slate-300">{o.descricao}</p>
              <div className="mt-2 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400"><CalendarDays size={13} /> {o.eventosRealizados} eventos realizados</div>
              <Link to={`/explorar`} className="mt-3 w-full">
>>>>>>> 604fa8e (Migração para Tailwind e ajustes de build)
                <Button variante="secondary" bloco tamanho="sm">Ver eventos</Button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
