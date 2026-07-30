import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Sparkles, CalendarDays, Ticket, Star } from 'lucide-react';
import { services } from '@/services';
import { useAsync } from '@/hooks/useAsync';
import { useCatalog } from '@/contexts/CatalogContext';
import { Button, Badge, Avatar } from '@/components/ui';
import { EventCard, EventCardSkeleton } from '@/components/events/EventCard';
import { CategoryIcon } from '@/components/CategoryIcon';
import { tipoEntidadeRotulo } from '@/utils/dominio';
import { hora, dataCurta } from '@/utils/format';

export function HomePage() {
  const navigate = useNavigate();
  const [busca, setBusca] = useState('');
  const { categorias, organizadores } = useCatalog();

  const destaques = useAsync(() => services.events.destaques(), []);
  const proximos = useAsync(() => services.events.listar({ status: undefined }, 1, 6), []);
  const gratuitos = useAsync(() => services.events.listar({ gratuito: true }, 1, 3), []);

  const orgDestaque = organizadores.filter((o) => o.verificado).slice(0, 4);

  const irBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/explorar?busca=${encodeURIComponent(busca)}`);
  };

  return (
    <>

      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(107,114,255,0.16),_transparent_32%),radial-gradient(circle_at_90%_10%,_rgba(255,92,138,0.12),_transparent_35%)] py-16 sm:py-20">
        <div className="container grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <Badge tom="brand" ponto>Agenda universitária 2026</Badge>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-[0.95] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-slate-100">
              Tudo o que rola no <span className="bg-gradient-to-r from-brand-600 to-accent-500 bg-clip-text text-transparent">seu campus</span>, em um só calendário.
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
              Descubra palestras, festas, workshops, semanas acadêmicas e campeonatos. Inscreva-se, compre
              ingressos e leve tudo no bolso com QR Code.
            </p>
            <form className="mt-6 flex max-w-2xl flex-wrap items-center gap-2 rounded-full border border-slate-200 bg-white/90 p-2 shadow-lg shadow-slate-200/60 dark:border-slate-700 dark:bg-slate-900/80 dark:shadow-none" onSubmit={irBuscar}>
              <Search size={20} className="ml-3 text-slate-500" />
              <input
                className="flex-1 bg-transparent px-2 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="O que você quer viver hoje?"
                aria-label="Buscar eventos"
              />
              <Button type="submit" iconeDir={<ArrowRight size={16} />}>Buscar</Button>
            </form>

            <div className="mt-8 flex flex-wrap gap-6">
              <div><strong className="block font-display text-2xl font-semibold text-slate-900 dark:text-slate-100">+120</strong><span className="text-sm text-slate-500 dark:text-slate-400">eventos por mês</span></div>
              <div><strong className="block font-display text-2xl font-semibold text-slate-900 dark:text-slate-100">4</strong><span className="text-sm text-slate-500 dark:text-slate-400">universidades</span></div>
              <div><strong className="block font-display text-2xl font-semibold text-slate-900 dark:text-slate-100">8</strong><span className="text-sm text-slate-500 dark:text-slate-400">campi conectados</span></div>
            </div>
          </div>
          <div>
            <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-xl shadow-slate-200/70 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-none">
              <div className="mb-4 flex items-center justify-between">
                <strong className="font-display text-lg text-slate-900 dark:text-slate-100">Esta semana</strong>
                <Badge tom="accent">Ao vivo</Badge>
              </div>
              <div className="space-y-3">
                {[
                  { cor: '#ff5c8a', t: 'Cervejada da Comp', s: '18 jul · 22h' },
                  { cor: '#3b82f6', t: 'Palestra de IA', s: '15 jul · 19h' },
                  { cor: '#5b4be6', t: 'SECComp 2026', s: '13 jul · 9h' },
                ].map((p) => (
                  <div key={p.t} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/70">
                    <span className="h-full w-1.5 rounded-full" style={{ background: p.cor }} />
                    <div>
                      <strong className="block text-sm text-slate-900 dark:text-slate-100">{p.t}</strong>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{p.s}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DESTAQUES */}

      <section className="container py-10 sm:py-14">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold text-slate-900 dark:text-slate-100">Em destaque</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Os eventos que estão bombando agora</p>
          </div>
          <Link to="/explorar?destaque=1" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 transition hover:gap-3 dark:text-brand-400">Ver todos <ArrowRight size={15} /></Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {destaques.estado === 'loading'
            ? Array.from({ length: 3 }).map((_, i) => <EventCardSkeleton key={i} />)
            : destaques.data?.map((ev) => <EventCard key={ev.id} evento={ev} />)}
        </div>
      </section>

      {/* CATEGORIAS */}

      <section className="container py-10 sm:py-14">
        <div className="mb-6">
          <h2 className="font-display text-2xl font-semibold text-slate-900 dark:text-slate-100">Explore por categoria</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Encontre exatamente o tipo de evento que combina com você</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categorias.map((c) => (
            <Link key={c.id} to={`/explorar?categoria=${c.id}`} className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900" style={{ ['--cat' as string]: c.cor }}>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl text-lg" style={{ backgroundColor: `${c.cor}1A`, color: c.cor }}><CategoryIcon nome={c.icone} size={22} /></span>
              <strong className="text-sm font-semibold text-slate-900 dark:text-slate-100">{c.nome}</strong>
            </Link>
          ))}
        </div>
      </section>

      {/* PRÓXIMOS */}

      <section className="container py-10 sm:py-14">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold text-slate-900 dark:text-slate-100">Próximos eventos</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Não perca o que vem por aí no seu campus</p>
          </div>
          <Link to="/calendario" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 transition hover:gap-3 dark:text-brand-400">Ver calendário <CalendarDays size={15} /></Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {proximos.estado === 'loading'
            ? Array.from({ length: 6 }).map((_, i) => <EventCardSkeleton key={i} />)
            : proximos.data?.itens.map((ev) => <EventCard key={ev.id} evento={ev} />)}
        </div>
      </section>

      {/* GRATUITOS + ORGANIZADORES */}

      <section className="container py-10 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-start">
          <div>
            <div className="mb-4">
              <h2 className="font-display text-2xl font-semibold text-slate-900 dark:text-slate-100">Bombando e de graça</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Eventos gratuitos para aproveitar</p>
            </div>
            <div className="space-y-3">
              {gratuitos.data?.itens.map((ev) => (
                <Link key={ev.id} to={`/eventos/${ev.slug}`} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-brand-500 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                  <span className="h-full w-1.5 rounded-full bg-emerald-500" />
                  <div className="min-w-0 flex-1">
                    <strong className="block text-sm font-semibold text-slate-900 dark:text-slate-100">{ev.titulo}</strong>
                    <span className="text-sm text-slate-500 dark:text-slate-400">{dataCurta(ev.dataInicio)} · {hora(ev.dataInicio)} · {ev.local}</span>
                  </div>
                  <Badge tom="sucesso">Gratuito</Badge>
                </Link>
              )) ?? <EventCardSkeleton />}
            </div>
          </div>
          <div>

            <div className="mb-4">
              <h2 className="font-display text-2xl font-semibold text-slate-900 dark:text-slate-100">Organizadores</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Atléticas, CAs e EJs em destaque</p>
            </div>
            <div className="space-y-3">
              {orgDestaque.map((o) => (
                <div key={o.id} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                  <Avatar nome={o.nome} cor={o.avatarCor} tamanho={40} />
                  <div className="min-w-0 flex-1">
                    <strong className="flex items-center gap-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {o.nome.split('—')[0].trim()}
                      {o.verificado && <Star size={13} fill="#6f57e8" color="#6f57e8" />}
                    </strong>
                    <span className="text-sm text-slate-500 dark:text-slate-400">{o.entidade ? tipoEntidadeRotulo[o.entidade.tipo] : 'Organizador'} · {o.eventosRealizados} eventos</span>
                  </div>
                </div>
              ))}
              <Link to="/organizadores"><Button variante="secondary" bloco>Ver todos os organizadores</Button></Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}

      <section className="container py-10 sm:py-14">
        <div className="flex flex-col gap-6 rounded-[32px] bg-gradient-to-r from-brand-700 via-brand-600 to-accent-600 p-8 text-white shadow-xl shadow-brand-200/60 sm:flex-row sm:items-center sm:justify-between dark:shadow-none">
          <div>
            <h2 className="font-display text-2xl font-semibold">Você organiza eventos?</h2>
            <p className="mt-2 max-w-2xl text-sm text-white/85">Crie eventos, gerencie ingressos, cupons e faça check-in por QR Code — tudo em um só lugar.</p>
          </div>
          <Link to="/organizador"><Button variante="accent" tamanho="lg" iconeEsq={<Sparkles size={18} />}>Acessar painel do organizador</Button></Link>
        </div>
      </section>
    </>
  );
}
