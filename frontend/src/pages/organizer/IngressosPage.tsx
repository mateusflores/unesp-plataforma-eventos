import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Ticket } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge, Skeleton, EmptyState, ErrorState, Button } from '@/components/ui';
import { useEventosDoOrganizador } from '@/hooks/useOrganizer';
import { moeda, dataCurta } from '@/utils/format';
import type { Tom } from '@/utils/dominio';

export function OrgIngressosPage() {
  const { data, estado, statusHttp, erro, recarregar } = useEventosDoOrganizador();

  const linhas = useMemo(() => {
    const hoje = new Date(2026, 6, 10).getTime();
    return (data ?? [])
      .filter((e) => !e.gratuito && e.ingressos.length > 0)
      .flatMap((e) =>
        e.ingressos.flatMap((ing) =>
          ing.lotes.map((l) => {
            const ini = new Date(l.dataInicio).getTime();
            const fim = new Date(l.dataFim).getTime();
            let estado: { rotulo: string; tom: Tom };
            if (l.quantidadeDisponivel <= 0) estado = { rotulo: 'Esgotado', tom: 'perigo' };
            else if (hoje < ini) estado = { rotulo: 'Futuro', tom: 'info' };
            else if (hoje > fim) estado = { rotulo: 'Encerrado', tom: 'neutro' };
            else estado = { rotulo: 'Ativo', tom: 'sucesso' };
            return { evento: e, ingresso: ing, lote: l, estado };
          }),
        ),
      );
  }, [data]);

  if (estado === 'error') return <ErrorState status={statusHttp} mensagem={erro} onRetry={recarregar} />;

  return (
    <div>
      <PageHeader titulo="Ingressos e lotes" subtitulo="Acompanhe preços, disponibilidade e o período de venda de cada lote." />
      {estado === 'loading' || estado === 'idle' ? (
        <Skeleton h={320} radius="var(--radius-lg)" />
      ) : linhas.length === 0 ? (
        <EmptyState icone={<Ticket size={28} />} titulo="Nenhum ingresso pago" descricao="Crie um evento pago com tipos de ingresso para gerenciá-los aqui." acao={<Link to="/organizador/eventos/novo"><Button>Criar evento</Button></Link>} />
      ) : (
        <div className="tabela-wrap">
          <table className="tabela">
            <thead>
              <tr>
                <th>Evento</th><th>Ingresso</th><th>Lote</th><th>Preço</th><th>Disponível</th><th>Período</th><th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {linhas.map(({ evento, ingresso, lote, estado }) => (
                <tr key={`${evento.id}-${lote.id}`}>
                  <td><strong>{evento.titulo}</strong></td>
                  <td>{ingresso.nome}</td>
                  <td className="text-secondary">{lote.nome}</td>
                  <td>{moeda(lote.preco)}</td>
                  <td>{lote.quantidadeDisponivel}/{lote.quantidadeTotal}</td>
                  <td className="text-secondary">{dataCurta(lote.dataInicio)} – {dataCurta(lote.dataFim)}</td>
                  <td><Badge tom={estado.tom} ponto>{estado.rotulo}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
