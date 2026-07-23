import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';
import { Button, Chip, Drawer, Select } from '@/components/ui';
import { useCatalog } from '@/contexts/CatalogContext';
import type { EventoFiltros } from '@/types';

interface Props {
  filtros: EventoFiltros;
  onChange: (patch: Partial<EventoFiltros>) => void;
  onLimpar: () => void;
  totalResultados?: number;
}

export function EventFilters({ filtros, onChange, onLimpar, totalResultados }: Props) {
  const { categorias, universidades, campi } = useCatalog();
  const [drawerAberto, setDrawerAberto] = useState(false);

  const campiFiltrados = filtros.universidadeId
    ? campi.filter((c) => c.universidadeId === filtros.universidadeId)
    : campi;

  const catsAtivas = filtros.categoriaIds ?? [];
  const toggleCategoria = (id: number) => {
    const nova = catsAtivas.includes(id) ? catsAtivas.filter((x) => x !== id) : [...catsAtivas, id];
    onChange({ categoriaIds: nova.length ? nova : undefined });
  };

  const filtrosAtivos =
    (filtros.busca ? 1 : 0) +
    (filtros.universidadeId ? 1 : 0) +
    (filtros.campusId ? 1 : 0) +
    catsAtivas.length +
    (filtros.gratuito !== undefined ? 1 : 0);

  const controlesInternos = (
    <>
      <div className="filtro-grupo">
        <div className="filtro-grupo__titulo">Universidade</div>
        <Select
          value={filtros.universidadeId ?? ''}
          onChange={(e) =>
            onChange({ universidadeId: e.target.value ? Number(e.target.value) : undefined, campusId: undefined })
          }
        >
          <option value="">Todas</option>
          {universidades.map((u) => (
            <option key={u.id} value={u.id}>{u.sigla} — {u.nome}</option>
          ))}
        </Select>
      </div>
      <div className="filtro-grupo">
        <div className="filtro-grupo__titulo">Campus</div>
        <Select
          value={filtros.campusId ?? ''}
          onChange={(e) => onChange({ campusId: e.target.value ? Number(e.target.value) : undefined })}
        >
          <option value="">Todos</option>
          {campiFiltrados.map((c) => (
            <option key={c.id} value={c.id}>{c.nome} · {c.cidade}</option>
          ))}
        </Select>
      </div>
      <div className="filtro-grupo">
        <div className="filtro-grupo__titulo">Categorias</div>
        <div className="filtro-opcoes">
          {categorias.map((c) => (
            <Chip key={c.id} cor={c.cor} ativo={catsAtivas.includes(c.id)} onClick={() => toggleCategoria(c.id)}>
              {c.nome}
            </Chip>
          ))}
        </div>
      </div>
      <div className="filtro-grupo">
        <div className="filtro-grupo__titulo">Preço</div>
        <div className="filtro-opcoes">
          <Chip ativo={filtros.gratuito === undefined} onClick={() => onChange({ gratuito: undefined })}>Todos</Chip>
          <Chip ativo={filtros.gratuito === true} onClick={() => onChange({ gratuito: true })}>Gratuitos</Chip>
          <Chip ativo={filtros.gratuito === false} onClick={() => onChange({ gratuito: false })}>Pagos</Chip>
        </div>
      </div>
    </>
  );

  return (
    <>
      <div className="filtros-bar">
        <label className="busca-inline">
          <Search size={17} />
          <input
            value={filtros.busca ?? ''}
            onChange={(e) => onChange({ busca: e.target.value || undefined })}
            placeholder="Buscar por nome ou local…"
            aria-label="Buscar eventos"
          />
          {filtros.busca && (
            <button onClick={() => onChange({ busca: undefined })} aria-label="Limpar busca"><X size={15} /></button>
          )}
        </label>

        {/* Selects diretos no desktop */}
        <div className="hide-mobile row gap-2">
          <Select
            value={filtros.universidadeId ?? ''}
            onChange={(e) => onChange({ universidadeId: e.target.value ? Number(e.target.value) : undefined, campusId: undefined })}
            aria-label="Universidade"
          >
            <option value="">Todas universidades</option>
            {universidades.map((u) => <option key={u.id} value={u.id}>{u.sigla}</option>)}
          </Select>
          <Select
            value={filtros.campusId ?? ''}
            onChange={(e) => onChange({ campusId: e.target.value ? Number(e.target.value) : undefined })}
            aria-label="Campus"
          >
            <option value="">Todos campi</option>
            {campiFiltrados.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </Select>
        </div>

        <Button
          variante="secondary"
          iconeEsq={<SlidersHorizontal size={16} />}
          onClick={() => setDrawerAberto(true)}
        >
          Filtros{filtrosAtivos > 0 && ` (${filtrosAtivos})`}
        </Button>
        {filtrosAtivos > 0 && (
          <Button variante="ghost" onClick={onLimpar}>Limpar</Button>
        )}
      </div>

      {/* Chips de categoria (desktop, acesso rápido) */}
      <div className="filtros-chips hide-mobile mb-4">
        {categorias.map((c) => (
          <Chip key={c.id} cor={c.cor} ativo={catsAtivas.includes(c.id)} onClick={() => toggleCategoria(c.id)}>
            {c.nome}
          </Chip>
        ))}
      </div>

      {/* Resumo de filtros ativos + total */}
      {(filtrosAtivos > 0 || totalResultados !== undefined) && (
        <div className="resultado-info">
          <strong>{totalResultados !== undefined ? `${totalResultados} evento${totalResultados === 1 ? '' : 's'}` : ''}</strong>
          {filtrosAtivos > 0 && (
            <div className="filtros-chips">
              {filtros.busca && <Chip ativo onRemover={() => onChange({ busca: undefined })}>“{filtros.busca}”</Chip>}
              {catsAtivas.map((id) => {
                const c = categorias.find((x) => x.id === id);
                return c ? <Chip key={id} ativo onRemover={() => toggleCategoria(id)}>{c.nome}</Chip> : null;
              })}
              {filtros.gratuito !== undefined && (
                <Chip ativo onRemover={() => onChange({ gratuito: undefined })}>{filtros.gratuito ? 'Gratuitos' : 'Pagos'}</Chip>
              )}
            </div>
          )}
        </div>
      )}

      <Drawer
        aberto={drawerAberto}
        onFechar={() => setDrawerAberto(false)}
        titulo="Filtrar eventos"
        footer={
          <>
            <Button variante="ghost" onClick={onLimpar} bloco>Limpar tudo</Button>
            <Button onClick={() => setDrawerAberto(false)} bloco>Ver resultados</Button>
          </>
        }
      >
        {controlesInternos}
      </Drawer>
    </>
  );
}

/** Legenda de cores por categoria (calendário). */
export function CategoriaLegenda() {
  const { categorias } = useCatalog();
  return (
    <div className="filtros-legenda">
      {categorias.map((c) => (
        <span key={c.id} className="filtros-legenda__item">
          <span className="filtros-legenda__dot" style={{ background: c.cor }} /> {c.nome}
        </span>
      ))}
    </div>
  );
}
