/** Modelo de dados do catálogo de Test Smells. */
export type SmellCategory =
  | 'assertions'
  | 'fixtures'
  | 'dependencies'
  | 'duplication'
  | 'execution'
  | 'semantics';

export type ImpactLevel = 'Manutenibilidade' | 'Flakiness' | 'Confiabilidade' | 'Legibilidade' | 'Performance';
export type FlakinessRelation = 'direct' | 'possible' | 'none';
export type FlakinessFactor = 'tempo' | 'ordem' | 'estado compartilhado' | 'ambiente externo' | 'aleatoriedade';

export interface FlakinessProfile {
  factors: FlakinessFactor[];
  explanation: string;
  example: string;
}

export interface CategoryMeta {
  id: SmellCategory;
  label: string;
  shortLabel: string;
  description: string;
  accent: 'amber' | 'teal' | 'rose' | 'violet' | 'sky' | 'lime';
}

export interface LiteratureSource {
  authors: string;
  year: number;
  title: string;
  /** Link da fonte web, quando a referência não é uma publicação acadêmica. */
  url?: string;
}

export interface CodeExample {
  code: string;
  language: 'javascript' | 'typescript' | 'tsx' | 'jsx';
  framework?: 'Jest' | 'Vitest' | 'Testing Library' | 'Mocha' | 'Chai';
}

export interface DetectionRule {
  name: string;
  description: string;
  pseudocode: string;
  tool: 'ESLint Rule (Babel AST)' | 'tree-sitter query' | 'ts-morph / TS Compiler API';
}

export interface TestSmell {
  id: number;
  slug: string;
  name: string;
  aka: string[];
  category: SmellCategory;
  impact: ImpactLevel[];
  /** Indica se a literatura relaciona o smell a falhas intermitentes. */
  flakiness?: FlakinessRelation;
  /** Mecanismos e exemplo prático quando há risco de flakiness. */
  flakinessProfile?: FlakinessProfile;
  definition: string;
  manifestation: string;
  /** Efeito prático mais provável quando o smell permanece no teste. */
  consequences?: string;
  /** Estratégia objetiva para eliminar ou reduzir o smell. */
  refactoring?: string;
  badExample: CodeExample;
  goodExample: CodeExample;
  detectionRule: DetectionRule;
  tags: string[];
  sources?: LiteratureSource[];
}
