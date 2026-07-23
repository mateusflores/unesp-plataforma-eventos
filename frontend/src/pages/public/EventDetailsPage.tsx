import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  CalendarDays, Clock, MapPin, Users, Building2, Ticket, ArrowLeft, ShieldCheck,
  CheckCircle2, Hourglass,
} from 'lucide-react';
import { services, ApiError } from '@/services';
import { useAsync } from '@/hooks/useAsync';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { useCatalog } from '@/contexts/CatalogContext';
import { EventCover } from '@/components/events/EventCover';
import { CategoriaTag, BarraVagas } from '@/components/events/EventBits';
import { Button, Badge, Skeleton, ErrorState, Avatar, Modal } from '@/components/ui';
import { intervalo, duracaoHoras, hora, dataCompleta, moeda } from '@/utils/format';
import { disponibilidadeEvento, tipoEntidadeRotulo } from '@/utils/dominio';
import type { Evento, Inscricao } from '@/types';

export function EventDetailsPage() {
  const { slug = '' } = useParams();
  const { data, estado, statusHttp, erro, recarregar } = useAsync(() => services.events.porSlug(slug), [slug]);

  if (estado === 'loading' || estado === 'idle') {
    return (
      <div className="container section-sm">
        <Skeleton h={340} radius="var(--radius-xl)" />
        <div className="mt-6" style={{ maxWidth: 600 }}>
          <Skeleton h={28} w="70%" />
          <div className="mt-4"><Skeleton h={16} /></div>
          <div className="mt-2"><Skeleton h={16} w="90%" /></div>
        </div>
      </div>
    );
  }
  if (estado === 'error' || !data) {
    return <div className="container section-sm"><ErrorState status={statusHttp} mensagem={erro} onRetry={recarregar} /></div>;
  }
  return <Detalhe evento={data} onMudou={recarregar} />;
}

