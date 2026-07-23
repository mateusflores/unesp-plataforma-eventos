import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { Button } from '@/components/ui';

export function NotFoundPage() {
  return (
    <div className="container section center" style={{ flexDirection: 'column', textAlign: 'center', gap: 'var(--sp-4)' }}>
      <div className="erro-num">404</div>
      <h1>Esta página saiu de cartaz</h1>
      <p className="text-secondary" style={{ maxWidth: 420 }}>
        O endereço que você procurou não existe ou o evento pode ter sido movido. Que tal explorar o que está rolando agora?
      </p>
      <div className="row gap-3 mt-2">
        <Link to="/"><Button variante="secondary">Voltar ao início</Button></Link>
        <Link to="/explorar"><Button iconeEsq={<Compass size={16} />}>Explorar eventos</Button></Link>
      </div>
    </div>
  );
}
