import type { Categoria, Tag } from '@/types';

export const categorias: Categoria[] = [
  { id: 1, nome: 'Acadêmico', slug: 'academico', cor: 'var(--cat-academico)', icone: 'GraduationCap' },
  { id: 2, nome: 'Festas & Rolês', slug: 'festas', cor: 'var(--cat-festa)', icone: 'PartyPopper' },
  { id: 3, nome: 'Workshop', slug: 'workshop', cor: 'var(--cat-workshop)', icone: 'Wrench' },
  { id: 4, nome: 'Palestra', slug: 'palestra', cor: 'var(--cat-palestra)', icone: 'Mic' },
  { id: 5, nome: 'Esportivo', slug: 'esportivo', cor: 'var(--cat-esporte)', icone: 'Trophy' },
  { id: 6, nome: 'Cultural', slug: 'cultural', cor: 'var(--cat-cultural)', icone: 'Palette' },
  { id: 7, nome: 'Carreira', slug: 'carreira', cor: 'var(--cat-carreira)', icone: 'Briefcase' },
  { id: 8, nome: 'Competição', slug: 'competicao', cor: 'var(--cat-competicao)', icone: 'Swords' },
  { id: 9, nome: 'Feira', slug: 'feira', cor: 'var(--cat-feira)', icone: 'Store' },
];

export const tags: Tag[] = [
  { id: 1, nome: 'Gratuito' },
  { id: 2, nome: 'Networking' },
  { id: 3, nome: 'Tecnologia' },
  { id: 4, nome: 'Inteligência Artificial' },
  { id: 5, nome: 'Git & GitHub' },
  { id: 6, nome: 'Carreira' },
  { id: 7, nome: 'Música' },
  { id: 8, nome: 'Open Bar' },
  { id: 9, nome: 'Calouros' },
  { id: 10, nome: 'Empreendedorismo' },
  { id: 11, nome: 'Hackathon' },
  { id: 12, nome: 'Cultura' },
  { id: 13, nome: 'Esporte' },
  { id: 14, nome: 'LinkedIn' },
  { id: 15, nome: 'Design' },
  { id: 16, nome: 'Certificado' },
];
