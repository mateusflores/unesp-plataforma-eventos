import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CalendarDays, LayoutGrid, List } from 'lucide-react';
import { Button, Segmented } from '@/components/ui';
import type { OpcaoSegmento } from '@/components/ui';
import { useCatalog } from '@/contexts/CatalogContext';
import { hora, dataCompleta } from '@/utils/format';
import { nomeMesAno } from '@/utils/format';
import {
  gradeDoMes,
  diasDaSemana,
  diasDaSemanaCurto,
  eventosDoDia,
  ehHoje,
  mesmaData,
  addMeses,
  addDias,
  ehMultiDia,
} from './calendarUtils';
import { EventSummaryModal } from './EventSummaryModal';
import type { Evento } from '@/types';
import './calendar.css';

type Visao = 'mes' | 'semana' | 'lista';

const opcoesVisao: OpcaoSegmento<Visao>[] = [
  { valor: 'mes', rotulo: 'Mês', icone: <LayoutGrid size={15} /> },
  { valor: 'semana', rotulo: 'Semana', icone: <CalendarDays size={15} /> },
  { valor: 'lista', rotulo: 'Lista', icone: <List size={15} /> },
];

export function Calendar({ eventos }: { eventos: Evento[] }) {
  const { categoriaPorId } = useCatalog();
  const [visao, setVisao] = useState<Visao>('mes');
  const [referencia, setReferencia] = useState(new Date(2026, 6, 10)); // "hoje" da demo
  const [selecionado, setSelecionado] = useState<Evento | null>(null);
  const [diaExpandido, setDiaExpandido] = useState<Date | null>(null);

  const corEvento = (ev: Evento): string => categoriaPorId(ev.categoriaIds[0])?.cor ?? 'var(--brand-600)';

  const navegar = (dir: number) => {
    if (visao === 'mes') setReferencia((r) => addMeses(r, dir));
    else if (visao === 'semana') setReferencia((r) => addDias(r, dir * 7));
    else setReferencia((r) => addMeses(r, dir));
  };

  const label = useMemo(() => {
    if (visao === 'semana') {
      const dias = diasDaSemana(referencia);
      return `${dias[0].getDate()}–${dias[6].getDate()} de ${nomeMesAno(referencia).split(' de ')[0]}`;
    }
    return nomeMesAno(referencia);
  }, [visao, referencia]);

  return (
    <div>
      <div className="cal-toolbar">
        <div className="cal-nav">
          <button className="cal-navbtn" onClick={() => navegar(-1)} aria-label="Anterior"><ChevronLeft size={18} /></button>
          <button className="cal-navbtn" onClick={() => navegar(1)} aria-label="Próximo"><ChevronRight size={18} /></button>
          <span className="cal-nav__label">{label}</span>
          <Button variante="secondary" tamanho="sm" onClick={() => setReferencia(new Date(2026, 6, 10))}>Hoje</Button>
        </div>
        <Segmented opcoes={opcoesVisao} valor={visao} onChange={setVisao} ariaLabel="Modo de visualização" />
      </div>

      {visao === 'mes' && (
        <MesView
          referencia={referencia}
          eventos={eventos}
          corEvento={corEvento}
          onEvento={setSelecionado}
          onExpandir={setDiaExpandido}
        />
      )}
      {visao === 'semana' && (
        <SemanaView referencia={referencia} eventos={eventos} corEvento={corEvento} onEvento={setSelecionado} />
      )}
      {visao === 'lista' && (
        <ListaView referencia={referencia} eventos={eventos} corEvento={corEvento} onEvento={setSelecionado} />
      )}

      <EventSummaryModal evento={selecionado} onFechar={() => setSelecionado(null)} />

      {/* Modal "ver mais eventos do dia" */}
      {diaExpandido && (
        <DiaModal
          dia={diaExpandido}
          eventos={eventosDoDia(eventos, diaExpandido)}
          corEvento={corEvento}
          onEvento={(ev) => {
            setDiaExpandido(null);
            setSelecionado(ev);
          }}
          onFechar={() => setDiaExpandido(null)}
        />
      )}
    </div>
  );
}

