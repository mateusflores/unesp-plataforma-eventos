import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import './toast.css';

type ToastTipo = 'sucesso' | 'erro' | 'aviso' | 'info';
interface Toast {
  id: number;
  tipo: ToastTipo;
  titulo: string;
  descricao?: string;
}

interface ToastContextValue {
  toast: (tipo: ToastTipo, titulo: string, descricao?: string) => void;
  sucesso: (titulo: string, descricao?: string) => void;
  erro: (titulo: string, descricao?: string) => void;
  aviso: (titulo: string, descricao?: string) => void;
  info: (titulo: string, descricao?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const icones = {
  sucesso: CheckCircle2,
  erro: XCircle,
  aviso: AlertTriangle,
  info: Info,
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remover = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (tipo: ToastTipo, titulo: string, descricao?: string) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, tipo, titulo, descricao }]);
      setTimeout(() => remover(id), 4200);
    },
    [remover],
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      toast,
      sucesso: (t, d) => toast('sucesso', t, d),
      erro: (t, d) => toast('erro', t, d),
      aviso: (t, d) => toast('aviso', t, d),
      info: (t, d) => toast('info', t, d),
    }),
    [toast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-viewport" role="region" aria-label="Notificações" aria-live="polite">
        {toasts.map((t) => {
          const Icone = icones[t.tipo];
          return (
            <div key={t.id} className={`toast toast--${t.tipo}`} role="status">
              <Icone size={20} className="toast__icon" aria-hidden />
              <div className="toast__body">
                <strong>{t.titulo}</strong>
                {t.descricao && <span>{t.descricao}</span>}
              </div>
              <button className="toast__close" onClick={() => remover(t.id)} aria-label="Fechar notificação">
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast deve ser usado dentro de <ToastProvider>.');
  return ctx;
}
