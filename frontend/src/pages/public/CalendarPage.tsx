import { useMemo, useState } from 'react';
import { services } from '@/services';
import { useAsync } from '@/hooks/useAsync';
import { useDebounce } from '@/hooks/useDebounce';
import { Calendar } from '@/components/calendar/Calendar';
import { EventFilters, CategoriaLegenda } from '@/components/events/EventFilters';
import { PageHeader } from '@/components/layout/PageHeader';
import { Skeleton, ErrorState } from '@/components/ui';
import type { EventoFiltros } from '@/types';

export function CalendarPage() {
  const [filtros, setFiltros] = useState<EventoFiltros>({});
  const busca = useDebounce(filtros.busca ?? '', 300);
  const filtrosEfetivos = useMemo(() => ({ ...filtros, busca: busca || undefined }), [filtros, busca]);

  // Para o calendário buscamos um lote amplo (todos os eventos que casam com os filtros).
  const { data, estado, statusHttp, erro, recarregar } = useAsync(
    () => services.events.listar(filtrosEfetivos, 1, 200),
    [filtrosEfetivos],
  );

  const patch = (p: Partial<EventoFiltros>) => setFiltros((f) => ({ ...f, ...p }));

  return (
    <div className="container section-sm">
      <PageHeader
        titulo="Calendário de eventos"
        subtitulo="Navegue por mês, semana ou lista. Clique em um evento para ver o resumo."
      />

      <EventFilters filtros={filtros} onChange={patch} onLimpar={() => setFiltros({})} totalResultados={data?.total} />

      <div className="mb-6"><CategoriaLegenda /></div>

      {estado === 'error' ? (
        <ErrorState status={statusHttp} mensagem={erro} onRetry={recarregar} />
      ) : estado === 'loading' || estado === 'idle' ? (
        <Skeleton h={620} radius="var(--radius-lg)" />
      ) : (
        <Calendar eventos={data?.itens ?? []} />
      )}
    </div>
  );
}
