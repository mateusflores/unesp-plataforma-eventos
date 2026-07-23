import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { TipoUsuario } from '@/types';

/**
 * Protege visualmente as rotas conforme o perfil simulado.
 * - Sem autenticação -> redireciona para /login (guardando o destino).
 * - Perfil sem permissão -> página 403 (Forbidden).
 */
export function ProtectedRoute({
  children,
  papeis,
}: {
  children: ReactNode;
  papeis?: TipoUsuario[];
}) {
  const { autenticado, papel, carregando } = useAuth();
  const location = useLocation();

  if (carregando) return null;

  if (!autenticado) {
    return <Navigate to="/login" state={{ de: location.pathname }} replace />;
  }
  if (papeis && papel && !papeis.includes(papel)) {
    return <Navigate to="/403" replace />;
  }
  return <>{children}</>;
}
