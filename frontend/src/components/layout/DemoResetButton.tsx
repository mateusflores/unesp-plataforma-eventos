import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { services } from '@/services';
import { useToast } from '@/contexts/ToastContext';

/** Restaura os dados mockados ao estado inicial (útil durante a demonstração). */
export function DemoResetButton() {
  const [carregando, setCarregando] = useState(false);
  const toast = useToast();

  const reiniciar = async () => {
    if (!confirm('Reiniciar os dados de demonstração? As alterações locais serão descartadas.')) return;
    setCarregando(true);
    await services.demo.reset();
    toast.sucesso('Dados reiniciados', 'A página será recarregada.');
    setTimeout(() => location.reload(), 700);
  };

  return (
<<<<<<< HEAD
    <button className="footer__reset" onClick={reiniciar} disabled={carregando}>
=======
    <button className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800" onClick={reiniciar} disabled={carregando}>
>>>>>>> 604fa8e (Migração para Tailwind e ajustes de build)
      <RotateCcw size={13} /> {carregando ? 'Reiniciando…' : 'Reiniciar dados da demo'}
    </button>
  );
}
