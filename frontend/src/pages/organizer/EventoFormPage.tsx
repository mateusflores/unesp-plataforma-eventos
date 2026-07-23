import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Save, Send, Plus, Trash2, Eye } from 'lucide-react';
import { services, ApiError } from '@/services';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCatalog } from '@/contexts/CatalogContext';
import { useOrganizadorIds } from '@/hooks/useOrganizer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button, Input, Textarea, Select, Switch, Chip, Stepper, Badge, Skeleton } from '@/components/ui';
import { moeda, intervalo } from '@/utils/format';
import type { Evento, Ingresso, Lote } from '@/types';

const ETAPAS = ['Informações', 'Data & Local', 'Categorias', 'Ingressos', 'Revisão'];

const paraInputDateTime = (iso: string): string => {
  if (!iso) return '';
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
};

interface FormState {
  titulo: string;
  resumo: string;
  descricao: string;
  imagemCapa: string;
  gratuito: boolean;
  publico: boolean;
  dataInicio: string;
  dataFim: string;
  universidadeId: number;
  campusId: number;
  local: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  cep: string;
  capacidade: number;
  categoriaIds: number[];
  tagIds: number[];
  ingressos: Ingresso[];
}

const vazio = (organizadorId: number, uniId: number, campusId: number): FormState => ({
  titulo: '',
  resumo: '',
  descricao: '',
  imagemCapa: '',
  gratuito: true,
  publico: true,
  dataInicio: '',
  dataFim: '',
  universidadeId: uniId,
  campusId,
  local: '',
  logradouro: '',
  numero: '',
  bairro: '',
  cidade: '',
  cep: '',
  capacidade: 100,
  categoriaIds: [],
  tagIds: [],
  ingressos: [],
});

