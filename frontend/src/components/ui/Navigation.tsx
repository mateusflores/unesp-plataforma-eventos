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

    <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-800 dark:bg-slate-900" role="tablist" aria-label={ariaLabel}>
      {opcoes.map((o) => (
        <button
          key={o.valor}
          role="tab"
          aria-selected={valor === o.valor}

          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${valor === o.valor ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}
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

    <div className="flex flex-wrap items-center gap-2" role="tablist">
      {opcoes.map((o) => (
        <button
          key={o.valor}
          role="tab"
          aria-selected={valor === o.valor}

          className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition ${valor === o.valor ? 'bg-brand-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'}`}
          onClick={() => onChange(o.valor)}
        >
          {o.rotulo}
          {typeof o.contagem === 'number' && (

            <span className="ml-2 text-xs font-semibold opacity-80">{o.contagem}</span>
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

    <nav className="flex items-center justify-center gap-2" aria-label="Paginação">
      <button
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-brand-400 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:border-brand-400 dark:hover:text-brand-300"
        disabled={pagina === 1}
        onClick={() => onChange(pagina - 1)}
        aria-label="Página anterior"
      >
        <ChevronLeft size={16} />
      </button>
      {paginas.map((p, i) =>
        p === '...' ? (

          <span key={`e${i}`} className="inline-flex h-9 w-9 items-center justify-center rounded-full text-sm text-slate-500">
            …
          </span>
        ) : (
          <button
            key={p}

            className={`inline-flex h-9 w-9 items-center justify-center rounded-full border text-sm font-medium transition ${p === pagina ? 'border-brand-600 bg-brand-600 text-white shadow-sm' : 'border-slate-200 text-slate-700 hover:border-brand-400 hover:text-brand-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-brand-400 dark:hover:text-brand-300'}`}
            onClick={() => onChange(p)}
            aria-current={p === pagina ? 'page' : undefined}
          >
            {p}
          </button>
        ),
      )}
      <button

        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-brand-400 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:border-brand-400 dark:hover:text-brand-300"
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

    <div className="flex flex-wrap items-center gap-3" role="list">
      {etapas.map((e, i) => {
        const estado = i < atual ? 'ok' : i === atual ? 'ativo' : '';
        return (
          <div key={e} className="flex items-center gap-3" role="listitem">
            <div className={`flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium ${estado === 'ok' ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:border-emerald-400 dark:bg-emerald-950/40 dark:text-emerald-300' : estado === 'ativo' ? 'border-brand-500 bg-brand-50 text-brand-700 dark:border-brand-400 dark:bg-brand-950/40 dark:text-brand-300' : 'border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'}`}>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-current/10 text-xs font-semibold">{i < atual ? '✓' : i + 1}</span>
              <span>{e}</span>
            </div>
            {i < etapas.length - 1 && <span className="h-px w-6 bg-slate-200 dark:bg-slate-700" aria-hidden />}
          </div>
        );
      })}
    </div>
  );
}
