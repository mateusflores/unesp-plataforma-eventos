import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { services } from '@/services';
import { useToast } from '@/contexts/ToastContext';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable } from '@/components/admin/DataTable';
import type { Coluna } from '@/components/admin/DataTable';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Avatar, Badge, Button, Switch } from '@/components/ui';
import type { Usuario, TipoUsuario } from '@/types';

const tomTipo: Record<TipoUsuario, 'perigo' | 'brand' | 'neutro'> = {
  ADMIN: 'perigo',
  ORGANIZADOR: 'brand',
  PARTICIPANTE: 'neutro',
};

export function AdminUsuariosPage() {
  const toast = useToast();
  const [usuarios, setUsuarios] = useState<Usuario[] | null>(null);
  const [remover, setRemover] = useState<Usuario | null>(null);
  const [processando, setProcessando] = useState(false);

  const carregar = () => services.admin.usuarios().then(setUsuarios);
  useEffect(() => { carregar(); }, []);

  const alternar = async (u: Usuario) => {
    await services.admin.alternarUsuarioAtivo(u.id);
    toast.sucesso(`Usuário ${u.ativo ? 'desativado' : 'ativado'}`);
    carregar();
  };

  const confirmarRemocao = async () => {
    if (!remover) return;
    setProcessando(true);
    await services.admin.removerUsuario(remover.id);
    toast.sucesso('Usuário removido');
    setRemover(null);
    setProcessando(false);
    carregar();
  };

  const colunas: Coluna<Usuario>[] = [
    {
      chave: 'nome',
      titulo: 'Usuário',
      ordenavel: true,
      valorOrdenacao: (u) => u.nome,
      render: (u) => (
        <div className="row gap-3">
          <Avatar nome={u.nome} cor={u.avatarCor} tamanho={34} />
          <div>
            <strong className="text-sm">{u.nome}</strong>
            <div className="text-xs text-muted">{u.email}</div>
          </div>
        </div>
      ),
    },
    { chave: 'tipo', titulo: 'Perfil', ordenavel: true, valorOrdenacao: (u) => u.tipo, render: (u) => <Badge tom={tomTipo[u.tipo]}>{u.tipo}</Badge> },
    { chave: 'curso', titulo: 'Curso', render: (u) => <span className="text-secondary">{u.curso ?? '—'}</span> },
    { chave: 'ativo', titulo: 'Ativo', render: (u) => <Switch checked={u.ativo} onChange={() => alternar(u)} /> },
    {
      chave: 'acoes',
      titulo: 'Ações',
      alinhar: 'right',
      render: (u) => <Button variante="ghost" tamanho="sm" apenasIcone iconeEsq={<Trash2 size={16} />} onClick={() => setRemover(u)} />,
    },
  ];

  return (
    <div>
      <PageHeader titulo="Usuários" subtitulo="Gerencie contas, perfis e status de acesso." />
      <DataTable
        itens={usuarios}
        colunas={colunas}
        keyOf={(u) => u.id}
        buscaEm={(u) => `${u.nome} ${u.email} ${u.curso ?? ''}`}
        placeholderBusca="Buscar por nome, e-mail ou curso…"
      />
      <ConfirmDialog
        aberto={!!remover}
        titulo="Remover usuário"
        mensagem={`Tem certeza que deseja remover ${remover?.nome}? Esta ação é simulada e não pode ser desfeita.`}
        confirmarLabel="Remover"
        perigo
        carregando={processando}
        onConfirmar={confirmarRemocao}
        onCancelar={() => setRemover(null)}
      />
    </div>
  );
}
