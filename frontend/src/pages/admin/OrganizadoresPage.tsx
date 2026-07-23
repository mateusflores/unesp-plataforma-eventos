import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { services } from '@/services';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable } from '@/components/admin/DataTable';
import type { Coluna } from '@/components/admin/DataTable';
import { Avatar, Badge } from '@/components/ui';
import { tipoEntidadeRotulo } from '@/utils/dominio';
import type { Organizador } from '@/types';

export function AdminOrganizadoresPage() {
  const [organizadores, setOrganizadores] = useState<Organizador[] | null>(null);
  useEffect(() => { services.organizers.listar().then(setOrganizadores); }, []);

  const colunas: Coluna<Organizador>[] = [
    {
      chave: 'nome', titulo: 'Organizador', ordenavel: true, valorOrdenacao: (o) => o.nome,
      render: (o) => (
        <div className="row gap-3">
          <Avatar nome={o.nome} cor={o.avatarCor} tamanho={34} />
          <div>
            <strong className="text-sm row gap-1">{o.nome.split('—')[0].trim()} {o.verificado && <Star size={12} fill="var(--brand-500)" color="var(--brand-500)" />}</strong>
            <div className="text-xs text-muted">{o.entidade?.emailContato ?? 'Organizador individual'}</div>
          </div>
        </div>
      ),
    },
    { chave: 'tipo', titulo: 'Tipo', render: (o) => <Badge tom="neutro">{o.entidade ? tipoEntidadeRotulo[o.entidade.tipo] : 'Usuário'}</Badge> },
    { chave: 'verif', titulo: 'Status', render: (o) => (o.verificado ? <Badge tom="sucesso" ponto>Verificado</Badge> : <Badge tom="aviso" ponto>Pendente</Badge>) },
    { chave: 'eventos', titulo: 'Eventos', ordenavel: true, valorOrdenacao: (o) => o.eventosRealizados ?? 0, alinhar: 'right', render: (o) => <strong>{o.eventosRealizados ?? 0}</strong> },
  ];

  return (
    <div>
      <PageHeader titulo="Organizadores" subtitulo="Atléticas, centros acadêmicos, empresas juniores e comissões." />
      <DataTable itens={organizadores} colunas={colunas} keyOf={(o) => o.id} buscaEm={(o) => o.nome} placeholderBusca="Buscar organizador…" />
    </div>
  );
}
