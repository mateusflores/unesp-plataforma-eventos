import { Link } from 'react-router-dom';
import { CalendarDays, MapPin, Users, ArrowRight } from 'lucide-react';
import { Modal, Button } from '@/components/ui';
import { EventCover } from '@/components/events/EventCover';
import { CategoriaTag, PrecoBadge, StatusEventoBadge } from '@/components/events/EventBits';
import { intervalo } from '@/utils/format';
import { useCatalog } from '@/contexts/CatalogContext';
import type { Evento } from '@/types';

export function EventSummaryModal({ evento, onFechar }: { evento: Evento | null; onFechar: () => void }) {
  const { campusPorId, organizadorPorId } = useCatalog();
  if (!evento) return null;
  const campus = campusPorId(evento.campusId);
  const org = organizadorPorId(evento.organizadorId);

  return (
    <Modal aberto={!!evento} onFechar={onFechar}>
      <div style={{ margin: 'calc(-1 * var(--sp-6)) calc(-1 * var(--sp-6)) 0' }} className="cal-pop-cover">
        <EventCover evento={evento} altura={140} />
      </div>
      <div style={{ paddingTop: 'var(--sp-4)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
        <div className="row gap-2 wrap">
          {evento.categoriaIds.map((id) => <CategoriaTag key={id} id={id} />)}
          {evento.status !== 'PUBLICADO' ? <StatusEventoBadge status={evento.status} /> : <PrecoBadge evento={evento} />}
        </div>
        <h2 style={{ fontSize: 'var(--fs-xl)' }}>{evento.titulo}</h2>
        <p className="text-secondary text-sm clamp-3">{evento.resumo}</p>
        <ul className="cal-pop-meta">
          <li><CalendarDays size={16} /> {intervalo(evento.dataInicio, evento.dataFim)}</li>
          <li><MapPin size={16} /> {evento.local} · {campus?.nome}</li>
          <li><Users size={16} /> {evento.inscritos}/{evento.capacidade} inscritos · {org?.nome.split('—')[0].trim()}</li>
        </ul>
        <Link to={`/eventos/${evento.slug}`} onClick={onFechar}>
          <Button bloco iconeDir={<ArrowRight size={16} />}>Ver detalhes e participar</Button>
        </Link>
      </div>
    </Modal>
  );
}