export function OrgEventoFormPage() {
  const { id } = useParams();
  const editando = !!id;
  const navigate = useNavigate();
  const toast = useToast();
  const { usuario } = useAuth();
  const { categorias, tags, universidades, campi } = useCatalog();
  const orgIds = useOrganizadorIds();

  const [etapa, setEtapa] = useState(0);
  const [form, setForm] = useState<FormState | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [erros, setErros] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editando) {
      services.events.porId(Number(id)).then((ev) => setForm(fromEvento(ev)));
    } else {
      setForm(vazio(orgIds[0] ?? 6, universidades[0]?.id ?? 1, 1));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => (f ? { ...f, [k]: v } : f));

  const campiFiltrados = useMemo(
    () => (form ? campi.filter((c) => c.universidadeId === form.universidadeId) : []),
    [form, campi],
  );

  if (!form) return <Skeleton h={480} radius="var(--radius-lg)" />;

  const validarEtapa = (): boolean => {
    const e: Record<string, string> = {};
    if (etapa === 0) {
      if (form.titulo.trim().length < 4) e.titulo = 'Dê um título com ao menos 4 caracteres.';
      if (form.resumo.trim().length < 8) e.resumo = 'Escreva um resumo curto.';
    }
    if (etapa === 1) {
      if (!form.dataInicio) e.dataInicio = 'Informe a data de início.';
      if (!form.dataFim) e.dataFim = 'Informe a data de término.';
      if (form.dataInicio && form.dataFim && form.dataFim < form.dataInicio) e.dataFim = 'O término deve ser após o início.';
      if (!form.local.trim()) e.local = 'Informe o local.';
    }
    setErros(e);
    return Object.keys(e).length === 0;
  };

  const proximo = () => {
    if (validarEtapa()) setEtapa((s) => Math.min(ETAPAS.length - 1, s + 1));
  };

  const montarPayload = (): Partial<Evento> => ({
    titulo: form.titulo,
    resumo: form.resumo,
    descricao: form.descricao,
    imagemCapa: form.imagemCapa || undefined,
    gratuito: form.gratuito,
    publico: form.publico,
    dataInicio: form.dataInicio,
    dataFim: form.dataFim,
    universidadeId: form.universidadeId,
    campusId: form.campusId,
    local: form.local,
    capacidade: Number(form.capacidade),
    categoriaIds: form.categoriaIds,
    tagIds: form.tagIds,
    ingressos: form.gratuito ? [] : form.ingressos,
    organizadorId: orgIds[0] ?? 6,
    endereco: {
      id: 0,
      logradouro: form.logradouro,
      numero: form.numero,
      bairro: form.bairro,
      cidade: form.cidade,
      estado: 'SP',
      cep: form.cep,
    },
  });

  const salvar = async (status: 'RASCUNHO' | 'PUBLICADO') => {
    if (!validarEtapa()) return;
    setSalvando(true);
    try {
      const payload = { ...montarPayload(), status };
      if (editando) {
        await services.events.atualizar(Number(id), payload);
        toast.sucesso(status === 'PUBLICADO' ? 'Evento publicado!' : 'Rascunho salvo');
      } else {
        await services.events.criar(payload);
        toast.sucesso(status === 'PUBLICADO' ? 'Evento criado e publicado!' : 'Rascunho salvo');
      }
      navigate('/organizador/eventos');
    } catch (e) {
      toast.erro('Erro ao salvar', e instanceof ApiError ? e.message : undefined);
    } finally {
      setSalvando(false);
    }
  };

  const toggleId = (campo: 'categoriaIds' | 'tagIds', id2: number) => {
    const atual = form[campo];
    set(campo, atual.includes(id2) ? atual.filter((x) => x !== id2) : [...atual, id2]);
  };

  return (
    <div>
      <Link to="/organizador/eventos" className="row gap-2 text-sm text-secondary mb-4" style={{ width: 'fit-content' }}>
        <ArrowLeft size={16} /> Voltar
      </Link>
      <PageHeader titulo={editando ? 'Editar evento' : 'Criar evento'} subtitulo={`Passo ${etapa + 1} de ${ETAPAS.length} — ${ETAPAS[etapa]}`} />

      <div className="mb-6"><Stepper etapas={ETAPAS} atual={etapa} /></div>

      <div className="painel" style={{ maxWidth: 780 }}>
        {etapa === 0 && (
          <div className="col gap-4">
            <Input label="Título do evento" obrigatorio value={form.titulo} onChange={(e) => set('titulo', e.target.value)} erro={erros.titulo} placeholder="Ex.: SECComp 2026" />
            <Input label="Resumo" obrigatorio value={form.resumo} onChange={(e) => set('resumo', e.target.value)} erro={erros.resumo} hint="Uma frase que aparece nos cards." />
            <Textarea label="Descrição completa" value={form.descricao} onChange={(e) => set('descricao', e.target.value)} placeholder="Conte tudo sobre o evento…" />
            <Input label="Imagem de capa (URL)" value={form.imagemCapa} onChange={(e) => set('imagemCapa', e.target.value)} hint="Opcional — deixamos um gradiente bonito se vazio." />
            <div className="row gap-6 wrap">
              <Switch checked={form.gratuito} onChange={(v) => set('gratuito', v)} label="Evento gratuito" />
              <Switch checked={form.publico} onChange={(v) => set('publico', v)} label="Visível publicamente" />
            </div>
          </div>
        )}

        {etapa === 1 && (
          <div className="col gap-4">
            <div className="form-grid">
              <Input type="datetime-local" label="Início" obrigatorio value={form.dataInicio} onChange={(e) => set('dataInicio', e.target.value)} erro={erros.dataInicio} />
              <Input type="datetime-local" label="Término" obrigatorio value={form.dataFim} onChange={(e) => set('dataFim', e.target.value)} erro={erros.dataFim} />
              <Select label="Universidade" value={form.universidadeId} onChange={(e) => set('universidadeId', Number(e.target.value))}>
                {universidades.map((u) => <option key={u.id} value={u.id}>{u.sigla} — {u.nome}</option>)}
              </Select>
              <Select label="Campus" value={form.campusId} onChange={(e) => set('campusId', Number(e.target.value))}>
                {campiFiltrados.map((c) => <option key={c.id} value={c.id}>{c.nome} · {c.cidade}</option>)}
              </Select>
            </div>
            <Input label="Nome do local" obrigatorio value={form.local} onChange={(e) => set('local', e.target.value)} erro={erros.local} placeholder="Ex.: Auditório Central" />
            <div className="form-grid">
              <Input label="Logradouro" value={form.logradouro} onChange={(e) => set('logradouro', e.target.value)} />
              <Input label="Número" value={form.numero} onChange={(e) => set('numero', e.target.value)} />
              <Input label="Bairro" value={form.bairro} onChange={(e) => set('bairro', e.target.value)} />
              <Input label="CEP" value={form.cep} onChange={(e) => set('cep', e.target.value)} />
              <Input className="col-span" type="number" label="Capacidade" value={form.capacidade} onChange={(e) => set('capacidade', Number(e.target.value))} />
            </div>
          </div>
        )}

        {etapa === 2 && (
          <div className="col gap-6">
            <div>
              <div className="filtro-grupo__titulo">Categorias</div>
              <div className="filtro-opcoes">
                {categorias.map((c) => (
                  <Chip key={c.id} cor={c.cor} ativo={form.categoriaIds.includes(c.id)} onClick={() => toggleId('categoriaIds', c.id)}>{c.nome}</Chip>
                ))}
              </div>
            </div>
            <div>
              <div className="filtro-grupo__titulo">Tags</div>
              <div className="filtro-opcoes">
                {tags.map((t) => (
                  <Chip key={t.id} ativo={form.tagIds.includes(t.id)} onClick={() => toggleId('tagIds', t.id)}>#{t.nome}</Chip>
                ))}
              </div>
            </div>
          </div>
        )}

        {etapa === 3 && (
          <IngressosEditor
            gratuito={form.gratuito}
            ingressos={form.ingressos}
            onChange={(ings) => set('ingressos', ings)}
          />
        )}

        {etapa === 4 && <Revisao form={form} categorias={categorias} />}

        {/* Navegação */}
        <div className="row-between mt-8" style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--sp-5)' }}>
          <div>
            {etapa > 0 && <Button variante="ghost" onClick={() => setEtapa((s) => s - 1)}>Voltar</Button>}
          </div>
          <div className="row gap-2">
            <Button variante="secondary" carregando={salvando} onClick={() => salvar('RASCUNHO')} iconeEsq={<Save size={16} />}>Salvar rascunho</Button>
            {etapa < ETAPAS.length - 1 ? (
              <Button onClick={proximo} iconeDir={<ArrowRight size={16} />}>Continuar</Button>
            ) : (
              <Button carregando={salvando} onClick={() => salvar('PUBLICADO')} iconeEsq={<Send size={16} />}>Publicar evento</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- Editor de ingressos e lotes ----
function IngressosEditor({ gratuito, ingressos, onChange }: { gratuito: boolean; ingressos: Ingresso[]; onChange: (i: Ingresso[]) => void }) {
  if (gratuito) {
    return (
      <div className="state-panel">
        <Badge tom="sucesso" ponto>Evento gratuito</Badge>
        <p className="text-sm text-secondary" style={{ maxWidth: 380 }}>
          Eventos gratuitos usam inscrição simples (sem ingressos pagos). Para vender ingressos, desative “gratuito” na etapa 1.
        </p>
      </div>
    );
  }

  const addIngresso = () => {
    const id = -Date.now();
    onChange([...ingressos, { id, eventoId: 0, nome: 'Novo ingresso', descricao: '', lotes: [novoLote(id)] }]);
  };
  const novoLote = (ingressoId: number): Lote => ({
    id: -Date.now() - Math.random(),
    ingressoId,
    nome: '1º Lote',
    preco: 20,
    quantidadeTotal: 100,
    quantidadeDisponivel: 100,
    dataInicio: '',
    dataFim: '',
  });
  const upIngresso = (idx: number, patch: Partial<Ingresso>) => {
    const nova = [...ingressos];
    nova[idx] = { ...nova[idx], ...patch };
    onChange(nova);
  };
  const upLote = (i: number, li: number, patch: Partial<Lote>) => {
    const nova = [...ingressos];
    const lotes = [...nova[i].lotes];
    lotes[li] = { ...lotes[li], ...patch };
    nova[i] = { ...nova[i], lotes };
    onChange(nova);
  };

  return (
    <div className="col gap-4">
      {ingressos.length === 0 && <p className="text-sm text-muted">Nenhum tipo de ingresso ainda. Adicione o primeiro.</p>}
      {ingressos.map((ing, i) => (
        <div key={ing.id} className="painel">
          <div className="row gap-2">
            <Input label="Nome do ingresso" value={ing.nome} onChange={(e) => upIngresso(i, { nome: e.target.value })} className="grow" />
            <Button variante="ghost" apenasIcone iconeEsq={<Trash2 size={16} />} onClick={() => onChange(ingressos.filter((_, x) => x !== i))} style={{ alignSelf: 'flex-end' }} />
          </div>
          {ing.lotes.map((l, li) => (
            <div key={l.id} className="form-grid--3 mt-3">
              <Input label="Lote" value={l.nome} onChange={(e) => upLote(i, li, { nome: e.target.value })} />
              <Input type="number" label="Preço (R$)" value={l.preco} onChange={(e) => upLote(i, li, { preco: Number(e.target.value) })} />
              <Input type="number" label="Quantidade" value={l.quantidadeTotal} onChange={(e) => upLote(i, li, { quantidadeTotal: Number(e.target.value), quantidadeDisponivel: Number(e.target.value) })} />
            </div>
          ))}
          <Button variante="ghost" tamanho="sm" className="mt-3" iconeEsq={<Plus size={14} />} onClick={() => upIngresso(i, { lotes: [...ing.lotes, novoLote(ing.id)] })}>Adicionar lote</Button>
        </div>
      ))}
      <Button variante="secondary" iconeEsq={<Plus size={16} />} onClick={addIngresso}>Adicionar tipo de ingresso</Button>
    </div>
  );
}

function Revisao({ form, categorias }: { form: FormState; categorias: { id: number; nome: string }[] }) {
  return (
    <div className="col gap-4">
      <div className="row gap-2"><Eye size={18} /> <strong>Revise antes de publicar</strong></div>
      <div className="painel">
        <div className="def-list">
          <div className="def-list__row"><span>Título</span><span>{form.titulo || '—'}</span></div>
          <div className="def-list__row"><span>Quando</span><span>{form.dataInicio && form.dataFim ? intervalo(form.dataInicio, form.dataFim) : '—'}</span></div>
          <div className="def-list__row"><span>Local</span><span>{form.local || '—'}</span></div>
          <div className="def-list__row"><span>Capacidade</span><span>{form.capacidade}</span></div>
          <div className="def-list__row"><span>Tipo</span><span>{form.gratuito ? 'Gratuito' : 'Pago'}</span></div>
          <div className="def-list__row"><span>Categorias</span><span>{form.categoriaIds.map((id) => categorias.find((c) => c.id === id)?.nome).filter(Boolean).join(', ') || '—'}</span></div>
          {!form.gratuito && (
            <div className="def-list__row"><span>Ingressos</span><span>{form.ingressos.length ? form.ingressos.map((i) => `${i.nome} (${moeda(i.lotes[0]?.preco ?? 0)})`).join(', ') : 'Nenhum'}</span></div>
          )}
        </div>
      </div>
      <p className="text-sm text-muted">Ao publicar, o evento fica visível para todos. Você pode salvar como rascunho e voltar depois.</p>
    </div>
  );
}

function fromEvento(ev: Evento): FormState {
  return {
    titulo: ev.titulo,
    resumo: ev.resumo,
    descricao: ev.descricao,
    imagemCapa: ev.imagemCapa,
    gratuito: ev.gratuito,
    publico: ev.publico,
    dataInicio: paraInputDateTime(ev.dataInicio),
    dataFim: paraInputDateTime(ev.dataFim),
    universidadeId: ev.universidadeId,
    campusId: ev.campusId,
    local: ev.local,
    logradouro: ev.endereco.logradouro,
    numero: ev.endereco.numero,
    bairro: ev.endereco.bairro,
    cidade: ev.endereco.cidade,
    cep: ev.endereco.cep,
    capacidade: ev.capacidade,
    categoriaIds: ev.categoriaIds,
    tagIds: ev.tagIds,
    ingressos: ev.ingressos,
  };
}
