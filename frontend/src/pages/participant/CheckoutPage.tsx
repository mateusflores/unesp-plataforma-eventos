import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Minus, Plus, Tag, ArrowLeft, ArrowRight, Ticket, QrCode, CreditCard, Barcode, CheckCircle2, XCircle, Hourglass } from 'lucide-react';
import { services, ApiError } from '@/services';
import { useAsync } from '@/hooks/useAsync';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Button, Input, Stepper, Skeleton, ErrorState, Badge } from '@/components/ui';
import { moeda, dataCompleta, hora } from '@/utils/format';
import { metodoPagamentoRotulo } from '@/utils/dominio';
import type { Evento, Cupom, MetodoPagamento, Compra } from '@/types';

const ETAPAS = ['Ingressos', 'Pagamento', 'Confirmação'];

export function CheckoutPage() {
  const { slug = '' } = useParams();
  const { data, estado, statusHttp, erro, recarregar } = useAsync(() => services.events.porSlug(slug), [slug]);

  if (estado === 'loading' || estado === 'idle')
    return <div className="container section-sm"><Skeleton h={400} radius="var(--radius-lg)" /></div>;
  if (estado === 'error' || !data)
    return <div className="container section-sm"><ErrorState status={statusHttp} mensagem={erro} onRetry={recarregar} /></div>;
  if (data.gratuito || data.ingressos.length === 0)
    return (
      <div className="container section-sm">
        <ErrorState status={404} mensagem="Este evento não vende ingressos. Ele é gratuito — faça sua inscrição na página do evento." />
        <div className="center mt-4"><Link to={`/eventos/${data.slug}`}><Button>Ir para o evento</Button></Link></div>
      </div>
    );
  return <Checkout evento={data} />;
}

