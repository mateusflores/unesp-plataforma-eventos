/** Helpers de formatação para pt-BR. */

const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const meses = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
];
const mesesCurto = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

export const parseData = (iso: string): Date => new Date(iso);

export const moeda = (valor: number): string =>
  valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const hora = (iso: string): string => {
  const d = parseData(iso);
  return `${String(d.getHours()).padStart(2, '0')}h${d.getMinutes() ? String(d.getMinutes()).padStart(2, '0') : ''}`;
};

export const dataCurta = (iso: string): string => {
  const d = parseData(iso);
  return `${String(d.getDate()).padStart(2, '0')} ${mesesCurto[d.getMonth()]}`;
};

export const dataCompleta = (iso: string): string => {
  const d = parseData(iso);
  return `${diasSemana[d.getDay()]}, ${d.getDate()} de ${meses[d.getMonth()]} de ${d.getFullYear()}`;
};

export const dataHora = (iso: string): string => `${dataCurta(iso)} · ${hora(iso)}`;

/** Intervalo legível: mesmo dia -> "13 jul · 9h–18h"; dias diferentes -> "13–17 jul". */
export const intervalo = (inicioIso: string, fimIso: string): string => {
  const i = parseData(inicioIso);
  const f = parseData(fimIso);
  const mesmoDia = i.toDateString() === f.toDateString();
  if (mesmoDia) return `${dataCurta(inicioIso)} · ${hora(inicioIso)}–${hora(fimIso)}`;
  const mesmoMes = i.getMonth() === f.getMonth();
  if (mesmoMes) return `${i.getDate()}–${f.getDate()} ${mesesCurto[f.getMonth()]}`;
  return `${dataCurta(inicioIso)} – ${dataCurta(fimIso)}`;
};

export const duracaoHoras = (inicioIso: string, fimIso: string): string => {
  const ms = parseData(fimIso).getTime() - parseData(inicioIso).getTime();
  const horas = Math.round(ms / 36e5);
  if (horas < 24) return `${horas}h`;
  const dias = Math.round(horas / 24);
  return `${dias} ${dias > 1 ? 'dias' : 'dia'}`;
};

export const iniciais = (nome: string): string =>
  nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');

export const meMes = meses;
export const nomeMesAno = (d: Date): string => `${meses[d.getMonth()]} de ${d.getFullYear()}`;
