/* =========================================================================
   ÁGORA · TIPOS DE DOMÍNIO
   Modelagem baseada em plantuml.txt. Nomes de campos coerentes com o domínio.
   Estes tipos são consumidos pela camada de serviços (mock e API real).
   ========================================================================= */

// ---- Enums ----
export type TipoUsuario = 'ADMIN' | 'ORGANIZADOR' | 'PARTICIPANTE';

export type TipoEntidade =
  | 'ATLETICA'
  | 'CENTRO_ACADEMICO'
  | 'EMPRESA_JUNIOR'
  | 'COMISSAO'
  | 'OUTRO';

export type StatusEvento = 'RASCUNHO' | 'PUBLICADO' | 'CANCELADO' | 'ENCERRADO';

export type TipoDesconto = 'PERCENTUAL' | 'VALOR_FIXO';

export type StatusCompra = 'PENDENTE' | 'PAGO' | 'CANCELADO';

export type MetodoPagamento = 'PIX' | 'CARTAO' | 'BOLETO';

export type StatusPagamento = 'APROVADO' | 'RECUSADO' | 'EM_ANALISE';

export type StatusIngresso = 'VALIDO' | 'UTILIZADO' | 'CANCELADO';

export type StatusInscricao = 'CONFIRMADA' | 'CANCELADA' | 'LISTA_ESPERA';

// ---- Entidades base ----
export interface Universidade {
  id: number;
  nome: string;
  sigla: string;
  logoCor: string;
}

export interface Campus {
  id: number;
  universidadeId: number;
  nome: string;
  cidade: string;
  estado: string;
}

export interface Endereco {
  id: number;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  complemento?: string;
}

export interface Categoria {
  id: number;
  nome: string;
  slug: string;
  /** variável CSS de cor (ex.: --cat-festa) */
  cor: string;
  icone: string;
}

export interface Tag {
  id: number;
  nome: string;
}

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  tipo: TipoUsuario;
  ativo: boolean;
  avatarCor: string;
  universidadeId?: number;
  campusId?: number;
  curso?: string;
  /** entidades das quais o usuário é membro */
  entidadesIds?: number[];
}

/** Organizador é abstrato: pode ser um usuário individual ou uma entidade. */
export interface Organizador {
  id: number;
  tipo: 'USUARIO' | 'ENTIDADE';
  nome: string;
  descricao: string;
  avatarCor: string;
  /** presente quando tipo === 'USUARIO' */
  usuarioId?: number;
  /** presente quando tipo === 'ENTIDADE' */
  entidade?: {
    tipo: TipoEntidade;
    emailContato: string;
  };
  verificado?: boolean;
  eventosRealizados?: number;
}

// ---- Ingressos e lotes ----
export interface Lote {
  id: number;
  ingressoId: number;
  nome: string;
  preco: number;
  quantidadeTotal: number;
  quantidadeDisponivel: number;
  dataInicio: string; // ISO
  dataFim: string; // ISO
}

export interface Ingresso {
  id: number;
  eventoId: number;
  nome: string;
  descricao: string;
  lotes: Lote[];
}

// ---- Evento ----
export interface Evento {
  id: number;
  titulo: string;
  slug: string;
  descricao: string;
  resumo: string;
  dataInicio: string; // ISO
  dataFim: string; // ISO
  capacidade: number;
  inscritos: number;
  publico: boolean;
  gratuito: boolean;
  status: StatusEvento;
  imagemCapa: string;
  organizadorId: number;
  universidadeId: number;
  campusId: number;
  endereco: Endereco;
  local: string;
  categoriaIds: number[];
  tagIds: number[];
  ingressos: Ingresso[];
  /** menor preço entre lotes ativos (0 quando gratuito) */
  precoAPartir: number;
  temListaEspera: boolean;
  destaque?: boolean;
}

// ---- Inscrição (evento gratuito) ----
export interface Inscricao {
  id: number;
  usuarioId: number;
  eventoId: number;
  data: string; // ISO
  status: StatusInscricao;
}

// ---- Cupom ----
export interface Cupom {
  id: number;
  eventoId?: number;
  codigo: string;
  tipo: TipoDesconto;
  valor: number;
  validade: string; // ISO
  quantidadeMaxima: number;
  quantidadeUsada: number;
  ativo: boolean;
}

// ---- Compra / Pagamento ----
export interface ItemCompra {
  id: number;
  ingressoId: number;
  loteId: number;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
}

export interface Pagamento {
  id: number;
  metodo: MetodoPagamento;
  status: StatusPagamento;
  data: string; // ISO
  valor: number;
}

export interface Compra {
  id: number;
  usuarioId: number;
  eventoId: number;
  data: string; // ISO
  itens: ItemCompra[];
  cupomId?: number;
  desconto: number;
  valorTotal: number;
  status: StatusCompra;
  pagamento?: Pagamento;
}

// ---- Ingresso emitido / Check-in ----
export interface CheckIn {
  id: number;
  ingressoEmitidoId: number;
  dataHora: string; // ISO
  responsavel?: string;
}

export interface IngressoEmitido {
  id: number;
  compraId: number;
  itemCompraId: number;
  usuarioId: number;
  eventoId: number;
  ingressoNome: string;
  loteNome: string;
  codigoQR: string;
  status: StatusIngresso;
  dataEmissao: string; // ISO
  checkIn?: CheckIn;
}

// ---- Utilitários de apresentação ----
export interface Paginado<T> {
  itens: T[];
  total: number;
  pagina: number;
  porPagina: number;
}

export interface EventoFiltros {
  busca?: string;
  universidadeId?: number;
  campusId?: number;
  categoriaIds?: number[];
  gratuito?: boolean;
  status?: StatusEvento;
  organizadorId?: number;
  dataInicio?: string;
  dataFim?: string;
  somenteDestaque?: boolean;
}
