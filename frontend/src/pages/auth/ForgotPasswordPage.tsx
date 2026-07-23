import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle2 } from 'lucide-react';
import { AuthShell } from './AuthShell';
import { Button, Input } from '@/components/ui';
import { services, ApiError } from '@/services';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [enviado, setEnviado] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setCarregando(true);
    try {
      await services.auth.recuperarSenha(email);
      setEnviado(true);
    } catch (err) {
      setErro(err instanceof ApiError ? err.message : 'Erro ao enviar.');
    } finally {
      setCarregando(false);
    }
  };

  if (enviado) {
    return (
      <AuthShell titulo="Verifique seu e-mail" subtitulo="Enviamos instruções de recuperação (simulado).">
        <div className="card card--pad center" style={{ flexDirection: 'column', gap: 'var(--sp-3)', marginTop: 'var(--sp-6)', textAlign: 'center' }}>
          <div className="state-panel__icon" style={{ color: 'var(--success-500)', background: 'var(--tom-sucesso-bg)' }}>
            <CheckCircle2 size={28} />
          </div>
          <p className="text-secondary">
            Se <strong>{email}</strong> estiver cadastrado, você receberá um link para redefinir a senha.
          </p>
          <Link to="/login"><Button variante="secondary">Voltar ao login</Button></Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell titulo="Recuperar senha" subtitulo="Informe seu e-mail e enviaremos um link de recuperação.">
      <form className="auth__form" onSubmit={enviar}>
        <Input label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} erro={erro ?? undefined} icone={<Mail size={17} />} obrigatorio />
        <Button type="submit" bloco tamanho="lg" carregando={carregando}>Enviar link</Button>
      </form>
      <p className="auth__foot">
        Lembrou a senha? <Link to="/login">Entrar</Link>
      </p>
    </AuthShell>
  );
}
