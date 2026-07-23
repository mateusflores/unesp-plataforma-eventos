import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { services } from '@/services';
import { useAsync } from '@/hooks/useAsync';
import { useDebounce } from '@/hooks/useDebounce';
import { EventFilters } from '@/components/events/EventFilters';
import { EventCard, EventCardSkeleton } from '@/components/events/EventCard';
import { Pagination, EmptyState, ErrorState, Button } from '@/components/ui';
import { PageHeader } from '@/components/layout/PageHeader';
import type { EventoFiltros } from '@/types';

const POR_PAGINA = 9;

export function ExplorePage() {
  const [params] = useSearchParams();
  const [filtros, setFiltros] = useState<EventoFiltros>(() => ({
    busca: params.get('busca') || undefined,
    categoriaIds: params.get('categoria') ? [Number(params.get('categoria'))] : undefined,
    somenteDestaque: params.get('destaque') === '1' || undefined,
    gratuito: params.get('gratuito') === '1' ? true : undefined,
  }));
  const [pagina, setPagina] = useState(1);

  const buscaDebounced = useDebounce(filtros.busca ?? '', 350);
  const filtrosEfetivos = useMemo(
    () => ({ ...filtros, busca: buscaDebounced || undefined }),
    [filtros, buscaDebounced],
  );

  // Reinicia página ao mudar filtros.
  useEffect(() => setPagina(1), [filtrosEfetivos]);

  const { data, estado, statusHttp, erro, recarregar } = useAsync(
    () => services.events.listar(filtrosEfetivos, pagina, POR_PAGINA),
    [filtrosEfetivos, pagina],
  );

  const patch = (p: Partial<EventoFiltros>) => setFiltros((f) => ({ ...f, ...p }));
  const limpar = () => setFiltros({});

  const totalPaginas = data ? Math.ceil(data.total / POR_PAGINA) : 1;

  return (
    <div className="container section-sm">
      <PageHeader
        titulo="Explorar eventos"
        subtitulo="Filtre por universidade, campus, categoria e preço para achar o rolê perfeito."
      />

      <EventFilters filtros={filtros} onChange={patch} onLimpar={limpar} totalResultados={data?.total} />

      {estado === 'error' ? (
        <ErrorState status={statusHttp} mensagem={erro} onRetry={recarregar} />
      ) : estado === 'loading' ? (
        <div className="eventos-grid">
          {Array.from({ length: 6 }).map((_, i) => <EventCardSkeleton key={i} />)}
        </div>
      ) : data && data.itens.length === 0 ? (
        <EmptyState
          titulo="Nenhum evento encontrado"
          descricao="Tente remover alguns filtros ou buscar por outro termo."
          acao={<Button variante="secondary" onClick={limpar}>Limpar filtros</Button>}
        />
      ) : (
        <>
          <div className="eventos-grid">
            {data?.itens.map((ev) => <EventCard key={ev.id} evento={ev} />)}
          </div>
          <div className="mt-8">
            <Pagination pagina={pagina} totalPaginas={totalPaginas} onChange={setPagina} />
          </div>
        </>
      )}
    </div>
  );
}
