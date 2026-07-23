import { env } from '@/config/env';

/** Simula latência de rede para validar estados de carregamento. */
export const delay = (ms = env.mockDelay): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/** Cópia profunda simples para não vazar referências dos mocks. */
export const clone = <T>(value: T): T =>
  typeof structuredClone === 'function'
    ? structuredClone(value)
    : JSON.parse(JSON.stringify(value));

let seq = Date.now();
/** Gera um id numérico incremental para novos registros mockados. */
export const nextId = (): number => ++seq;

/** Normaliza texto para busca (sem acentos, minúsculo). */
export const normalize = (s: string): string =>
  s
    .normalize('NFD')
    // eslint-disable-next-line no-misleading-character-class
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();

/** Erro de domínio para simular respostas de API (401/403/404/422...). */
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
