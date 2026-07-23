/**
 * Contratos dos serviços.
 *
 * A interface é a mesma para os mocks (src/services/mocks) e para a API real
 * (src/services/api). Os componentes dependem SEMPRE destes contratos, nunca
 * de uma implementação concreta — por isso a troca mock↔API não exige mexer
 * na interface visual.
 */
import type {
  Campus,
  Categoria,
  Compra,
  Cupom,
  Evento,
  EventoFiltros,
  IngressoEmitido,
  Inscricao,
  MetodoPagamento,
  Organizador,
  Paginado,
  StatusIngresso,
  Tag,
  Universidade,
  Usuario,
} from '@/types';

export interface AuthService {
  login(email: string, senha: string): Promise<Usuario>;
  loginDemo(usuarioId: number): Promise<Usuario>;
  registrar(dados: { nome: string; email: string; senha: string; telefone?: string }): Promise<Usuario>;
  recuperarSenha(email: string): Promise<void>;
  me(usuarioId: number): Promise<Usuario>;
}

export interface EventService {
  listar(filtros?: EventoFiltros, pagina?: number, porPagina?: number): Promise<Paginado<Evento>>;
  destaques(): Promise<Evento[]>;
  porSlug(slug: string): Promise<Evento>;
  porId(id: number): Promise<Evento>;
  porOrganizador(organizadorId: number): Promise<Evento[]>;
  criar(evento: Partial<Evento>): Promise<Evento>;
  atualizar(id: number, patch: Partial<Evento>): Promise<Evento>;
  publicar(id: number): Promise<Evento>;
  cancelar(id: number): Promise<Evento>;
  duplicar(id: number): Promise<Evento>;
}

export interface RegistrationService {
  doUsuario(usuarioId: number): Promise<Inscricao[]>;
  status(usuarioId: number, eventoId: number): Promise<Inscricao | null>;
  inscrever(usuarioId: number, eventoId: number): Promise<Inscricao>;
  cancelar(inscricaoId: number): Promise<Inscricao>;
  participantesDoEvento(eventoId: number): Promise<Inscricao[]>;
}

export interface CouponService {
  validar(codigo: string, eventoId: number): Promise<Cupom>;
  doEvento(eventoId: number): Promise<Cupom[]>;
  doOrganizador(organizadorId: number): Promise<Cupom[]>;
  salvar(cupom: Partial<Cupom>): Promise<Cupom>;
  alternarAtivo(id: number): Promise<Cupom>;
}

export interface PurchaseInput {
  usuarioId: number;
  eventoId: number;
  itens: { ingressoId: number; loteId: number; quantidade: number }[];
  cupomCodigo?: string;
  metodo: MetodoPagamento;
}

export interface PurchaseService {
  doUsuario(usuarioId: number): Promise<Compra[]>;
  criar(input: PurchaseInput): Promise<Compra>;
  cancelar(compraId: number): Promise<Compra>;
}

export interface TicketService {
  doUsuario(usuarioId: number): Promise<IngressoEmitido[]>;
  doEvento(eventoId: number): Promise<IngressoEmitido[]>;
}

export interface CheckInService {
  consultar(codigoQR: string): Promise<IngressoEmitido>;
  registrar(codigoQR: string, responsavel: string): Promise<IngressoEmitido>;
  doEvento(eventoId: number): Promise<IngressoEmitido[]>;
}

export interface OrganizerService {
  listar(): Promise<Organizador[]>;
  destaques(): Promise<Organizador[]>;
  porId(id: number): Promise<Organizador>;
}

export interface CatalogService {
  universidades(): Promise<Universidade[]>;
  campi(universidadeId?: number): Promise<Campus[]>;
  categorias(): Promise<Categoria[]>;
  tags(): Promise<Tag[]>;
}

export interface AdminService {
  usuarios(): Promise<Usuario[]>;
  alternarUsuarioAtivo(id: number): Promise<Usuario>;
  removerUsuario(id: number): Promise<void>;
  salvarCategoria(categoria: Partial<Categoria>): Promise<Categoria>;
  removerCategoria(id: number): Promise<void>;
  salvarUniversidade(u: Partial<Universidade>): Promise<Universidade>;
  salvarCampus(c: Partial<Campus>): Promise<Campus>;
  metricas(): Promise<{
    totalEventos: number;
    eventosPublicados: number;
    totalUsuarios: number;
    totalOrganizadores: number;
    ingressosVendidos: number;
    receita: number;
  }>;
}

export interface Services {
  auth: AuthService;
  events: EventService;
  registrations: RegistrationService;
  coupons: CouponService;
  purchases: PurchaseService;
  tickets: TicketService;
  checkin: CheckInService;
  organizers: OrganizerService;
  catalog: CatalogService;
  admin: AdminService;
  /** utilidades de demonstração (reset de dados) */
  demo: { reset(): Promise<void> };
}

/** Status de check-in derivado usado pela tela de leitura de QR. */
export type CheckInResultado =
  | { tipo: 'VALIDO'; ingresso: IngressoEmitido }
  | { tipo: 'JA_UTILIZADO'; ingresso: IngressoEmitido }
  | { tipo: 'CANCELADO'; ingresso: IngressoEmitido }
  | { tipo: 'INEXISTENTE' };

export type { StatusIngresso };
