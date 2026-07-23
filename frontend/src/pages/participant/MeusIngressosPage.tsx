import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Ticket as TicketIcon, CalendarDays, MapPin, User } from 'lucide-react';
import { services } from '@/services';
import { useAsync } from '@/hooks/useAsync';
import { useAuth } from '@/contexts/AuthContext';
import { useCatalog } from '@/contexts/CatalogContext';
import { PageHeader } from '@/components/layout/PageHeader';
import { Tabs, Badge, Button, Skeleton, EmptyState, ErrorState, QRCode, Modal } from '@/components/ui';
import { dataCompleta, hora } from '@/utils/format';
import { statusIngressoInfo } from '@/utils/dominio';
import type { IngressoEmitido, Evento } from '@/types';

type Aba = 'todos' | 'VALIDO' | 'UTILIZADO' | 'CANCELADO';

export function MeusIngressosPage() {
  const { usuario } = useAuth();
  const [aba, setAba] = useState<Aba>('todos');
  const [detalhe, setDetalhe] = useState<{ ing: IngressoEmitido; ev?: Evento } | null>(null);

  const dados = useAsync(async () => {
    if (!usuario) return { ingressos: [] as IngressoEmitido[], eventos: [] as Evento[] };
    const [ingressos, ev] = await Promise.all([
      services.tickets.doUsuario(usuario.id),
      services.events.listar({}, 1, 200),
    ]);
    return { ingressos, eventos: ev.itens };
  }, [usuario?.id]);

  const eventosMap = useMemo(() => {
    const m = new Map<number, Evento>();
    dados.data?.eventos.forEach((e) => m.set(e.id, e));
    return m;
  }, [dados.data]);

  const filtrados = (dados.data?.ingressos ?? []).filter((t) => (aba === 'todos' ? true : t.status === aba));

  return (
    <div className="container section-sm">
      <PageHeader titulo="Meus ingressos" subtitulo="Apresente o QR Code na entrada do evento. (Ilustrativo — sem validação real.)" />

      <div className="mb-6">
        <Tabs
          valor={aba}
          onChange={(v) => setAba(v as Aba)}
          opcoes={[
            { valor: 'todos', rotulo: 'Todos' },
            { valor: 'VALIDO', rotulo: 'Válidos' },
            { valor: 'UTILIZADO', rotulo: 'Utilizados' },
            { valor: 'CANCELADO', rotulo: 'Cancelados' },
          ]}
        />
      </div>

      {dados.estado === 'error' ? (
        <ErrorState status={dados.statusHttp} mensagem={dados.erro} onRetry={dados.recarregar} />
      ) : dados.estado === 'loading' || dados.estado === 'idle' ? (
        <div className="ingressos-grid">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} h={220} radius="var(--radius-lg)" />)}</div>
      ) : filtrados.length === 0 ? (
        <EmptyState
          icone={<TicketIcon size={28} />}
          titulo="Nenhum ingresso aqui"
          descricao="Compre ingressos de eventos pagos para vê-los nesta área."
          acao={<Link to="/explorar"><Button>Explorar eventos</Button></Link>}
        />
      ) : (
        <div className="ingressos-grid">
          {filtrados.map((t) => {
            const ev = eventosMap.get(t.eventoId);
            const info = statusIngressoInfo[t.status];
            return (
              <button key={t.id} className="ticket" onClick={() => setDetalhe({ ing: t, ev })} style={{ textAlign: 'left' }}>
                <div className="ticket__top" style={{ background: `linear-gradient(135deg, var(--brand-700), var(--brand-500))` }}>
                  <div className="row-between">
                    <span className="text-xs" style={{ opacity: 0.85 }}>{t.ingressoNome}</span>
                    <span className={`badge badge--${info.tom} badge--solid`} style={{ background: 'rgba(255,255,255,.22)' }}>{info.rotulo}</span>
                  </div>
                  <div className="ticket__evento mt-2">{ev?.titulo ?? 'Evento'}</div>
                </div>
                <div className="ticket__perf" />
                <div className="ticket__body">
                  <div className="ticket__info">
                    <div className="ticket__linha"><span>Data</span><strong>{ev ? `${dataCompleta(ev.dataInicio).replace(/^\w+, /, '')}` : '—'}</strong></div>
                    <div className="ticket__linha"><span>Horário</span><strong>{ev ? hora(ev.dataInicio) : '—'}</strong></div>
                    <div className="ticket__linha"><span>Lote</span><strong>{t.loteNome}</strong></div>
                    <div className="ticket__linha"><span>Código</span><strong>{t.codigoQR}</strong></div>
                  </div>
                  <QRCode valor={t.codigoQR} tamanho={92} />
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Detalhe do ingresso */}
      <Modal aberto={!!detalhe} onFechar={() => setDetalhe(null)} titulo="Ingresso digital">
        {detalhe && (
          <div className="center" style={{ flexDirection: 'column', gap: 'var(--sp-4)' }}>
            <QRCode valor={detalhe.ing.codigoQR} tamanho={200} />
            <Badge tom={statusIngressoInfo[detalhe.ing.status].tom} ponto>{statusIngressoInfo[detalhe.ing.status].rotulo}</Badge>
            <div className="painel" style={{ width: '100%' }}>
              <div className="def-list">
                <div className="def-list__row"><span>Evento</span><span>{detalhe.ev?.titulo}</span></div>
                <div className="def-list__row"><span>Ingresso</span><span>{detalhe.ing.ingressoNome} · {detalhe.ing.loteNome}</span></div>
                {detalhe.ev && <div className="def-list__row"><span>Data</span><span>{dataCompleta(detalhe.ev.dataInicio)}</span></div>}
                {detalhe.ev && <div className="def-list__row"><span>Local</span><span>{detalhe.ev.local}</span></div>}
                <div className="def-list__row"><span>Código</span><span>{detalhe.ing.codigoQR}</span></div>
                {detalhe.ing.checkIn && <div className="def-list__row"><span>Check-in</span><span>{dataCompleta(detalhe.ing.checkIn.dataHora)}</span></div>}
              </div>
            </div>
            <div className="row gap-2 text-xs text-muted"><User size={13} /> {detalhe.ev?.local} · <MapPin size={13} /> apresente na entrada</div>
          </div>
        )}
      </Modal>
    </div>
  );
}
