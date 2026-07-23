/**
 * Store em memória dos dados mockados.
 *
 * Semeado a partir de src/data e persistido opcionalmente em localStorage
 * apenas para manter alterações feitas durante a demonstração (inscrições,
 * compras, check-ins...). A aplicação funciona com os dados iniciais mesmo
 * sem localStorage — basta chamar `resetStore()`.
 */
import { universidades, campi } from '@/data/universidades';
import { categorias, tags } from '@/data/categorias';
import { usuarios, organizadores } from '@/data/usuarios';
import { eventos } from '@/data/eventos';
import { inscricoes, cupons, compras, ingressosEmitidos } from '@/data/transacoes';
import { clone } from '@/services/utils';
import type {
  Campus,
  Categoria,
  Compra,
  Cupom,
  Evento,
  IngressoEmitido,
  Inscricao,
  Organizador,
  Tag,
  Universidade,
  Usuario,
} from '@/types';

export interface Store {
  universidades: Universidade[];
  campi: Campus[];
  categorias: Categoria[];
  tags: Tag[];
  usuarios: Usuario[];
  organizadores: Organizador[];
  eventos: Evento[];
  inscricoes: Inscricao[];
  cupons: Cupom[];
  compras: Compra[];
  ingressosEmitidos: IngressoEmitido[];
}

// Versão do cache local. Ao mudar o seed de dados, incremente para invalidar
// o localStorage antigo e recarregar os novos dados mockados.
const STORAGE_KEY = 'agora:store:v2';

function seed(): Store {
  return clone({
    universidades,
    campi,
    categorias,
    tags,
    usuarios,
    organizadores,
    eventos,
    inscricoes,
    cupons,
    compras,
    ingressosEmitidos,
  });
}

function load(): Store {
  if (typeof localStorage === 'undefined') return seed();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seed();
    return JSON.parse(raw) as Store;
  } catch {
    return seed();
  }
}

export const store: Store = load();

export function persist(): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    /* ignora falhas de quota/modo privado */
  }
}

/** Restaura os dados iniciais (usado pelo botão "Reiniciar dados" da demo). */
export function resetStore(): void {
  const fresh = seed();
  Object.assign(store, fresh);
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* noop */
    }
  }
}
