import { store, persist, resetStore } from './store';
import { delay, clone, nextId, normalize, ApiError } from '@/services/utils';
import type { Services, PurchaseInput } from '@/services/contracts';
import type {
  Campus,
  Categoria,
  Compra,
  Cupom,
  Evento,
  EventoFiltros,
  IngressoEmitido,
  Inscricao,
  ItemCompra,
  Pagamento,
  StatusPagamento,
  Universidade,
  Usuario,
} from '@/types';

// ----------------------------------------------------------------------------
// Helpers de domínio
// ----------------------------------------------------------------------------
const findEvento = (id: number): Evento => {
  const ev = store.eventos.find((e) => e.id === id);
  if (!ev) throw new ApiError(404, 'Evento não encontrado.');
  return ev;
};

const recomputaPrecoAPartir = (ev: Evento): void => {
  const precos = ev.ingressos.flatMap((i) => i.lotes.map((l) => l.preco)).filter((p) => p > 0);
  ev.precoAPartir = precos.length ? Math.min(...precos) : 0;
};

const aplicarFiltros = (lista: Evento[], f: EventoFiltros): Evento[] => {
  let r = lista;
  if (f.busca) {
    const q = normalize(f.busca);
    r = r.filter(
      (e) =>
        normalize(e.titulo).includes(q) ||
        normalize(e.resumo).includes(q) ||
        normalize(e.local).includes(q),
    );
  }
  if (f.universidadeId) r = r.filter((e) => e.universidadeId === f.universidadeId);
  if (f.campusId) r = r.filter((e) => e.campusId === f.campusId);
  if (f.categoriaIds?.length)
    r = r.filter((e) => e.categoriaIds.some((c) => f.categoriaIds!.includes(c)));
  if (typeof f.gratuito === 'boolean') r = r.filter((e) => e.gratuito === f.gratuito);
  if (f.status) r = r.filter((e) => e.status === f.status);
  if (f.organizadorId) r = r.filter((e) => e.organizadorId === f.organizadorId);
  if (f.somenteDestaque) r = r.filter((e) => e.destaque);
  if (f.dataInicio) r = r.filter((e) => e.dataFim >= f.dataInicio!);
  if (f.dataFim) r = r.filter((e) => e.dataInicio <= f.dataFim!);
  return r;
};

const descontoDoCupom = (cupom: Cupom, subtotal: number): number => {
  if (cupom.tipo === 'PERCENTUAL') return Math.round(subtotal * (cupom.valor / 100) * 100) / 100;
  return Math.min(cupom.valor, subtotal);
};

const acharCupomValido = (codigo: string, eventoId: number): Cupom => {
  const c = store.cupons.find(
    (x) => x.codigo.toLowerCase() === codigo.trim().toLowerCase() && (!x.eventoId || x.eventoId === eventoId),
  );
  if (!c || !c.ativo || new Date(c.validade) < new Date() || c.quantidadeUsada >= c.quantidadeMaxima)
    throw new ApiError(422, 'Cupom inválido.');
  return c;
};

// Resultado de pagamento pseudo-aleatório e determinístico por método.
const simularPagamento = (metodo: PurchaseInput['metodo'], valor: number): Pagamento => {
  let status: StatusPagamento = 'APROVADO';
  if (metodo === 'BOLETO') status = 'EM_ANALISE';
  if (metodo === 'CARTAO' && valor > 0 && Math.random() < 0.15) status = 'RECUSADO';
  return { id: nextId(), metodo, status, data: new Date().toISOString(), valor };
};

