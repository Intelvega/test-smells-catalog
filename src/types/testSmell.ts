/**
 * Modelo de dados do catálogo de Test Smells.
 * Cada smell descreve um anti-padrão de código de teste em JavaScript/TypeScript,
 * com exemplo ruim, exemplo refatorado e uma heurística de detecção estática.
 */

export type SmellCategory =
  | 'assertions'
  | 'fixtures'
  | 'dependencies'
  | 'duplication'
  | 'execution'
  | 'semantics';

export type ImpactLevel = 'Manutenibilidade' | 'Flakiness' | 'Confiabilidade' | 'Legibilidade' | 'Performance';

export type ImpactSeverity = 'baixo' | 'médio' | 'alto' | 'crítico';

export interface CategoryMeta {
  id: SmellCategory;
  label: string;
  shortLabel: string;
  description: string;
  accent: 'amber' | 'teal' | 'rose' | 'violet' | 'sky' | 'lime';
}

export interface CodeExample {
  /** Código curto, realista, com o anti-padrão presente */
  code: string;
  /** Linguagem/dialeto usado no exemplo (para o highlighter) */
  language: 'javascript' | 'typescript' | 'tsx' | 'jsx';
  /** Runner/ferramenta em foco no exemplo (Jest, Vitest, RTL, Mocha) */
  framework?: 'Jest' | 'Vitest' | 'Testing Library' | 'Mocha' | 'Chai';
}

export interface DetectionRule {
  /** Nome curto da heurística/regra */
  name: string;
  /** Descrição da lógica de detecção via AST (nós, padrões, condições) */
  description: string;
  /** Pseudocódigo ou trecho de regra (ex: estilo ESLint / tree-sitter query) */
  pseudocode: string;
  /** Ferramenta de referência sugerida para implementar a regra */
  tool: 'ESLint Rule (Babel AST)' | 'tree-sitter query' | 'ts-morph / TS Compiler API';
}

export interface TestSmell {
  id: number;
  slug: string;
  name: string;
  aka: string[];
  category: SmellCategory;
  impact: ImpactLevel[];
  severity: ImpactSeverity;
  definition: string;
  manifestation: string;
  badExample: CodeExample;
  goodExample: CodeExample;
  detectionRule: DetectionRule;
  tags: string[];
}
