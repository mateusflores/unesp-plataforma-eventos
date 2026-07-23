import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Usuario, TipoUsuario } from '@/types';
import { services } from '@/services';

interface AuthContextValue {
  usuario: Usuario | null;
  carregando: boolean;
  autenticado: boolean;
  papel: TipoUsuario | null;
  login: (email: string, senha: string) => Promise<Usuario>;
  loginDemo: (usuarioId: number) => Promise<Usuario>;
  registrar: (dados: { nome: string; email: string; senha: string; telefone?: string }) => Promise<Usuario>;
  logout: () => void;
  atualizarUsuario: (patch: Partial<Usuario>) => void;
}

const STORAGE_KEY = 'agora:auth:v1';
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  // Restaura a sessão simulada.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUsuario(JSON.parse(raw));
    } catch {
      /* noop */
    }
    setCarregando(false);
  }, []);

  const persistir = useCallback((u: Usuario | null) => {
    setUsuario(u);
    try {
      if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* noop */
    }
  }, []);

  const login = useCallback(
    async (email: string, senha: string) => {
      const u = await services.auth.login(email, senha);
      persistir(u);
      return u;
    },
    [persistir],
  );

  const loginDemo = useCallback(
    async (usuarioId: number) => {
      const u = await services.auth.loginDemo(usuarioId);
      persistir(u);
      return u;
    },
    [persistir],
  );

  const registrar = useCallback(
    async (dados: { nome: string; email: string; senha: string; telefone?: string }) => {
      const u = await services.auth.registrar(dados);
      persistir(u);
      return u;
    },
    [persistir],
  );

  const logout = useCallback(() => persistir(null), [persistir]);

  const atualizarUsuario = useCallback(
    (patch: Partial<Usuario>) => {
      setUsuario((prev) => {
        if (!prev) return prev;
        const next = { ...prev, ...patch };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          /* noop */
        }
        return next;
      });
    },
    [],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      usuario,
      carregando,
      autenticado: !!usuario,
      papel: usuario?.tipo ?? null,
      login,
      loginDemo,
      registrar,
      logout,
      atualizarUsuario,
    }),
    [usuario, carregando, login, loginDemo, registrar, logout, atualizarUsuario],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>.');
  return ctx;
}