function Detalhe({ evento, onMudou }: { evento: Evento; onMudou: () => void }) {
  const { autenticado, usuario } = useAuth();
  const { campusPorId, universidadePorId, organizadorPorId, tagPorId } = useCatalog();
  const campus = campusPorId(evento.campusId);
  const uni = universidadePorId(evento.universidadeId);
  const org = organizadorPorId(evento.organizadorId);

  const inscricao = useAsync<Inscricao | null>(
    () => (autenticado && usuario ? services.registrations.status(usuario.id, evento.id) : Promise.resolve(null)),
    [autenticado, usuario?.id, evento.id],
  );

  const info = [
    { icone: <CalendarDays size={18} />, label: 'Data', valor: dataCompleta(evento.dataInicio) },
    { icone: <Clock size={18} />, label: 'Horário', valor: `${hora(evento.dataInicio)} — ${hora(evento.dataFim)} · ${duracaoHoras(evento.dataInicio, evento.dataFim)}` },
    { icone: <MapPin size={18} />, label: 'Local', valor: `${evento.local}` },
    { icone: <Building2 size={18} />, label: 'Campus', valor: `${campus?.nome} · ${uni?.sigla}` },
    { icone: <Users size={18} />, label: 'Capacidade', valor: `${evento.inscritos} / ${evento.capacidade} inscritos` },
  ];

  return (
    <div className="container section-sm">
      <Link to="/explorar" className="row gap-2 text-sm text-secondary mb-4" style={{ width: 'fit-content' }}>
        <ArrowLeft size={16} /> Voltar para eventos
      </Link>

      {/* HERO */}
      <div className="ev-hero">
        <EventCover evento={evento} altura="100%" />
        <div className="ev-hero__grad" />
        <div className="ev-hero__info">
          <div className="row gap-2 wrap mb-2">
            {evento.categoriaIds.map((id) => <CategoriaTag key={id} id={id} />)}
          </div>
          <h1>{evento.titulo}</h1>
          <div className="row gap-3 wrap mt-2" style={{ color: 'rgba(255,255,255,.9)', fontSize: 'var(--fs-sm)' }}>
            <span className="row gap-1"><CalendarDays size={15} /> {intervalo(evento.dataInicio, evento.dataFim)}</span>
            <span className="row gap-1"><MapPin size={15} /> {evento.local}</span>
          </div>
        </div>
      </div>

      <div className="ev-layout">
        {/* Conteúdo */}
        <div>
          <div className="ev-bloco">
            <div className="ev-info-list">
              {info.map((i) => (
                <div key={i.label} className="ev-info-item">
                  <span className="ev-info-item__icon">{i.icone}</span>
                  <div>
                    <strong>{i.label}</strong>
                    <span>{i.valor}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="ev-bloco">
            <h2>Sobre o evento</h2>
            <p className="ev-desc">{evento.descricao}</p>
          </div>

          {evento.tagIds.length > 0 && (
            <div className="ev-bloco">
              <h2>Tags</h2>
              <div className="row gap-2 wrap">
                {evento.tagIds.map((id) => {
                  const t = tagPorId(id);
                  return t ? <Badge key={id} tom="neutro">#{t.nome}</Badge> : null;
                })}
              </div>
            </div>
          )}

          {org && (
            <div className="ev-bloco">
              <h2>Organizador</h2>
              <div className="painel row gap-4">
                <Avatar nome={org.nome} cor={org.avatarCor} tamanho={56} />
                <div className="grow">
                  <div className="row gap-2">
                    <strong>{org.nome}</strong>
                    {org.verificado && <Badge tom="brand" ponto>Verificado</Badge>}
                  </div>
                  <p className="text-secondary text-sm mt-2">{org.descricao}</p>
                  <div className="text-xs text-muted mt-2">
                    {org.entidade ? tipoEntidadeRotulo[org.entidade.tipo] : 'Organizador individual'} · {org.eventosRealizados} eventos realizados
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Aside CTA */}
        <aside className="ev-aside">
          <CtaEvento evento={evento} inscricao={inscricao.data} onMudou={() => { onMudou(); inscricao.recarregar(); }} />
        </aside>
      </div>
    </div>
  );
}

function CtaEvento({
  evento,
  inscricao,
  onMudou,
}: {
  evento: Evento;
  inscricao: Inscricao | null;
  onMudou: () => void;
}) {
  const { autenticado, usuario } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [processando, setProcessando] = useState(false);
  const [modalInscricao, setModalInscricao] = useState(false);

  const disp = disponibilidadeEvento(evento.inscritos, evento.capacidade);

  // Estados terminais
  if (evento.status === 'CANCELADO') {
    return (
      <div className="ev-cta">
        <div className="ev-cta__body">
          <Badge tom="perigo" ponto>Evento cancelado</Badge>
          <p className="text-sm text-secondary">Este evento foi cancelado pelo organizador. Se você tinha inscrição ou ingresso, o valor será estornado.</p>
        </div>
      </div>
    );
  }
  if (evento.status === 'ENCERRADO') {
    return (
      <div className="ev-cta">
        <div className="ev-cta__body">
          <Badge tom="neutro" ponto>Evento encerrado</Badge>
          <p className="text-sm text-secondary">Este evento já aconteceu. Obrigado a todos que participaram!</p>
          <Link to="/explorar"><Button variante="secondary" bloco>Ver eventos futuros</Button></Link>
        </div>
      </div>
    );
  }

  const exigirLogin = (): boolean => {
    if (!autenticado) {
      toast.info('Entre para participar', 'Faça login ou crie uma conta.');
      navigate('/login', { state: { de: `/eventos/${evento.slug}` } });
      return true;
    }
    return false;
  };

  const inscrever = async () => {
    if (exigirLogin() || !usuario) return;
    setProcessando(true);
    try {
      const r = await services.registrations.inscrever(usuario.id, evento.id);
      setModalInscricao(false);
      if (r.status === 'LISTA_ESPERA') toast.aviso('Você entrou na lista de espera', 'Avisaremos se surgir vaga.');
      else toast.sucesso('Inscrição confirmada!', 'Ela já aparece na sua agenda.');
      onMudou();
    } catch (e) {
      toast.erro('Não foi possível inscrever', e instanceof ApiError ? e.message : undefined);
    } finally {
      setProcessando(false);
    }
  };

  const cancelarInscricao = async () => {
    if (!inscricao) return;
    setProcessando(true);
    try {
      await services.registrations.cancelar(inscricao.id);
      toast.sucesso('Inscrição cancelada');
      onMudou();
    } finally {
      setProcessando(false);
    }
  };

  // ---- Evento GRATUITO ----
  if (evento.gratuito) {
    return (
      <div className="ev-cta">
        <div className="ev-cta__head">
          <div className="row-between">
            <span className="ev-cta__preco">Gratuito</span>
            <Badge tom={disp.tom} ponto>{disp.rotulo}</Badge>
          </div>
          <div className="mt-4"><BarraVagas inscritos={evento.inscritos} capacidade={evento.capacidade} /></div>
        </div>
        <div className="ev-cta__body">
          {inscricao?.status === 'CONFIRMADA' ? (
            <>
              <div className="row gap-2" style={{ color: 'var(--success-600)' }}>
                <CheckCircle2 size={20} /> <strong>Inscrição confirmada</strong>
              </div>
              <p className="text-sm text-secondary">Você está confirmado neste evento. Ele já está na sua agenda.</p>
              <Button variante="outline-danger" bloco carregando={processando} onClick={cancelarInscricao}>Cancelar inscrição</Button>
            </>
          ) : inscricao?.status === 'LISTA_ESPERA' ? (
            <>
              <div className="row gap-2" style={{ color: 'var(--warning-600)' }}>
                <Hourglass size={20} /> <strong>Na lista de espera</strong>
              </div>
              <p className="text-sm text-secondary">Avisaremos assim que uma vaga for liberada.</p>
              <Button variante="outline-danger" bloco carregando={processando} onClick={cancelarInscricao}>Sair da lista</Button>
            </>
          ) : (
            <>
              <Button bloco tamanho="lg" carregando={processando} onClick={() => setModalInscricao(true)} iconeEsq={<CheckCircle2 size={18} />}>
                {disp.lotado ? 'Entrar na lista de espera' : 'Fazer inscrição'}
              </Button>
              <p className="text-xs text-muted row gap-1"><ShieldCheck size={13} /> Inscrição gratuita e simulada</p>
            </>
          )}
        </div>

        <Modal
          aberto={modalInscricao}
          onFechar={() => setModalInscricao(false)}
          titulo="Confirmar inscrição"
          footer={
            <>
              <Button variante="ghost" onClick={() => setModalInscricao(false)}>Voltar</Button>
              <Button carregando={processando} onClick={inscrever}>Confirmar inscrição</Button>
            </>
          }
        >
          <p className="text-secondary text-sm">Você está se inscrevendo em:</p>
          <div className="painel mt-2">
            <strong>{evento.titulo}</strong>
            <div className="text-sm text-secondary mt-1">{dataCompleta(evento.dataInicio)} · {hora(evento.dataInicio)}</div>
            <div className="text-sm text-secondary">{evento.local}</div>
          </div>
          {disp.lotado && <p className="text-sm mt-4" style={{ color: 'var(--warning-600)' }}>Evento lotado — você entrará na lista de espera.</p>}
        </Modal>
      </div>
    );
  }

  // ---- Evento PAGO ----
  return (
    <div className="ev-cta">
      <div className="ev-cta__head">
        <div className="row-between">
          <div>
            <div className="text-xs text-muted">A partir de</div>
            <span className="ev-cta__preco">{moeda(evento.precoAPartir)}</span>
          </div>
          <Badge tom={disp.tom} ponto>{disp.rotulo}</Badge>
        </div>
      </div>
      <div className="ev-cta__body">
        {evento.ingressos.map((ing) => {
          const loteAtivo = ing.lotes.find((l) => l.quantidadeDisponivel > 0) ?? ing.lotes[ing.lotes.length - 1];
          return (
            <div key={ing.id} className="ingresso-opcao">
              <div className="ingresso-opcao__row">
                <div>
                  <strong>{ing.nome}</strong>
                  <div className="ingresso-opcao__lote">
                    {loteAtivo.nome} · {loteAtivo.quantidadeDisponivel > 0 ? `${loteAtivo.quantidadeDisponivel} disponíveis` : 'Esgotado'}
                  </div>
                </div>
                <strong>{moeda(loteAtivo.preco)}</strong>
              </div>
            </div>
          );
        })}
        <Button
          bloco
          tamanho="lg"
          iconeEsq={<Ticket size={18} />}
          onClick={() => { if (!exigirLogin()) navigate(`/checkout/${evento.slug}`); }}
        >
          Comprar ingressos
        </Button>
        <p className="text-xs text-muted row gap-1"><ShieldCheck size={13} /> Checkout simulado — nenhum pagamento real</p>
      </div>
    </div>
  );
}
