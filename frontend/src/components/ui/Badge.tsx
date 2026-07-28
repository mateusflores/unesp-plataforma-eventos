import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import type { Tom } from '@/utils/dominio';

interface BadgeProps {
  tom?: Tom;
  ponto?: boolean;
  children: ReactNode;
  className?: string;
}

export function Badge({ tom = 'neutro', ponto, children, className = '' }: BadgeProps) {
<<<<<<< HEAD
  return (
    <span className={`badge badge--${tom} ${className}`}>
      {ponto && <span className="badge__dot" aria-hidden />}
=======
  const variants: Record<NonNullable<BadgeProps['tom']>, string> = {
    neutro: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    brand: 'bg-brand-100 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300',
    accent: 'bg-accent-100 text-accent-700 dark:bg-accent-950/40 dark:text-accent-300',
    sucesso: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
    perigo: 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300',
    aviso: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
    info: 'bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300',
  };

  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${variants[tom]} ${className}`}>
      {ponto && <span className="h-2 w-2 rounded-full bg-current" aria-hidden />}
>>>>>>> 604fa8e (Migração para Tailwind e ajustes de build)
      {children}
    </span>
  );
}

interface ChipProps {
  ativo?: boolean;
  cor?: string;
  onClick?: () => void;
  onRemover?: () => void;
  children: ReactNode;
}

export function Chip({ ativo, cor, onClick, onRemover, children }: ChipProps) {
  return (
    <button
      type="button"
<<<<<<< HEAD
      className={`chip ${ativo ? 'chip--ativo' : ''}`}
      onClick={onClick}
      aria-pressed={ativo}
    >
      {cor && <span className="chip__cor" style={{ background: cor }} aria-hidden />}
      {children}
      {onRemover && (
        <span
          className="chip__remover"
=======
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition ${ativo ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-sm dark:border-brand-400 dark:bg-brand-950/50 dark:text-brand-300' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'}`}
      onClick={onClick}
      aria-pressed={ativo}
    >
      {cor && <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: cor }} aria-hidden />}
      {children}
      {onRemover && (
        <span
          className="ml-1 inline-flex items-center rounded-full p-0.5 text-current transition hover:bg-black/5 dark:hover:bg-white/10"
>>>>>>> 604fa8e (Migração para Tailwind e ajustes de build)
          role="button"
          aria-label="Remover filtro"
          onClick={(e) => {
            e.stopPropagation();
            onRemover();
          }}
        >
          <X size={13} />
        </span>
      )}
    </button>
  );
}
