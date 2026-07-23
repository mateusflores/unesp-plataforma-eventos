/**
 * Implementação da API real (REST).
 *
 * Segue exatamente o contrato de `Services`. Os endpoints abaixo são uma
 * proposta de mapeamento — quando o back-end existir, basta ajustá-los.
 * Enquanto VITE_USE_MOCKS=true, este arquivo NÃO é utilizado.
 */
import { http } from './http';
import type { Services } from '@/services/contracts';

const qs = (params: Record<string, unknown>): string => {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    if (Array.isArray(v)) v.forEach((item) => sp.append(k, String(item)));
    else sp.append(k, String(v));
  });
  const s = sp.toString();
  return s ? `?${s}` : '';
};

export const apiServices: Services = {
  auth: {
    login: (email, senha) => http.post('/auth/login', { email, senha }),
    loginDemo: (usuarioId) => http.post('/auth/demo', { usuarioId }),
    registrar: (dados) => http.post('/auth/registrar', dados),
    recuperarSenha: (email) => http.post('/auth/recuperar-senha', { email }),
    me: (usuarioId) => http.get(`/usuarios/${usuarioId}`),
  },
  events: {
    listar: (filtros = {}, pagina = 1, porPagina = 9) =>
      http.get(`/eventos${qs({ ...filtros, pagina, porPagina })}`),
    destaques: () => http.get('/eventos/destaques'),
    porSlug: (slug) => http.get(`/eventos/slug/${slug}`),
    porId: (id) => http.get(`/eventos/${id}`),
    porOrganizador: (organizadorId) => http.get(`/organizadores/${organizadorId}/eventos`),
    criar: (evento) => http.post('/eventos', evento),
    atualizar: (id, patch) => http.put(`/eventos/${id}`, patch),
    publicar: (id) => http.patch(`/eventos/${id}/publicar`),
    cancelar: (id) => http.patch(`/eventos/${id}/cancelar`),
    duplicar: (id) => http.post(`/eventos/${id}/duplicar`),
  },
  registrations: {
    doUsuario: (usuarioId) => http.get(`/usuarios/${usuarioId}/inscricoes`),
    status: (usuarioId, eventoId) => http.get(`/inscricoes/status${qs({ usuarioId, eventoId })}`),
    inscrever: (usuarioId, eventoId) => http.post('/inscricoes', { usuarioId, eventoId }),
    cancelar: (inscricaoId) => http.patch(`/inscricoes/${inscricaoId}/cancelar`),
    participantesDoEvento: (eventoId) => http.get(`/eventos/${eventoId}/inscricoes`),
  },
  coupons: {
    validar: (codigo, eventoId) => http.post('/cupons/validar', { codigo, eventoId }),
    doEvento: (eventoId) => http.get(`/eventos/${eventoId}/cupons`),
    doOrganizador: (organizadorId) => http.get(`/organizadores/${organizadorId}/cupons`),
    salvar: (cupom) => (cupom.id ? http.put(`/cupons/${cupom.id}`, cupom) : http.post('/cupons', cupom)),
    alternarAtivo: (id) => http.patch(`/cupons/${id}/alternar`),
  },
  purchases: {
    doUsuario: (usuarioId) => http.get(`/usuarios/${usuarioId}/compras`),
    criar: (input) => http.post('/compras', input),
    cancelar: (compraId) => http.patch(`/compras/${compraId}/cancelar`),
  },
  tickets: {
    doUsuario: (usuarioId) => http.get(`/usuarios/${usuarioId}/ingressos`),
    doEvento: (eventoId) => http.get(`/eventos/${eventoId}/ingressos`),
  },
  checkin: {
    consultar: (codigoQR) => http.get(`/checkin/${encodeURIComponent(codigoQR)}`),
    registrar: (codigoQR, responsavel) => http.post('/checkin', { codigoQR, responsavel }),
    doEvento: (eventoId) => http.get(`/eventos/${eventoId}/checkins`),
  },
  organizers: {
    listar: () => http.get('/organizadores'),
    destaques: () => http.get('/organizadores/destaques'),
    porId: (id) => http.get(`/organizadores/${id}`),
  },
  catalog: {
    universidades: () => http.get('/universidades'),
    campi: (universidadeId) => http.get(`/campi${qs({ universidadeId })}`),
    categorias: () => http.get('/categorias'),
    tags: () => http.get('/tags'),
  },
  admin: {
    usuarios: () => http.get('/admin/usuarios'),
    alternarUsuarioAtivo: (id) => http.patch(`/admin/usuarios/${id}/alternar`),
    removerUsuario: (id) => http.del(`/admin/usuarios/${id}`),
    salvarCategoria: (c) => (c.id ? http.put(`/categorias/${c.id}`, c) : http.post('/categorias', c)),
    removerCategoria: (id) => http.del(`/categorias/${id}`),
    salvarUniversidade: (u) => (u.id ? http.put(`/universidades/${u.id}`, u) : http.post('/universidades', u)),
    salvarCampus: (c) => (c.id ? http.put(`/campi/${c.id}`, c) : http.post('/campi', c)),
    metricas: () => http.get('/admin/metricas'),
  },
  demo: {
    reset: () => http.post('/demo/reset'),
  },
};
