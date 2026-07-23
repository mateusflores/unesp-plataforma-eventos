/**
 * Configuração central de ambiente.
 *
 * `useMocks` decide, em tempo de execução, se a aplicação consome a camada
 * de serviços simulada (src/services/mocks) ou a camada HTTP real
 * (src/services/api). Basta alterar VITE_USE_MOCKS no arquivo .env.
 */
export const env = {
  useMocks: import.meta.env.VITE_USE_MOCKS !== 'false',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080',
  mockDelay: Number(import.meta.env.VITE_MOCK_DELAY ?? 600),
} as const;
