import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
  aberto: boolean;
  onFechar: () => void;
  titulo?: string;
  children: ReactNode;
  footer?: ReactNode;
  largo?: boolean;
}

export function Modal({ aberto, onFechar, titulo, children, footer, largo }: ModalProps) {
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
    <div className="overlay" onClick={onFechar}>
      <div
        className={`modal ${largo ? 'modal--lg' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        onClick={(e) => e.stopPropagation()}
      >
        {titulo && (
          <div className="modal__header">
            <h2 className="modal__title">{titulo}</h2>
            <button className="modal__close" onClick={onFechar} aria-label="Fechar">
              <X size={20} />
            </button>
          </div>
        )}
        <div className="modal__body">{children}</div>
        {footer && <div className="modal__footer">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
