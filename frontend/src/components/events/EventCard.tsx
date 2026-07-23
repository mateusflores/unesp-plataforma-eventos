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
    <Link to={`/eventos/${evento.slug}`} className={`event-card ${encerradoOuCancelado ? 'event-card--fade' : ''}`}>
      <div className="event-card__cover">
        <EventCover evento={evento} altura={172} />
        <div className="event-card__badges">
          {evento.status !== 'PUBLICADO' ? <StatusEventoBadge status={evento.status} /> : <PrecoBadge evento={evento} />}
        </div>
        {evento.destaque && <span className="event-card__destaque">★ Destaque</span>}
      </div>
      <div className="event-card__body">
        <div className="row gap-2 wrap">
          {evento.categoriaIds.slice(0, 2).map((id) => (
            <CategoriaTag key={id} id={id} />
          ))}
        </div>
        <h3 className="event-card__titulo clamp-2">{evento.titulo}</h3>
        <ul className="event-card__meta">
          <li>
            <CalendarDays size={15} /> {intervalo(evento.dataInicio, evento.dataFim)}
          </li>
          <li>
            <MapPin size={15} /> <span className="truncate">{evento.local} · {campus?.nome}{uni ? ` — ${uni.sigla}` : ''}</span>
          </li>
          <li>
            <Users size={15} /> {evento.inscritos}/{evento.capacidade} · {org?.nome.split('—')[0].trim()}
          </li>
        </ul>
      </div>
    </Link>
  );
}

export function EventCardSkeleton() {
  return (
    <div className="event-card">
      <span className="skeleton" style={{ height: 172, borderRadius: 0 }} />
      <div className="event-card__body">
        <span className="skeleton" style={{ width: 90, height: 20, borderRadius: 999 }} />
        <span className="skeleton" style={{ width: '85%', height: 22, marginTop: 4 }} />
        <span className="skeleton" style={{ width: '70%', height: 14, marginTop: 10 }} />
        <span className="skeleton" style={{ width: '60%', height: 14, marginTop: 6 }} />
      </div>
    </div>
  );
}
