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
  return (
    <span className={`badge badge--${tom} ${className}`}>
      {ponto && <span className="badge__dot" aria-hidden />}
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
      className={`chip ${ativo ? 'chip--ativo' : ''}`}
      onClick={onClick}
      aria-pressed={ativo}
    >
      {cor && <span className="chip__cor" style={{ background: cor }} aria-hidden />}
      {children}
      {onRemover && (
        <span
          className="chip__remover"
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
