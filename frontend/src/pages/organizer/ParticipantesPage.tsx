import { useEffect, useMemo, useState } from 'react';
import { Search, Users, Download } from 'lucide-react';
import { services } from '@/services';
import { useEventosDoOrganizador } from '@/hooks/useOrganizer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Avatar, Badge, Select, Skeleton, EmptyState } from '@/components/ui';
import { dataHora } from '@/utils/format';
import { statusInscricaoInfo, statusIngressoInfo } from '@/utils/dominio';
import { normalize } from '@/services/utils';
import type { Usuario } from '@/types';

interface Linha {
  usuario?: Usuario;
  tipo: 'Inscrição' | 'Ingresso';
  detalhe: string;
  statusRotulo: string;
  statusTom: 'sucesso' | 'aviso' | 'perigo' | 'neutro';
  data: string;
  checkin?: string;
}

export function OrgParticipantesPage() {
  const eventosAsync = useEventosDoOrganizador();
  const [eventoId, setEventoId] = useState<number | null>(null);
  const [busca, setBusca] = useState('');
  const [linhas, setLinhas] = useState<Linha[] | null>(null);

  const eventos = eventosAsync.data ?? [];
  useEffect(() => {
    if (!eventoId && eventos.length) setEventoId(eventos[0].id);
  }, [eventos, eventoId]);

  useEffect(() => {
    if (!eventoId) return;
    setLinhas(null);
    (async () => {
      const [inscricoes, ingressos, usuarios] = await Promise.all([
        services.registrations.participantesDoEvento(eventoId),
        services.tickets.doEvento(eventoId),
        services.admin.usuarios(),
      ]);
      const mapU = new Map(usuarios.map((u) => [u.id, u]));
      const rows: Linha[] = [];
      inscricoes.forEach((i) => {
        const info = statusInscricaoInfo[i.status];
        rows.push({ usuario: mapU.get(i.usuarioId), tipo: 'Inscrição', detalhe: 'Evento gratuito', statusRotulo: info.rotulo, statusTom: info.tom as Linha['statusTom'], data: i.data });
      });
      ingressos.forEach((t) => {
        const info = statusIngressoInfo[t.status];
        rows.push({ usuario: mapU.get(t.usuarioId), tipo: 'Ingresso', detalhe: `${t.ingressoNome} · ${t.loteNome}`, statusRotulo: info.rotulo, statusTom: info.tom as Linha['statusTom'], data: t.dataEmissao, checkin: t.checkIn?.dataHora });
      });
      setLinhas(rows.sort((a, b) => b.data.localeCompare(a.data)));
    })();
  }, [eventoId]);

  const filtradas = useMemo(
    () => (linhas ?? []).filter((l) => (busca ? normalize(l.usuario?.nome ?? '').includes(normalize(busca)) || normalize(l.usuario?.email ?? '').includes(normalize(busca)) : true)),
    [linhas, busca],
  );

  return (
    <div>
      <PageHeader titulo="Participantes" subtitulo="Inscritos e compradores de ingressos por evento." />

      <div className="toolbar">
        <Select value={eventoId ?? ''} onChange={(e) => setEventoId(Number(e.target.value))} aria-label="Evento">
          {eventos.map((e) => <option key={e.id} value={e.id}>{e.titulo}</option>)}
        </Select>
        <label className="busca-inline">
          <Search size={17} />
          <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por nome ou e-mail…" aria-label="Buscar participante" />
        </label>
        <button className="btn btn--secondary btn--sm" onClick={() => alert('Exportação simulada (CSV).')}><Download size={15} /> Exportar</button>
      </div>

      {eventosAsync.estado === 'loading' || linhas === null ? (
        <Skeleton h={320} radius="var(--radius-lg)" />
      ) : filtradas.length === 0 ? (
        <EmptyState icone={<Users size={28} />} titulo="Sem participantes" descricao="Ainda não há inscritos ou compradores para este evento." />
      ) : (
        <div className="tabela-wrap">
          <table className="tabela">
            <thead>
              <tr><th>Participante</th><th>Tipo</th><th>Detalhe</th><th>Status</th><th>Data</th><th>Check-in</th></tr>
            </thead>
            <tbody>
              {filtradas.map((l, i) => (
                <tr key={i}>
                  <td>
                    <div className="row gap-3">
                      <Avatar nome={l.usuario?.nome ?? '??'} cor={l.usuario?.avatarCor} tamanho={34} />
                      <div>
                        <strong className="text-sm">{l.usuario?.nome ?? 'Usuário'}</strong>
                        <div className="text-xs text-muted">{l.usuario?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><Badge tom={l.tipo === 'Ingresso' ? 'brand' : 'neutro'}>{l.tipo}</Badge></td>
                  <td className="text-secondary">{l.detalhe}</td>
                  <td><Badge tom={l.statusTom} ponto>{l.statusRotulo}</Badge></td>
                  <td className="text-secondary">{dataHora(l.data)}</td>
                  <td>{l.checkin ? <Badge tom="sucesso">{dataHora(l.checkin)}</Badge> : <span className="text-muted">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
