import { Modal, Button } from '@/components/ui';

interface Props {
  aberto: boolean;
  titulo: string;
  mensagem: string;
  confirmarLabel?: string;
  perigo?: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
  carregando?: boolean;
}

export function ConfirmDialog({
  aberto,
  titulo,
  mensagem,
  confirmarLabel = 'Confirmar',
  perigo,
  onConfirmar,
  onCancelar,
  carregando,
}: Props) {
  return (
    <Modal
      aberto={aberto}
      onFechar={onCancelar}
      titulo={titulo}
      footer={
        <>
          <Button variante="ghost" onClick={onCancelar}>Cancelar</Button>
          <Button variante={perigo ? 'danger' : 'primary'} carregando={carregando} onClick={onConfirmar}>{confirmarLabel}</Button>
        </>
      }
    >
      <p className="text-secondary">{mensagem}</p>
    </Modal>
  );
}
