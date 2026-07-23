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
  const classes = [
    'btn',
    `btn--${variante}`,
    tamanho !== 'md' && `btn--${tamanho}`,
    bloco && 'btn--block',
    apenasIcone && 'btn--icon',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} disabled={disabled || carregando} {...rest}>
      {carregando ? (
        <span className="spinner" style={{ width: 16, height: 16 }} aria-hidden />
      ) : (
        iconeEsq
      )}
      {!apenasIcone && children}
      {iconeDir}
    </button>
  );
}
