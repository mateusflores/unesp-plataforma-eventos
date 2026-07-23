import { iniciais } from '@/utils/format';

interface AvatarProps {
  nome: string;
  cor?: string;
  tamanho?: number;
}

export function Avatar({ nome, cor = 'var(--brand-600)', tamanho = 40 }: AvatarProps) {
  return (
    <span
      className="avatar"
      style={{ background: cor, width: tamanho, height: tamanho, fontSize: tamanho * 0.4 }}
      aria-hidden
      title={nome}
    >
      {iniciais(nome)}
    </span>
  );
}
