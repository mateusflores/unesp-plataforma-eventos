import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone } from 'lucide-react';
import { AuthShell } from './AuthShell';
import { Button, Input } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { ApiError } from '@/services';

export function RegisterPage() {
  const { registrar } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState({ nome: '', email: '', telefone: '', senha: '', confirmar: '' });
  const [erros, setErros] = useState<Record<string, string>>({});
  const [carregando, setCarregando] = useState(false);

  const set = (campo: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [campo]: e.target.value }));

  const validar = () => {
    const e: Record<string, string> = {};
    if (form.nome.trim().length < 3) e.nome = 'Informe seu nome completo.';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email = 'E-mail inválido.';
    if (form.senha.length < 6) e.senha = 'A senha deve ter ao menos 6 caracteres.';
    if (form.senha !== form.confirmar) e.confirmar = 'As senhas não coincidem.';
    setErros(e);
    return Object.keys(e).length === 0;
  };

  const enviar = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validar()) return;
    setCarregando(true);
    try {
      await registrar({ nome: form.nome, email: form.email, senha: form.senha, telefone: form.telefone });
      toast.sucesso('Conta criada!', 'Você já está autenticado.');
      navigate('/', { replace: true });
    } catch (err) {
      setErros({ email: err instanceof ApiError ? err.message : 'Erro ao criar conta.' });
    } finally {
      setCarregando(false);
    }
  };

  return (
    <AuthShell titulo="Criar conta" subtitulo="Leva menos de um minuto. É grátis e simulado.">
      <form className="auth__form" onSubmit={enviar}>
        <Input label="Nome completo" value={form.nome} onChange={set('nome')} erro={erros.nome} icone={<User size={17} />} obrigatorio />
        <Input label="E-mail" type="email" value={form.email} onChange={set('email')} erro={erros.email} icone={<Mail size={17} />} obrigatorio />
        <Input label="Telefone" value={form.telefone} onChange={set('telefone')} placeholder="(14) 99999-9999" icone={<Phone size={17} />} />
        <Input label="Senha" type="password" value={form.senha} onChange={set('senha')} erro={erros.senha} icone={<Lock size={17} />} obrigatorio />
        <Input label="Confirmar senha" type="password" value={form.confirmar} onChange={set('confirmar')} erro={erros.confirmar} icone={<Lock size={17} />} obrigatorio />
        <Button type="submit" bloco tamanho="lg" carregando={carregando}>
          Criar conta
        </Button>
      </form>
      <p className="auth__foot">
        Já tem conta? <Link to="/login">Entrar</Link>
      </p>
    </AuthShell>
  );
}
