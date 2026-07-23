import type { Evento } from '@/types';

export const MS_DIA = 86400000;

export const inicioDoDia = (d: Date): Date => new Date(d.getFullYear(), d.getMonth(), d.getDate());

export const mesmaData = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export const ehHoje = (d: Date): boolean => mesmaData(d, new Date());

export const addDias = (d: Date, n: number): Date => new Date(d.getTime() + n * MS_DIA);

export const addMeses = (d: Date, n: number): Date => new Date(d.getFullYear(), d.getMonth() + n, 1);

/** Matriz de 6 semanas (42 dias) começando no domingo, cobrindo o mês. */
export function gradeDoMes(referencia: Date): Date[] {
  const primeiro = new Date(referencia.getFullYear(), referencia.getMonth(), 1);
  const inicio = addDias(primeiro, -primeiro.getDay());
  return Array.from({ length: 42 }, (_, i) => addDias(inicio, i));
}

/** 7 dias da semana que contém `referencia` (domingo→sábado). */
export function diasDaSemana(referencia: Date): Date[] {
  const inicio = addDias(inicioDoDia(referencia), -referencia.getDay());
  return Array.from({ length: 7 }, (_, i) => addDias(inicio, i));
}

/** Um evento ocupa um dia se o intervalo [inicio, fim] intersecta o dia. */
export function eventoNoDia(ev: Evento, dia: Date): boolean {
  const d0 = inicioDoDia(dia).getTime();
  const d1 = d0 + MS_DIA - 1;
  const ini = new Date(ev.dataInicio).getTime();
  const fim = new Date(ev.dataFim).getTime();
  return ini <= d1 && fim >= d0;
}

export function eventosDoDia(eventos: Evento[], dia: Date): Evento[] {
  return eventos
    .filter((e) => eventoNoDia(e, dia))
    .sort((a, b) => a.dataInicio.localeCompare(b.dataInicio));
}

export const ehMultiDia = (ev: Evento): boolean =>
  !mesmaData(new Date(ev.dataInicio), new Date(ev.dataFim));

export const diasDaSemanaCurto = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
