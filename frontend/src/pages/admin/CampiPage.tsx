import { useEffect, useState } from 'react';
import { Plus, Pencil } from 'lucide-react';
import { services } from '@/services';
import { useToast } from '@/contexts/ToastContext';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable } from '@/components/admin/DataTable';
import type { Coluna } from '@/components/admin/DataTable';
import { Badge, Button, Input, Select, Modal } from '@/components/ui';
import type { Campus, Universidade } from '@/types';

export function AdminCampiPage() {
  const toast = useToast();
  const [campi, setCampi] = useState<Campus[] | null>(null);
  const [universidades, setUniversidades] = useState<Universidade[]>([]);
  const [editar, setEditar] = useState<Partial<Campus> | null>(null);

  const carregar = () => services.catalog.campi().then(setCampi);
  useEffect(() => {
    carregar();
    services.catalog.universidades().then(setUniversidades);
  }, []);

  const sigla = (id: number) => universidades.find((u) => u.id === id)?.sigla ?? '—';

  const salvar = async () => {
    if (!editar?.nome) return toast.erro('Informe o nome do campus');
    await services.admin.salvarCampus(editar);
    toast.sucesso('Campus salvo');
    setEditar(null);
    carregar();
  };

  const colunas: Coluna<Campus>[] = [
    { chave: 'nome', titulo: 'Campus', ordenavel: true, valorOrdenacao: (c) => c.nome, render: (c) => <strong className="text-sm">{c.nome}</strong> },
    { chave: 'uni', titulo: 'Universidade', render: (c) => <Badge tom="brand">{sigla(c.universidadeId)}</Badge> },
    { chave: 'cidade', titulo: 'Cidade', ordenavel: true, valorOrdenacao: (c) => c.cidade, render: (c) => <span className="text-secondary">{c.cidade} / {c.estado}</span> },
    { chave: 'acoes', titulo: 'Ações', alinhar: 'right', render: (c) => <Button variante="ghost" tamanho="sm" apenasIcone iconeEsq={<Pencil size={16} />} onClick={() => setEditar(c)} /> },
  ];

  return (
    <div>
      <PageHeader titulo="Campi" subtitulo="Unidades físicas onde os eventos acontecem." />
      <DataTable
        itens={campi}
        colunas={colunas}
        keyOf={(c) => c.id}
        buscaEm={(c) => `${c.nome} ${c.cidade}`}
        placeholderBusca="Buscar campus ou cidade…"
        acoesHeader={<Button iconeEsq={<Plus size={16} />} onClick={() => setEditar({ universidadeId: universidades[0]?.id, estado: 'SP' })}>Novo campus</Button>}
      />
      <Modal
        aberto={!!editar}
        onFechar={() => setEditar(null)}
        titulo={editar?.id ? 'Editar campus' : 'Novo campus'}
        footer={<><Button variante="ghost" onClick={() => setEditar(null)}>Cancelar</Button><Button onClick={salvar}>Salvar</Button></>}
      >
        {editar && (
          <div className="col gap-4">
            <Select label="Universidade" value={editar.universidadeId} onChange={(e) => setEditar({ ...editar, universidadeId: Number(e.target.value) })}>
              {universidades.map((u) => <option key={u.id} value={u.id}>{u.sigla} — {u.nome}</option>)}
            </Select>
            <Input label="Nome do campus" value={editar.nome ?? ''} onChange={(e) => setEditar({ ...editar, nome: e.target.value })} />
            <div className="form-grid">
              <Input label="Cidade" value={editar.cidade ?? ''} onChange={(e) => setEditar({ ...editar, cidade: e.target.value })} />
              <Input label="Estado (UF)" value={editar.estado ?? ''} onChange={(e) => setEditar({ ...editar, estado: e.target.value.toUpperCase().slice(0, 2) })} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
