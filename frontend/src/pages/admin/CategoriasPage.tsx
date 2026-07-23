import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { services } from '@/services';
import { useToast } from '@/contexts/ToastContext';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable } from '@/components/admin/DataTable';
import type { Coluna } from '@/components/admin/DataTable';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Button, Input, Select, Modal } from '@/components/ui';
import { CategoryIcon } from '@/components/CategoryIcon';
import type { Categoria } from '@/types';

const CORES = [
  ['Acadêmico', 'var(--cat-academico)'],
  ['Festa', 'var(--cat-festa)'],
  ['Workshop', 'var(--cat-workshop)'],
  ['Palestra', 'var(--cat-palestra)'],
  ['Esporte', 'var(--cat-esporte)'],
  ['Cultural', 'var(--cat-cultural)'],
  ['Carreira', 'var(--cat-carreira)'],
  ['Competição', 'var(--cat-competicao)'],
  ['Feira', 'var(--cat-feira)'],
];
const ICONES = ['GraduationCap', 'PartyPopper', 'Wrench', 'Mic', 'Trophy', 'Palette', 'Briefcase', 'Swords', 'Store'];

export function AdminCategoriasPage() {
  const toast = useToast();
  const [categorias, setCategorias] = useState<Categoria[] | null>(null);
  const [editar, setEditar] = useState<Partial<Categoria> | null>(null);
  const [remover, setRemover] = useState<Categoria | null>(null);

  const carregar = () => services.catalog.categorias().then(setCategorias);
  useEffect(() => { carregar(); }, []);

  const salvar = async () => {
    if (!editar?.nome) return toast.erro('Informe o nome');
    await services.admin.salvarCategoria(editar);
    toast.sucesso('Categoria salva');
    setEditar(null);
    carregar();
  };

  const confirmarRemocao = async () => {
    if (!remover) return;
    await services.admin.removerCategoria(remover.id);
    toast.sucesso('Categoria removida');
    setRemover(null);
    carregar();
  };

  const colunas: Coluna<Categoria>[] = [
    {
      chave: 'nome', titulo: 'Categoria', ordenavel: true, valorOrdenacao: (c) => c.nome,
      render: (c) => (
        <div className="row gap-3">
          <span className="cat-tile__icon" style={{ ['--cat' as string]: c.cor, width: 34, height: 34 }}><CategoryIcon nome={c.icone} size={17} /></span>
          <strong className="text-sm">{c.nome}</strong>
        </div>
      ),
    },
    { chave: 'slug', titulo: 'Slug', render: (c) => <span className="text-secondary" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xs)' }}>{c.slug}</span> },
    { chave: 'cor', titulo: 'Cor', render: (c) => <span className="row gap-2"><span style={{ width: 16, height: 16, borderRadius: 5, background: c.cor }} /> <span className="text-xs text-muted">{c.cor.replace('var(--', '').replace(')', '')}</span></span> },
    {
      chave: 'acoes', titulo: 'Ações', alinhar: 'right',
      render: (c) => (
        <div className="row gap-1" style={{ justifyContent: 'flex-end' }}>
          <Button variante="ghost" tamanho="sm" apenasIcone iconeEsq={<Pencil size={16} />} onClick={() => setEditar(c)} />
          <Button variante="ghost" tamanho="sm" apenasIcone iconeEsq={<Trash2 size={16} />} onClick={() => setRemover(c)} />
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader titulo="Categorias" subtitulo="Organize os tipos de evento e suas cores no calendário." />
      <DataTable
        itens={categorias}
        colunas={colunas}
        keyOf={(c) => c.id}
        buscaEm={(c) => c.nome}
        placeholderBusca="Buscar categoria…"
        acoesHeader={<Button iconeEsq={<Plus size={16} />} onClick={() => setEditar({ cor: CORES[0][1], icone: ICONES[0] })}>Nova categoria</Button>}
      />

      <Modal
        aberto={!!editar}
        onFechar={() => setEditar(null)}
        titulo={editar?.id ? 'Editar categoria' : 'Nova categoria'}
        footer={<><Button variante="ghost" onClick={() => setEditar(null)}>Cancelar</Button><Button onClick={salvar}>Salvar</Button></>}
      >
        {editar && (
          <div className="col gap-4">
            <Input label="Nome" value={editar.nome ?? ''} onChange={(e) => setEditar({ ...editar, nome: e.target.value })} />
            <div className="form-grid">
              <Select label="Cor" value={editar.cor} onChange={(e) => setEditar({ ...editar, cor: e.target.value })}>
                {CORES.map(([nome, cor]) => <option key={cor} value={cor}>{nome}</option>)}
              </Select>
              <Select label="Ícone" value={editar.icone} onChange={(e) => setEditar({ ...editar, icone: e.target.value })}>
                {ICONES.map((i) => <option key={i} value={i}>{i}</option>)}
              </Select>
            </div>
            <div className="row gap-3">
              <span className="cat-tile__icon" style={{ ['--cat' as string]: editar.cor ?? 'var(--cat-academico)' }}><CategoryIcon nome={editar.icone ?? 'Tag'} size={22} /></span>
              <span className="text-sm text-muted">Pré-visualização</span>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        aberto={!!remover}
        titulo="Remover categoria"
        mensagem={`Remover a categoria "${remover?.nome}"? Eventos existentes podem ficar sem categoria.`}
        confirmarLabel="Remover"
        perigo
        onConfirmar={confirmarRemocao}
        onCancelar={() => setRemover(null)}
      />
    </div>
  );
}
