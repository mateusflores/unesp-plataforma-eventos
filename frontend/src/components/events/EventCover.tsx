import { useState } from 'react';
import { CategoryIcon } from '@/components/CategoryIcon';
import { useCatalog } from '@/contexts/CatalogContext';
import type { Evento } from '@/types';

/**
 * Capa do evento.
 *
 * O gradiente derivado da categoria é SEMPRE renderizado como fundo — a
 * imagem remota (quando existir e carregar) aparece por cima com um fade.
 * Assim nunca há imagem quebrada nem tela em branco, e a UI não depende da
 * rede (importante para a demonstração offline). O campo `imagemCapa`
 * permanece no modelo para uso quando houver back-end/CDN real.
 */
export function EventCover({ evento, altura }: { evento: Evento; altura?: number | string }) {
  const [carregada, setCarregada] = useState(false);
  const { categoriaPorId } = useCatalog();
  const cat = categoriaPorId(evento.categoriaIds[0]);
  const cor = cat?.cor ?? 'var(--brand-600)';
  const usarImagem = /^https?:\/\//.test(evento.imagemCapa);

  return (
    <div className="event-cover" style={{ height: altura, ['--cat' as string]: cor }}>
      <div className="event-cover__fallback">{cat && <CategoryIcon nome={cat.icone} size={40} strokeWidth={1.5} />}</div>
      {usarImagem && (
        <img
          src={evento.imagemCapa}
          alt=""
          loading="lazy"
          onLoad={() => setCarregada(true)}
          className="event-cover__img"
          style={{ opacity: carregada ? 1 : 0 }}
        />
      )}
    </div>
  );
}
