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
<<<<<<< HEAD
    <div className="segmented" role="tablist" aria-label={ariaLabel}>
=======
    <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-800 dark:bg-slate-900" role="tablist" aria-label={ariaLabel}>
>>>>>>> 604fa8e (Migração para Tailwind e ajustes de build)
      {opcoes.map((o) => (
        <button
          key={o.valor}
          role="tab"
          aria-selected={valor === o.valor}
<<<<<<< HEAD
          className={`segmented__item ${valor === o.valor ? 'segmented__item--ativo' : ''}`}
=======
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${valor === o.valor ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}
>>>>>>> 604fa8e (Migração para Tailwind e ajustes de build)
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
<<<<<<< HEAD
    <div className="tabs" role="tablist">
=======
    <div className="flex flex-wrap items-center gap-2" role="tablist">
>>>>>>> 604fa8e (Migração para Tailwind e ajustes de build)
      {opcoes.map((o) => (
        <button
          key={o.valor}
          role="tab"
          aria-selected={valor === o.valor}
<<<<<<< HEAD
          className={`tab ${valor === o.valor ? 'tab--ativo' : ''}`}
=======
          className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition ${valor === o.valor ? 'bg-brand-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'}`}
>>>>>>> 604fa8e (Migração para Tailwind e ajustes de build)
          onClick={() => onChange(o.valor)}
        >
          {o.rotulo}
          {typeof o.contagem === 'number' && (
<<<<<<< HEAD
            <span className="text-muted" style={{ marginLeft: 6, fontWeight: 500 }}>
              {o.contagem}
            </span>
=======
            <span className="ml-2 text-xs font-semibold opacity-80">{o.contagem}</span>
>>>>>>> 604fa8e (Migração para Tailwind e ajustes de build)
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
<<<<<<< HEAD
    <nav className="pagination" aria-label="Paginação">
      <button
        className="pagination__btn"
=======
    <nav className="flex items-center justify-center gap-2" aria-label="Paginação">
      <button
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-brand-400 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:border-brand-400 dark:hover:text-brand-300"
>>>>>>> 604fa8e (Migração para Tailwind e ajustes de build)
        disabled={pagina === 1}
        onClick={() => onChange(pagina - 1)}
        aria-label="Página anterior"
      >
        <ChevronLeft size={16} />
      </button>
      {paginas.map((p, i) =>
        p === '...' ? (
<<<<<<< HEAD
          <span key={`e${i}`} className="pagination__btn" style={{ cursor: 'default' }}>
=======
          <span key={`e${i}`} className="inline-flex h-9 w-9 items-center justify-center rounded-full text-sm text-slate-500">
>>>>>>> 604fa8e (Migração para Tailwind e ajustes de build)
            …
          </span>
        ) : (
          <button
            key={p}
<<<<<<< HEAD
            className={`pagination__btn ${p === pagina ? 'pagination__btn--ativo' : ''}`}
=======
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full border text-sm font-medium transition ${p === pagina ? 'border-brand-600 bg-brand-600 text-white shadow-sm' : 'border-slate-200 text-slate-700 hover:border-brand-400 hover:text-brand-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-brand-400 dark:hover:text-brand-300'}`}
>>>>>>> 604fa8e (Migração para Tailwind e ajustes de build)
            onClick={() => onChange(p)}
            aria-current={p === pagina ? 'page' : undefined}
          >
            {p}
          </button>
        ),
      )}
      <button
<<<<<<< HEAD
        className="pagination__btn"
=======
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-brand-400 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:border-brand-400 dark:hover:text-brand-300"
>>>>>>> 604fa8e (Migração para Tailwind e ajustes de build)
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
<<<<<<< HEAD
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
=======
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
>>>>>>> 604fa8e (Migração para Tailwind e ajustes de build)
          </div>
        );
      })}
    </div>
  );
}
