import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variante = 'primary' | 'accent' | 'secondary' | 'ghost' | 'danger' | 'outline-danger';
type Tamanho = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante;
  tamanho?: Tamanho;
  bloco?: boolean;
  carregando?: boolean;
  iconeEsq?: ReactNode;
  iconeDir?: ReactNode;
  apenasIcone?: boolean;
}

export function Button({
  variante = 'primary',
  tamanho = 'md',
  bloco,
  carregando,
  iconeEsq,
  iconeDir,
  apenasIcone,
  children,
  className = '',
  disabled,
  ...rest
}: ButtonProps) {

  const base = 'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60';
  const sizes = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-10 px-5 text-sm',
    lg: 'h-12 px-6 text-base',
  };
  const variants = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-400',
    accent: 'bg-accent-500 text-white hover:bg-accent-600',
    secondary: 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    'outline-danger': 'border border-red-300 bg-white text-red-700 hover:bg-red-50 dark:border-red-700 dark:bg-transparent dark:text-red-300',
  } as const;

  return (
    <button className={[base, sizes[tamanho], variants[variante], bloco ? 'w-full' : '', apenasIcone ? 'aspect-square p-0' : '', className].filter(Boolean).join(' ')} disabled={disabled || carregando} {...rest}>
      {carregando ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent" aria-hidden /> : iconeEsq}
      {!apenasIcone && children}
      {iconeDir}
    </button>
  );
}
