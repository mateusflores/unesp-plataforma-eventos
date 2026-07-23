import { useEffect, useState } from 'react';
import { services } from '@/services';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable } from '@/components/admin/DataTable';
import type { Coluna } from '@/components/admin/DataTable';
import { Badge } from '@/components/ui';
import type { Tag, Evento } from '@/types';

export function AdminTagsPage() {
  const [tags, setTags] = useState<Tag[] | null>(null);
  const [eventos, setEventos] = useState<Evento[]>([]);

  useEffect(() => {
    services.catalog.tags().then(setTags);
    services.events.listar({}, 1, 200).then((p) => setEventos(p.itens));
  }, []);

  const uso = (id: number) => eventos.filter((e) => e.tagIds.includes(id)).length;

  const colunas: Coluna<Tag>[] = [
    { chave: 'nome', titulo: 'Tag', ordenavel: true, valorOrdenacao: (t) => t.nome, render: (t) => <Badge tom="neutro">#{t.nome}</Badge> },
    { chave: 'uso', titulo: 'Eventos', ordenavel: true, valorOrdenacao: (t) => uso(t.id), render: (t) => <strong>{uso(t.id)}</strong> },
  ];

  return (
    <div>
      <PageHeader titulo="Tags" subtitulo="Palavras-chave usadas para refinar a descoberta de eventos." />
      <DataTable itens={tags} colunas={colunas} keyOf={(t) => t.id} buscaEm={(t) => t.nome} placeholderBusca="Buscar tag…" />
    </div>
  );
}
