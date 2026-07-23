import type { ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface OpcaoSegmento<T extends string> {
  valor: T;
  rotulo: string;
  icone?: ReactNode;
}

export function Segmented<T extends string>({
  opcoes,
  valor,
  onChange,
  ariaLabel,
}: {
  opcoes: OpcaoSegmento<T>[];
  valor: T;
  onChange: (v: T) => void;
  ariaLabel?: string;
}) {
  return (
    <div className="segmented" role="tablist" aria-label={ariaLabel}>
      {opcoes.map((o) => (
        <button
          key={o.valor}
          role="tab"
          aria-selected={valor === o.valor}
          className={`segmented__item ${valor === o.valor ? 'segmented__item--ativo' : ''}`}
          onClick={() => onChange(o.valor)}
        >
          {o.icone}
          {o.rotulo}
        </button>
      ))}
    </div>
  );
}

export function Tabs<T extends string>({
  opcoes,
  valor,
  onChange,
}: {
  opcoes: { valor: T; rotulo: string; contagem?: number }[];
  valor: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="tabs" role="tablist">
      {opcoes.map((o) => (
        <button
          key={o.valor}
          role="tab"
          aria-selected={valor === o.valor}
          className={`tab ${valor === o.valor ? 'tab--ativo' : ''}`}
          onClick={() => onChange(o.valor)}
        >
          {o.rotulo}
          {typeof o.contagem === 'number' && (
            <span className="text-muted" style={{ marginLeft: 6, fontWeight: 500 }}>
              {o.contagem}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export function Pagination({
  pagina,
  totalPaginas,
  onChange,
}: {
  pagina: number;
  totalPaginas: number;
  onChange: (p: number) => void;
}) {
  if (totalPaginas <= 1) return null;
  const paginas: (number | '...')[] = [];
  for (let p = 1; p <= totalPaginas; p++) {
    if (p === 1 || p === totalPaginas || Math.abs(p - pagina) <= 1) paginas.push(p);
    else if (paginas[paginas.length - 1] !== '...') paginas.push('...');
  }

  return (
    <nav className="pagination" aria-label="Paginação">
      <button
        className="pagination__btn"
        disabled={pagina === 1}
        onClick={() => onChange(pagina - 1)}
        aria-label="Página anterior"
      >
        <ChevronLeft size={16} />
      </button>
      {paginas.map((p, i) =>
        p === '...' ? (
          <span key={`e${i}`} className="pagination__btn" style={{ cursor: 'default' }}>
            …
          </span>
        ) : (
          <button
            key={p}
            className={`pagination__btn ${p === pagina ? 'pagination__btn--ativo' : ''}`}
            onClick={() => onChange(p)}
            aria-current={p === pagina ? 'page' : undefined}
          >
            {p}
          </button>
        ),
      )}
      <button
        className="pagination__btn"
        disabled={pagina === totalPaginas}
        onClick={() => onChange(pagina + 1)}
        aria-label="Próxima página"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}

export function Stepper({
  etapas,
  atual,
}: {
  etapas: string[];
  atual: number;
}) {
  return (
    <div className="stepper" role="list">
      {etapas.map((e, i) => {
        const estado = i < atual ? 'ok' : i === atual ? 'ativo' : '';
        return (
          <div key={e} className="stepper__step" style={{ display: 'contents' }}>
            <div className={`stepper__step ${estado ? `stepper__step--${estado}` : ''}`} role="listitem">
              <span className="stepper__bullet">{i < atual ? '✓' : i + 1}</span>
              <span className="stepper__label">{e}</span>
            </div>
            {i < etapas.length - 1 && <span className="stepper__line" aria-hidden />}
          </div>
        );
      })}
    </div>
  );
}
