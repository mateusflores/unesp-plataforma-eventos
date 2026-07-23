import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Ban } from 'lucide-react';
import { services } from '@/services';
import { useToast } from '@/contexts/ToastContext';
import { useCatalog } from '@/contexts/CatalogContext';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable } from '@/components/admin/DataTable';
import type { Coluna } from '@/components/admin/DataTable';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Button, Badge } from '@/components/ui';
import { StatusEventoBadge } from '@/components/events/EventBits';
import { dataCurta, moeda } from '@/utils/format';
import type { Evento } from '@/types';

export function AdminEventosPage() {
  const toast = useToast();
  const { organizadorPorId, campusPorId } = useCatalog();
  const [eventos, setEventos] = useState<Evento[] | null>(null);
  const [cancelar, setCancelar] = useState<Evento | null>(null);

  const carregar = () => services.events.listar({}, 1, 200).then((p) => setEventos(p.itens));
  useEffect(() => { carregar(); }, []);

  const confirmarCancelamento = async () => {
    if (!cancelar) return;
    await services.events.cancelar(cancelar.id);
    toast.sucesso('Evento cancelado');
    setCancelar(null);
    carregar();
  };

  const colunas: Coluna<Evento>[] = [
    { chave: 'titulo', titulo: 'Evento', ordenavel: true, valorOrdenacao: (e) => e.titulo, render: (e) => <strong className="text-sm">{e.titulo}</strong> },
    { chave: 'org', titulo: 'Organizador', render: (e) => <span className="text-secondary text-sm">{organizadorPorId(e.organizadorId)?.nome.split('—')[0].trim() ?? '—'}</span> },
    { chave: 'campus', titulo: 'Campus', render: (e) => <span className="text-secondary text-sm">{campusPorId(e.campusId)?.nome ?? '—'}</span> },
    { chave: 'data', titulo: 'Data', ordenavel: true, valorOrdenacao: (e) => e.dataInicio, render: (e) => <span className="text-secondary text-sm">{dataCurta(e.dataInicio)}</span> },
    { chave: 'preco', titulo: 'Preço', render: (e) => (e.gratuito ? <Badge tom="sucesso">Grátis</Badge> : moeda(e.precoAPartir)) },
    { chave: 'status', titulo: 'Status', ordenavel: true, valorOrdenacao: (e) => e.status, render: (e) => <StatusEventoBadge status={e.status} /> },
    {
      chave: 'acoes', titulo: 'Ações', alinhar: 'right',
      render: (e) => (
        <div className="row gap-1" style={{ justifyContent: 'flex-end' }}>
          <Link to={`/eventos/${e.slug}`}><Button variante="ghost" tamanho="sm" apenasIcone iconeEsq={<Eye size={16} />} /></Link>
          {e.status !== 'CANCELADO' && <Button variante="ghost" tamanho="sm" apenasIcone iconeEsq={<Ban size={16} />} onClick={() => setCancelar(e)} />}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader titulo="Eventos" subtitulo="Todos os eventos da plataforma, de todas as instituições." />
      <DataTable
        itens={eventos}
        colunas={colunas}
        keyOf={(e) => e.id}
        buscaEm={(e) => e.titulo}
        placeholderBusca="Buscar evento…"
        porPagina={10}
      />
      <ConfirmDialog
        aberto={!!cancelar}
        titulo="Cancelar evento"
        mensagem={`Cancelar "${cancelar?.titulo}"? Os participantes seriam notificados (simulado).`}
        confirmarLabel="Cancelar evento"
        perigo
        onConfirmar={confirmarCancelamento}
        onCancelar={() => setCancelar(null)}
      />
    </div>
  );
}
