import { useEffect, useState } from 'react';
import { QrCode, Search, CheckCircle2, XCircle, AlertTriangle, ScanLine, UserCheck } from 'lucide-react';
import { services, ApiError } from '@/services';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { useEventosDoOrganizador } from '@/hooks/useOrganizer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge, Button, Select, Input } from '@/components/ui';
import { dataHora } from '@/utils/format';
import { statusIngressoInfo } from '@/utils/dominio';
import type { IngressoEmitido } from '@/types';

type Resultado =
  | { tipo: 'idle' }
  | { tipo: 'buscando' }
  | { tipo: 'inexistente' }
  | { tipo: 'encontrado'; ingresso: IngressoEmitido };

export function OrgCheckInPage() {
  const { usuario } = useAuth();
  const toast = useToast();
  const eventosAsync = useEventosDoOrganizador();
  const [eventoId, setEventoId] = useState<number | null>(null);
  const [codigo, setCodigo] = useState('');
  const [resultado, setResultado] = useState<Resultado>({ tipo: 'idle' });
  const [amostras, setAmostras] = useState<IngressoEmitido[]>([]);
  const [confirmando, setConfirmando] = useState(false);

  const eventos = eventosAsync.data ?? [];
  useEffect(() => {
    if (!eventoId && eventos.length) setEventoId(eventos[0].id);
  }, [eventos, eventoId]);

  useEffect(() => {
    if (eventoId) services.tickets.doEvento(eventoId).then(setAmostras);
  }, [eventoId]);

  const consultar = async (cod: string) => {
    if (!cod.trim()) return;
    setResultado({ tipo: 'buscando' });
    try {
      const ing = await services.checkin.consultar(cod);
      setResultado({ tipo: 'encontrado', ingresso: ing });
    } catch {
      setResultado({ tipo: 'inexistente' });
    }
  };

  const confirmar = async (cod: string) => {
    setConfirmando(true);
    try {
      const ing = await services.checkin.registrar(cod, usuario?.nome ?? 'Organizador');
      setResultado({ tipo: 'encontrado', ingresso: ing });
      toast.sucesso('Check-in confirmado!', 'Ingresso marcado como utilizado.');
      if (eventoId) services.tickets.doEvento(eventoId).then(setAmostras);
    } catch (e) {
      toast.erro('Não foi possível', e instanceof ApiError ? e.message : undefined);
    } finally {
      setConfirmando(false);
    }
  };

  return (
    <div>
      <PageHeader titulo="Check-in" subtitulo="Leia o QR Code (simulado) ou consulte manualmente pelo código do ingresso." />

      <div className="checkout-grid">
        <div className="col gap-4">
          <div className="painel">
            <Select label="Evento" value={eventoId ?? ''} onChange={(e) => setEventoId(Number(e.target.value))}>
              {eventos.map((e) => <option key={e.id} value={e.id}>{e.titulo}</option>)}
            </Select>

            <div className="scanner mt-4">
              <ScanLine size={40} />
              <span className="scanner__line" />
              <p className="text-sm text-secondary mt-2">Área de leitura de QR Code (simulada)</p>
            </div>

            <form className="row gap-2 mt-4" onSubmit={(e) => { e.preventDefault(); consultar(codigo); }}>
              <Input className="grow" value={codigo} onChange={(e) => setCodigo(e.target.value.toUpperCase())} placeholder="AGORA-1-XXXXXX" icone={<Search size={16} />} />
              <Button type="submit" iconeEsq={<QrCode size={16} />}>Consultar</Button>
            </form>

            {amostras.length > 0 && (
              <div className="mt-4">
                <div className="text-xs text-muted mb-2">Códigos de exemplo (clique para testar):</div>
                <div className="row gap-2 wrap">
                  {amostras.slice(0, 4).map((a) => (
                    <button key={a.id} className="chip" onClick={() => { setCodigo(a.codigoQR); consultar(a.codigoQR); }}>
                      {a.codigoQR}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Resultado */}
        <div className="painel">
          <strong className="text-sm">Resultado</strong>
          <div className="mt-4">
            {resultado.tipo === 'idle' && <p className="text-sm text-muted">Consulte um ingresso para ver o resultado.</p>}
            {resultado.tipo === 'buscando' && <p className="text-sm text-secondary">Verificando…</p>}
            {resultado.tipo === 'inexistente' && (
              <ResultBox cor="var(--danger-500)" bg="var(--tom-perigo-bg)" icone={<XCircle size={28} />} titulo="Ingresso inexistente" texto="Nenhum ingresso corresponde a este código." />
            )}
            {resultado.tipo === 'encontrado' && <IngressoResultado ingresso={resultado.ingresso} confirmando={confirmando} onConfirmar={() => confirmar(resultado.ingresso.codigoQR)} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function IngressoResultado({ ingresso, confirmando, onConfirmar }: { ingresso: IngressoEmitido; confirmando: boolean; onConfirmar: () => void }) {
  const info = statusIngressoInfo[ingresso.status];
  if (ingresso.status === 'CANCELADO')
    return <ResultBox cor="var(--danger-500)" bg="var(--tom-perigo-bg)" icone={<XCircle size={28} />} titulo="Ingresso cancelado" texto="Este ingresso foi cancelado e não permite entrada." />;
  if (ingresso.status === 'UTILIZADO')
    return (
      <>
        <ResultBox cor="var(--warning-500)" bg="var(--tom-aviso-bg)" icone={<AlertTriangle size={28} />} titulo="Ingresso já utilizado" texto={ingresso.checkIn ? `Check-in em ${dataHora(ingresso.checkIn.dataHora)}` : 'Já passou pela entrada.'} />
        <Detalhes ingresso={ingresso} />
      </>
    );
  return (
    <>
      <ResultBox cor="var(--success-500)" bg="var(--tom-sucesso-bg)" icone={<CheckCircle2 size={28} />} titulo="Ingresso válido" texto="Pronto para check-in." />
      <Detalhes ingresso={ingresso} />
      <Button bloco className="mt-4" carregando={confirmando} onClick={onConfirmar} iconeEsq={<UserCheck size={16} />}>Confirmar check-in</Button>
      <div className="mt-2"><Badge tom={info.tom} ponto>{info.rotulo}</Badge></div>
    </>
  );
}

function Detalhes({ ingresso }: { ingresso: IngressoEmitido }) {
  return (
    <div className="painel mt-4">
      <div className="def-list">
        <div className="def-list__row"><span>Ingresso</span><span>{ingresso.ingressoNome} · {ingresso.loteNome}</span></div>
        <div className="def-list__row"><span>Código</span><span>{ingresso.codigoQR}</span></div>
        <div className="def-list__row"><span>Emitido em</span><span>{dataHora(ingresso.dataEmissao)}</span></div>
      </div>
    </div>
  );
}

function ResultBox({ cor, bg, icone, titulo, texto }: { cor: string; bg: string; icone: React.ReactNode; titulo: string; texto: string }) {
  return (
    <div className="center" style={{ flexDirection: 'column', gap: 'var(--sp-2)', textAlign: 'center', padding: 'var(--sp-4) 0' }}>
      <div className="state-panel__icon" style={{ color: cor, background: bg }}>{icone}</div>
      <strong>{titulo}</strong>
      <p className="text-sm text-secondary">{texto}</p>
    </div>
  );
}
