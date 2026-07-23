/**
 * Ponto único de acesso aos serviços.
 *
 * A escolha entre mocks e API real acontece AQUI, em um só lugar, com base em
 * VITE_USE_MOCKS. Os componentes importam sempre de `@/services`:
 *
 *   import { services } from '@/services';
 *   const { itens } = await services.events.listar();
 *
 * Trocar para o back-end real = definir VITE_USE_MOCKS=false no .env.
 */
import { env } from '@/config/env';
import { mockServices } from './mocks';
import { apiServices } from './api';
import type { Services } from './contracts';

export const services: Services = env.useMocks ? mockServices : apiServices;

export type { Services } from './contracts';
export type { PurchaseInput, CheckInResultado } from './contracts';
export { ApiError } from './utils';
