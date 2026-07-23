import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError } from '@/services';

export type AsyncEstado = 'idle' | 'loading' | 'success' | 'empty' | 'error';

export interface AsyncResultado<T> {
  data: T | null;
  estado: AsyncEstado;
  erro: string | null;
  statusHttp: number | null;
  recarregar: () => void;
  setData: (updater: (prev: T | null) => T | null) => void;
}

/** Considera "empty" quando o resultado é array vazio. */
function ehVazio(data: unknown): boolean {
  return Array.isArray(data) && data.length === 0;
}

/**
 * Executa uma função assíncrona (tipicamente um serviço) e expõe os estados
 * de carregamento, sucesso, vazio e erro — a base para todas as telas que um
 * dia consumirão a API real.
 */
export function useAsync<T>(fn: () => Promise<T>, deps: unknown[] = []): AsyncResultado<T> {
  const [data, setData] = useState<T | null>(null);
  const [estado, setEstado] = useState<AsyncEstado>('idle');
  const [erro, setErro] = useState<string | null>(null);
  const [statusHttp, setStatusHttp] = useState<number | null>(null);
  const [nonce, setNonce] = useState(0);
  const fnRef = useRef(fn);
  fnRef.current = fn;

  useEffect(() => {
    let vivo = true;
    setEstado('loading');
    setErro(null);
    setStatusHttp(null);
    fnRef
      .current()
      .then((res) => {
        if (!vivo) return;
        setData(res);
        setEstado(ehVazio(res) ? 'empty' : 'success');
      })
      .catch((e: unknown) => {
        if (!vivo) return;
        if (e instanceof ApiError) {
          setErro(e.message);
          setStatusHttp(e.status);
        } else {
          setErro('Não foi possível carregar. Verifique sua conexão.');
        }
        setEstado('error');
      });
    return () => {
      vivo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce]);

  const recarregar = useCallback(() => setNonce((n) => n + 1), []);
  const setDataFn = useCallback((updater: (prev: T | null) => T | null) => {
    setData((prev) => updater(prev));
  }, []);

  return { data, estado, erro, statusHttp, recarregar, setData: setDataFn };
}
