import {
  Gauge,
  School,
  MapPin,
  Users,
  Building2,
  CalendarDays,
  Shapes,
  Tags,
} from 'lucide-react';
import { AppShell } from './AppShell';
import type { GrupoShell } from './AppShell';

const grupos: GrupoShell[] = [
  {
    itens: [{ para: '/admin', rotulo: 'Visão geral', icone: <Gauge size={18} />, fim: true }],
  },
  {
    titulo: 'Plataforma',
    itens: [
      { para: '/admin/universidades', rotulo: 'Universidades', icone: <School size={18} /> },
      { para: '/admin/campi', rotulo: 'Campi', icone: <MapPin size={18} /> },
      { para: '/admin/eventos', rotulo: 'Eventos', icone: <CalendarDays size={18} /> },
      { para: '/admin/organizadores', rotulo: 'Organizadores', icone: <Building2 size={18} /> },
    ],
  },
  {
    titulo: 'Pessoas & Taxonomia',
    itens: [
      { para: '/admin/usuarios', rotulo: 'Usuários', icone: <Users size={18} /> },
      { para: '/admin/categorias', rotulo: 'Categorias', icone: <Shapes size={18} /> },
      { para: '/admin/tags', rotulo: 'Tags', icone: <Tags size={18} /> },
    ],
  },
];

export function AdminLayout() {
  return <AppShell grupos={grupos} titulo="Administração" />;
}
