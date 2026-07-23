import { useEffect, useState } from 'react';
import { Plus, Pencil } from 'lucide-react';
import { services } from '@/services';
import { useToast } from '@/contexts/ToastContext';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable } from '@/components/admin/DataTable';
import type { Coluna } from '@/components/admin/DataTable';
import { Badge, Button, Input, Modal } from '@/components/ui';
import type { Universidade, Campus } from '@/types';

export function AdminUniversidadesPage() {
  const toast = useToast();
  const [universidades, setUniversidades] = useState<Universidade[] | null>(null);
  const [campi, setCampi] = useState<Campus[]>([]);
  const [editar, setEditar] = useState<Partial<Universidade> | null>(null);

  const carregar = () => {
    services.catalog.universidades().then(setUniversidades);
    services.catalog.campi().then(setCampi);
  };
  useEffect(() => { carregar(); }, []);

  const salvar = async () => {
    if (!editar?.nome || !editar.sigla) return toast.erro('Preencha nome e sigla');
    await services.admin.salvarUniversidade(editar);
    toast.sucesso('Universidade salva');
    setEditar(null);
    carregar();
  };

  const colunas: Coluna<Universidade>[] = [
    {
      chave: 'nome', titulo: 'Universidade', ordenavel: true, valorOrdenacao: (u) => u.nome,
      render: (u) => (
        <div className="row gap-3">
          <span style={{ width: 12, height: 12, borderRadius: 4, background: u.logoCor }} />
          <strong className="text-sm">{u.nome}</strong>
        </div>
      ),
    },
    { chave: 'sigla', titulo: 'Sigla', render: (u) => <Badge tom="brand">{u.sigla}</Badge> },
    { chave: 'campi', titulo: 'Campi', ordenavel: true, valorOrdenacao: (u) => campi.filter((c) => c.universidadeId === u.id).length, render: (u) => <strong>{campi.filter((c) => c.universidadeId === u.id).length}</strong> },
    { chave: 'acoes', titulo: 'Ações', alinhar: 'right', render: (u) => <Button variante="ghost" tamanho="sm" apenasIcone iconeEsq={<Pencil size={16} />} onClick={() => setEditar(u)} /> },
  ];

  return (
    <div>
      <PageHeader titulo="Universidades" subtitulo="Instituições atendidas pela plataforma." />
      <DataTable
        itens={universidades}
        colunas={colunas}
        keyOf={(u) => u.id}
        buscaEm={(u) => `${u.nome} ${u.sigla}`}
        placeholderBusca="Buscar universidade…"
        acoesHeader={<Button iconeEsq={<Plus size={16} />} onClick={() => setEditar({ logoCor: '#5b4be6' })}>Nova universidade</Button>}
      />
      <Modal
        aberto={!!editar}
        onFechar={() => setEditar(null)}
        titulo={editar?.id ? 'Editar universidade' : 'Nova universidade'}
        footer={<><Button variante="ghost" onClick={() => setEditar(null)}>Cancelar</Button><Button onClick={salvar}>Salvar</Button></>}
      >
        {editar && (
          <div className="col gap-4">
            <Input label="Nome" value={editar.nome ?? ''} onChange={(e) => setEditar({ ...editar, nome: e.target.value })} />
            <div className="form-grid">
              <Input label="Sigla" value={editar.sigla ?? ''} onChange={(e) => setEditar({ ...editar, sigla: e.target.value.toUpperCase() })} />
              <Input type="color" label="Cor" value={editar.logoCor ?? '#5b4be6'} onChange={(e) => setEditar({ ...editar, logoCor: e.target.value })} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
