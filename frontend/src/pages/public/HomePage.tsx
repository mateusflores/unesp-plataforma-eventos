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
      {/* HERO */}
      <section className="hero">
        <div className="container hero__grid">
          <div>
            <Badge tom="brand" ponto>Agenda universitária 2026</Badge>
            <h1 className="hero__titulo mt-4">
              Tudo o que rola no <em>seu campus</em>, em um só calendário.
            </h1>
            <p className="hero__sub">
              Descubra palestras, festas, workshops, semanas acadêmicas e campeonatos. Inscreva-se, compre
              ingressos e leve tudo no bolso com QR Code.
            </p>
            <form className="hero__busca" onSubmit={irBuscar}>
              <Search size={20} className="text-muted" />
              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="O que você quer viver hoje?"
                aria-label="Buscar eventos"
              />
              <Button type="submit" iconeDir={<ArrowRight size={16} />}>Buscar</Button>
            </form>
            <div className="hero__stats">
              <div className="hero__stat"><strong>+120</strong><span>eventos por mês</span></div>
              <div className="hero__stat"><strong>4</strong><span>universidades</span></div>
              <div className="hero__stat"><strong>8</strong><span>campi conectados</span></div>
            </div>
          </div>
          <div className="hero__art">
            <div className="hero__mini-cal">
              <div className="row-between mb-4">
                <strong className="font-display">Esta semana</strong>
                <Badge tom="accent">Ao vivo</Badge>
              </div>
              <div className="hero__pills">
                {[
                  { cor: 'var(--cat-festa)', t: 'Cervejada da Comp', s: '18 jul · 22h' },
                  { cor: 'var(--cat-palestra)', t: 'Palestra de IA', s: '15 jul · 19h' },
                  { cor: 'var(--cat-academico)', t: 'SECComp 2026', s: '13 jul · 9h' },
                ].map((p) => (
                  <div key={p.t} className="hero__pill">
                    <span className="hero__pill-bar" style={{ background: p.cor }} />
                    <div>
                      <strong>{p.t}</strong>
                      <span>{p.s}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DESTAQUES */}
      <section className="container section-sm">
        <div className="sec-head">
          <div>
            <h2>Em destaque</h2>
            <p>Os eventos que estão bombando agora</p>
          </div>
          <Link to="/explorar?destaque=1" className="sec-link">Ver todos <ArrowRight size={15} /></Link>
        </div>
        <div className="eventos-grid">
          {destaques.estado === 'loading'
            ? Array.from({ length: 3 }).map((_, i) => <EventCardSkeleton key={i} />)
            : destaques.data?.map((ev) => <EventCard key={ev.id} evento={ev} />)}
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="container section-sm">
        <div className="sec-head">
          <div>
            <h2>Explore por categoria</h2>
            <p>Encontre exatamente o tipo de evento que combina com você</p>
          </div>
        </div>
        <div className="cat-grid">
          {categorias.map((c) => (
            <Link key={c.id} to={`/explorar?categoria=${c.id}`} className="cat-tile" style={{ ['--cat' as string]: c.cor }}>
              <span className="cat-tile__icon"><CategoryIcon nome={c.icone} size={22} /></span>
              <div>
                <strong>{c.nome}</strong>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* PRÓXIMOS */}
      <section className="container section-sm">
        <div className="sec-head">
          <div>
            <h2>Próximos eventos</h2>
            <p>Não perca o que vem por aí no seu campus</p>
          </div>
          <Link to="/calendario" className="sec-link">Ver calendário <CalendarDays size={15} /></Link>
        </div>
        <div className="eventos-grid">
          {proximos.estado === 'loading'
            ? Array.from({ length: 6 }).map((_, i) => <EventCardSkeleton key={i} />)
            : proximos.data?.itens.map((ev) => <EventCard key={ev.id} evento={ev} />)}
        </div>
      </section>

      {/* GRATUITOS + ORGANIZADORES */}
      <section className="container section-sm">
        <div className="hero__grid" style={{ alignItems: 'start', gap: 'var(--sp-8)' }}>
          <div>
            <div className="sec-head">
              <div><h2>Bombando e de graça</h2><p>Eventos gratuitos para aproveitar</p></div>
            </div>
            <div className="col gap-4">
              {gratuitos.data?.itens.map((ev) => (
                <Link key={ev.id} to={`/eventos/${ev.slug}`} className="hero__pill" style={{ padding: 'var(--sp-4)' }}>
                  <span className="hero__pill-bar" style={{ background: 'var(--success-500)' }} />
                  <div className="grow">
                    <strong style={{ fontSize: 'var(--fs-md)' }}>{ev.titulo}</strong>
                    <span>{dataCurta(ev.dataInicio)} · {hora(ev.dataInicio)} · {ev.local}</span>
                  </div>
                  <Badge tom="sucesso">Gratuito</Badge>
                </Link>
              )) ?? <EventCardSkeleton />}
            </div>
          </div>
          <div>
            <div className="sec-head">
              <div><h2>Organizadores</h2><p>Atléticas, CAs e EJs em destaque</p></div>
            </div>
            <div className="col gap-3">
              {orgDestaque.map((o) => (
                <div key={o.id} className="hero__pill" style={{ padding: 'var(--sp-3)' }}>
                  <Avatar nome={o.nome} cor={o.avatarCor} tamanho={40} />
                  <div className="grow">
                    <strong style={{ fontSize: 'var(--fs-sm)', display: 'flex', alignItems: 'center', gap: 6 }}>
                      {o.nome.split('—')[0].trim()}
                      {o.verificado && <Star size={13} fill="var(--brand-500)" color="var(--brand-500)" />}
                    </strong>
                    <span>{o.entidade ? tipoEntidadeRotulo[o.entidade.tipo] : 'Organizador'} · {o.eventosRealizados} eventos</span>
                  </div>
                </div>
              ))}
              <Link to="/organizadores"><Button variante="secondary" bloco>Ver todos os organizadores</Button></Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="container section-sm">
        <div className="cta-final">
          <div>
            <h2>Você organiza eventos?</h2>
            <p>Crie eventos, gerencie ingressos, cupons e faça check-in por QR Code — tudo em um só lugar.</p>
          </div>
          <Link to="/organizador"><Button variante="accent" tamanho="lg" iconeEsq={<Sparkles size={18} />}>Acessar painel do organizador</Button></Link>
        </div>
      </section>
    </>
  );
}
