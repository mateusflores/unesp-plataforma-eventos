import type { Universidade, Campus } from '@/types';

export const universidades: Universidade[] = [
  { id: 1, nome: 'Universidade Estadual Paulista', sigla: 'UNESP', logoCor: '#c8102e' },
  { id: 2, nome: 'Universidade de São Paulo', sigla: 'USP', logoCor: '#1094ab' },
  { id: 3, nome: 'Universidade Estadual de Campinas', sigla: 'UNICAMP', logoCor: '#0a3d62' },
  { id: 4, nome: 'Universidade Federal de São Carlos', sigla: 'UFSCar', logoCor: '#2e7d32' },
];

export const campi: Campus[] = [
  // Rio Claro é o campus principal desta demonstração (IGCE + IB, bairro Bela Vista).
  { id: 1, universidadeId: 1, nome: 'Rio Claro', cidade: 'Rio Claro', estado: 'SP' },
  { id: 2, universidadeId: 1, nome: 'Bauru', cidade: 'Bauru', estado: 'SP' },
  { id: 3, universidadeId: 1, nome: 'Presidente Prudente', cidade: 'Presidente Prudente', estado: 'SP' },
  { id: 4, universidadeId: 1, nome: 'São José do Rio Preto', cidade: 'São José do Rio Preto', estado: 'SP' },
  { id: 5, universidadeId: 2, nome: 'Cidade Universitária', cidade: 'São Paulo', estado: 'SP' },
  { id: 6, universidadeId: 2, nome: 'São Carlos', cidade: 'São Carlos', estado: 'SP' },
  { id: 7, universidadeId: 3, nome: 'Campinas', cidade: 'Campinas', estado: 'SP' },
  { id: 8, universidadeId: 4, nome: 'São Carlos', cidade: 'São Carlos', estado: 'SP' },
];