// ---------------- Mês ----------------
function MesView({
  referencia,
  eventos,
  corEvento,
  onEvento,
  onExpandir,
}: {
  referencia: Date;
  eventos: Evento[];
  corEvento: (e: Evento) => string;
  onEvento: (e: Evento) => void;
  onExpandir: (d: Date) => void;
}) {
  const dias = gradeDoMes(referencia);
  const mesAtual = referencia.getMonth();

  return (
    <div className="cal-month">
      <div className="cal-week-head">
        {diasDaSemanaCurto.map((d) => <span key={d}>{d}</span>)}
      </div>
      <div className="cal-grid">
        {dias.map((dia) => {
          const doMes = dia.getMonth() === mesAtual;
          const evs = eventosDoDia(eventos, dia);
          const visiveis = evs.slice(0, 3);
          return (
            <div
              key={dia.toISOString()}
              className={`cal-day ${!doMes ? 'cal-day--fora' : ''} ${ehHoje(dia) ? 'cal-day--hoje' : ''}`}
              onClick={() => evs.length > 0 && onExpandir(dia)}
            >
              <div className="row-between">
                <span className="cal-day__num">{dia.getDate()}</span>
                {evs.length > 0 && <span className="cal-day__count">{evs.length}</span>}
              </div>
              {visiveis.map((ev) => {
                const cont = ehMultiDia(ev) && !mesmaData(new Date(ev.dataInicio), dia);
                return (
                  <button
                    key={ev.id}
                    className={`cal-pill ${cont ? 'cal-pill--cont' : ''} ${ev.status === 'CANCELADO' ? 'cal-pill--cancelado' : ''}`}
                    style={{ ['--c' as string]: corEvento(ev) }}
                    onClick={(e) => { e.stopPropagation(); onEvento(ev); }}
                    title={ev.titulo}
                  >
                    {!cont && <span className="cal-pill__dot" />}
                    <span className="truncate">{cont ? '↳ ' : ''}{ev.titulo}</span>
                  </button>
                );
              })}
              {evs.length > 3 && (
                <button className="cal-mais" onClick={(e) => { e.stopPropagation(); onExpandir(dia); }}>
                  +{evs.length - 3} eventos
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------- Semana ----------------
function SemanaView({
  referencia,
  eventos,
  corEvento,
  onEvento,
}: {
  referencia: Date;
  eventos: Evento[];
  corEvento: (e: Evento) => string;
  onEvento: (e: Evento) => void;
}) {
  const dias = diasDaSemana(referencia);
  return (
    <div className="cal-week">
      {dias.map((dia) => {
        const evs = eventosDoDia(eventos, dia);
        return (
          <div key={dia.toISOString()} className="cal-wcol">
            <div className={`cal-wcol__head ${ehHoje(dia) ? 'cal-wcol__head--hoje' : ''}`}>
              <small>{diasDaSemanaCurto[dia.getDay()]}</small>
              <strong>{dia.getDate()}</strong>
            </div>
            <div className="cal-wcol__body">
              {evs.length === 0 ? (
                <span className="text-muted text-xs text-center" style={{ padding: 'var(--sp-3) 0' }}>—</span>
              ) : (
                evs.map((ev) => (
                  <button
                    key={ev.id}
                    className="cal-wevent"
                    style={{ ['--c' as string]: corEvento(ev) }}
                    onClick={() => onEvento(ev)}
                  >
                    <span>{hora(ev.dataInicio)}</span>
                    <strong className="truncate">{ev.titulo}</strong>
                  </button>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---------------- Lista ----------------
function ListaView({
  referencia,
  eventos,
  corEvento,
  onEvento,
}: {
  referencia: Date;
  eventos: Evento[];
  corEvento: (e: Evento) => string;
  onEvento: (e: Evento) => void;
}) {
  // Agrupa eventos do mês da referência por dia.
  const mes = referencia.getMonth();
  const ano = referencia.getFullYear();
  const doMes = eventos
    .filter((e) => {
      const d = new Date(e.dataInicio);
      return d.getMonth() === mes && d.getFullYear() === ano;
    })
    .sort((a, b) => a.dataInicio.localeCompare(b.dataInicio));

  const grupos = new Map<string, Evento[]>();
  doMes.forEach((e) => {
    const chave = new Date(e.dataInicio).toDateString();
    if (!grupos.has(chave)) grupos.set(chave, []);
    grupos.get(chave)!.push(e);
  });

  if (grupos.size === 0) {
    return (
      <div className="painel text-center text-secondary" style={{ padding: 'var(--sp-12)' }}>
        Nenhum evento neste mês. Navegue para outro período.
      </div>
    );
  }

  return (
    <div className="cal-list">
      {Array.from(grupos.entries()).map(([chave, evs]) => {
        const dia = new Date(chave);
        return (
          <div key={chave} className="cal-list__dia">
            <div className={`cal-list__data ${ehHoje(dia) ? 'cal-list__data--hoje' : ''}`}>
              <strong>{dia.getDate()}</strong>
              <span>{diasDaSemanaCurto[dia.getDay()]}</span>
            </div>
            <div className="cal-list__eventos">
              {evs.map((ev) => (
                <button key={ev.id} className="cal-list__ev" style={{ ['--c' as string]: corEvento(ev) }} onClick={() => onEvento(ev)}>
                  <span className="cal-list__ev-bar" />
                  <span className="cal-list__ev-hora">{hora(ev.dataInicio)}</span>
                  <div className="grow" style={{ textAlign: 'left' }}>
                    <strong style={{ fontSize: 'var(--fs-sm)' }}>{ev.titulo}</strong>
                    <div className="text-xs text-muted">{ev.local}</div>
                  </div>
                  {ev.gratuito ? <span className="badge badge--sucesso">Grátis</span> : <span className="badge badge--brand">R$ {ev.precoAPartir.toFixed(0)}</span>}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---------------- Modal do dia ----------------
function DiaModal({
  dia,
  eventos,
  corEvento,
  onEvento,
  onFechar,
}: {
  dia: Date;
  eventos: Evento[];
  corEvento: (e: Evento) => string;
  onEvento: (e: Evento) => void;
  onFechar: () => void;
}) {
  return (
    <div className="overlay" onClick={onFechar}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal__header">
          <h2 className="modal__title" style={{ textTransform: 'capitalize' }}>{dataCompleta(dia.toISOString())}</h2>
          <button className="modal__close" onClick={onFechar} aria-label="Fechar">✕</button>
        </div>
        <div className="modal__body">
          <div className="col gap-2">
            {eventos.map((ev) => (
              <button key={ev.id} className="cal-list__ev" style={{ ['--c' as string]: corEvento(ev) }} onClick={() => onEvento(ev)}>
                <span className="cal-list__ev-bar" />
                <span className="cal-list__ev-hora">{hora(ev.dataInicio)}</span>
                <div className="grow" style={{ textAlign: 'left' }}>
                  <strong style={{ fontSize: 'var(--fs-sm)' }}>{ev.titulo}</strong>
                  <div className="text-xs text-muted">{ev.local}</div>
                </div>
                {ev.gratuito ? <span className="badge badge--sucesso">Grátis</span> : <span className="badge badge--brand">R$ {ev.precoAPartir.toFixed(0)}</span>}
              </button>
            ))}
          </div>
          <Link to="/explorar" onClick={onFechar} className="sec-link mt-4" style={{ display: 'inline-flex' }}>
            Ver todos na busca →
          </Link>
        </div>
      </div>
    </div>
  );
}
