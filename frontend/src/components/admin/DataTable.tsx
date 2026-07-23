import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Search, ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import { Pagination, EmptyState, Skeleton } from '@/components/ui';
import { normalize } from '@/services/utils';

export interface Coluna<T> {
  chave: string;
  titulo: string;
  render: (item: T) => ReactNode;
  ordenavel?: boolean;
  valorOrdenacao?: (item: T) => string | number;
  alinhar?: 'right' | 'center';
}

interface Props<T> {
  itens: T[] | null;
  colunas: Coluna<T>[];
  buscaEm?: (item: T) => string;
  placeholderBusca?: string;
  porPagina?: number;
  acoesHeader?: ReactNode;
  vazioTitulo?: string;
  vazioDescricao?: string;
  keyOf: (item: T) => string | number;
}

export function DataTable<T>({
  itens,
  colunas,
  buscaEm,
  placeholderBusca = 'Buscar…',
  porPagina = 8,
  acoesHeader,
  vazioTitulo = 'Nada encontrado',
  vazioDescricao = 'Ajuste a busca ou adicione um novo registro.',
  keyOf,
}: Props<T>) {
  const [busca, setBusca] = useState('');
  const [pagina, setPagina] = useState(1);
  const [ordem, setOrdem] = useState<{ chave: string; dir: 'asc' | 'desc' } | null>(null);

  const processados = useMemo(() => {
    let r = itens ?? [];
    if (busca && buscaEm) r = r.filter((i) => normalize(buscaEm(i)).includes(normalize(busca)));
    if (ordem) {
      const col = colunas.find((c) => c.chave === ordem.chave);
      if (col?.valorOrdenacao) {
        r = [...r].sort((a, b) => {
          const va = col.valorOrdenacao!(a);
          const vb = col.valorOrdenacao!(b);
          const cmp = typeof va === 'number' && typeof vb === 'number' ? va - vb : String(va).localeCompare(String(vb));
          return ordem.dir === 'asc' ? cmp : -cmp;
        });
      }
    }
    return r;
  }, [itens, busca, ordem, buscaEm, colunas]);

  const totalPaginas = Math.ceil(processados.length / porPagina);
  const paginaSegura = Math.min(pagina, Math.max(1, totalPaginas));
  const visiveis = processados.slice((paginaSegura - 1) * porPagina, paginaSegura * porPagina);

  const alternarOrdem = (chave: string) =>
    setOrdem((o) => (o?.chave === chave ? { chave, dir: o.dir === 'asc' ? 'desc' : 'asc' } : { chave, dir: 'asc' }));

  return (
    <div>
      <div className="toolbar">
        {buscaEm && (
          <label className="busca-inline">
            <Search size={17} />
            <input value={busca} onChange={(e) => { setBusca(e.target.value); setPagina(1); }} placeholder={placeholderBusca} aria-label="Buscar" />
          </label>
        )}
        <div className="grow" />
        {acoesHeader}
      </div>

      {itens === null ? (
        <Skeleton h={320} radius="var(--radius-lg)" />
      ) : visiveis.length === 0 ? (
        <div className="tabela-wrap"><EmptyState titulo={vazioTitulo} descricao={vazioDescricao} /></div>
      ) : (
        <>
          <div className="tabela-wrap">
            <table className="tabela">
              <thead>
                <tr>
                  {colunas.map((c) => (
                    <th key={c.chave} style={{ textAlign: c.alinhar }}>
                      {c.ordenavel && c.valorOrdenacao ? (
                        <button className="tabela__sort" onClick={() => alternarOrdem(c.chave)}>
                          {c.titulo}
                          {ordem?.chave === c.chave ? (ordem.dir === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />) : <ArrowUpDown size={12} />}
                        </button>
                      ) : (
                        c.titulo
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visiveis.map((item) => (
                  <tr key={keyOf(item)}>
                    {colunas.map((c) => (
                      <td key={c.chave} style={{ textAlign: c.alinhar }}>{c.render(item)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="row-between mt-4 wrap gap-3">
            <span className="text-sm text-muted">{processados.length} registro(s)</span>
            <Pagination pagina={paginaSegura} totalPaginas={totalPaginas} onChange={setPagina} />
          </div>
        </>
      )}
    </div>
  );
}
