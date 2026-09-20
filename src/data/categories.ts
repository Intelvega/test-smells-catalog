import type { CategoryMeta } from '../types/testSmell';

export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'assertions',
    label: 'Issues in Assertions',
    shortLabel: 'Assertions',
    description: 'Problemas na forma como o teste verifica (ou deixa de verificar) o comportamento esperado.',
    accent: 'amber',
  },
  {
    id: 'fixtures',
    label: 'Setup, Teardown & Fixtures',
    shortLabel: 'Fixtures',
    description: 'Anti-padrões na preparação e limpeza do cenário de teste.',
    accent: 'teal',
  },
  {
    id: 'dependencies',
    label: 'Dependencies & Isolamento',
    shortLabel: 'Isolamento',
    description: 'Acoplamento indevido a rede, sistema de arquivos, ordem de execução ou ambiente.',
    accent: 'violet',
  },
  {
    id: 'duplication',
    label: 'Code Duplication & Complexity',
    shortLabel: 'Duplicação',
    description: 'Repetição e complexidade acidental dentro do código de teste.',
    accent: 'rose',
  },
  {
    id: 'execution',
    label: 'Test Execution & Behavior',
    shortLabel: 'Execução',
    description: 'Comportamento problemático em tempo de execução: lentidão, flakiness, ruído.',
    accent: 'sky',
  },
  {
    id: 'semantics',
    label: 'Test Semantic & Design',
    shortLabel: 'Semântica',
    description: 'Falhas de design e intenção do teste: nomenclatura, escopo e acoplamento à implementação.',
    accent: 'lime',
  },
];

export const CATEGORY_MAP: Record<string, CategoryMeta> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c])
);
