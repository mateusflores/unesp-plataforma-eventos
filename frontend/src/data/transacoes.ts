import type {
  Inscricao,
  Cupom,
  Compra,
  IngressoEmitido,
} from '@/types';

// ---- Inscrições (eventos gratuitos) do participante Ana (id 1) ----
export const inscricoes: Inscricao[] = [
  { id: 1, usuarioId: 1, eventoId: 3, data: '2026-07-02T10:12:00', status: 'CONFIRMADA' },
  { id: 2, usuarioId: 1, eventoId: 4, data: '2026-07-05T18:40:00', status: 'LISTA_ESPERA' },
  { id: 3, usuarioId: 1, eventoId: 7, data: '2026-07-08T09:05:00', status: 'CONFIRMADA' },
  { id: 4, usuarioId: 1, eventoId: 12, data: '2026-06-10T14:00:00', status: 'CONFIRMADA' },
  { id: 5, usuarioId: 4, eventoId: 14, data: '2026-07-06T11:20:00', status: 'CONFIRMADA' },
  { id: 6, usuarioId: 5, eventoId: 7, data: '2026-07-08T20:00:00', status: 'CONFIRMADA' },
  { id: 7, usuarioId: 4, eventoId: 3, data: '2026-07-03T08:00:00', status: 'CANCELADA' },
];

// ---- Cupons ----
export const cupons: Cupom[] = [
  { id: 1, eventoId: 1, codigo: 'CALOURO10', tipo: 'PERCENTUAL', valor: 10, validade: '2026-07-12T23:59:59', quantidadeMaxima: 100, quantidadeUsada: 34, ativo: true },
  { id: 2, eventoId: 2, codigo: 'ATLETICA20', tipo: 'PERCENTUAL', valor: 20, validade: '2026-07-18T20:00:00', quantidadeMaxima: 200, quantidadeUsada: 200, ativo: true },
  { id: 3, eventoId: 1, codigo: 'PARCEIRO15', tipo: 'VALOR_FIXO', valor: 15, validade: '2026-06-30T23:59:59', quantidadeMaxima: 50, quantidadeUsada: 12, ativo: false },
  { id: 4, eventoId: 10, codigo: 'HACK2026', tipo: 'PERCENTUAL', valor: 15, validade: '2026-08-08T12:00:00', quantidadeMaxima: 80, quantidadeUsada: 9, ativo: true },
  { id: 5, eventoId: 6, codigo: 'TORCIDA5', tipo: 'VALOR_FIXO', valor: 5, validade: '2026-07-25T07:00:00', quantidadeMaxima: 300, quantidadeUsada: 60, ativo: true },
];

// ---- Compras (ingressos pagos) ----
export const compras: Compra[] = [
  {
    id: 1,
    usuarioId: 1,
    eventoId: 1,
    data: '2026-07-06T15:22:00',
    itens: [
      { id: 1, ingressoId: 1, loteId: 2, descricao: 'Passaporte Completo — 2º Lote', quantidade: 1, valorUnitario: 60 },
    ],
    cupomId: 1,
    desconto: 6,
    valorTotal: 54,
    status: 'PAGO',
    pagamento: { id: 1, metodo: 'PIX', status: 'APROVADO', data: '2026-07-06T15:23:10', valor: 54 },
  },
  {
    id: 2,
    usuarioId: 1,
    eventoId: 2,
    data: '2026-07-09T21:00:00',
    itens: [
      { id: 2, ingressoId: 3, loteId: 5, descricao: 'Pista — 2º Lote', quantidade: 2, valorUnitario: 90 },
    ],
    desconto: 0,
    valorTotal: 180,
    status: 'PENDENTE',
    pagamento: { id: 2, metodo: 'BOLETO', status: 'EM_ANALISE', data: '2026-07-09T21:01:00', valor: 180 },
  },
  {
    id: 3,
    usuarioId: 4,
    eventoId: 9,
    data: '2026-07-07T10:00:00',
    itens: [
      { id: 3, ingressoId: 6, loteId: 8, descricao: 'Inscrição com certificado — Único', quantidade: 1, valorUnitario: 10 },
    ],
    desconto: 0,
    valorTotal: 10,
    status: 'PAGO',
    pagamento: { id: 3, metodo: 'CARTAO', status: 'APROVADO', data: '2026-07-07T10:01:00', valor: 10 },
  },
  {
    id: 4,
    usuarioId: 1,
    eventoId: 6,
    data: '2026-07-01T12:00:00',
    itens: [
      { id: 4, ingressoId: 5, loteId: 7, descricao: 'Torcida — Único', quantidade: 1, valorUnitario: 15 },
    ],
    desconto: 0,
    valorTotal: 15,
    status: 'CANCELADO',
    pagamento: { id: 4, metodo: 'CARTAO', status: 'RECUSADO', data: '2026-07-01T12:01:00', valor: 15 },
  },
];

// ---- Ingressos emitidos + check-ins ----
export const ingressosEmitidos: IngressoEmitido[] = [
  {
    id: 1,
    compraId: 1,
    itemCompraId: 1,
    usuarioId: 1,
    eventoId: 1,
    ingressoNome: 'Passaporte Completo',
    loteNome: '2º Lote',
    codigoQR: 'AGORA-1-A1B2C3',
    status: 'VALIDO',
    dataEmissao: '2026-07-06T15:23:20',
  },
  {
    id: 2,
    compraId: 3,
    itemCompraId: 3,
    usuarioId: 4,
    eventoId: 9,
    ingressoNome: 'Inscrição com certificado',
    loteNome: 'Único',
    codigoQR: 'AGORA-9-D4E5F6',
    status: 'UTILIZADO',
    dataEmissao: '2026-07-07T10:01:10',
    checkIn: { id: 1, ingressoEmitidoId: 2, dataHora: '2026-07-14T13:52:00', responsavel: 'Bruno Carvalho Lima' },
  },
  {
    id: 3,
    compraId: 4,
    itemCompraId: 4,
    usuarioId: 1,
    eventoId: 6,
    ingressoNome: 'Torcida',
    loteNome: 'Único',
    codigoQR: 'AGORA-6-G7H8I9',
    status: 'CANCELADO',
    dataEmissao: '2026-07-01T12:01:10',
  },
];
