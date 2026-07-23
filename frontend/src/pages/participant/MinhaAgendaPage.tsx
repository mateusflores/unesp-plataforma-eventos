import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, MapPin, Ticket, CalendarX2 } from 'lucide-react';
import { services } from '@/services';
import { useAsync } from '@/hooks/useAsync';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { PageHeader } from '@/components/layout/PageHeader';
import { Tabs, Badge, Button, Skeleton, EmptyState, ErrorState } from '@/components/ui';
import { EventCover } from '@/components/events/EventCover';
import { dataCompleta, hora, moeda } from '@/utils/format';
import { statusInscricaoInfo, statusCompraInfo } from '@/utils/dominio';
import type { Evento, Inscricao, Compra } from '@/types';

type Aba = 'proximos' | 'anteriores' | 'espera' | 'compras';

interface ItemAgenda {
  evento: Evento;
  tipo: 'inscricao' | 'compra';
  inscricao?: Inscricao;
  compra?: Compra;
  data: string;
}

export function MinhaAgendaPage() {
  const { usuario } = useAuth();
  const toast = useToast();
  const [aba, setAba] = useState<Aba>('proximos');

  const dados = useAsync(async () => {
    if (!usuario) return { inscricoes: [], compras: [], eventos: [] as Evento[] };
    const [inscricoes, compras, eventosPag] = await Promise.all([
      services.registrations.doUsuario(usuario.id),
      services.purchases.doUsuario(usuario.id),
      services.events.listar({ status: 'PUBLICADO' }, 1, 200),
    ]);
    // inclui também cancelados/encerrados para exibição histórica
    const todos = await services.events.listar({}, 1, 200);
    return { inscricoes, compras, eventos: todos.itens };
  }, [usuario?.id]);

  const eventosMap = useMemo(() => {
    const m = new Map<number, Evento>();
    dados.data?.eventos.forEach((e) => m.set(e.id, e));
    return m;
  }, [dados.data]);

  const itens: ItemAgenda[] = useMemo(() => {
    if (!dados.data) return [];
    const lista: ItemAgenda[] = [];
    dados.data.inscricoes.forEach((i) => {
      const ev = eventosMap.get(i.eventoId);
      if (ev) lista.push({ evento: ev, tipo: 'inscricao', inscricao: i, data: ev.dataInicio });
    });
    dados.data.compras.forEach((c) => {
      const ev = eventosMap.get(c.eventoId);
      if (ev) lista.push({ evento: ev, tipo: 'compra', compra: c, data: ev.dataInicio });
    });
    return lista.sort((a, b) => a.data.localeCompare(b.data));
  }, [dados.data, eventosMap]);

  const agora = new Date(2026, 6, 10).getTime();
  const filtrados = itens.filter((it) => {
    const fim = new Date(it.evento.dataFim).getTime();
    if (aba === 'proximos') return fim >= agora && it.inscricao?.status !== 'CANCELADA' && it.compra?.status !== 'CANCELADO';
    if (aba === 'anteriores') return fim < agora;
    if (aba === 'espera') return it.inscricao?.status === 'LISTA_ESPERA';
    if (aba === 'compras') return it.tipo === 'compra';
    return true;
  });

  const cancelarInscricao = async (id: number) => {
    await services.registrations.cancelar(id);
    toast.sucesso('Inscrição cancelada');
    dados.recarregar();
  };

  return (
    <div className="container section-sm">
      <PageHeader titulo="Minha agenda" subtitulo="Seus eventos, inscrições e compras, organizados por período." />

      <div className="mb-6">
        <Tabs
          valor={aba}
          onChange={(v) => setAba(v as Aba)}
          opcoes={[
            { valor: 'proximos', rotulo: 'Próximos' },
            { valor: 'anteriores', rotulo: 'Anteriores' },
            { valor: 'espera', rotulo: 'Lista de espera' },
            { valor: 'compras', rotulo: 'Compras' },
          ]}
        />
      </div>

      {dados.estado === 'error' ? (
        <ErrorState status={dados.statusHttp} mensagem={dados.erro} onRetry={dados.recarregar} />
      ) : dados.estado === 'loading' || dados.estado === 'idle' ? (
        <div className="col gap-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} h={110} radius="var(--radius-lg)" />)}</div>
      ) : filtrados.length === 0 ? (
        <EmptyState
          icone={<CalendarX2 size={28} />}
          titulo="Nada nesta aba"
          descricao="Explore eventos e faça sua primeira inscrição para vê-los aqui."
          acao={<Link to="/explorar"><Button>Explorar eventos</Button></Link>}
        />
      ) : (
        <div className="col gap-4">
          {filtrados.map((it) => (
            <div key={`${it.tipo}-${it.inscricao?.id ?? it.compra?.id}`} className="card row gap-4" style={{ padding: 'var(--sp-3)', overflow: 'hidden' }}>
              <div style={{ width: 120, height: 84, borderRadius: 'var(--radius-md)', overflow: 'hidden', flexShrink: 0 }}>
                <EventCover evento={it.evento} altura={84} />
              </div>
              <div className="grow" style={{ minWidth: 0 }}>
                <div className="row gap-2 wrap mb-2">
                  {it.inscricao && <Badge tom={statusInscricaoInfo[it.inscricao.status].tom} ponto>{statusInscricaoInfo[it.inscricao.status].rotulo}</Badge>}
                  {it.compra && <Badge tom={statusCompraInfo[it.compra.status].tom} ponto>{statusCompraInfo[it.compra.status].rotulo}</Badge>}
                  {it.tipo === 'compra' && <span className="text-xs text-muted">{moeda(it.compra!.valorTotal)}</span>}
                </div>
                <Link to={`/eventos/${it.evento.slug}`}><strong>{it.evento.titulo}</strong></Link>
                <div className="text-sm text-secondary mt-1 row gap-3 wrap">
                  <span className="row gap-1"><CalendarDays size={14} /> {dataCompleta(it.evento.dataInicio)} · {hora(it.evento.dataInicio)}</span>
                  <span className="row gap-1"><MapPin size={14} /> {it.evento.local}</span>
                </div>
              </div>
              <div className="col gap-2" style={{ alignItems: 'flex-end' }}>
                {it.tipo === 'compra' && <Link to="/meus-ingressos"><Button variante="secondary" tamanho="sm" iconeEsq={<Ticket size={14} />}>Ingressos</Button></Link>}
                {it.inscricao && it.inscricao.status !== 'CANCELADA' && new Date(it.evento.dataFim).getTime() >= agora && (
                  <Button variante="ghost" tamanho="sm" onClick={() => cancelarInscricao(it.inscricao!.id)}>Cancelar</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
