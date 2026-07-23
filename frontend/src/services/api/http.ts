import { env } from '@/config/env';
import { ApiError } from '@/services/utils';

/**
 * Cliente HTTP mínimo usado pela camada de API real.
 * Centraliza baseURL, cabeçalhos, token e tratamento de erros para que a troca
 * mock↔API não exija mudanças nos componentes.
 */
let authToken: string | null = null;
export const setAuthToken = (token: string | null): void => {
  authToken = token;
};

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${env.apiBaseUrl}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let message = `Erro ${res.status}`;
    try {
      const data = await res.json();
      message = data.message ?? message;
    } catch {
      /* resposta sem corpo JSON */
    }
    throw new ApiError(res.status, message);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const http = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body),
  put: <T>(path: string, body?: unknown) => request<T>('PUT', path, body),
  patch: <T>(path: string, body?: unknown) => request<T>('PATCH', path, body),
  del: <T>(path: string) => request<T>('DELETE', path),
};
