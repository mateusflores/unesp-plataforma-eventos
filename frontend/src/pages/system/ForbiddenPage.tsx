import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';

export function ForbiddenPage() {
  const { papel } = useAuth();
  return (
    <div className="container section center" style={{ flexDirection: 'column', textAlign: 'center', gap: 'var(--sp-4)' }}>
      <div className="state-panel__icon" style={{ width: 72, height: 72 }}>
        <ShieldAlert size={32} />
      </div>
      <div className="erro-num" style={{ fontSize: 'var(--fs-2xl)' }}>Acesso restrito</div>
      <h1>Você não tem permissão para acessar esta área</h1>
      <p className="text-secondary" style={{ maxWidth: 460 }}>
        Seu perfil atual é <strong>{papel ?? 'visitante'}</strong>. Esta seção é reservada a outro tipo de usuário.
        Troque de conta na tela de login para acessar as áreas de organizador ou administrador.
      </p>
      <div className="row gap-3 mt-2">
        <Link to="/"><Button variante="secondary">Início</Button></Link>
        <Link to="/login"><Button>Trocar de conta</Button></Link>
      </div>
    </div>
  );
}
