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
<<<<<<< HEAD
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
=======
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={onFechar} />
      <aside
        className={`fixed top-0 flex h-full w-full max-w-md flex-col border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950 ${lado === 'right' ? 'right-0 border-l' : 'left-0 border-r'}`}
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{titulo}</h2>
          <button
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            onClick={onFechar}
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
        {footer && <div className="border-t border-slate-200 px-6 py-4 dark:border-slate-800">{footer}</div>}
      </aside>
    </div>,
>>>>>>> 604fa8e (Migração para Tailwind e ajustes de build)
    document.body,
  );
}
