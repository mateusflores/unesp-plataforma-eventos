import {
  LayoutDashboard,
  CalendarCheck,
  PlusCircle,
  Ticket,
  BadgePercent,
  Users,
  QrCode,
} from 'lucide-react';
import { AppShell } from './AppShell';
import type { GrupoShell } from './AppShell';

const grupos: GrupoShell[] = [
  {
    itens: [
      { para: '/organizador', rotulo: 'Dashboard', icone: <LayoutDashboard size={18} />, fim: true },
      { para: '/organizador/eventos', rotulo: 'Meus eventos', icone: <CalendarCheck size={18} />, fim: true },
      { para: '/organizador/eventos/novo', rotulo: 'Criar evento', icone: <PlusCircle size={18} /> },
    ],
  },
  {
    titulo: 'Gestão',
    itens: [
      { para: '/organizador/ingressos', rotulo: 'Ingressos e lotes', icone: <Ticket size={18} /> },
      { para: '/organizador/cupons', rotulo: 'Cupons', icone: <BadgePercent size={18} /> },
      { para: '/organizador/participantes', rotulo: 'Participantes', icone: <Users size={18} /> },
      { para: '/organizador/checkin', rotulo: 'Check-in', icone: <QrCode size={18} /> },
    ],
  },
];

export function OrganizerLayout() {
  return <AppShell grupos={grupos} titulo="Painel do organizador" />;
}
