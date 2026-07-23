import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui';
import { CategoryIcon } from '@/components/CategoryIcon';
import { useCatalog } from '@/contexts/CatalogContext';
import { statusEventoInfo } from '@/utils/dominio';
import type { Evento, StatusEvento } from '@/types';

export function StatusEventoBadge({ status }: { status: StatusEvento }) {
  const info = statusEventoInfo[status];
  return (
    <Badge tom={info.tom} ponto>
      {info.rotulo}
    </Badge>
  );
}

export function PrecoBadge({ evento }: { evento: Evento }) {
  if (evento.gratuito) return <Badge tom="sucesso">Gratuito</Badge>;
  return <Badge tom="brand">A partir de R$ {evento.precoAPartir.toFixed(0)}</Badge>;
}

export function CategoriaTag({ id, link }: { id: number; link?: boolean }) {
  const { categoriaPorId } = useCatalog();
  const cat = categoriaPorId(id);
  if (!cat) return null;
  const conteudo = (
    <span
      className="cat-tag"
      style={{ ['--cat' as string]: cat.cor }}
    >
      <CategoryIcon nome={cat.icone} size={13} />
      {cat.nome}
    </span>
  );
  return link ? (
    <Link to={`/explorar?categoria=${cat.id}`}>{conteudo}</Link>
  ) : (
    conteudo
  );
}

/** Barrinha de disponibilidade (vagas). */
export function BarraVagas({ inscritos, capacidade }: { inscritos: number; capacidade: number }) {
  const pct = capacidade > 0 ? Math.min(100, (inscritos / capacidade) * 100) : 0;
  const tom = pct >= 100 ? 'var(--danger-500)' : pct >= 80 ? 'var(--warning-500)' : 'var(--success-500)';
  return (
    <div className="barra-vagas" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
      <span style={{ width: `${pct}%`, background: tom }} />
    </div>
  );
}
