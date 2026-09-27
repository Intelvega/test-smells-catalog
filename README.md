# Catálogo de Test Smells (JS/TS)

Aplicação web interativa com um catálogo acadêmico de **66 test smells** em JavaScript/TypeScript, organizados em 6 categorias, cada um com definição teórica, manifestação nos frameworks do ecossistema (Jest, Vitest, Testing Library, Mocha), comparador de código (❌ com smell / ✅ refatorado) e a heurística de detecção estática (AST) correspondente.

## Stack

- **React 19 + TypeScript** (Vite)
- **Tailwind CSS v4** (tema dark customizado, tokens em `src/index.css`)
- **Lucide React** para ícones
- **PrismJS** para highlight de código, com tema customizado em `src/prism-theme.css`

## Rodando localmente

```bash
npm install
npm run dev       # ambiente de desenvolvimento, http://localhost:5173
npm run build     # build de produção em dist/
npm run preview   # serve o build de produção
```

## Estrutura de arquivos

```
src/
├── types/
│   └── testSmell.ts          # interface TestSmell, CodeExample, DetectionRule, etc.
├── data/
│   ├── testSmells.ts         # os 66 smells, com exemplos de código reais
│   ├── categories.ts         # metadados das 6 categorias
│   └── accentStyles.ts       # mapa de classes Tailwind por cor de destaque
├── components/
│   ├── Header.tsx            # barra superior com busca em tempo real
│   ├── DashboardMetrics.tsx  # cards com métricas rápidas
│   ├── FilterBar.tsx         # filtros por categoria e relação com flakiness
│   ├── SmellCard.tsx         # ficha técnica em accordion (um smell)
│   ├── CodeComparisonView.tsx# comparador de código lado a lado / em abas
│   ├── CodeBlock.tsx         # bloco de código com highlight + copiar
│   └── DetectionRuleModal.tsx# modal com a heurística de detecção AST
├── App.tsx                   # composição da página e lógica de filtros/busca
├── main.tsx
├── index.css                 # tokens de design (paleta, tipografia)
└── prism-theme.css           # tema de syntax highlighting
```

## Adicionando ou editando um smell

Cada item de `TEST_SMELLS` (em `src/data/testSmells.ts`) segue a interface `TestSmell` definida em `src/types/testSmell.ts`. Para editar um smell existente ou adicionar um novo, siga o mesmo formato: `definition`, `manifestation`, `badExample`/`goodExample` (com `code`, `language`, `framework`) e `detectionRule` (com `name`, `description`, `pseudocode`, `tool`).


## Atualização do catálogo

O catálogo inclui 66 smells. Os 16 itens adicionados foram documentados a partir de Meneses (2025), Oliveira et al. (2024), Silva (2022) e Jorge, Machado e Andrade (2021); as referências aparecem na ficha de cada smell. O cartão de severidade e o filtro por severidade foram removidos. Em seu lugar, a interface destaca **Flakiness direta** e **Possível flakiness**.
