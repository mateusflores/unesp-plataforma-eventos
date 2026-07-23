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
    <button className="footer__reset" onClick={reiniciar} disabled={carregando}>
      <RotateCcw size={13} /> {carregando ? 'Reiniciando…' : 'Reiniciar dados da demo'}
    </button>
  );
}
