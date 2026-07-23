import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCatalog } from '@/contexts/CatalogContext';
import { services } from '@/services';
import { useAsync } from './useAsync';
import type { Evento } from '@/types';

/**
 * Ids de organizadores que o usuário logado pode gerenciar.
 * - Admin: todos.
 * - Organizador: sua organização individual + entidades das quais é membro.
 */
export function useOrganizadorIds(): number[] {
  const { usuario, papel } = useAuth();
  const { organizadores } = useCatalog();
  return useMemo(() => {
    if (!usuario) return [];
    if (papel === 'ADMIN') return organizadores.map((o) => o.id);
    const proprios = organizadores.filter((o) => o.usuarioId === usuario.id).map((o) => o.id);
    const entidades = usuario.entidadesIds ?? [];
    return Array.from(new Set([...proprios, ...entidades]));
  }, [usuario, papel, organizadores]);
}

/** Todos os eventos gerenciáveis pelo usuário logado (inclui rascunhos). */
export function useEventosDoOrganizador() {
  const ids = useOrganizadorIds();
  const idsKey = ids.join(',');
  return useAsync<Evento[]>(async () => {
    if (ids.length === 0) return [];
    const listas = await Promise.all(ids.map((id) => services.events.porOrganizador(id)));
    const map = new Map<number, Evento>();
    listas.flat().forEach((e) => map.set(e.id, e));
    return Array.from(map.values()).sort((a, b) => b.dataInicio.localeCompare(a.dataInicio));
  }, [idsKey]);
}