// ----------------------------------------------------------------------------
// Serviços
// ----------------------------------------------------------------------------
export const mockServices: Services = {
  auth: {
    async login(email, senha) {
      await delay();
      const u = store.usuarios.find((x) => x.email.toLowerCase() === email.toLowerCase());
      if (!u || !senha) throw new ApiError(401, 'E-mail ou senha inválidos.');
      if (!u.ativo) throw new ApiError(403, 'Conta desativada. Fale com o suporte.');
      return clone(u);
    },
    async loginDemo(usuarioId) {
      await delay(200);
      const u = store.usuarios.find((x) => x.id === usuarioId);
      if (!u) throw new ApiError(404, 'Conta de demonstração não encontrada.');
      return clone(u);
    },
    async registrar({ nome, email, telefone }) {
      await delay();
      if (store.usuarios.some((u) => u.email.toLowerCase() === email.toLowerCase()))
        throw new ApiError(422, 'Já existe uma conta com este e-mail.');
      const novo: Usuario = {
        id: nextId(),
        nome,
        email,
        telefone: telefone ?? '',
        tipo: 'PARTICIPANTE',
        ativo: true,
        avatarCor: '#5b4be6',
        entidadesIds: [],
      };
      store.usuarios.push(novo);
      persist();
      return clone(novo);
    },
    async recuperarSenha(email) {
      await delay();
      if (!email.includes('@')) throw new ApiError(422, 'Informe um e-mail válido.');
      /* simulação: nenhum e-mail é realmente enviado */
    },
    async me(usuarioId) {
      await delay(150);
      const u = store.usuarios.find((x) => x.id === usuarioId);
      if (!u) throw new ApiError(404, 'Usuário não encontrado.');
      return clone(u);
    },
  },

  events: {
    async listar(filtros = {}, pagina = 1, porPagina = 9) {
      await delay();
      const base = store.eventos.filter((e) =>
        filtros.status ? true : e.status === 'PUBLICADO' || e.status === 'ENCERRADO' || e.status === 'CANCELADO',
      );
      const filtrados = aplicarFiltros(base, filtros).sort((a, b) =>
        a.dataInicio.localeCompare(b.dataInicio),
      );
      const inicio = (pagina - 1) * porPagina;
      return {
        itens: clone(filtrados.slice(inicio, inicio + porPagina)),
        total: filtrados.length,
        pagina,
        porPagina,
      };
    },
    async destaques() {
      await delay();
      return clone(store.eventos.filter((e) => e.destaque && e.status === 'PUBLICADO'));
    },
    async porSlug(slug) {
      await delay();
      const ev = store.eventos.find((e) => e.slug === slug);
      if (!ev) throw new ApiError(404, 'Evento não encontrado.');
      return clone(ev);
    },
    async porId(id) {
      await delay();
      return clone(findEvento(id));
    },
    async porOrganizador(organizadorId) {
      await delay();
      return clone(
        store.eventos
          .filter((e) => e.organizadorId === organizadorId)
          .sort((a, b) => b.dataInicio.localeCompare(a.dataInicio)),
      );
    },
    async criar(dados) {
      await delay();
      const id = nextId();
      const ev: Evento = {
        id,
        titulo: dados.titulo ?? 'Novo evento',
        slug: `evento-${id}`,
        resumo: dados.resumo ?? '',
        descricao: dados.descricao ?? '',
        dataInicio: dados.dataInicio ?? new Date().toISOString(),
        dataFim: dados.dataFim ?? new Date().toISOString(),
        capacidade: dados.capacidade ?? 100,
        inscritos: 0,
        publico: dados.publico ?? true,
        gratuito: dados.gratuito ?? true,
        status: dados.status ?? 'RASCUNHO',
        imagemCapa: dados.imagemCapa ?? `https://picsum.photos/seed/agora-${id}/1200/675`,
        organizadorId: dados.organizadorId ?? 6,
        universidadeId: dados.universidadeId ?? 1,
        campusId: dados.campusId ?? 1,
        endereco:
          dados.endereco ??
          { id: nextId(), logradouro: '', numero: '', bairro: '', cidade: '', estado: 'SP', cep: '' },
        local: dados.local ?? '',
        categoriaIds: dados.categoriaIds ?? [],
        tagIds: dados.tagIds ?? [],
        ingressos: dados.ingressos ?? [],
        precoAPartir: 0,
        temListaEspera: dados.temListaEspera ?? false,
        destaque: false,
      };
      recomputaPrecoAPartir(ev);
      store.eventos.push(ev);
      persist();
      return clone(ev);
    },
    async atualizar(id, patch) {
      await delay();
      const ev = findEvento(id);
      Object.assign(ev, patch);
      recomputaPrecoAPartir(ev);
      persist();
      return clone(ev);
    },
    async publicar(id) {
      await delay();
      const ev = findEvento(id);
      ev.status = 'PUBLICADO';
      persist();
      return clone(ev);
    },
    async cancelar(id) {
      await delay();
      const ev = findEvento(id);
      ev.status = 'CANCELADO';
      persist();
      return clone(ev);
    },
    async duplicar(id) {
      await delay();
      const original = findEvento(id);
      const novoId = nextId();
      const copia: Evento = {
        ...clone(original),
        id: novoId,
        titulo: `${original.titulo} (cópia)`,
        slug: `${original.slug}-copia-${novoId}`,
        status: 'RASCUNHO',
        inscritos: 0,
      };
      store.eventos.push(copia);
      persist();
      return clone(copia);
    },
  },

  registrations: {
    async doUsuario(usuarioId) {
      await delay();
      return clone(store.inscricoes.filter((i) => i.usuarioId === usuarioId));
    },
    async status(usuarioId, eventoId) {
      await delay(150);
      const i = store.inscricoes.find(
        (x) => x.usuarioId === usuarioId && x.eventoId === eventoId && x.status !== 'CANCELADA',
      );
      return i ? clone(i) : null;
    },
    async inscrever(usuarioId, eventoId) {
      await delay();
      const ev = findEvento(eventoId);
      if (ev.status !== 'PUBLICADO') throw new ApiError(422, 'Evento indisponível para inscrição.');
      const existente = store.inscricoes.find(
        (x) => x.usuarioId === usuarioId && x.eventoId === eventoId && x.status !== 'CANCELADA',
      );
      if (existente) throw new ApiError(422, 'Você já está inscrito neste evento.');
      const lotado = ev.inscritos >= ev.capacidade;
      const inscricao: Inscricao = {
        id: nextId(),
        usuarioId,
        eventoId,
        data: new Date().toISOString(),
        status: lotado ? 'LISTA_ESPERA' : 'CONFIRMADA',
      };
      if (!lotado) ev.inscritos += 1;
      store.inscricoes.push(inscricao);
      persist();
      return clone(inscricao);
    },
    async cancelar(inscricaoId) {
      await delay();
      const i = store.inscricoes.find((x) => x.id === inscricaoId);
      if (!i) throw new ApiError(404, 'Inscrição não encontrada.');
      if (i.status === 'CONFIRMADA') {
        const ev = store.eventos.find((e) => e.id === i.eventoId);
        if (ev && ev.inscritos > 0) ev.inscritos -= 1;
      }
      i.status = 'CANCELADA';
      persist();
      return clone(i);
    },
    async participantesDoEvento(eventoId) {
      await delay();
      return clone(store.inscricoes.filter((i) => i.eventoId === eventoId));
    },
  },

  coupons: {
    async validar(codigo, eventoId) {
      await delay(300);
      const c = store.cupons.find(
        (x) => x.codigo.toLowerCase() === codigo.trim().toLowerCase() && (!x.eventoId || x.eventoId === eventoId),
      );
      if (!c) throw new ApiError(404, 'Cupom não encontrado.');
      if (!c.ativo) throw new ApiError(422, 'Este cupom está desativado.');
      if (new Date(c.validade) < new Date()) throw new ApiError(422, 'Cupom expirado.');
      if (c.quantidadeUsada >= c.quantidadeMaxima) throw new ApiError(422, 'Cupom esgotado.');
      return clone(c);
    },
    async doEvento(eventoId) {
      await delay();
      return clone(store.cupons.filter((c) => c.eventoId === eventoId));
    },
    async doOrganizador(organizadorId) {
      await delay();
      const eventosDoOrg = store.eventos.filter((e) => e.organizadorId === organizadorId).map((e) => e.id);
      return clone(store.cupons.filter((c) => c.eventoId && eventosDoOrg.includes(c.eventoId)));
    },
    async salvar(dados) {
      await delay();
      if (dados.id) {
        const c = store.cupons.find((x) => x.id === dados.id);
        if (!c) throw new ApiError(404, 'Cupom não encontrado.');
        Object.assign(c, dados);
        persist();
        return clone(c);
      }
      const novo: Cupom = {
        id: nextId(),
        eventoId: dados.eventoId,
        codigo: dados.codigo ?? 'NOVOCUPOM',
        tipo: dados.tipo ?? 'PERCENTUAL',
        valor: dados.valor ?? 10,
        validade: dados.validade ?? new Date(Date.now() + 30 * 864e5).toISOString(),
        quantidadeMaxima: dados.quantidadeMaxima ?? 100,
        quantidadeUsada: 0,
        ativo: dados.ativo ?? true,
      };
      store.cupons.push(novo);
      persist();
      return clone(novo);
    },
    async alternarAtivo(id) {
      await delay(200);
      const c = store.cupons.find((x) => x.id === id);
      if (!c) throw new ApiError(404, 'Cupom não encontrado.');
      c.ativo = !c.ativo;
      persist();
      return clone(c);
    },
  },

  purchases: {
    async doUsuario(usuarioId) {
      await delay();
      return clone(
        store.compras
          .filter((c) => c.usuarioId === usuarioId)
          .sort((a, b) => b.data.localeCompare(a.data)),
      );
    },
    async criar(input) {
      await delay(900);
      const ev = findEvento(input.eventoId);
      const itens: ItemCompra[] = input.itens.map((it) => {
        const ingresso = ev.ingressos.find((i) => i.id === it.ingressoId);
        const lote = ingresso?.lotes.find((l) => l.id === it.loteId);
        if (!ingresso || !lote) throw new ApiError(422, 'Ingresso ou lote inválido.');
        if (lote.quantidadeDisponivel < it.quantidade)
          throw new ApiError(422, `Restam apenas ${lote.quantidadeDisponivel} unidades de ${ingresso.nome}.`);
        return {
          id: nextId(),
          ingressoId: it.ingressoId,
          loteId: it.loteId,
          descricao: `${ingresso.nome} — ${lote.nome}`,
          quantidade: it.quantidade,
          valorUnitario: lote.preco,
        };
      });

      const subtotal = itens.reduce((s, it) => s + it.valorUnitario * it.quantidade, 0);

      let desconto = 0;
      let cupomId: number | undefined;
      if (input.cupomCodigo) {
        const cupom = acharCupomValido(input.cupomCodigo, ev.id);
        desconto = descontoDoCupom(cupom, subtotal);
        cupomId = cupom.id;
        cupom.quantidadeUsada += 1;
      }

      const valorTotal = Math.max(0, subtotal - desconto);
      const pagamento = simularPagamento(input.metodo, valorTotal);
      const statusCompra = pagamento.status === 'APROVADO' ? 'PAGO' : pagamento.status === 'RECUSADO' ? 'CANCELADO' : 'PENDENTE';

      const compra: Compra = {
        id: nextId(),
        usuarioId: input.usuarioId,
        eventoId: ev.id,
        data: new Date().toISOString(),
        itens,
        cupomId,
        desconto,
        valorTotal,
        status: statusCompra,
        pagamento,
      };

      // Emite ingressos e baixa estoque apenas quando aprovado.
      if (pagamento.status === 'APROVADO') {
        for (const it of itens) {
          const ingresso = ev.ingressos.find((i) => i.id === it.ingressoId)!;
          const lote = ingresso.lotes.find((l) => l.id === it.loteId)!;
          lote.quantidadeDisponivel -= it.quantidade;
          for (let n = 0; n < it.quantidade; n++) {
            store.ingressosEmitidos.push({
              id: nextId(),
              compraId: compra.id,
              itemCompraId: it.id,
              usuarioId: input.usuarioId,
              eventoId: ev.id,
              ingressoNome: ingresso.nome,
              loteNome: lote.nome,
              codigoQR: `AGORA-${ev.id}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
              status: 'VALIDO',
              dataEmissao: new Date().toISOString(),
            });
          }
        }
      }

      store.compras.push(compra);
      persist();
      return clone(compra);
    },
    async cancelar(compraId) {
      await delay();
      const c = store.compras.find((x) => x.id === compraId);
      if (!c) throw new ApiError(404, 'Compra não encontrada.');
      c.status = 'CANCELADO';
      store.ingressosEmitidos
        .filter((t) => t.compraId === compraId)
        .forEach((t) => (t.status = 'CANCELADO'));
      persist();
      return clone(c);
    },
  },

  tickets: {
    async doUsuario(usuarioId) {
      await delay();
      return clone(store.ingressosEmitidos.filter((t) => t.usuarioId === usuarioId));
    },
    async doEvento(eventoId) {
      await delay();
      return clone(store.ingressosEmitidos.filter((t) => t.eventoId === eventoId));
    },
  },

  checkin: {
    async consultar(codigoQR) {
      await delay(400);
      const t = store.ingressosEmitidos.find((x) => x.codigoQR.toUpperCase() === codigoQR.trim().toUpperCase());
      if (!t) throw new ApiError(404, 'Ingresso inexistente.');
      return clone(t);
    },
    async registrar(codigoQR, responsavel) {
      await delay(500);
      const t = store.ingressosEmitidos.find((x) => x.codigoQR.toUpperCase() === codigoQR.trim().toUpperCase());
      if (!t) throw new ApiError(404, 'Ingresso inexistente.');
      if (t.status === 'CANCELADO') throw new ApiError(422, 'Ingresso cancelado.');
      if (t.status === 'UTILIZADO') throw new ApiError(409, 'Ingresso já utilizado.');
      t.status = 'UTILIZADO';
      t.checkIn = { id: nextId(), ingressoEmitidoId: t.id, dataHora: new Date().toISOString(), responsavel };
      persist();
      return clone(t);
    },
    async doEvento(eventoId) {
      await delay();
      return clone(store.ingressosEmitidos.filter((t) => t.eventoId === eventoId));
    },
  },

  organizers: {
    async listar() {
      await delay();
      return clone(store.organizadores);
    },
    async destaques() {
      await delay();
      return clone(store.organizadores.filter((o) => o.verificado).slice(0, 4));
    },
    async porId(id) {
      await delay();
      const o = store.organizadores.find((x) => x.id === id);
      if (!o) throw new ApiError(404, 'Organizador não encontrado.');
      return clone(o);
    },
  },

  catalog: {
    async universidades() {
      await delay(200);
      return clone(store.universidades);
    },
    async campi(universidadeId) {
      await delay(200);
      return clone(
        universidadeId ? store.campi.filter((c) => c.universidadeId === universidadeId) : store.campi,
      );
    },
    async categorias() {
      await delay(150);
      return clone(store.categorias);
    },
    async tags() {
      await delay(150);
      return clone(store.tags);
    },
  },

  admin: {
    async usuarios() {
      await delay();
      return clone(store.usuarios);
    },
    async alternarUsuarioAtivo(id) {
      await delay(200);
      const u = store.usuarios.find((x) => x.id === id);
      if (!u) throw new ApiError(404, 'Usuário não encontrado.');
      u.ativo = !u.ativo;
      persist();
      return clone(u);
    },
    async removerUsuario(id) {
      await delay();
      const idx = store.usuarios.findIndex((x) => x.id === id);
      if (idx >= 0) store.usuarios.splice(idx, 1);
      persist();
    },
    async salvarCategoria(dados) {
      await delay();
      if (dados.id) {
        const c = store.categorias.find((x) => x.id === dados.id);
        if (!c) throw new ApiError(404, 'Categoria não encontrada.');
        Object.assign(c, dados);
        persist();
        return clone(c);
      }
      const nova: Categoria = {
        id: nextId(),
        nome: dados.nome ?? 'Nova categoria',
        slug: (dados.nome ?? 'nova').toLowerCase().replace(/\s+/g, '-'),
        cor: dados.cor ?? 'var(--cat-academico)',
        icone: dados.icone ?? 'Tag',
      };
      store.categorias.push(nova);
      persist();
      return clone(nova);
    },
    async removerCategoria(id) {
      await delay();
      const idx = store.categorias.findIndex((x) => x.id === id);
      if (idx >= 0) store.categorias.splice(idx, 1);
      persist();
    },
    async salvarUniversidade(dados) {
      await delay();
      if (dados.id) {
        const u = store.universidades.find((x) => x.id === dados.id);
        if (!u) throw new ApiError(404, 'Universidade não encontrada.');
        Object.assign(u, dados);
        persist();
        return clone(u);
      }
      const nova: Universidade = {
        id: nextId(),
        nome: dados.nome ?? 'Nova universidade',
        sigla: dados.sigla ?? 'NOVA',
        logoCor: dados.logoCor ?? '#5b4be6',
      };
      store.universidades.push(nova);
      persist();
      return clone(nova);
    },
    async salvarCampus(dados) {
      await delay();
      if (dados.id) {
        const c = store.campi.find((x) => x.id === dados.id);
        if (!c) throw new ApiError(404, 'Campus não encontrado.');
        Object.assign(c, dados);
        persist();
        return clone(c);
      }
      const novo: Campus = {
        id: nextId(),
        universidadeId: dados.universidadeId ?? 1,
        nome: dados.nome ?? 'Novo campus',
        cidade: dados.cidade ?? '',
        estado: dados.estado ?? 'SP',
      };
      store.campi.push(novo);
      persist();
      return clone(novo);
    },
    async metricas() {
      await delay();
      const ingressosVendidos = store.ingressosEmitidos.filter((t) => t.status !== 'CANCELADO').length;
      const receita = store.compras
        .filter((c) => c.status === 'PAGO')
        .reduce((s, c) => s + c.valorTotal, 0);
      return {
        totalEventos: store.eventos.length,
        eventosPublicados: store.eventos.filter((e) => e.status === 'PUBLICADO').length,
        totalUsuarios: store.usuarios.length,
        totalOrganizadores: store.organizadores.length,
        ingressosVendidos,
        receita,
      };
    },
  },

  demo: {
    async reset() {
      await delay(300);
      resetStore();
    },
  },
};
