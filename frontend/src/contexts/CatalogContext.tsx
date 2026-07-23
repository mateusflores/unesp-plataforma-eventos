import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { services } from '@/services';
import type { Campus, Categoria, Organizador, Tag, Universidade } from '@/types';

interface CatalogContextValue {
  categorias: Categoria[];
  tags: Tag[];
  universidades: Universidade[];
  campi: Campus[];
  organizadores: Organizador[];
  pronto: boolean;
  categoriaPorId: (id: number) => Categoria | undefined;
  tagPorId: (id: number) => Tag | undefined;
  organizadorPorId: (id: number) => Organizador | undefined;
  universidadePorId: (id: number) => Universidade | undefined;
  campusPorId: (id: number) => Campus | undefined;
}

const CatalogContext = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [universidades, setUniversidades] = useState<Universidade[]>([]);
  const [campi, setCampi] = useState<Campus[]>([]);
  const [organizadores, setOrganizadores] = useState<Organizador[]>([]);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    let vivo = true;
    Promise.all([
      services.catalog.categorias(),
      services.catalog.tags(),
      services.catalog.universidades(),
      services.catalog.campi(),
      services.organizers.listar(),
    ]).then(([cat, tg, uni, cmp, org]) => {
      if (!vivo) return;
      setCategorias(cat);
      setTags(tg);
      setUniversidades(uni);
      setCampi(cmp);
      setOrganizadores(org);
      setPronto(true);
    });
    return () => {
      vivo = false;
    };
  }, []);

  const value = useMemo<CatalogContextValue>(
    () => ({
      categorias,
      tags,
      universidades,
      campi,
      organizadores,
      pronto,
      categoriaPorId: (id) => categorias.find((c) => c.id === id),
      tagPorId: (id) => tags.find((t) => t.id === id),
      organizadorPorId: (id) => organizadores.find((o) => o.id === id),
      universidadePorId: (id) => universidades.find((u) => u.id === id),
      campusPorId: (id) => campi.find((c) => c.id === id),
    }),
    [categorias, tags, universidades, campi, organizadores, pronto],
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCatalog(): CatalogContextValue {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog deve ser usado dentro de <CatalogProvider>.');
  return ctx;
}
