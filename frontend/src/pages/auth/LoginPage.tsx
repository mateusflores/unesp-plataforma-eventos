import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { AuthShell } from './AuthShell';
import { Avatar, Button, Input } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { contasDemo, usuarios } from '@/data/usuarios';
import { ApiError } from '@/services';

export function LoginPage() {
  const { login, loginDemo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const destino = (location.state as { de?: string } | null)?.de ?? '/';

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const entrar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    if (!email || !senha) {
      setErro('Preencha e-mail e senha.');
      return;
    }
    setCarregando(true);
    try {
      const u = await login(email, senha);
      toast.sucesso(`Bem-vindo(a), ${u.nome.split(' ')[0]}!`);
      navigate(destino, { replace: true });
    } catch (err) {
      setErro(err instanceof ApiError ? err.message : 'Não foi possível entrar.');
    } finally {
      setCarregando(false);
    }
  };

  const entrarDemo = async (usuarioId: number) => {
    setCarregando(true);
    try {
      const u = await loginDemo(usuarioId);
      toast.sucesso(`Entrando como ${u.nome.split(' ')[0]} (${u.tipo.toLowerCase()})`);
      navigate(destino, { replace: true });
    } finally {
      setCarregando(false);
    }
  };

  return (
    <AuthShell titulo="Entrar" subtitulo="Acesse sua conta para descobrir e participar de eventos.">
      <form className="auth__form" onSubmit={entrar}>
        <Input
          label="E-mail"
          type="email"
          placeholder="voce@aluno.universidade.br"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icone={<Mail size={17} />}
          autoComplete="email"
        />
        <Input
          label="Senha"
          type="password"
          placeholder="••••••••"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          icone={<Lock size={17} />}
          erro={erro ?? undefined}
          autoComplete="current-password"
        />
        <div className="row-between text-sm">
          <span />
          <Link to="/recuperar-senha" className="auth__foot" style={{ margin: 0 }}>
            Esqueci minha senha
          </Link>
        </div>
        <Button type="submit" bloco tamanho="lg" carregando={carregando} iconeDir={<ArrowRight size={18} />}>
          Entrar
        </Button>
      </form>

      <div className="auth__sep">ou entre como demonstração</div>

      <div className="auth__demos">
        {contasDemo.map((c) => {
          const u = usuarios.find((x) => x.id === c.usuarioId)!;
          return (
            <button key={c.usuarioId} className="demo-conta" onClick={() => entrarDemo(c.usuarioId)} disabled={carregando}>
              <Avatar nome={u.nome} cor={u.avatarCor} tamanho={40} />
              <div className="demo-conta__body">
                <strong>{u.nome}</strong>
                <span>{c.descricao}</span>
              </div>
              <span className="demo-conta__badge">{c.rotulo}</span>
            </button>
          );
        })}
      </div>

      <p className="auth__foot">
        Não tem conta? <Link to="/cadastro">Criar conta grátis</Link>
      </p>
    </AuthShell>
  );
}
