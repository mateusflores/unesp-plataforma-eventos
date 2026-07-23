import { useEffect, useState } from 'react';
import { BadgePercent, Plus, Pencil } from 'lucide-react';
import { services, ApiError } from '@/services';
import { useToast } from '@/contexts/ToastContext';
import { useOrganizadorIds, useEventosDoOrganizador } from '@/hooks/useOrganizer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge, Button, Input, Select, Switch, Modal, Skeleton, EmptyState } from '@/components/ui';
import { moeda, dataCurta } from '@/utils/format';
import type { Cupom, TipoDesconto } from '@/types';
import type { Tom } from '@/utils/dominio';

function estadoCupom(c: Cupom): { rotulo: string; tom: Tom } {
  if (!c.ativo) return { rotulo: 'Desativado', tom: 'neutro' };
  if (new Date(c.validade) < new Date(2026, 6, 10)) return { rotulo: 'Expirado', tom: 'perigo' };
  if (c.quantidadeUsada >= c.quantidadeMaxima) return { rotulo: 'Esgotado', tom: 'aviso' };
  return { rotulo: 'Ativo', tom: 'sucesso' };
}

export function OrgCuponsPage() {
  const toast = useToast();
  const orgIds = useOrganizadorIds();
  const eventosAsync = useEventosDoOrganizador();
  const [cupons, setCupons] = useState<Cupom[] | null>(null);
  const [editar, setEditar] = useState<Partial<Cupom> | null>(null);

  const carregar = async () => {
    const listas = await Promise.all(orgIds.map((id) => services.coupons.doOrganizador(id)));
    const map = new Map<number, Cupom>();
    listas.flat().forEach((c) => map.set(c.id, c));
    setCupons(Array.from(map.values()));
  };

  useEffect(() => {
    if (orgIds.length) carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgIds.join(',')]);

  const salvar = async () => {
    if (!editar) return;
    try {
      await services.coupons.salvar(editar);
      toast.sucesso(editar.id ? 'Cupom atualizado' : 'Cupom criado');
      setEditar(null);
      carregar();
    } catch (e) {
      toast.erro('Erro', e instanceof ApiError ? e.message : undefined);
    }
  };

  const alternar = async (id: number) => {
    await services.coupons.alternarAtivo(id);
    carregar();
  };

  const eventosPagos = (eventosAsync.data ?? []).filter((e) => !e.gratuito);

  return (
    <div>
      <PageHeader
        titulo="Cupons"
        subtitulo="Crie descontos percentuais ou de valor fixo para seus eventos."
        acoes={<Button iconeEsq={<Plus size={16} />} onClick={() => setEditar({ tipo: 'PERCENTUAL', valor: 10, quantidadeMaxima: 100, ativo: true, validade: '2026-08-31T23:59:59', eventoId: eventosPagos[0]?.id })}>Novo cupom</Button>}
      />

      {cupons === null ? (
        <Skeleton h={280} radius="var(--radius-lg)" />
      ) : cupons.length === 0 ? (
        <EmptyState icone={<BadgePercent size={28} />} titulo="Nenhum cupom" descricao="Crie cupons de desconto para impulsionar suas vendas." acao={<Button onClick={() => setEditar({ tipo: 'PERCENTUAL', valor: 10, quantidadeMaxima: 100, ativo: true, validade: '2026-08-31T23:59:59', eventoId: eventosPagos[0]?.id })}>Criar cupom</Button>} />
      ) : (
        <div className="tabela-wrap">
          <table className="tabela">
            <thead>
              <tr><th>Código</th><th>Desconto</th><th>Usos</th><th>Validade</th><th>Estado</th><th>Ativo</th><th style={{ textAlign: 'right' }}>Editar</th></tr>
            </thead>
            <tbody>
              {cupons.map((c) => {
                const est = estadoCupom(c);
                return (
                  <tr key={c.id}>
                    <td><strong style={{ fontFamily: 'var(--font-mono)' }}>{c.codigo}</strong></td>
                    <td>{c.tipo === 'PERCENTUAL' ? `${c.valor}%` : moeda(c.valor)}</td>
                    <td>{c.quantidadeUsada}/{c.quantidadeMaxima}</td>
                    <td className="text-secondary">{dataCurta(c.validade)}</td>
                    <td><Badge tom={est.tom} ponto>{est.rotulo}</Badge></td>
                    <td><Switch checked={c.ativo} onChange={() => alternar(c.id)} /></td>
                    <td style={{ textAlign: 'right' }}><Button variante="ghost" tamanho="sm" apenasIcone iconeEsq={<Pencil size={16} />} onClick={() => setEditar(c)} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        aberto={!!editar}
        onFechar={() => setEditar(null)}
        titulo={editar?.id ? 'Editar cupom' : 'Novo cupom'}
        footer={<><Button variante="ghost" onClick={() => setEditar(null)}>Cancelar</Button><Button onClick={salvar}>Salvar</Button></>}
      >
        {editar && (
          <div className="col gap-4">
            <Input label="Código" value={editar.codigo ?? ''} onChange={(e) => setEditar({ ...editar, codigo: e.target.value.toUpperCase() })} placeholder="EX: CALOURO10" />
            <div className="form-grid">
              <Select label="Tipo" value={editar.tipo} onChange={(e) => setEditar({ ...editar, tipo: e.target.value as TipoDesconto })}>
                <option value="PERCENTUAL">Percentual (%)</option>
                <option value="VALOR_FIXO">Valor fixo (R$)</option>
              </Select>
              <Input type="number" label="Valor" value={editar.valor ?? 0} onChange={(e) => setEditar({ ...editar, valor: Number(e.target.value) })} />
              <Input type="number" label="Quantidade máxima" value={editar.quantidadeMaxima ?? 0} onChange={(e) => setEditar({ ...editar, quantidadeMaxima: Number(e.target.value) })} />
              <Input type="date" label="Validade" value={(editar.validade ?? '').slice(0, 10)} onChange={(e) => setEditar({ ...editar, validade: `${e.target.value}T23:59:59` })} />
            </div>
            <Select label="Evento" value={editar.eventoId ?? ''} onChange={(e) => setEditar({ ...editar, eventoId: e.target.value ? Number(e.target.value) : undefined })}>
              <option value="">Todos os eventos</option>
              {eventosPagos.map((e) => <option key={e.id} value={e.id}>{e.titulo}</option>)}
            </Select>
            <Switch checked={editar.ativo ?? true} onChange={(v) => setEditar({ ...editar, ativo: v })} label="Cupom ativo" />
          </div>
        )}
      </Modal>
    </div>
  );
}
