import {
  GraduationCap,
  PartyPopper,
  Wrench,
  Mic,
  Trophy,
  Palette,
  Briefcase,
  Swords,
  Store,
  Tag as TagIcon,
} from 'lucide-react';
import type { LucideProps } from 'lucide-react';

const mapa: Record<string, React.ComponentType<LucideProps>> = {
  GraduationCap,
  PartyPopper,
  Wrench,
  Mic,
  Trophy,
  Palette,
  Briefcase,
  Swords,
  Store,
  Tag: TagIcon,
};

export function CategoryIcon({ nome, ...props }: { nome: string } & LucideProps) {
  const Icone = mapa[nome] ?? TagIcon;
  return <Icone {...props} />;
}
