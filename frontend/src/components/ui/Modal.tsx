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
<<<<<<< HEAD
    <div className="overlay" onClick={onFechar}>
      <div
        className={`modal ${largo ? 'modal--lg' : ''}`}
=======
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4" onClick={onFechar}>
      <div
        className={`w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 ${largo ? 'max-w-3xl' : ''}`}
>>>>>>> 604fa8e (Migração para Tailwind e ajustes de build)
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        onClick={(e) => e.stopPropagation()}
      >
        {titulo && (
<<<<<<< HEAD
          <div className="modal__header">
            <h2 className="modal__title">{titulo}</h2>
            <button className="modal__close" onClick={onFechar} aria-label="Fechar">
=======
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{titulo}</h2>
            <button className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200" onClick={onFechar} aria-label="Fechar">
>>>>>>> 604fa8e (Migração para Tailwind e ajustes de build)
              <X size={20} />
            </button>
          </div>
        )}
<<<<<<< HEAD
        <div className="modal__body">{children}</div>
        {footer && <div className="modal__footer">{footer}</div>}
=======
        <div className="px-6 py-5">{children}</div>
        {footer && <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 bg-slate-50/70 px-6 py-4 dark:border-slate-800 dark:bg-slate-950/60">{footer}</div>}
>>>>>>> 604fa8e (Migração para Tailwind e ajustes de build)
      </div>
    </div>,
    document.body,
  );
}
