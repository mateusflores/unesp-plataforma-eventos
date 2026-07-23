import type {
  StatusEvento,
  StatusCompra,
  StatusPagamento,
  StatusIngresso,
  StatusInscricao,
  MetodoPagamento,
  TipoEntidade,
} from '@/types';

export type Tom = 'brand' | 'sucesso' | 'aviso' | 'perigo' | 'info' | 'neutro' | 'accent';

interface RotuloTom {
  rotulo: string;
  tom: Tom;
}

export const statusEventoInfo: Record<StatusEvento, RotuloTom> = {
  RASCUNHO: { rotulo: 'Rascunho', tom: 'neutro' },
  PUBLICADO: { rotulo: 'Publicado', tom: 'sucesso' },
  CANCELADO: { rotulo: 'Cancelado', tom: 'perigo' },
  ENCERRADO: { rotulo: 'Encerrado', tom: 'neutro' },
};

export const statusCompraInfo: Record<StatusCompra, RotuloTom> = {
  PENDENTE: { rotulo: 'Pendente', tom: 'aviso' },
  PAGO: { rotulo: 'Pago', tom: 'sucesso' },
  CANCELADO: { rotulo: 'Cancelada', tom: 'perigo' },
};

export const statusPagamentoInfo: Record<StatusPagamento, RotuloTom> = {
  APROVADO: { rotulo: 'Aprovado', tom: 'sucesso' },
  RECUSADO: { rotulo: 'Recusado', tom: 'perigo' },
  EM_ANALISE: { rotulo: 'Em análise', tom: 'aviso' },
};

export const statusIngressoInfo: Record<StatusIngresso, RotuloTom> = {
  VALIDO: { rotulo: 'Válido', tom: 'sucesso' },
  UTILIZADO: { rotulo: 'Utilizado', tom: 'neutro' },
  CANCELADO: { rotulo: 'Cancelado', tom: 'perigo' },
};

export const statusInscricaoInfo: Record<StatusInscricao, RotuloTom> = {
  CONFIRMADA: { rotulo: 'Confirmada', tom: 'sucesso' },
  CANCELADA: { rotulo: 'Cancelada', tom: 'perigo' },
  LISTA_ESPERA: { rotulo: 'Lista de espera', tom: 'aviso' },
};

export const metodoPagamentoRotulo: Record<MetodoPagamento, string> = {
  PIX: 'Pix',
  CARTAO: 'Cartão de crédito',
  BOLETO: 'Boleto',
};

export const tipoEntidadeRotulo: Record<TipoEntidade, string> = {
  ATLETICA: 'Atlética',
  CENTRO_ACADEMICO: 'Centro Acadêmico',
  EMPRESA_JUNIOR: 'Empresa Júnior',
  COMISSAO: 'Comissão',
  OUTRO: 'Entidade',
};

/** Disponibilidade derivada de um evento para exibição de selo. */
export function disponibilidadeEvento(inscritos: number, capacidade: number): {
  rotulo: string;
  tom: Tom;
  lotado: boolean;
  percentual: number;
} {
  const percentual = capacidade > 0 ? Math.min(100, Math.round((inscritos / capacidade) * 100)) : 0;
  if (inscritos >= capacidade) return { rotulo: 'Lotado', tom: 'perigo', lotado: true, percentual: 100 };
  if (percentual >= 80) return { rotulo: 'Últimas vagas', tom: 'aviso', lotado: false, percentual };
  return { rotulo: 'Vagas disponíveis', tom: 'sucesso', lotado: false, percentual };
}
