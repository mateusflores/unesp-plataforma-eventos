import { Link } from 'react-router-dom';
import { CalendarDays, MapPin, Users } from 'lucide-react';
import { useCatalog } from '@/contexts/CatalogContext';
import { intervalo } from '@/utils/format';
import { EventCover } from './EventCover';
import { CategoriaTag, PrecoBadge, StatusEventoBadge } from './EventBits';
import type { Evento } from '@/types';
import './events.css';

export function EventCard({ evento }: { evento: Evento }) {
  const { campusPorId, universidadePorId, organizadorPorId } = useCatalog();
  const campus = campusPorId(evento.campusId);
  const uni = universidadePorId(evento.universidadeId);
  const org = organizadorPorId(evento.organizadorId);
  const encerradoOuCancelado = evento.status === 'CANCELADO' || evento.status === 'ENCERRADO';

  return (

    <Link to={`/eventos/${evento.slug}`} className={`group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 ${encerradoOuCancelado ? 'opacity-70' : ''}`}>
      <div className="relative">
        <EventCover evento={evento} altura={172} />
        <div className="absolute left-3 top-3 flex gap-2">
          {evento.status !== 'PUBLICADO' ? <StatusEventoBadge status={evento.status} /> : <PrecoBadge evento={evento} />}
        </div>
        {evento.destaque && <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-slate-800 shadow">★ Destaque</span>}
      </div>
      <div className="space-y-3 p-4">
        <div className="flex flex-wrap gap-2">
          {evento.categoriaIds.slice(0, 2).map((id) => (
            <CategoriaTag key={id} id={id} />
          ))}
        </div>

        <h3 className="line-clamp-2 font-display text-lg font-semibold text-slate-900 dark:text-slate-100">{evento.titulo}</h3>
        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
          <li className="flex items-center gap-2"><CalendarDays size={15} /> {intervalo(evento.dataInicio, evento.dataFim)}</li>
          <li className="flex items-center gap-2"><MapPin size={15} /> <span className="truncate">{evento.local} · {campus?.nome}{uni ? ` — ${uni.sigla}` : ''}</span></li>
          <li className="flex items-center gap-2"><Users size={15} /> {evento.inscritos}/{evento.capacidade} · {org?.nome.split('—')[0].trim()}</li>
        </ul>
      </div>
    </Link>
  );
}

export function EventCardSkeleton() {
  return (

    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="h-[172px] animate-pulse bg-slate-200 dark:bg-slate-800" />
      <div className="space-y-3 p-4">
        <div className="h-6 w-24 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="h-5 w-4/5 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="h-4 w-3/4 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="h-4 w-2/3 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
  );
}
