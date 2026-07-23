import { useState } from 'react';
import { Save, Ticket, CalendarCheck, ShoppingBag } from 'lucide-react';
import { services } from '@/services';
import { useAsync } from '@/hooks/useAsync';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { useCatalog } from '@/contexts/CatalogContext';
import { PageHeader } from '@/components/layout/PageHeader';
import { Avatar, Badge, Button, Input, Select, Switch } from '@/components/ui';
import { moeda } from '@/utils/format';

export function PerfilPage() {
  const { usuario, atualizarUsuario } = useAuth();
  const toast = useToast();
  const { universidades, campi } = useCatalog();
  const [form, setForm] = useState({
    nome: usuario?.nome ?? '',
    email: usuario?.email ?? '',
    telefone: usuario?.telefone ?? '',
    curso: usuario?.curso ?? '',
    universidadeId: usuario?.universidadeId ?? '',
    campusId: usuario?.campusId ?? '',
  });
  const [notificacoes, setNotificacoes] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const stats = useAsync(async () => {
    if (!usuario) return { inscricoes: 0, compras: 0, ingressos: 0, gasto: 0 };
    const [ins, com, tic] = await Promise.all([
      services.registrations.doUsuario(usuario.id),
      services.purchases.doUsuario(usuario.id),
      services.tickets.doUsuario(usuario.id),
    ]);
    return {
      inscricoes: ins.filter((i) => i.status !== 'CANCELADA').length,
      compras: com.length,
      ingressos: tic.filter((t) => t.status !== 'CANCELADO').length,
      gasto: com.filter((c) => c.status === 'PAGO').reduce((s, c) => s + c.valorTotal, 0),
    };
  }, [usuario?.id]);

  if (!usuario) return null;
  const campiFiltrados = form.universidadeId ? campi.filter((c) => c.universidadeId === Number(form.universidadeId)) : campi;

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    // Atualização apenas local (simulada) no contexto de auth.
    setTimeout(() => {
      atualizarUsuario({
        nome: form.nome,
        telefone: form.telefone,
        curso: form.curso,
        universidadeId: form.universidadeId ? Number(form.universidadeId) : undefined,
        campusId: form.campusId ? Number(form.campusId) : undefined,
      });
      setSalvando(false);
      toast.sucesso('Perfil atualizado');
    }, 500);
  };

  return (
    <div className="container section-sm">
      <PageHeader titulo="Meu perfil" subtitulo="Seus dados pessoais, vínculo acadêmico e histórico." />

      <div className="checkout-grid">
        <form className="painel" onSubmit={salvar}>
          <div className="row gap-4 mb-6">
            <Avatar nome={usuario.nome} cor={usuario.avatarCor} tamanho={64} />
            <div>
              <strong style={{ fontSize: 'var(--fs-lg)' }}>{usuario.nome}</strong>
              <div className="row gap-2 mt-1"><Badge tom="brand">{usuario.tipo}</Badge><span className="text-sm text-muted">{usuario.email}</span></div>
            </div>
          </div>

          <div className="form-grid">
            <Input className="col-span" label="Nome completo" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
            <Input label="E-mail" value={form.email} disabled hint="O e-mail não pode ser alterado nesta demo." />
            <Input label="Telefone" value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} />
            <Input label="Curso" value={form.curso} onChange={(e) => setForm({ ...form, curso: e.target.value })} />
            <Select label="Universidade" value={form.universidadeId} onChange={(e) => setForm({ ...form, universidadeId: e.target.value, campusId: '' })}>
              <option value="">Selecione</option>
              {universidades.map((u) => <option key={u.id} value={u.id}>{u.sigla}</option>)}
            </Select>
            <Select label="Campus" value={form.campusId} onChange={(e) => setForm({ ...form, campusId: e.target.value })}>
              <option value="">Selecione</option>
              {campiFiltrados.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </Select>
          </div>

          <div className="mt-6" style={{ paddingTop: 'var(--sp-4)', borderTop: '1px solid var(--border)' }}>
            <strong className="text-sm">Configurações</strong>
            <div className="mt-4"><Switch checked={notificacoes} onChange={setNotificacoes} label="Receber avisos de eventos por e-mail (simulado)" /></div>
          </div>

          <div className="mt-6"><Button type="submit" carregando={salvando} iconeEsq={<Save size={16} />}>Salvar alterações</Button></div>
        </form>

        <div className="col gap-4">
          <div className="painel">
            <strong className="text-sm">Resumo de atividade</strong>
            <div className="col gap-3 mt-4">
              <ResumoLinha icone={<CalendarCheck size={18} />} rotulo="Inscrições ativas" valor={stats.data?.inscricoes ?? 0} />
              <ResumoLinha icone={<ShoppingBag size={18} />} rotulo="Compras realizadas" valor={stats.data?.compras ?? 0} />
              <ResumoLinha icone={<Ticket size={18} />} rotulo="Ingressos válidos" valor={stats.data?.ingressos ?? 0} />
              <div className="def-list__row"><span>Total investido</span><span>{moeda(stats.data?.gasto ?? 0)}</span></div>
            </div>
          </div>
          <div className="painel">
            <strong className="text-sm">Vínculos</strong>
            <p className="text-sm text-secondary mt-2">
              {usuario.entidadesIds && usuario.entidadesIds.length > 0
                ? `Você é membro de ${usuario.entidadesIds.length} entidade(s) estudantil(is).`
                : 'Você ainda não faz parte de nenhuma entidade estudantil.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResumoLinha({ icone, rotulo, valor }: { icone: React.ReactNode; rotulo: string; valor: number }) {
  return (
    <div className="row-between">
      <span className="row gap-2 text-sm text-secondary">{icone} {rotulo}</span>
      <strong>{valor}</strong>
    </div>
  );
}