function Checkout({ evento }: { evento: Evento }) {
  const { usuario } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [etapa, setEtapa] = useState(0);
  const [quantidades, setQuantidades] = useState<Record<number, number>>({}); // loteId -> qtd
  const [cupomInput, setCupomInput] = useState('');
  const [cupom, setCupom] = useState<Cupom | null>(null);
  const [cupomErro, setCupomErro] = useState<string | null>(null);
  const [validandoCupom, setValidandoCupom] = useState(false);
  const [metodo, setMetodo] = useState<MetodoPagamento>('PIX');
  const [processando, setProcessando] = useState(false);
  const [resultado, setResultado] = useState<Compra | null>(null);

  const lotes = useMemo(
    () => evento.ingressos.flatMap((ing) => ing.lotes.map((l) => ({ ing, lote: l }))),
    [evento],
  );

  const setQtd = (loteId: number, delta: number, max: number) =>
    setQuantidades((q) => {
      const atual = q[loteId] ?? 0;
      const novo = Math.max(0, Math.min(max, atual + delta));
      return { ...q, [loteId]: novo };
    });

  const itensSelecionados = lotes
    .map(({ ing, lote }) => ({ ing, lote, qtd: quantidades[lote.id] ?? 0 }))
    .filter((x) => x.qtd > 0);

  const subtotal = itensSelecionados.reduce((s, x) => s + x.lote.preco * x.qtd, 0);
  const desconto = cupom
    ? cupom.tipo === 'PERCENTUAL'
      ? Math.round(subtotal * (cupom.valor / 100) * 100) / 100
      : Math.min(cupom.valor, subtotal)
    : 0;
  const total = Math.max(0, subtotal - desconto);
  const temItens = itensSelecionados.length > 0;

  const validarCupom = async () => {
    if (!cupomInput.trim()) return;
    setValidandoCupom(true);
    setCupomErro(null);
    try {
      const c = await services.coupons.validar(cupomInput, evento.id);
      setCupom(c);
      toast.sucesso('Cupom aplicado!', `Desconto de ${c.tipo === 'PERCENTUAL' ? `${c.valor}%` : moeda(c.valor)}`);
    } catch (e) {
      setCupom(null);
      setCupomErro(e instanceof ApiError ? e.message : 'Cupom inválido.');
    } finally {
      setValidandoCupom(false);
    }
  };

  const finalizar = async () => {
    if (!usuario) return;
    setProcessando(true);
    try {
      const compra = await services.purchases.criar({
        usuarioId: usuario.id,
        eventoId: evento.id,
        itens: itensSelecionados.map((x) => ({ ingressoId: x.ing.id, loteId: x.lote.id, quantidade: x.qtd })),
        cupomCodigo: cupom?.codigo,
        metodo,
      });
      setResultado(compra);
      setEtapa(2);
    } catch (e) {
      toast.erro('Falha ao processar', e instanceof ApiError ? e.message : undefined);
    } finally {
      setProcessando(false);
    }
  };

  const metodos: { valor: MetodoPagamento; icone: React.ReactNode }[] = [
    { valor: 'PIX', icone: <QrCode size={22} /> },
    { valor: 'CARTAO', icone: <CreditCard size={22} /> },
    { valor: 'BOLETO', icone: <Barcode size={22} /> },
  ];

  return (
    <div className="container section-sm">
      <Link to={`/eventos/${evento.slug}`} className="row gap-2 text-sm text-secondary mb-4" style={{ width: 'fit-content' }}>
        <ArrowLeft size={16} /> Voltar ao evento
      </Link>

      <div className="mb-6"><Stepper etapas={ETAPAS} atual={etapa} /></div>

      <div className="checkout-grid">
        <div>
          {etapa === 0 && (
            <div className="painel">
              <h2 style={{ fontSize: 'var(--fs-lg)', marginBottom: 'var(--sp-4)' }}>Escolha seus ingressos</h2>
              <div className="col gap-4">
                {lotes.map(({ ing, lote }) => {
                  const esgotado = lote.quantidadeDisponivel <= 0;
                  const qtd = quantidades[lote.id] ?? 0;
                  return (
                    <div key={lote.id} className="ingresso-opcao">
                      <div className="ingresso-opcao__row">
                        <div>
                          <strong>{ing.nome} · {lote.nome}</strong>
                          <div className="ingresso-opcao__lote">{ing.descricao}</div>
                          <div className="text-xs text-muted mt-1">
                            {esgotado ? 'Esgotado' : `${lote.quantidadeDisponivel} disponíveis`}
                          </div>
                        </div>
                        <div className="col gap-2" style={{ alignItems: 'flex-end' }}>
                          <strong>{moeda(lote.preco)}</strong>
                          <div className="qtd">
                            <button onClick={() => setQtd(lote.id, -1, lote.quantidadeDisponivel)} disabled={qtd === 0} aria-label="Diminuir"><Minus size={15} /></button>
                            <span>{qtd}</span>
                            <button onClick={() => setQtd(lote.id, 1, lote.quantidadeDisponivel)} disabled={esgotado || qtd >= lote.quantidadeDisponivel} aria-label="Aumentar"><Plus size={15} /></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {etapa === 1 && (
            <div className="painel">
              <h2 style={{ fontSize: 'var(--fs-lg)', marginBottom: 'var(--sp-4)' }}>Forma de pagamento</h2>
              <div className="pgto-metodos">
                {metodos.map((m) => (
                  <button
                    key={m.valor}
                    className={`pgto-metodo ${metodo === m.valor ? 'pgto-metodo--ativo' : ''}`}
                    onClick={() => setMetodo(m.valor)}
                  >
                    {m.icone}
                    {metodoPagamentoRotulo[m.valor]}
                  </button>
                ))}
              </div>

              <div className="mt-6">
                {metodo === 'PIX' && <p className="text-sm text-secondary">Ao confirmar, geraríamos um QR Code Pix (simulado). O pagamento é aprovado na hora nesta demonstração.</p>}
                {metodo === 'CARTAO' && (
                  <div className="form-grid mt-2">
                    <Input className="col-span" label="Número do cartão" placeholder="0000 0000 0000 0000" disabled />
                    <Input label="Validade" placeholder="MM/AA" disabled />
                    <Input label="CVV" placeholder="123" disabled />
                    <div className="col-span text-xs text-muted">Campos ilustrativos — nenhum dado real é processado.</div>
                  </div>
                )}
                {metodo === 'BOLETO' && <p className="text-sm text-secondary">Um boleto seria gerado com vencimento em 3 dias úteis (simulado). A compra fica <strong>em análise</strong> até a compensação.</p>}
              </div>
            </div>
          )}

          {etapa === 2 && resultado && <ResultadoCompra compra={resultado} evento={evento} onVerIngressos={() => navigate('/meus-ingressos')} onVerAgenda={() => navigate('/minha-agenda')} />}
        </div>

        {/* Resumo */}
        {etapa < 2 && (
          <div className="resumo">
            <div className="resumo__head">
              <strong>{evento.titulo}</strong>
              <div className="text-sm text-secondary mt-1">{dataCompleta(evento.dataInicio)} · {hora(evento.dataInicio)}</div>
            </div>
            <div className="resumo__body">
              {temItens ? (
                itensSelecionados.map((x) => (
                  <div key={x.lote.id} className="resumo__linha">
                    <span>{x.qtd}× {x.ing.nome} <span className="text-muted">({x.lote.nome})</span></span>
                    <span>{moeda(x.lote.preco * x.qtd)}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted">Selecione ao menos um ingresso.</p>
              )}

              {/* Cupom */}
              <div className="mt-2">
                <div className="row gap-2">
                  <span className="busca-inline" style={{ height: 42 }}>
                    <Tag size={16} />
                    <input value={cupomInput} onChange={(e) => setCupomInput(e.target.value.toUpperCase())} placeholder="Cupom" aria-label="Cupom" disabled={!!cupom} />
                  </span>
                  {cupom ? (
                    <Button variante="ghost" onClick={() => { setCupom(null); setCupomInput(''); }}>Remover</Button>
                  ) : (
                    <Button variante="secondary" onClick={validarCupom} carregando={validandoCupom} disabled={!temItens}>Aplicar</Button>
                  )}
                </div>
                {cupomErro && <div className="field__error mt-2">{cupomErro}</div>}
                {cupom && <div className="mt-2"><Badge tom="sucesso" ponto>Cupom {cupom.codigo} aplicado</Badge></div>}
              </div>

              <div className="resumo__linha mt-2"><span>Subtotal</span><span>{moeda(subtotal)}</span></div>
              {desconto > 0 && <div className="resumo__linha"><span>Desconto</span><span className="resumo__desc">− {moeda(desconto)}</span></div>}
              <div className="resumo__linha resumo__linha--total"><span>Total</span><span>{moeda(total)}</span></div>

              {etapa === 0 && (
                <Button bloco tamanho="lg" disabled={!temItens} onClick={() => setEtapa(1)} iconeDir={<ArrowRight size={18} />}>Continuar</Button>
              )}
              {etapa === 1 && (
                <>
                  <Button bloco tamanho="lg" carregando={processando} onClick={finalizar} iconeEsq={<Ticket size={18} />}>
                    {total > 0 ? `Pagar ${moeda(total)}` : 'Finalizar'}
                  </Button>
                  <Button bloco variante="ghost" onClick={() => setEtapa(0)}>Voltar</Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ResultadoCompra({
  compra,
  evento,
  onVerIngressos,
  onVerAgenda,
}: {
  compra: Compra;
  evento: Evento;
  onVerIngressos: () => void;
  onVerAgenda: () => void;
}) {
  const status = compra.pagamento?.status ?? 'EM_ANALISE';
  const cfg = {
    APROVADO: { icone: <CheckCircle2 size={40} />, cor: 'var(--success-500)', bg: 'var(--tom-sucesso-bg)', titulo: 'Pagamento aprovado!', texto: 'Seus ingressos foram emitidos e já estão em “Meus ingressos”.' },
    RECUSADO: { icone: <XCircle size={40} />, cor: 'var(--danger-500)', bg: 'var(--tom-perigo-bg)', titulo: 'Pagamento recusado', texto: 'Não foi possível aprovar o pagamento. Tente outro método (simulação).' },
    EM_ANALISE: { icone: <Hourglass size={40} />, cor: 'var(--warning-500)', bg: 'var(--tom-aviso-bg)', titulo: 'Pagamento em análise', texto: 'Assim que for compensado, seus ingressos serão liberados. A compra está pendente.' },
  }[status];

  return (
    <div className="painel center" style={{ flexDirection: 'column', textAlign: 'center', gap: 'var(--sp-3)', padding: 'var(--sp-10)' }}>
      <div className="state-panel__icon" style={{ width: 80, height: 80, color: cfg.cor, background: cfg.bg }}>{cfg.icone}</div>
      <h2>{cfg.titulo}</h2>
      <p className="text-secondary" style={{ maxWidth: 420 }}>{cfg.texto}</p>
      <div className="painel" style={{ width: '100%', maxWidth: 380, marginTop: 'var(--sp-2)' }}>
        <div className="def-list">
          <div className="def-list__row"><span>Evento</span><span>{evento.titulo}</span></div>
          <div className="def-list__row"><span>Pedido</span><span>#{compra.id}</span></div>
          <div className="def-list__row"><span>Método</span><span>{metodoPagamentoRotulo[compra.pagamento!.metodo]}</span></div>
          <div className="def-list__row"><span>Total</span><span>{moeda(compra.valorTotal)}</span></div>
        </div>
      </div>
      <div className="row gap-3 mt-2 wrap center">
        {status === 'APROVADO' && <Button onClick={onVerIngressos} iconeEsq={<Ticket size={16} />}>Ver meus ingressos</Button>}
        <Button variante="secondary" onClick={onVerAgenda}>Ir para minha agenda</Button>
      </div>
    </div>
  );
}
