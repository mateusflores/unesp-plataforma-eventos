import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface DrawerProps {
  aberto: boolean;
  onFechar: () => void;
  titulo?: string;
  lado?: 'left' | 'right';
  children: ReactNode;
  footer?: ReactNode;
}

export function Drawer({ aberto, onFechar, titulo, lado = 'right', children, footer }: DrawerProps) {
  useEffect(() => {
    if (!aberto) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onFechar();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [aberto, onFechar]);

  if (!aberto) return null;

  return createPortal(
    <>
      <div className="drawer-overlay" onClick={onFechar} />
      <aside className={`drawer drawer--${lado}`} role="dialog" aria-modal="true" aria-label={titulo}>
        <div className="drawer__header">
          <h2 style={{ fontSize: 'var(--fs-lg)' }}>{titulo}</h2>
          <button className="modal__close" onClick={onFechar} aria-label="Fechar">
            <X size={20} />
          </button>
        </div>
        <div className="drawer__body">{children}</div>
        {footer && <div className="drawer__footer">{footer}</div>}
      </aside>
    </>,
    document.body,
  );
}
