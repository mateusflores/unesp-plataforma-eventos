import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, PlusCircle, Eye, Pencil, Copy, Send, Ban, MoreVertical } from 'lucide-react';
import { services, ApiError } from '@/services';
import { useToast } from '@/contexts/ToastContext';
import { useCatalog } from '@/contexts/CatalogContext';
import { useEventosDoOrganizador } from '@/hooks/useOrganizer';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusEventoBadge } from '@/components/events/EventBits';
import { Button, Select, Skeleton, EmptyState, ErrorState, Badge } from '@/components/ui';
import { intervalo, moeda } from '@/utils/format';
import { normalize } from '@/services/utils';
import type { StatusEvento } from '@/types';

export function OrgEventosPage() {
  const { data, estado, statusHttp, erro, recarregar } = useEventosDoOrganizador();
  const toast = useToast();
  const { campusPorId } = useCatalog();
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<StatusEvento | ''>('');
  const [menuId, setMenuId] = useState<number | null>(null);

  const filtrados = useMemo(() => {
    let r = data ?? [];
    if (busca) r = r.filter((e) => normalize(e.titulo).includes(normalize(busca)));
    if (filtroStatus) r = r.filter((e) => e.status === filtroStatus);
    return r;
  }, [data, busca, filtroStatus]);

  const acao = async (fn: () => Promise<unknown>, sucesso: string) => {
    setMenuId(null);
    try {
      await fn();
      toast.sucesso(sucesso);
      recarregar();
    } catch (e) {
      toast.erro('Erro', e instanceof ApiError ? e.message : undefined);
    }
  };

  if (estado === 'error') return <ErrorState status={statusHttp} mensagem={erro} onRetry={recarregar} />;

  return (
    <div>
      <PageHeader
        titulo="Meus eventos"
        subtitulo="Gerencie, publique e acompanhe todos os seus eventos."
        acoes={<Link to="/organizador/eventos/novo"><Button iconeEsq={<PlusCircle size={16} />}>Criar evento</Button></Link>}
      />

      <div className="toolbar">
        <label className="busca-inline">
          <Search size={17} />
          <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar evento…" aria-label="Buscar" />
        </label>
        <Select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value as StatusEvento | '')} aria-label="Filtrar status">
          <option value="">Todos os status</option>
          <option value="PUBLICADO">Publicados</option>
          <option value="RASCUNHO">Rascunhos</option>
          <option value="ENCERRADO">Encerrados</option>
          <option value="CANCELADO">Cancelados</option>
        </Select>
      </div>

      {estado === 'loading' || estado === 'idle' ? (
        <Skeleton h={360} radius="var(--radius-lg)" />
      ) : filtrados.length === 0 ? (
        <EmptyState titulo="Nenhum evento encontrado" descricao="Crie seu primeiro evento ou ajuste os filtros." acao={<Link to="/organizador/eventos/novo"><Button>Criar evento</Button></Link>} />
      ) : (
        <div className="tabela-wrap">
          <table className="tabela">
            <thead>
              <tr>
                <th>Evento</th>
                <th>Data</th>
                <th>Campus</th>
                <th>Inscritos</th>
                <th>Preço</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((e) => (
                <tr key={e.id}>
                  <td><strong>{e.titulo}</strong></td>
                  <td className="text-secondary">{intervalo(e.dataInicio, e.dataFim)}</td>
                  <td className="text-secondary">{campusPorId(e.campusId)?.nome ?? '—'}</td>
                  <td>{e.inscritos}/{e.capacidade}</td>
                  <td>{e.gratuito ? <Badge tom="sucesso">Grátis</Badge> : moeda(e.precoAPartir)}</td>
                  <td><StatusEventoBadge status={e.status} /></td>
                  <td>
                    <div className="row gap-1" style={{ justifyContent: 'flex-end', position: 'relative' }}>
                      <Link to={`/eventos/${e.slug}`} title="Ver"><Button variante="ghost" tamanho="sm" apenasIcone iconeEsq={<Eye size={16} />} /></Link>
                      <Link to={`/organizador/eventos/${e.id}/editar`} title="Editar"><Button variante="ghost" tamanho="sm" apenasIcone iconeEsq={<Pencil size={16} />} /></Link>
                      <Button variante="ghost" tamanho="sm" apenasIcone iconeEsq={<MoreVertical size={16} />} onClick={() => setMenuId(menuId === e.id ? null : e.id)} />
                      {menuId === e.id && (
                        <div className="menu-drop" style={{ top: '100%', width: 180 }}>
                          <button className="menu-drop__item" onClick={() => acao(() => services.events.duplicar(e.id), 'Evento duplicado')}><Copy size={15} /> Duplicar</button>
                          {e.status !== 'PUBLICADO' && e.status !== 'CANCELADO' && (
                            <button className="menu-drop__item" onClick={() => acao(() => services.events.publicar(e.id), 'Evento publicado')}><Send size={15} /> Publicar</button>
                          )}
                          {e.status !== 'CANCELADO' && (
                            <button className="menu-drop__item menu-drop__item--danger" onClick={() => acao(() => services.events.cancelar(e.id), 'Evento cancelado')}><Ban size={15} /> Cancelar</button>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
