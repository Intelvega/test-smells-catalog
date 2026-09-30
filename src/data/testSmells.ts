import type { FlakinessProfile, LiteratureSource, TestSmell } from '../types/testSmell';

const DISSERTATION = { authors: 'Meneses', year: 2025, title: 'Master’s Dissertation: Test Smells in JavaScript' } as const;
const SNUTS = { authors: 'Oliveira, Mateus, Virgínio e Rocha', year: 2024, title: 'SNUTS.js: Sniffing Nasty Unit Test Smells in Javascript' } as const;
const STEEL = { authors: 'Jorge, Machado e Andrade', year: 2021, title: 'Steel: Test Smell Detection for JavaScript' } as const;
const SILVA = { authors: 'Silva', year: 2022, title: 'JavaScript Test Smell Detection Tool' } as const;
const READTHEDOCS = { authors: 'Alice', year: 2025, title: 'Test Smell in JavaScript (Read the Docs)' } as const;
const READTHEDOCS_BASE_URL = 'https://test-readthedocss.readthedocs.io/en/latest/Test%20Smells/';
const OPEN_CATALOG = { authors: 'Soares, Aranda III, Romão e Ribeiro', year: 2023, title: 'The Open Catalog of Test Smells' } as const;
const OPEN_CATALOG_BASE_URL = 'https://test-smell-catalog.readthedocs.io/en/latest/';

function literatureSmell(input: Omit<TestSmell, 'badExample' | 'goodExample' | 'detectionRule'> & { bad: string; good: string; rule: string }): TestSmell {
  return {
    ...input,
    badExample: { language: 'javascript', framework: 'Jest', code: input.bad },
    goodExample: { language: 'javascript', framework: 'Jest', code: input.good },
    detectionRule: {
      name: input.rule,
      description: 'Heurística estática proposta para identificar este padrão em callbacks de it/test e hooks Jest/Vitest.',
      pseudocode: 'ON test callback: localizar o padrão sintático associado e reportar a ocorrência com o contexto do teste.',
      tool: 'ESLint Rule (Babel AST)',
    },
  };
}

function readTheDocsSmell(input: Omit<TestSmell, 'badExample' | 'goodExample' | 'detectionRule' | 'sources'> & { bad: string; good: string; rule: string; href: string }): TestSmell {
  return {
    ...literatureSmell({ ...input, sources: [{ ...READTHEDOCS, url: new URL(input.href, READTHEDOCS_BASE_URL).href }] }),
    detectionRule: {
      name: input.rule,
      description: 'Heurística estática para localizar a construção indicada na página de referência do ReadTheDocs.',
      pseudocode: 'ON arquivo de teste: identificar a construção AST associada, reportar o teste e apontar a estratégia de refatoração.',
      tool: 'ESLint Rule (Babel AST)',
    },
  };
}

/**
 * Base de dados do catálogo de test smells em JavaScript/TypeScript.
 * Organizada em 6 categorias, na ordem do catálogo acadêmico de referência.
 */

const CONSEQUENCES: Record<string, string> = {
  'assertion-roulette': 'Dificulta localizar a expectativa que falhou e aumenta o tempo de diagnóstico na CI.',
  'assertion-free-test': 'Permite que regressões passem despercebidas, pois o teste não verifica nenhum resultado observável.',
  'sensitive-equality': 'Pode falhar por diferenças irrelevantes de representação, ordem ou precisão entre execuções.',
  'missing-assertions-line-hitter': 'Cria uma falsa percepção de cobertura: linhas são executadas sem que o comportamento seja validado.',
  'over-checking-nitpicker': 'Torna o teste frágil a detalhes irrelevantes da implementação e eleva o custo de manutenção.',
  'calculating-expected-results-on-the-fly': 'Reproduz a lógica de produção no teste e pode mascarar o mesmo erro nos dois lados.',
  'under-the-carpet-assertion': 'Oculta a verificação em fluxos auxiliares, dificultando entender o que o cenário realmente garante.',
  'premature-assertions': 'Verifica o estado antes da conclusão da operação e pode gerar resultados intermitentes.',
  'redundant-assertion': 'Adiciona ruído sem aumentar a detecção de falhas, tornando a intenção menos clara.',
  'equality-sledgehammer-assertion': 'Compara mais dados do que o necessário e quebra quando detalhes não relevantes mudam.',
  'general-fixture': 'Aumenta o acoplamento entre testes e torna o setup mais difícil de entender e alterar.',
  'vague-header-setup': 'Esconde o propósito do estado inicial e obriga o leitor a percorrer o código para compreender o cenário.',
  'curdled-test-fixtures': 'Mantém dados de fixture obsoletos, confundindo o cenário e aumentando a manutenção.',
  'excessive-inline-setup': 'Mistura preparação e verificação, alongando o teste e dificultando a leitura do comportamento testado.',
  'empty-shared-fixture': 'Indica uma abstração sem utilidade, acrescentando complexidade sem reduzir repetição.',
  'hidden-test-data-bury-the-lede': 'Oculta entradas importantes longe da asserção, reduzindo a legibilidade do cenário.',
  'the-mother-hen': 'Centraliza setup demais e cria dependências implícitas entre testes.',
  'unused-definition': 'Deixa código morto no teste, aumentando ruído e a chance de manutenção equivocada.',
  'resource-leakage-missing-teardown': 'Vaza recursos e estado entre testes, causando lentidão, interferência e flakiness.',
  'mystery-guest': 'Introduz dependências externas pouco visíveis, reduzindo isolamento e reprodutibilidade.',
  'chain-gang-dependent-test': 'Faz um teste depender do anterior, de modo que falhas se propagam e a ordem passa a importar.',
  'test-pollution-environmental-vandal': 'Altera estado compartilhado sem restaurá-lo e pode afetar testes executados depois.',
  'context-sensitivity': 'Faz o resultado depender de ambiente, horário ou configuração externa, favorecendo flakiness.',
  'local-only-testing-the-local-hero': 'Pode passar somente na máquina do autor e falhar em CI ou em outros ambientes.',
  'web-browsing-test-hidden-integration': 'Depende de rede e serviços externos, tornando a execução lenta e instável.',
  'counting-on-spies': 'Acopla o teste à sequência interna de chamadas e dificulta refatorações seguras.',
  'middle-man': 'Adiciona camadas sem comportamento relevante, deixando o teste mais indireto e difícil de manter.',
  'programming-paradigms-blend': 'Mistura estilos de teste e confunde o fluxo de controle e as responsabilidades.',
  'duplicate-test-code-copy-paste': 'Duplica correções e torna cenários semelhantes inconsistentes ao longo do tempo.',
  'long-test': 'Agrupa muitos comportamentos, piorando leitura, diagnóstico e manutenção.',
  'magic-number-magic-values': 'Oculta o significado dos valores de teste e dificulta a revisão do cenário.',
  'complicated-logic-in-tests': 'Cria ramificações e cálculos difíceis de validar, podendo esconder defeitos no próprio teste.',
  'duplicate-assert': 'Repete a mesma verificação sem ampliar a cobertura e gera ruído na especificação.',
  'hardcoded-environment-configuration': 'Acopla o teste a máquinas e serviços específicos, reduzindo portabilidade e reprodutibilidade.',
  'over-refactoring-overly-dry-tests': 'Abstrai demais os cenários e esconde detalhes relevantes para quem lê o teste.',
  'commented-out-test': 'Remove cobertura sem transparência e acumula código obsoleto no repositório.',
  'sleepy-test-stinky-synchronization': 'Depende de tempo arbitrário, ficando lento e sujeito a flakiness sob carga variável.',
  'flaky-test-intermittent-failures': 'Alterna entre passar e falhar sem mudança de código, enfraquecendo a confiança na suíte.',
  'chatty-logging-print-statement': 'Polui os logs da CI, dificulta encontrar falhas reais e pode reduzir o desempenho.',
  'ignored-disabled-test': 'Reduz a cobertura efetiva e preserva falhas conhecidas sem acompanhamento claro.',
  'slow-test': 'Aumenta o tempo de feedback e incentiva execuções parciais da suíte.',
  'interactive-test': 'Exige intervenção humana e impede automação confiável na CI.',
  'premature-teardown': 'Encerra recursos antes do término do cenário, causando falhas intermitentes.',
  'unsound-test-false-positive-negative': 'Pode aprovar comportamento incorreto ou reprovar comportamento correto, comprometendo a confiança na suíte.',
  'the-silent-catcher-empty-catch': 'Engole erros e permite que falhas de produção passem como sucesso do teste.',
  'eager-test': 'Verifica muitos comportamentos em um caso, tornando a origem da falha ambígua.',
  'lazy-test': 'Espalha um único comportamento por vários testes, aumentando duplicação e custo de manutenção.',
  'what-are-we-testing-poor-naming': 'Não comunica a intenção do caso e torna resultados de CI difíceis de interpretar.',
  'testing-private-implementation': 'Acopla o teste a detalhes internos e quebra durante refatorações sem mudança de comportamento.',
  'second-class-citizens': 'Deixa o código de teste degradar, reduzindo sua capacidade de documentar e proteger o produto.',
  'anonymous-test': 'Impede identificar rapidamente o comportamento coberto e torna falhas de CI pouco informativas.',
  'conditional-test-logic': 'Multiplica caminhos no teste e pode ocultar resultados dependentes de estado ou ordem.',
  'exception-handling': 'Pode engolir a exceção esperada ou deixar o teste passar sem que a falha seja verificada.',
  'overcommented-test': 'Aumenta ruído visual e torna mais difícil localizar a lógica que realmente importa.',
  'suboptimal-assertion': 'Produz falhas pouco diagnósticas e pode aceitar resultados que não expressam o comportamento esperado.',
  'unknown-test': 'Não especifica o resultado esperado e pode passar mesmo diante de regressões funcionais.',
  'verbose-test': 'Dilui a intenção em muitos passos, dificultando diagnosticar e modificar o cenário.',
  'comments-only-test': 'Desativa cobertura de forma silenciosa e mantém código de teste obsoleto.',
  'complex-snapshot-test': 'Gera revisões difíceis e pode falhar por mudanças incidentais na estrutura renderizada.',
  'identical-test-description': 'Torna os relatórios ambíguos, dificultando identificar qual cenário falhou.',
  'non-functional-statement': 'Acrescenta instruções sem efeito, distraindo da preparação, ação e verificação.',
  'test-without-description': 'Remove o contexto do relatório de execução e dificulta entender o propósito do caso.',
  'transcripting-test': 'Polui a saída da suíte e pode esconder informações relevantes nos logs de CI.',
  'verify-in-setup': 'Atribui a falha a vários testes e esconde qual cenário define a expectativa.',
  'constructor-initialization': 'Deixa o setup distante dos cenários e pode tornar o compartilhamento de estado pouco explícito.',
  'empty-test': 'Cria falsa impressão de cobertura porque passa sem executar nenhuma verificação.',
};


const DEFAULT_REFACTORING_BY_CATEGORY: Record<TestSmell['category'], string> = {
  assertions: 'Expresse uma expectativa específica e verificável, limitada ao comportamento que o cenário pretende cobrir.',
  fixtures: 'Reduza e explicite o setup, criando somente os dados necessários e isolando o estado de cada cenário.',
  dependencies: 'Isole dependências externas por stubs, fakes ou recursos controlados e restaure qualquer estado compartilhado.',
  duplication: 'Extraia somente a preparação ou intenção comum, mantendo cada cenário independente e legível.',
  execution: 'Simplifique o fluxo do teste e garanta que ele seja executável, automatizado e verificável pelo runner.',
  semantics: 'Reestruture o teste em Arrange–Act–Assert, com um nome claro e uma única intenção observável.',
};

const FLAKINESS_PROFILES: Record<string, FlakinessProfile> = {
  "flaky-test-intermittent-failures": {
    "factors": [],
    "explanation": "Este smell descreve o sintoma: o teste alterna entre passar e falhar sem mudança no código. A causa pode ser tempo, ordem, estado compartilhado ou ambiente externo.",
    "example": "test('consulta status', async () => {\n  const response = await fetch('/status');\n  expect(response.ok).toBe(true); // falha apenas em algumas execuções\n});"
  },
  "sensitive-equality": {
    "factors": [
      "ordem"
    ],
    "explanation": "Comparações estruturais frágeis podem depender da ordem de itens ou da representação de valores. A flakiness surge quando a ordem não é garantida.",
    "example": "expect(await listUsers()).toEqual([ana, bia]);\n// a API pode devolver Bia antes de Ana"
  },
  "premature-assertions": {
    "factors": [
      "tempo"
    ],
    "explanation": "A expectativa é avaliada antes de uma operação assíncrona terminar. Em execuções lentas, o dado ainda não está disponível.",
    "example": "loadProfile();\nexpect(screen.getByText('Ana')).toBeVisible();\n// faltou await screen.findByText('Ana')"
  },
  "curdled-test-fixtures": {
    "factors": [
      "estado compartilhado",
      "ordem"
    ],
    "explanation": "Fixtures obsoletas ou inconsistentes podem deixar dados inválidos disponíveis para outros cenários, especialmente quando há reutilização de estado.",
    "example": "beforeEach(() => { user = sharedUser; });\ntest('edita perfil', () => { user.role = 'admin'; });"
  },
  "resource-leakage-missing-teardown": {
    "factors": [
      "tempo",
      "ordem",
      "estado compartilhado"
    ],
    "explanation": "Timers, conexões e servidores deixados abertos sobrevivem ao teste atual e interferem nos seguintes.",
    "example": "test('inicia polling', () => {\n  setInterval(refresh, 1000);\n  // nenhum clearInterval\n});"
  },
  "chain-gang-dependent-test": {
    "factors": [
      "ordem",
      "estado compartilhado"
    ],
    "explanation": "Um teste usa o resultado ou o estado criado por outro. Mudar a ordem de execução torna a suíte instável.",
    "example": "test('cria usuário', () => { created = createUser(); });\ntest('remove usuário', () => { expect(removeUser(created.id)).toBe(true); });"
  },
  "test-pollution-environmental-vandal": {
    "factors": [
      "ordem",
      "estado compartilhado",
      "ambiente externo"
    ],
    "explanation": "Alterações globais não restauradas contaminam testes posteriores e fazem o resultado depender da ordem da suíte.",
    "example": "test('modo manutenção', () => {\n  process.env.MODE = 'maintenance';\n  // faltou restaurar process.env.MODE\n});"
  },
  "context-sensitivity": {
    "factors": [
      "tempo",
      "ambiente externo"
    ],
    "explanation": "O comportamento depende do relógio, timezone, locale, sistema operacional ou configuração da máquina.",
    "example": "expect(new Date().getHours()).toBe(9);\n// muda conforme horário e fuso da execução"
  },
  "web-browsing-test-hidden-integration": {
    "factors": [
      "tempo",
      "ambiente externo"
    ],
    "explanation": "A disponibilidade e a latência de rede ou de serviços externos variam entre execuções.",
    "example": "const response = await fetch('https://api.example.com/health');\nexpect(response.status).toBe(200);"
  },
  "sleepy-test-stinky-synchronization": {
    "factors": [
      "tempo"
    ],
    "explanation": "Uma espera fixa não garante que a operação acabou. Sob carga, o tempo escolhido pode não ser suficiente.",
    "example": "await new Promise((resolve) => setTimeout(resolve, 500));\nexpect(job.status).toBe('done');"
  },
  "premature-teardown": {
    "factors": [
      "tempo",
      "estado compartilhado"
    ],
    "explanation": "Um recurso comum é encerrado enquanto ainda existem operações pendentes que o utilizam.",
    "example": "afterEach(() => server.close());\ntest('responde', async () => { request(server); /* sem await */ });"
  },
  "conditional-test-logic": {
    "factors": [
      "ordem",
      "estado compartilhado"
    ],
    "explanation": "Quando a condição depende de estado prévio ou dados variáveis, caminhos diferentes podem ser executados em cada rodada.",
    "example": "if (currentUser.isAdmin) {\n  expect(menu()).toContain('Config');\n}"
  },
  "exception-handling": {
    "factors": [
      "tempo"
    ],
    "explanation": "Em fluxos assíncronos, try/catch manual pode não aguardar a rejeição correta e mascarar uma falha.",
    "example": "try {\n  saveAsync(); // faltou await\n} catch (error) {\n  expect(error).toBeDefined();\n}"
  },
  "complex-snapshot-test": {
    "factors": [
      "tempo",
      "ambiente externo"
    ],
    "explanation": "Snapshots com datas, IDs, locale ou conteúdo recebido externamente variam sem mudança relevante de comportamento.",
    "example": "expect(render(<Dashboard generatedAt={new Date()} />).container)\n  .toMatchSnapshot();"
  },
  "verify-in-setup": {
    "factors": [
      "estado compartilhado"
    ],
    "explanation": "Não causa flakiness isoladamente, mas uma falha instável no setup é atribuída a vários testes e fica mais difícil de diagnosticar.",
    "example": "beforeEach(async () => {\n  user = await createRemoteUser();\n  expect(user.id).toBeDefined();\n});"
  }
};

const RAW_TEST_SMELLS: TestSmell[] = [
  // ─────────────────────────────────────────────────────────
  // Categoria 1 — Issues in Assertions (1–10)
  // ─────────────────────────────────────────────────────────
  {
    id: 1,
    slug: 'assertion-roulette',
    name: 'Assertion Roulette',
    aka: ['Multiple Assertions Without Message'],
    category: 'assertions',
    impact: ['Manutenibilidade', 'Legibilidade'],
    definition:
      'Um teste contém múltiplas asserções, sem mensagens que identifiquem qual delas falhou, forçando o leitor a "adivinhar" qual expectativa quebrou ao interpretar o relatório da CI.',
    manifestation:
      'Em Jest/Vitest, várias chamadas a expect() na mesma função de teste sem um segundo argumento de mensagem, ou sem dividir o cenário em testes menores — o relatório mostra apenas a linha da primeira falha, escondendo o restante.',
    badExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `test('cria pedido válido', () => {
  const order = createOrder({ qty: 2, price: 10 });

  expect(order.total).toBe(20);
  expect(order.status).toBe('pending');
  expect(order.items.length).toBe(1);
  expect(order.createdAt).toBeDefined();
});`,
    },
    goodExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `describe('createOrder', () => {
  const order = createOrder({ qty: 2, price: 10 });

  test('calcula o total corretamente', () => {
    expect(order.total).toBe(20);
  });

  test('inicia com status pendente', () => {
    expect(order.status).toBe('pending');
  });

  test('registra a data de criação', () => {
    expect(order.createdAt).toBeDefined();
  });
});`,
    },
    detectionRule: {
      name: 'multiple-uncorrelated-expects',
      description:
        'Percorrer o corpo de cada CallExpression de teste (it/test) e contar chamadas a expect() cujas expressões testam propriedades distintas do mesmo objeto sem mensagem customizada.',
      pseudocode: `ON CallExpression(name in ['it','test']):
  expectCalls = findAll(body, CallExpression(callee.name === 'expect'))
  IF expectCalls.length > 3
     AND expectCalls.none(hasCustomMessage)
     AND distinctSubjects(expectCalls) > 1:
     REPORT 'Assertion Roulette: separe os cenários em testes distintos'`,
      tool: 'ESLint Rule (Babel AST)',
    },
    tags: ['expect', 'jest', 'legibilidade', 'relatório de falha'],
  },
  {
    id: 2,
    slug: 'assertion-free-test',
    name: 'Assertion-Free / Assertionless Test',
    aka: ['Assertionless Test', 'Free Ride Assertion'],
    category: 'assertions',
    impact: ['Confiabilidade'],
    definition:
      'Um teste executa código de produção mas não contém nenhuma asserção explícita, então ele sempre "passa" independentemente do comportamento real do sistema.',
    manifestation:
      'Comum em testes gerados rapidamente para "exercitar" uma função: chama-se a API sob teste e o teste termina sem qualquer expect(), toBe(), assert() ou matcher de biblioteca.',
    badExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `test('processa pagamento', () => {
  const result = processPayment({ amount: 100, method: 'card' });
  console.log(result);
  // nenhuma asserção — o teste sempre passa
});`,
    },
    goodExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `test('processa pagamento com sucesso', () => {
  const result = processPayment({ amount: 100, method: 'card' });

  expect(result.status).toBe('approved');
  expect(result.amount).toBe(100);
});`,
    },
    detectionRule: {
      name: 'no-assertion-in-test-body',
      description:
        'Para cada função de teste, verificar se o corpo contém ao menos uma chamada reconhecida como asserção (expect/assert/should) ou um matcher de biblioteca conhecida.',
      pseudocode: `ON FunctionExpression as arg of it/test:
  assertionCalls = findAll(body, isAssertionCall)
  IF assertionCalls.length === 0:
     REPORT 'Assertion-Free Test: teste não verifica nenhum resultado'`,
      tool: 'ESLint Rule (Babel AST)',
    },
    tags: ['expect', 'cobertura falsa', 'confiabilidade'],
  },
  {
    id: 3,
    slug: 'sensitive-equality',
    name: 'Sensitive Equality',
    aka: ['Fragile Equality Check'],
    category: 'assertions',
    impact: ['Flakiness', 'Manutenibilidade'],
    definition:
      'Uso de comparação estrita/ingênua (toBe, toString, ==) para valores compostos como objetos, arrays, datas ou moedas, cuja representação varia por referência, locale ou fuso horário.',
    manifestation:
      'Comparar new Date() ou objetos com toBe() (identidade de referência) em vez de toEqual(); ou comparar strings formatadas de datas/moedas que mudam conforme o timezone/locale do executor da CI.',
    badExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `test('formata data do pedido', () => {
  const order = { createdAt: new Date('2024-01-10T08:00:00Z') };

  expect(order.createdAt.toLocaleDateString()).toBe('10/01/2024');
  expect({ id: 1, tags: ['a'] }).toBe({ id: 1, tags: ['a'] });
});`,
    },
    goodExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `test('formata data do pedido em UTC', () => {
  const order = { createdAt: new Date('2024-01-10T08:00:00Z') };

  expect(order.createdAt.toISOString()).toBe('2024-01-10T08:00:00.000Z');
  expect({ id: 1, tags: ['a'] }).toEqual({ id: 1, tags: ['a'] });
});`,
    },
    detectionRule: {
      name: 'strict-equality-on-composite-value',
      description:
        'Detectar expect(x).toBe(y) onde x ou y é um ObjectExpression/ArrayExpression/new Date(...), ou onde o argumento contém chamada a métodos sensíveis a locale (toLocaleDateString, toLocaleString).',
      pseudocode: `ON CallExpression(expect(x).toBe(y)):
  IF isObjectOrArrayLiteral(x) OR isObjectOrArrayLiteral(y)
     OR containsCall(x, 'toLocaleDateString'):
     REPORT 'Sensitive Equality: use toEqual()/toISOString() ou normalize timezone'`,
      tool: 'ESLint Rule (Babel AST)',
    },
    tags: ['toBe', 'toEqual', 'timezone', 'locale'],
  },
  {
    id: 4,
    slug: 'missing-assertions-line-hitter',
    name: 'Missing Assertions / Line Hitter',
    aka: ['Line Hitter', 'Coverage Padding'],
    category: 'assertions',
    impact: ['Confiabilidade'],
    definition:
      'O teste apenas invoca o código de produção para "acender" linhas na métrica de cobertura, sem verificar se o estado ou resultado produzido está correto.',
    manifestation:
      'Chamadas encadeadas a métodos de um serviço só para aumentar a cobertura de statements/branches, com try/catch vazio ou sem nenhum expect ligado ao valor de retorno.',
    badExample: {
      language: 'typescript',
      framework: 'Jest',
      code: `test('cobre validateUser', () => {
  try {
    validateUser({ name: '', email: 'x@x.com' });
  } catch (e) {
    // ignorado — só queremos subir cobertura
  }
});`,
    },
    goodExample: {
      language: 'typescript',
      framework: 'Jest',
      code: `test('rejeita usuário sem nome', () => {
  expect(() => validateUser({ name: '', email: 'x@x.com' }))
    .toThrow('name is required');
});`,
    },
    detectionRule: {
      name: 'coverage-only-invocation',
      description:
        'Sinalizar testes cujo TryStatement possui CatchClause com corpo vazio ou apenas comentário, combinado à ausência de assertion em qualquer branch do teste.',
      pseudocode: `ON CallExpression(it/test):
  IF hasEmptyCatchBlock(body) AND countAssertions(body) === 0:
     REPORT 'Line Hitter: teste não valida nenhum resultado'`,
      tool: 'ESLint Rule (Babel AST)',
    },
    tags: ['cobertura', 'try/catch', 'métrica enganosa'],
  },
  {
    id: 5,
    slug: 'over-checking-nitpicker',
    name: 'Over-Checking / Nitpicker',
    aka: ['Nitpicker Assertion', 'Exhaustive Assertion'],
    category: 'assertions',
    impact: ['Manutenibilidade'],
    definition:
      'O teste assere exaustivamente todos os campos de uma estrutura, incluindo detalhes irrelevantes à regra de negócio verificada, tornando-o frágil a qualquer mudança incidental no formato dos dados.',
    manifestation:
      'toEqual() comparando um objeto de resposta HTTP inteiro (headers, metadata, timestamps) quando o teste deveria validar só o campo de negócio relevante.',
    badExample: {
      language: 'javascript',
      framework: 'Vitest',
      code: `test('retorna usuário ativo', () => {
  const res = getUser('u1');

  expect(res).toEqual({
    id: 'u1',
    name: 'Ana',
    email: 'ana@x.com',
    active: true,
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
    internalVersion: 3,
    _links: { self: '/users/u1' },
  });
});`,
    },
    goodExample: {
      language: 'javascript',
      framework: 'Vitest',
      code: `test('retorna usuário ativo', () => {
  const res = getUser('u1');

  expect(res.active).toBe(true);
  expect(res.id).toBe('u1');
});`,
    },
    detectionRule: {
      name: 'over-specified-object-assertion',
      description:
        'Medir a quantidade de propriedades comparadas por toEqual/toMatchObject e sinalizar quando ultrapassa um limiar configurável (ex.: > 6 chaves) sem relação direta com o nome do teste.',
      pseudocode: `ON CallExpression(expect(x).toEqual(objLiteral)):
  IF countProperties(objLiteral) > THRESHOLD:
     REPORT 'Over-Checking: restrinja a asserção aos campos relevantes ao cenário'`,
      tool: 'ESLint Rule (Babel AST)',
    },
    tags: ['toEqual', 'toMatchObject', 'acoplamento a schema'],
  },
  {
    id: 6,
    slug: 'calculating-expected-results-on-the-fly',
    name: 'Calculating Expected Results On The Fly',
    aka: ['Duplicated Production Logic'],
    category: 'assertions',
    impact: ['Manutenibilidade', 'Confiabilidade'],
    definition:
      'O teste recria, com laços ou funções auxiliares, a mesma lógica de produção para calcular o valor esperado, em vez de usar um valor fixo e independente — se a lógica de produção tiver um bug, o teste "concorda" com ele.',
    manifestation:
      'Um teste de cálculo de frete reimplementa o algoritmo de precificação dentro do próprio arquivo de teste para gerar o "expected", duplicando (e potencialmente replicando erros de) a lógica sob teste.',
    badExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `test('calcula total do carrinho', () => {
  const items = [{ price: 10, qty: 3 }, { price: 5, qty: 2 }];

  let expected = 0;
  for (const item of items) {
    expected += item.price * item.qty; // reimplementa a lógica de produção
  }

  expect(calculateCartTotal(items)).toBe(expected);
});`,
    },
    goodExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `test('calcula total do carrinho', () => {
  const items = [{ price: 10, qty: 3 }, { price: 5, qty: 2 }];

  expect(calculateCartTotal(items)).toBe(40); // valor fixo, calculado à mão
});`,
    },
    detectionRule: {
      name: 'production-logic-mirrored-in-test',
      description:
        'Detectar estruturas de controle (for/while/reduce) dentro do corpo do teste cujo resultado alimenta diretamente o argumento esperado de um expect().',
      pseudocode: `ON CallExpression(it/test):
  loopVars = findAll(body, ForStatement | CallExpression('reduce'))
  IF loopVars.some(v => flowsInto(v, expectArgument)):
     REPORT 'Calculating Expected On The Fly: use um valor esperado fixo/independente'`,
      tool: 'ESLint Rule (Babel AST)',
    },
    tags: ['expected value', 'duplicação de lógica', 'oracle problem'],
  },
  {
    id: 7,
    slug: 'under-the-carpet-assertion',
    name: 'Under-The-Carpet Assertion',
    aka: ['Conditional Assertion', 'Swallowed Assertion'],
    category: 'assertions',
    impact: ['Confiabilidade'],
    definition:
      'A asserção está escondida dentro de um bloco condicional (if/switch) que pode nunca ser executado, fazendo o teste passar silenciosamente sem checar nada quando a condição é falsa.',
    manifestation:
      'if (result) { expect(result.ok).toBe(true) } sem um else que falhe explicitamente — se result for undefined/null, a asserção é simplesmente pulada.',
    badExample: {
      language: 'javascript',
      framework: 'Mocha',
      code: `it('valida resposta da API de estoque', async () => {
  const result = await fetchStock('sku-1');

  if (result) {
    expect(result.available).to.be.true;
  }
  // se result for undefined, o teste passa sem verificar nada
});`,
    },
    goodExample: {
      language: 'javascript',
      framework: 'Mocha',
      code: `it('valida resposta da API de estoque', async () => {
  const result = await fetchStock('sku-1');

  expect(result, 'resposta não deveria ser nula').to.not.be.undefined;
  expect(result.available).to.be.true;
});`,
    },
    detectionRule: {
      name: 'assertion-inside-conditional-branch',
      description:
        'Identificar CallExpression de asserção dentro de um IfStatement.consequent sem um alternate correspondente que force falha (expect.fail/throw).',
      pseudocode: `ON IfStatement:
  IF containsAssertion(consequent) AND alternate === null:
     REPORT 'Under-The-Carpet Assertion: a checagem pode ser silenciosamente pulada'`,
      tool: 'ESLint Rule (Babel AST)',
    },
    tags: ['if/else', 'assert oculto', 'falso positivo'],
  },
  {
    id: 8,
    slug: 'premature-assertions',
    name: 'Premature Assertions',
    aka: ['Missing Await Assertion'],
    category: 'assertions',
    impact: ['Flakiness', 'Confiabilidade'],
    definition:
      'A asserção é executada antes da Promise sob teste ser resolvida ou rejeitada, geralmente por falta de await, fazendo o teste validar um estado incompleto ou não reportar erros de asserção assíncronos.',
    manifestation:
      'Chamar uma função async sem await e em seguida assertar imediatamente, ou usar .then() sem retornar/aguardar a Promise dentro de um teste async.',
    badExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `test('busca perfil do usuário', () => {
  let profile;
  fetchProfile('u1').then((p) => { profile = p; });

  expect(profile).toBeDefined(); // roda antes da Promise resolver
});`,
    },
    goodExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `test('busca perfil do usuário', async () => {
  const profile = await fetchProfile('u1');

  expect(profile).toBeDefined();
});`,
    },
    detectionRule: {
      name: 'assertion-before-promise-resolution',
      description:
        'Verificar se uma CallExpression que retorna Promise (heurística: nome termina em fetch/load/async ou é anotada Promise<T>) é usada sem await/return dentro de um teste, seguida de uma asserção no mesmo escopo.',
      pseudocode: `ON CallExpression(returnsPromise) NOT wrapped in await/return:
  IF nextStatement is assertion:
     REPORT 'Premature Assertion: adicione await à chamada assíncrona'`,
      tool: 'ESLint Rule (Babel AST)',
    },
    tags: ['async/await', 'promise', 'race condition'],
  },
  {
    id: 9,
    slug: 'redundant-assertion',
    name: 'Redundant Assertion',
    aka: ['Duplicate Expect'],
    category: 'assertions',
    impact: ['Legibilidade'],
    definition:
      'A mesma asserção, sobre o mesmo estado, é repetida mais de uma vez no teste sem que nenhuma ação tenha alterado esse estado entre as chamadas.',
    manifestation:
      'expect(x).toBe(y) chamado duas vezes seguidas com os mesmos operandos, geralmente resultado de copiar e colar durante a escrita do teste.',
    badExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `test('define usuário como admin', () => {
  const user = promoteToAdmin(baseUser);

  expect(user.role).toBe('admin');
  expect(user.role).toBe('admin'); // redundante
});`,
    },
    goodExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `test('define usuário como admin', () => {
  const user = promoteToAdmin(baseUser);

  expect(user.role).toBe('admin');
});`,
    },
    detectionRule: {
      name: 'duplicate-expect-statement',
      description:
        'Comparar a representação textual normalizada (AST diff) de CallExpressions de asserção consecutivas dentro do mesmo bloco e sinalizar duplicatas exatas.',
      pseudocode: `ON Block:
  FOR each pair (expectA, expectB) consecutive:
    IF astEquals(expectA, expectB):
       REPORT 'Redundant Assertion: remova a chamada duplicada'`,
      tool: 'ESLint Rule (Babel AST)',
    },
    tags: ['expect', 'duplicação', 'copy-paste'],
  },
  {
    id: 10,
    slug: 'equality-sledgehammer-assertion',
    name: 'Equality Sledgehammer Assertion',
    aka: ['JSON.stringify Comparison'],
    category: 'assertions',
    impact: ['Manutenibilidade', 'Legibilidade'],
    definition:
      'Uso de JSON.stringify() para comparar dois objetos em vez de um matcher de igualdade profunda nativo, o que quebra por diferenças triviais de ordem de chaves e gera mensagens de erro ilegíveis.',
    manifestation:
      'expect(JSON.stringify(a)).toBe(JSON.stringify(b)) no lugar de expect(a).toEqual(b), comum quando o autor tenta "forçar" uma comparação profunda manualmente.',
    badExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `test('serializa configuração', () => {
  const config = buildConfig({ env: 'prod' });

  expect(JSON.stringify(config)).toBe(
    JSON.stringify({ env: 'prod', debug: false, retries: 3 })
  );
});`,
    },
    goodExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `test('serializa configuração', () => {
  const config = buildConfig({ env: 'prod' });

  expect(config).toEqual({ env: 'prod', debug: false, retries: 3 });
});`,
    },
    detectionRule: {
      name: 'json-stringify-equality',
      description:
        'Detectar CallExpression de expect().toBe()/toEqual() cujos argumentos envolvem JSON.stringify(...) em ambos os lados.',
      pseudocode: `ON CallExpression(expect(a).toBe(b)):
  IF isCallTo(a, 'JSON.stringify') AND isCallTo(b, 'JSON.stringify'):
     REPORT 'Equality Sledgehammer: use toEqual()/toMatchObject() diretamente'`,
      tool: 'ESLint Rule (Babel AST)',
    },
    tags: ['JSON.stringify', 'toEqual', 'comparação profunda'],
  },

  // ─────────────────────────────────────────────────────────
  // Categoria 2 — Setup, Teardown e Fixtures (11–19)
  // ─────────────────────────────────────────────────────────
  {
    id: 11,
    slug: 'general-fixture',
    name: 'General Fixture',
    aka: ['Fat Fixture', 'Overloaded Setup'],
    category: 'fixtures',
    impact: ['Manutenibilidade', 'Performance'],
    definition:
      'Um beforeEach único monta um cenário enorme — múltiplos mocks, providers e dados — do qual a maioria dos testes da suíte só precisa de uma fração pequena, tornando o setup caro e difícil de entender.',
    manifestation:
      'beforeEach() global em describe() que inicializa banco em memória, mocks de rede, contexto de autenticação e feature flags para todos os testes, mesmo os que testam apenas uma função pura.',
    badExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `describe('OrderService', () => {
  let db, authContext, featureFlags, httpMock;

  beforeEach(() => {
    db = createInMemoryDb();
    authContext = mockAuthContext({ role: 'admin' });
    featureFlags = mockFlags({ newCheckout: true });
    httpMock = mockHttpClient();
    seedOrders(db, 50);
  });

  test('formata preço em centavos', () => {
    expect(formatCents(1050)).toBe('R$ 10,50'); // não usa nada do setup
  });
});`,
    },
    goodExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `describe('formatCents', () => {
  test('formata preço em centavos', () => {
    expect(formatCents(1050)).toBe('R$ 10,50');
  });
});

describe('OrderService.checkout', () => {
  beforeEach(() => {
    // setup específico, só para os testes de checkout
  });
  // ...
});`,
    },
    detectionRule: {
      name: 'unused-setup-in-before-each',
      description:
        'Para cada variável inicializada em um beforeEach, verificar se ela é referenciada no corpo de todos os testes do describe; sinalizar quando a taxa de uso é baixa (ex.: usada em < 50% dos testes).',
      pseudocode: `ON BeforeEachHook in Describe:
  vars = declaredVariables(hook)
  usageRatio = countTestsUsing(vars) / totalTests(describe)
  IF usageRatio < 0.5:
     REPORT 'General Fixture: divida o setup por sub-describe'`,
      tool: 'ts-morph / TS Compiler API',
    },
    tags: ['beforeEach', 'setup pesado', 'acoplamento de suíte'],
  },
  {
    id: 12,
    slug: 'vague-header-setup',
    name: 'Vague Header Setup',
    aka: ['Mystery Variables'],
    category: 'fixtures',
    impact: ['Legibilidade'],
    definition:
      'Variáveis globais mutáveis declaradas no topo da suíte com nomes e valores genéricos (foo, data1, x), obrigando o leitor a rolar o arquivo para entender o que representam em cada teste.',
    manifestation:
      'let a, b, result; no topo do describe, atribuídos em diferentes beforeEach/testes com valores como "test", 1, {} sem significado de domínio.',
    badExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `describe('discount rules', () => {
  let a, b, result;

  beforeEach(() => {
    a = 100;
    b = 'test';
  });

  test('aplica desconto', () => {
    result = applyDiscount(a, 0.1);
    expect(result).toBe(90);
  });
});`,
    },
    goodExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `describe('discount rules', () => {
  const BASE_PRICE = 100;
  const TEN_PERCENT = 0.1;

  test('aplica 10% de desconto sobre o preço base', () => {
    const discountedPrice = applyDiscount(BASE_PRICE, TEN_PERCENT);
    expect(discountedPrice).toBe(90);
  });
});`,
    },
    detectionRule: {
      name: 'non-descriptive-fixture-identifier',
      description:
        'Sinalizar identificadores de variáveis no escopo do describe cujo nome pertence a uma lista de termos genéricos (a, b, x, data, temp, result, foo, bar) combinados com baixa entropia semântica.',
      pseudocode: `ON VariableDeclarator in Describe scope:
  IF name matches /^(a|b|x|temp\\d?|data\\d?|foo|bar)$/:
     REPORT 'Vague Header Setup: renomeie para refletir o domínio'`,
      tool: 'ESLint Rule (Babel AST)',
    },
    tags: ['nomenclatura', 'legibilidade', 'setup'],
  },
  {
    id: 13,
    slug: 'curdled-test-fixtures',
    name: 'Curdled Test Fixtures',
    aka: ['Patchwork Fixture'],
    category: 'fixtures',
    impact: ['Manutenibilidade', 'Flakiness'],
    definition:
      'Uma fixture compartilhada foi "remendada" repetidamente ao longo do tempo — com overrides, spreads e exceções acumuladas — até se tornar quebradiça e difícil de prever seu estado final.',
    manifestation:
      'Um factory de fixture com múltiplas camadas de { ...base, ...override1, ...override2 } espalhadas em vários arquivos de teste, cada um ajustando um campo diferente para "fazer o teste passar".',
    badExample: {
      language: 'typescript',
      framework: 'Jest',
      code: `const baseUser = { id: '1', role: 'user', active: true, plan: 'free' };

// teste A
const userA = { ...baseUser, plan: 'pro', active: false };
// teste B, meses depois
const userB = { ...userA, role: 'admin', legacyFlag: true };
// ninguém mais sabe por que legacyFlag existe`,
    },
    goodExample: {
      language: 'typescript',
      framework: 'Jest',
      code: `function makeUser(overrides: Partial<User> = {}): User {
  return { id: '1', role: 'user', active: true, plan: 'free', ...overrides };
}

const proUserInactive = makeUser({ plan: 'pro', active: false });
const adminUser = makeUser({ role: 'admin' });`,
    },
    detectionRule: {
      name: 'chained-fixture-spread',
      description:
        'Detectar cadeias de ObjectExpression com spread de outra variável derivada de fixture (profundidade > 2), indicando composição acumulada não controlada.',
      pseudocode: `ON ObjectExpression with SpreadElement(source):
  IF spreadChainDepth(source) > 2:
     REPORT 'Curdled Fixture: centralize em uma factory parametrizada'`,
      tool: 'ts-morph / TS Compiler API',
    },
    tags: ['factory', 'fixture', 'spread operator'],
  },
  {
    id: 14,
    slug: 'excessive-inline-setup',
    name: 'Excessive Inline Setup',
    aka: ['Setup Bloat'],
    category: 'fixtures',
    impact: ['Legibilidade', 'Manutenibilidade'],
    definition:
      'O corpo do teste contém dezenas de linhas de preparação de dados/mocks para, no final, executar apenas uma linha de ação e uma de asserção — a intenção do teste fica soterrada em ruído.',
    manifestation:
      'Um único it() com 30+ linhas construindo manualmente um grafo de objetos aninhados antes de chamar a função sob teste, em vez de usar builders/factories reutilizáveis.',
    badExample: {
      language: 'typescript',
      framework: 'Vitest',
      code: `test('calcula frete grátis', () => {
  const address = { street: 'Rua A', city: 'SP', state: 'SP', zip: '00000-000' };
  const customer = { id: '1', name: 'Ana', address, loyaltyTier: 'gold' };
  const item1 = { sku: 'a', price: 50, weight: 1, category: 'books' };
  const item2 = { sku: 'b', price: 30, weight: 0.5, category: 'books' };
  const cart = { customer, items: [item1, item2], couponCode: null };

  expect(calculateShipping(cart)).toBe(0);
});`,
    },
    goodExample: {
      language: 'typescript',
      framework: 'Vitest',
      code: `test('calcula frete grátis para cliente gold', () => {
  const cart = buildCart({ customer: buildCustomer({ loyaltyTier: 'gold' }) });

  expect(calculateShipping(cart)).toBe(0);
});`,
    },
    detectionRule: {
      name: 'high-setup-to-assertion-ratio',
      description:
        'Contar statements de preparação (declarações/atribuições) antes da primeira asserção e comparar à quantidade de linhas de asserção; sinalizar razão muito desbalanceada.',
      pseudocode: `ON TestFunctionBody:
  setupLines = statementsBeforeFirstAssertion(body)
  IF setupLines > 15 AND assertionLines <= 2:
     REPORT 'Excessive Inline Setup: extraia builders/factories'`,
      tool: 'ts-morph / TS Compiler API',
    },
    tags: ['builder pattern', 'factory', 'legibilidade'],
  },
  {
    id: 15,
    slug: 'empty-shared-fixture',
    name: 'Empty Shared-Fixture',
    aka: ['Empty Setup Hook'],
    category: 'fixtures',
    impact: ['Legibilidade'],
    definition:
      'Hooks de ciclo de vida (beforeEach, afterAll etc.) declarados vazios ou apenas com comentários, esquecidos após uma refatoração, gerando ruído e confusão sobre a real necessidade do hook.',
    manifestation:
      'beforeEach(() => {}) ou afterEach(() => { /* TODO */ }) permanecendo no arquivo sem nenhuma instrução funcional dentro.',
    badExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `describe('PaymentGateway', () => {
  beforeEach(() => {
    // TODO: configurar mock do gateway
  });

  test('rejeita cartão inválido', () => {
    expect(() => charge({ card: 'invalid' })).toThrow();
  });
});`,
    },
    goodExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `describe('PaymentGateway', () => {
  test('rejeita cartão inválido', () => {
    expect(() => charge({ card: 'invalid' })).toThrow();
  });
});`,
    },
    detectionRule: {
      name: 'empty-lifecycle-hook',
      description:
        'Detectar CallExpression de beforeEach/afterEach/beforeAll/afterAll cujo callback tem corpo vazio ou contém apenas comentários (sem statements reais).',
      pseudocode: `ON CallExpression(name in lifecycleHooks):
  IF callbackBody.statements.length === 0:
     REPORT 'Empty Shared-Fixture: remova o hook não utilizado'`,
      tool: 'ESLint Rule (Babel AST)',
    },
    tags: ['beforeEach', 'afterEach', 'código morto'],
  },
  {
    id: 16,
    slug: 'hidden-test-data-bury-the-lede',
    name: 'Hidden Test Data / Bury The Lede',
    aka: ['Bury The Lede', 'Opaque Fixture File'],
    category: 'fixtures',
    impact: ['Legibilidade', 'Manutenibilidade'],
    definition:
      'Dados essenciais para entender por que o teste passa ou falha estão encapsulados em arquivos externos (fixtures.json, mocks.ts) sem indicação clara no teste do que eles contêm ou por que aquele valor importa.',
    manifestation:
      'import { user } from "./fixtures/complex-user.json" usado numa asserção sobre um campo específico, sem que o teste explique ou destaque qual valor daquele arquivo está sendo validado.',
    badExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `import fixture from './fixtures/user-42.json';

test('calcula elegibilidade de crédito', () => {
  const result = evaluateCredit(fixture);
  expect(result.approved).toBe(true); // por que este fixture aprova? não dá pra saber aqui
});`,
    },
    goodExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `test('aprova crédito para renda acima de R$ 5.000 e score > 700', () => {
  const applicant = buildApplicant({ income: 5500, creditScore: 720 });

  const result = evaluateCredit(applicant);

  expect(result.approved).toBe(true);
});`,
    },
    detectionRule: {
      name: 'opaque-external-fixture-usage',
      description:
        'Detectar ImportDeclaration de arquivos de fixture (.json/.fixture.ts) cujo identificador importado é usado diretamente em uma asserção, sem nenhuma variável intermediária nomeada descrevendo o cenário.',
      pseudocode: `ON ImportDeclaration(path matches /fixtures?\\//):
  IF importedIdentifier flowsDirectlyInto(expectCall):
     REPORT 'Hidden Test Data: explicite o cenário com um builder nomeado'`,
      tool: 'ts-morph / TS Compiler API',
    },
    tags: ['fixture externa', 'json', 'legibilidade'],
  },
  {
    id: 17,
    slug: 'the-mother-hen',
    name: 'The Mother Hen',
    aka: ['Setup Test', 'Guinea Pig Test'],
    category: 'fixtures',
    impact: ['Manutenibilidade', 'Confiabilidade'],
    definition:
      'Um teste "mãe", geralmente o primeiro do arquivo, é responsável por montar o cenário de dados que os testes seguintes assumem já existir — criando dependência implícita de ordem de execução.',
    manifestation:
      'it("cria usuário") que salva um registro real usado depois por it("atualiza usuário") sem recriá-lo, dependendo de os testes rodarem sequencialmente e sem isolamento (comum em suítes de integração mal isoladas).',
    badExample: {
      language: 'javascript',
      framework: 'Mocha',
      code: `let userId;

it('cria o usuário', async () => {
  const user = await api.createUser({ name: 'Ana' });
  userId = user.id; // estado compartilhado entre testes
});

it('atualiza o usuário criado acima', async () => {
  const updated = await api.updateUser(userId, { name: 'Ana Silva' });
  expect(updated.name).toBe('Ana Silva');
});`,
    },
    goodExample: {
      language: 'javascript',
      framework: 'Mocha',
      code: `it('atualiza o nome de um usuário existente', async () => {
  const user = await api.createUser({ name: 'Ana' });

  const updated = await api.updateUser(user.id, { name: 'Ana Silva' });

  expect(updated.name).toBe('Ana Silva');
});`,
    },
    detectionRule: {
      name: 'state-shared-across-sibling-tests',
      description:
        'Identificar variáveis declaradas no escopo do describe, atribuídas dentro de um teste e lidas por outro teste posterior no mesmo arquivo (fluxo de dados entre ItStatements irmãos).',
      pseudocode: `ON Describe block:
  FOR each variable assigned inside a Test:
    IF readInLaterSiblingTest(variable):
       REPORT 'The Mother Hen: cada teste deve criar seu próprio cenário'`,
      tool: 'ts-morph / TS Compiler API',
    },
    tags: ['ordem de execução', 'estado compartilhado', 'isolamento'],
  },
  {
    id: 18,
    slug: 'unused-definition',
    name: 'Unused Definition',
    aka: ['Dead Fixture Variable'],
    category: 'fixtures',
    impact: ['Legibilidade'],
    definition:
      'Variáveis, mocks ou spies são criados no corpo do teste ou nos hooks de setup, mas nunca são referenciados em nenhuma ação ou asserção — código morto que confunde o leitor.',
    manifestation:
      'const loggerSpy = jest.spyOn(console, "log") criado mas nunca verificado com expect(loggerSpy)..., ou uma variável de fixture atribuída e nunca lida.',
    badExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `test('atualiza estoque', () => {
  const loggerSpy = jest.spyOn(console, 'log');
  const unusedMock = jest.fn();

  updateStock('sku-1', 5);

  expect(getStockLevel('sku-1')).toBe(5);
  // loggerSpy e unusedMock nunca são verificados
});`,
    },
    goodExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `test('atualiza estoque', () => {
  updateStock('sku-1', 5);

  expect(getStockLevel('sku-1')).toBe(5);
});`,
    },
    detectionRule: {
      name: 'unused-fixture-declaration',
      description:
        'Reaproveitar análise de variáveis não utilizadas (no-unused-vars) restrita ao escopo de blocos de teste, incluindo spies/mocks (jest.fn, jest.spyOn) atribuídos a identificadores nunca lidos.',
      pseudocode: `ON VariableDeclarator in TestBody:
  IF isNeverReferenced(identifier) after declaration:
     REPORT 'Unused Definition: remova a variável/mock não utilizado'`,
      tool: 'ESLint Rule (Babel AST)',
    },
    tags: ['jest.fn', 'jest.spyOn', 'código morto'],
  },
  {
    id: 19,
    slug: 'resource-leakage-missing-teardown',
    name: 'Resource Leakage (Missing Teardown)',
    aka: ['Missing Cleanup'],
    category: 'fixtures',
    impact: ['Flakiness', 'Performance'],
    definition:
      'Recursos abertos durante o teste — timers, mocks globais, conexões, elementos DOM, listeners — não são liberados ao final, vazando estado para os testes seguintes e causando falhas intermitentes.',
    manifestation:
      'jest.useFakeTimers() sem jest.useRealTimers() no afterEach, jest.spyOn() sem mockRestore(), ou render() de Testing Library sem cleanup() em ambientes sem auto-cleanup configurado.',
    badExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `describe('scheduler', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(Date, 'now').mockReturnValue(1000);
  });

  test('agenda tarefa', () => {
    scheduleTask(() => {}, 500);
    jest.advanceTimersByTime(500);
    expect(Date.now()).toBe(1000);
  });
  // sem afterEach — timers e spy vazam para o próximo describe
});`,
    },
    goodExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `describe('scheduler', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(Date, 'now').mockReturnValue(1000);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  test('agenda tarefa', () => {
    scheduleTask(() => {}, 500);
    jest.advanceTimersByTime(500);
    expect(Date.now()).toBe(1000);
  });
});`,
    },
    detectionRule: {
      name: 'setup-without-matching-teardown',
      description:
        'Para cada chamada de "abertura de recurso" (useFakeTimers, spyOn, render sem cleanup automático) dentro de um beforeEach/test, verificar se existe a chamada de fechamento correspondente em um afterEach/afterAll no mesmo escopo.',
      pseudocode: `ON CallExpression(opener in ['useFakeTimers','spyOn','render']):
  IF NOT existsMatchingCloser(describeScope, opener):
     REPORT 'Resource Leakage: adicione afterEach com a limpeza correspondente'`,
      tool: 'ESLint Rule (Babel AST)',
    },
    tags: ['afterEach', 'fake timers', 'mockRestore', 'cleanup'],
  },

  // ─────────────────────────────────────────────────────────
  // Categoria 3 — Dependencies & Isolamento (20–28)
  // ─────────────────────────────────────────────────────────
  {
    id: 20,
    slug: 'mystery-guest',
    name: 'Mystery Guest',
    aka: ['Hidden Dependency'],
    category: 'dependencies',
    impact: ['Legibilidade', 'Manutenibilidade'],
    definition:
      'O teste depende do conteúdo de um recurso externo (arquivo .json, .env, banco seedado) sem que o leitor consiga saber o que está sendo testado apenas lendo o corpo do teste.',
    manifestation:
      'readFileSync("./data/report.csv") usado dentro de um teste, cujos valores esperados na asserção só fazem sentido abrindo o arquivo externo manualmente.',
    badExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `test('gera relatório de vendas', () => {
  const raw = fs.readFileSync('./data/sales-2023.csv', 'utf-8');

  const report = generateReport(raw);

  expect(report.total).toBe(184320); // de onde vem esse número?
});`,
    },
    goodExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `test('soma o total de vendas do período', () => {
  const csv = 'date,amount\\n2023-01-01,100\\n2023-01-02,50';

  const report = generateReport(csv);

  expect(report.total).toBe(150);
});`,
    },
    detectionRule: {
      name: 'assertion-depends-on-external-file',
      description:
        'Detectar chamadas a fs.readFileSync/require de arquivos de dados fora do diretório de teste cujo retorno alimenta um valor comparado em expect(), sem uma constante nomeada explicando a origem do valor esperado.',
      pseudocode: `ON CallExpression('fs.readFileSync' | 'require'(dataPath)):
  IF result flowsInto(expectArgument):
     REPORT 'Mystery Guest: inline os dados relevantes no próprio teste'`,
      tool: 'ts-morph / TS Compiler API',
    },
    tags: ['fs.readFileSync', 'dados externos', 'legibilidade'],
  },
  {
    id: 21,
    slug: 'chain-gang-dependent-test',
    name: 'Chain Gang / Dependent Test',
    aka: ['Test Order Dependency'],
    category: 'dependencies',
    impact: ['Flakiness', 'Confiabilidade'],
    definition:
      'A passagem de um teste depende do sucesso ou da ordem de execução de um teste anterior, quebrando quando os testes são reordenados, filtrados ou paralelizados.',
    manifestation:
      'Uso de test.concurrent ou execução paralela junto de estado mutável compartilhado (array, contador) incrementado por um teste e lido por outro, sem describe.each ou isolamento.',
    badExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `let cart = [];

it('adiciona item ao carrinho', () => {
  cart.push({ sku: 'a', qty: 1 });
  expect(cart.length).toBe(1);
});

it('remove item do carrinho', () => {
  cart.pop(); // assume que o teste anterior rodou antes
  expect(cart.length).toBe(0);
});`,
    },
    goodExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `it('adiciona item ao carrinho', () => {
  const cart = addItem([], { sku: 'a', qty: 1 });
  expect(cart.length).toBe(1);
});

it('remove item do carrinho', () => {
  const cart = removeItem([{ sku: 'a', qty: 1 }], 'a');
  expect(cart.length).toBe(0);
});`,
    },
    detectionRule: {
      name: 'inter-test-state-dependency',
      description:
        'Identificar variáveis no escopo do describe mutadas por um teste (push/pop/atribuição) e lidas por outro teste, sem reinicialização em beforeEach.',
      pseudocode: `ON Describe scope:
  sharedVars = variablesMutatedInsideAnyTest(scope)
  IF sharedVars.readInDifferentTest AND NOT resetInBeforeEach(sharedVars):
     REPORT 'Chain Gang: elimine o estado mutável compartilhado entre testes'`,
      tool: 'ts-morph / TS Compiler API',
    },
    tags: ['ordem de execução', 'estado compartilhado', 'test.concurrent'],
  },
  {
    id: 22,
    slug: 'test-pollution-environmental-vandal',
    name: 'Test Pollution / Environmental Vandal',
    aka: ['Environmental Vandalism'],
    category: 'dependencies',
    impact: ['Flakiness', 'Confiabilidade'],
    definition:
      'O teste modifica objetos globais compartilhados (process.env, window, Date, Math.random) sem restaurar o valor original, "poluindo" o ambiente para os testes executados depois.',
    manifestation:
      'process.env.NODE_ENV = "production" atribuído diretamente dentro de um teste sem salvar/restaurar o valor anterior em afterEach.',
    badExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `test('usa configuração de produção', () => {
  process.env.NODE_ENV = 'production';

  const config = loadConfig();

  expect(config.debug).toBe(false);
  // NODE_ENV permanece 'production' para os próximos testes
});`,
    },
    goodExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `describe('loadConfig', () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  test('usa configuração de produção', () => {
    process.env.NODE_ENV = 'production';

    expect(loadConfig().debug).toBe(false);
  });
});`,
    },
    detectionRule: {
      name: 'global-mutation-without-restore',
      description:
        'Detectar AssignmentExpression a membros de objetos globais conhecidos (process.env, window, global) dentro de um teste, sem um afterEach/finally que restaure o valor original no mesmo escopo.',
      pseudocode: `ON AssignmentExpression(target in ['process.env.*','window.*','global.*']):
  IF NOT existsRestoreInAfterEachOrFinally(scope, target):
     REPORT 'Test Pollution: restaure o valor original do global após o teste'`,
      tool: 'ESLint Rule (Babel AST)',
    },
    tags: ['process.env', 'estado global', 'afterEach'],
  },
  {
    id: 23,
    slug: 'context-sensitivity',
    name: 'Context Sensitivity',
    aka: ['Environment-Dependent Test'],
    category: 'dependencies',
    impact: ['Flakiness'],
    definition:
      'O teste passa ou falha dependendo de características do ambiente de execução — timezone do SO, locale, terminador de linha (CRLF vs LF) — em vez de depender apenas da lógica sob teste.',
    manifestation:
      'new Date(2024, 0, 10).getHours() comparado a um valor fixo sem fixar o timezone, ou comparação de strings multilinha sensível a \\r\\n em ambientes Windows vs Unix na CI.',
    badExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `test('define horário de expiração', () => {
  const expiry = new Date(2024, 0, 10, 23, 0);

  expect(expiry.getHours()).toBe(23); // depende do timezone local do runner
});`,
    },
    goodExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `test('define horário de expiração em UTC', () => {
  const expiry = new Date(Date.UTC(2024, 0, 10, 23, 0));

  expect(expiry.getUTCHours()).toBe(23);
});`,
    },
    detectionRule: {
      name: 'timezone-or-locale-sensitive-call',
      description:
        'Sinalizar uso de métodos sensíveis ao ambiente (getHours, getDay, toLocaleString, new Date(y,m,d) sem UTC) dentro de asserções ou cálculo de valores esperados.',
      pseudocode: `ON CallExpression(method in ['getHours','getDay','toLocaleString']):
  IF NOT usesUTCVariant AND flowsInto(expectArgument):
     REPORT 'Context Sensitivity: normalize para UTC ou injete o timezone'`,
      tool: 'ESLint Rule (Babel AST)',
    },
    tags: ['timezone', 'Date', 'CRLF/LF', 'CI'],
  },
  {
    id: 24,
    slug: 'local-only-testing-the-local-hero',
    name: 'Local Only Testing (The Local Hero)',
    aka: ['The Local Hero'],
    category: 'dependencies',
    impact: ['Confiabilidade'],
    definition:
      'O teste embute caminhos absolutos do sistema de arquivos da máquina do autor, funcionando apenas localmente e quebrando em qualquer outra máquina ou no ambiente de CI.',
    manifestation:
      'Strings como "/Users/joao/projeto/fixtures/data.csv" ou "C:\\\\Users\\\\joao\\\\..." usadas diretamente em path.join ou fs.readFileSync.',
    badExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `test('lê arquivo de configuração', () => {
  const raw = fs.readFileSync('/Users/joao/projects/app/config.yaml', 'utf-8');

  expect(parseConfig(raw)).toBeDefined();
});`,
    },
    goodExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `test('lê arquivo de configuração', () => {
  const configPath = path.join(__dirname, 'fixtures', 'config.yaml');
  const raw = fs.readFileSync(configPath, 'utf-8');

  expect(parseConfig(raw)).toBeDefined();
});`,
    },
    detectionRule: {
      name: 'hardcoded-absolute-filesystem-path',
      description:
        'Detectar literais de string que correspondem ao padrão de caminho absoluto Unix (/Users/, /home/) ou Windows (C:\\\\) usados como argumento de funções de arquivo.',
      pseudocode: `ON StringLiteral matching /^(\\/Users\\/|\\/home\\/|[A-Z]:\\\\)/:
  IF usedAsArgumentOf(fs.readFileSync | path.join | require):
     REPORT 'Local Only Testing: use path.join(__dirname, ...) com caminho relativo'`,
      tool: 'ESLint Rule (Babel AST)',
    },
    tags: ['caminho absoluto', 'portabilidade', 'CI'],
  },
  {
    id: 25,
    slug: 'web-browsing-test-hidden-integration',
    name: 'Web-Browsing Test (Hidden Integration)',
    aka: ['Hidden Integration Test', 'Real Network Call'],
    category: 'dependencies',
    impact: ['Flakiness', 'Performance'],
    definition:
      'Um teste nomeado/organizado como unitário dispara requisições HTTP reais pela rede por falta de mock, tornando-o lento, dependente de conectividade e de serviços de terceiros.',
    manifestation:
      'Uso direto de fetch()/axios.get() apontando para uma URL real (inclusive de terceiros) dentro de um arquivo *.test.ts sem msw, nock ou jest.mock("axios").',
    badExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `test('busca cotação do dólar', async () => {
  const res = await fetch('https://api.exchangerate.host/latest?base=USD');
  const data = await res.json();

  expect(data.rates.BRL).toBeGreaterThan(0);
});`,
    },
    goodExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `import { server } from './mocks/server'; // configurado com msw
import { rest } from 'msw';

test('busca cotação do dólar', async () => {
  server.use(
    rest.get('*/latest', (_, res, ctx) => res(ctx.json({ rates: { BRL: 5.1 } })))
  );

  const data = await getExchangeRate('USD');

  expect(data.rates.BRL).toBe(5.1);
});`,
    },
    detectionRule: {
      name: 'unmocked-real-network-call',
      description:
        'Detectar chamadas a fetch/axios/http.request cujo argumento de URL contém um domínio literal (http:// ou https://) dentro de arquivos de teste, sem interceptação por msw/nock/jest.mock no mesmo módulo.',
      pseudocode: `ON CallExpression(fetch|axios.get)(urlContainsLiteralDomain):
  IF NOT moduleImports(['msw','nock']) AND NOT isMocked('axios'|'fetch'):
     REPORT 'Hidden Integration Test: mocke a chamada de rede'`,
      tool: 'ESLint Rule (Babel AST)',
    },
    tags: ['fetch', 'msw', 'nock', 'rede real'],
  },
  {
    id: 26,
    slug: 'counting-on-spies',
    name: 'Counting On Spies',
    aka: ['Overspecified Interaction Test'],
    category: 'dependencies',
    impact: ['Manutenibilidade'],
    definition:
      'O teste verifica exaustivamente como um método interno foi chamado (quantas vezes, com quais argumentos exatos, em qual ordem) em vez de verificar o comportamento observável, acoplando o teste a detalhes de implementação.',
    manifestation:
      'expect(spy).toHaveBeenCalledTimes(3) e expect(spy).toHaveBeenNthCalledWith(2, ...) usados para validar um cálculo que poderia ser verificado diretamente pelo valor de retorno.',
    badExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `test('calcula preço com desconto', () => {
  const applyDiscountSpy = jest.spyOn(pricing, 'applyDiscount');

  pricing.checkout(cart);

  expect(applyDiscountSpy).toHaveBeenCalledTimes(2);
  expect(applyDiscountSpy).toHaveBeenNthCalledWith(1, 100, 0.1);
  expect(applyDiscountSpy).toHaveBeenNthCalledWith(2, 90, 0.05);
});`,
    },
    goodExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `test('calcula preço final com descontos combinados', () => {
  const total = pricing.checkout(cart);

  expect(total).toBe(85.5);
});`,
    },
    detectionRule: {
      name: 'excessive-spy-call-assertions',
      description:
        'Contar quantas asserções em um teste são sobre chamadas de spy (toHaveBeenCalledWith/toHaveBeenNthCalledWith) versus asserções sobre valores de retorno/estado observável; sinalizar quando a maioria é sobre spies.',
      pseudocode: `ON TestFunctionBody:
  spyAssertions = count(expect(spy).toHaveBeenCalled*)
  outcomeAssertions = count(expect(returnValue|state))
  IF spyAssertions > outcomeAssertions:
     REPORT 'Counting On Spies: prefira verificar o comportamento observável'`,
      tool: 'ESLint Rule (Babel AST)',
    },
    tags: ['jest.spyOn', 'toHaveBeenCalledWith', 'acoplamento a implementação'],
  },
  {
    id: 27,
    slug: 'middle-man',
    name: 'Middle Man',
    aka: ['Mock Chain Delegation'],
    category: 'dependencies',
    impact: ['Manutenibilidade'],
    definition:
      'Uma cadeia de mocks apenas delega chamadas para outros mocks sem que o teste valide nenhuma lógica real, tornando-o um "teste do próprio mock" em vez do código de produção.',
    manifestation:
      'jest.mock() de um módulo inteiro onde a função sob teste apenas repassa argumentos para a dependência mockada, e a asserção final apenas confirma que o mock foi chamado com o que ele mesmo recebeu.',
    badExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `jest.mock('./repository');

test('busca usuário pelo id', async () => {
  repository.findById.mockResolvedValue({ id: '1' });

  const result = await userService.getUser('1');

  expect(repository.findById).toHaveBeenCalledWith('1');
  expect(result).toEqual({ id: '1' }); // só ecoa o próprio mock
});`,
    },
    goodExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `test('busca usuário e aplica regra de exibição de nome', async () => {
  repository.findById.mockResolvedValue({ id: '1', firstName: 'Ana', lastName: 'Silva' });

  const result = await userService.getUser('1');

  expect(result.displayName).toBe('Ana S.'); // valida lógica real do service
});`,
    },
    detectionRule: {
      name: 'mock-echo-without-business-logic',
      description:
        'Detectar testes em que o valor retornado pela função sob teste é estruturalmente idêntico ao valor configurado no mock (mockResolvedValue/mockReturnValue), sem transformação intermediária testada.',
      pseudocode: `ON TestFunctionBody:
  mockedReturn = valuePassedTo(mockResolvedValue|mockReturnValue)
  assertedValue = argumentOf(finalExpect)
  IF astEquals(mockedReturn, assertedValue):
     REPORT 'Middle Man: o teste não valida nenhuma lógica além do mock'`,
      tool: 'ts-morph / TS Compiler API',
    },
    tags: ['jest.mock', 'mockResolvedValue', 'valor de teste nulo'],
  },
  {
    id: 28,
    slug: 'programming-paradigms-blend',
    name: 'Programming Paradigms Blend',
    aka: ['Mixed Async Style'],
    category: 'dependencies',
    impact: ['Legibilidade', 'Manutenibilidade'],
    definition:
      'O mesmo arquivo (ou até o mesmo teste) mistura estilos assíncronos incompatíveis — callback done(), Promises encadeadas com .then() e async/await — dificultando o rastreio do fluxo de execução.',
    manifestation:
      'Um it(done => ...) chamando internamente uma função que retorna Promise com .then(), enquanto outro teste do mesmo arquivo usa async/await puro.',
    badExample: {
      language: 'javascript',
      framework: 'Mocha',
      code: `it('salva registro (callback style)', (done) => {
  saveRecord({ id: 1 }).then((res) => {
    expect(res.ok).to.be.true;
    done();
  });
});

it('lê registro (async/await)', async () => {
  const res = await readRecord(1);
  expect(res.id).to.equal(1);
});`,
    },
    goodExample: {
      language: 'javascript',
      framework: 'Mocha',
      code: `it('salva registro', async () => {
  const res = await saveRecord({ id: 1 });
  expect(res.ok).to.be.true;
});

it('lê registro', async () => {
  const res = await readRecord(1);
  expect(res.id).to.equal(1);
});`,
    },
    detectionRule: {
      name: 'mixed-async-styles-in-file',
      description:
        'Contar, por arquivo de teste, quantos testes usam parâmetro done, quantos usam .then() encadeado e quantos usam async/await; sinalizar quando mais de um estilo coexiste.',
      pseudocode: `ON TestFile:
  styles = { done: usesDoneCallback(file), promiseThen: usesThenChain(file), asyncAwait: usesAsyncAwait(file) }
  IF countTrue(styles) > 1:
     REPORT 'Programming Paradigms Blend: padronize em async/await'`,
      tool: 'ESLint Rule (Babel AST)',
    },
    tags: ['done()', 'async/await', 'promise chaining', 'consistência'],
  },

  // ─────────────────────────────────────────────────────────
  // Categoria 4 — Code Duplication & Complexity (29–36)
  // ─────────────────────────────────────────────────────────
  {
    id: 29,
    slug: 'duplicate-test-code-copy-paste',
    name: 'Duplicate Test Code (Copy-Paste)',
    aka: ['Copy-Paste Test'],
    category: 'duplication',
    impact: ['Manutenibilidade'],
    definition:
      'Vários testes praticamente idênticos, variando apenas um ou dois valores de entrada, foram criados por copiar e colar em vez de parametrização — qualquer mudança na lógica exige editar todos eles.',
    manifestation:
      'Vários it() quase idênticos testando a mesma função com entradas diferentes, quando poderiam ser expressos com test.each()/it.each() em Jest/Vitest ou describe.each.',
    badExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `test('valida CPF 111.444.777-35', () => {
  expect(isValidCpf('111.444.777-35')).toBe(true);
});
test('valida CPF 123.456.789-00', () => {
  expect(isValidCpf('123.456.789-00')).toBe(false);
});
test('valida CPF vazio', () => {
  expect(isValidCpf('')).toBe(false);
});`,
    },
    goodExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `test.each([
  ['111.444.777-35', true],
  ['123.456.789-00', false],
  ['', false],
])('isValidCpf(%s) deve retornar %s', (cpf, expected) => {
  expect(isValidCpf(cpf)).toBe(expected);
});`,
    },
    detectionRule: {
      name: 'near-duplicate-test-bodies',
      description:
        'Calcular a similaridade estrutural (AST normalizada, ignorando literais) entre corpos de testes consecutivos no mesmo describe; sinalizar grupos com alta similaridade que poderiam virar test.each.',
      pseudocode: `ON Describe block:
  FOR each cluster of tests with structuralSimilarity > 0.9:
    IF clusterSize >= 3:
       REPORT 'Duplicate Test Code: converta para test.each()'`,
      tool: 'ts-morph / TS Compiler API',
    },
    tags: ['test.each', 'parametrização', 'DRY'],
  },
  {
    id: 30,
    slug: 'long-test',
    name: 'Long Test',
    aka: ['Giant Test', 'God Test'],
    category: 'duplication',
    impact: ['Legibilidade', 'Manutenibilidade'],
    definition:
      'Um único teste acumula múltiplos cenários e fluxos de ação/verificação, tornando difícil identificar qual parte falhou e o que exatamente está sendo validado.',
    manifestation:
      'Um it() com 100+ linhas cobrindo criação, atualização, exclusão e listagem de um recurso na mesma função, com várias seções separadas por comentários "// agora testamos X".',
    badExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `test('fluxo completo de tarefas', async () => {
  const created = await api.createTask({ title: 'A' });
  expect(created.id).toBeDefined();

  const updated = await api.updateTask(created.id, { title: 'B' });
  expect(updated.title).toBe('B');

  const list = await api.listTasks();
  expect(list.length).toBeGreaterThan(0);

  await api.deleteTask(created.id);
  const afterDelete = await api.listTasks();
  expect(afterDelete.find(t => t.id === created.id)).toBeUndefined();
});`,
    },
    goodExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `test('cria uma tarefa', async () => {
  const created = await api.createTask({ title: 'A' });
  expect(created.id).toBeDefined();
});

test('atualiza o título de uma tarefa', async () => {
  const task = await api.createTask({ title: 'A' });
  const updated = await api.updateTask(task.id, { title: 'B' });
  expect(updated.title).toBe('B');
});

test('remove uma tarefa da listagem', async () => {
  const task = await api.createTask({ title: 'A' });
  await api.deleteTask(task.id);
  const list = await api.listTasks();
  expect(list.find(t => t.id === task.id)).toBeUndefined();
});`,
    },
    detectionRule: {
      name: 'test-body-length-threshold',
      description:
        'Medir o número de statements/linhas do corpo de cada teste e o número de "seções lógicas" (delimitadas por comentários ou blocos de ação+asserção repetidos); sinalizar acima de um limiar.',
      pseudocode: `ON TestFunctionBody:
  IF statementCount > 25 OR distinctActionAssertBlocks(body) > 2:
     REPORT 'Long Test: divida em testes menores e focados'`,
      tool: 'ts-morph / TS Compiler API',
    },
    tags: ['single responsibility', 'legibilidade', 'AAA pattern'],
  },
  {
    id: 31,
    slug: 'magic-number-magic-values',
    name: 'Magic Number / Magic Values',
    aka: ['Magic Values'],
    category: 'duplication',
    impact: ['Legibilidade'],
    definition:
      'Números e literais arbitrários aparecem no teste sem nenhuma constante nomeada ou comentário que explique seu significado ou por que aquele valor específico foi escolhido.',
    manifestation:
      'expect(calculateTax(4750)).toBe(712.5) sem indicar que 4750 é a faixa de imposto ou que 0.15 é a alíquota usada no cálculo.',
    badExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `test('calcula imposto', () => {
  expect(calculateTax(4750)).toBe(712.5);
});`,
    },
    goodExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `const INCOME_IN_SECOND_BRACKET = 4750;
const SECOND_BRACKET_RATE = 0.15;

test('aplica alíquota de 15% para renda na segunda faixa', () => {
  const expectedTax = INCOME_IN_SECOND_BRACKET * SECOND_BRACKET_RATE;

  expect(calculateTax(INCOME_IN_SECOND_BRACKET)).toBe(expectedTax);
});`,
    },
    detectionRule: {
      name: 'unexplained-numeric-literal',
      description:
        'Sinalizar NumericLiteral usados diretamente como argumento de função sob teste ou de expect(), fora de uma constante nomeada, excluindo valores triviais (0, 1, -1).',
      pseudocode: `ON NumericLiteral (value not in [0,1,-1]) as CallArgument:
  IF NOT boundToNamedConstant(literal):
     REPORT 'Magic Number: extraia para uma constante nomeada'`,
      tool: 'ESLint Rule (Babel AST)',
    },
    tags: ['constantes nomeadas', 'legibilidade'],
  },
  {
    id: 32,
    slug: 'complicated-logic-in-tests',
    name: 'Complicated Logic In Tests',
    aka: ['Conditional Logic In Test'],
    category: 'duplication',
    impact: ['Manutenibilidade', 'Confiabilidade'],
    definition:
      'O teste contém estruturas de controle complexas — laços, condicionais, tratamento de exceção não trivial — que introduzem sua própria lógica passível de bugs, minando a confiança de que o teste está correto.',
    manifestation:
      'for/while ou if/else aninhados dentro de um it() para decidir "o que" assertar, tornando o próprio teste um programa que precisaria ser testado.',
    badExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `test('valida lista de pedidos', () => {
  const orders = getOrders();

  for (const order of orders) {
    if (order.status === 'paid') {
      expect(order.total).toBeGreaterThan(0);
    } else if (order.status === 'cancelled') {
      expect(order.total).toBe(0);
    }
  }
});`,
    },
    goodExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `test.each([
  [{ status: 'paid', total: 100 }, true],
  [{ status: 'cancelled', total: 0 }, true],
])('valida consistência do pedido %#', (order, expected) => {
  expect(isOrderConsistent(order)).toBe(expected);
});`,
    },
    detectionRule: {
      name: 'control-flow-inside-test-body',
      description:
        'Detectar ForStatement/WhileStatement/IfStatement dentro do corpo do teste (fora de callbacks de setup) cuja presença indica lógica de decisão sendo testada por lógica equivalente.',
      pseudocode: `ON TestFunctionBody:
  IF contains(ForStatement | WhileStatement | nestedIfStatement):
     REPORT 'Complicated Logic In Tests: prefira test.each ou casos explícitos'`,
      tool: 'ESLint Rule (Babel AST)',
    },
    tags: ['for/while', 'if/else', 'test.each', 'complexidade ciclomática'],
  },
  {
    id: 33,
    slug: 'duplicate-assert',
    name: 'Duplicate Assert',
    aka: ['Copy-Pasted Assertion Block'],
    category: 'duplication',
    impact: ['Legibilidade'],
    definition:
      'O mesmo conjunto de asserções (não apenas uma linha) é repetido em múltiplos testes sem variação, geralmente por ter sido copiado e colado ao criar novos casos de teste.',
    manifestation:
      'Dois testes distintos, testando cenários diferentes de entrada, mas terminando com o mesmo bloco de 4-5 expects idênticos que nada tem a ver com a diferença entre os cenários.',
    badExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `test('cria usuário admin', () => {
  const user = createUser({ role: 'admin' });
  expect(user.id).toBeDefined();
  expect(user.createdAt).toBeInstanceOf(Date);
  expect(user.active).toBe(true);
});

test('cria usuário comum', () => {
  const user = createUser({ role: 'user' });
  expect(user.id).toBeDefined();
  expect(user.createdAt).toBeInstanceOf(Date);
  expect(user.active).toBe(true);
});`,
    },
    goodExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `function expectValidNewUser(user) {
  expect(user.id).toBeDefined();
  expect(user.createdAt).toBeInstanceOf(Date);
  expect(user.active).toBe(true);
}

test('cria usuário admin', () => {
  expectValidNewUser(createUser({ role: 'admin' }));
});

test('cria usuário comum', () => {
  expectValidNewUser(createUser({ role: 'user' }));
});`,
    },
    detectionRule: {
      name: 'duplicated-assertion-block-across-tests',
      description:
        'Comparar sequências de CallExpressions de asserção entre diferentes testes do mesmo describe e sinalizar blocos idênticos (>= 3 asserções) repetidos em 2+ testes.',
      pseudocode: `ON Describe block:
  assertionBlocks = extractTrailingAssertionBlocks(allTests)
  IF exists duplicate block (size >= 3) in 2+ tests:
     REPORT 'Duplicate Assert: extraia um helper expectXyz()'`,
      tool: 'ts-morph / TS Compiler API',
    },
    tags: ['helper de asserção', 'DRY', 'custom matcher'],
  },
  {
    id: 34,
    slug: 'hardcoded-environment-configuration',
    name: 'Hardcoded Environment Configuration',
    aka: ['Hardcoded Secrets/URLs'],
    category: 'duplication',
    impact: ['Manutenibilidade', 'Confiabilidade'],
    definition:
      'URLs de serviços, tokens de autenticação ou outras configurações de ambiente são escritos diretamente no código do teste, em vez de vir de variáveis de ambiente ou de configuração injetável.',
    manifestation:
      'const API_URL = "https://staging.api.empresa.com" ou um token Bearer literal dentro do corpo do teste, que quebra ao mudar de ambiente e pode vazar credenciais em repositórios públicos.',
    badExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `test('autentica na API de staging', async () => {
  const res = await fetch('https://staging.api.empresa.com/login', {
    headers: { Authorization: 'Bearer sk_live_51Hx...' },
  });

  expect(res.status).toBe(200);
});`,
    },
    goodExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `test('autentica na API', async () => {
  const res = await fetch(\`\${process.env.API_URL}/login\`, {
    headers: { Authorization: \`Bearer \${process.env.TEST_API_TOKEN}\` },
  });

  expect(res.status).toBe(200);
});`,
    },
    detectionRule: {
      name: 'hardcoded-url-or-secret-literal',
      description:
        'Detectar StringLiterals que correspondem a padrões de URL (http[s]://) ou de segredo (Bearer, chaves com prefixos conhecidos como sk_, AKIA) usados diretamente no código de teste.',
      pseudocode: `ON StringLiteral matching /^https?:\\/\\// OR /Bearer |sk_|AKIA/:
  IF NOT sourcedFrom(process.env):
     REPORT 'Hardcoded Environment Configuration: use variáveis de ambiente'`,
      tool: 'ESLint Rule (Babel AST)',
    },
    tags: ['process.env', 'segredos', 'segurança'],
  },
  {
    id: 35,
    slug: 'over-refactoring-overly-dry-tests',
    name: 'Over-Refactoring / Overly DRY Tests',
    aka: ['Overly Abstracted Test'],
    category: 'duplication',
    impact: ['Legibilidade'],
    definition:
      'Na tentativa de eliminar duplicação, o teste é abstraído em tantas funções utilitárias e camadas indiretas que o leitor perde o fluxo do cenário — o "DRY" prejudica o "Descriptive And Meaningful Phrases".',
    manifestation:
      'runStandardSuite(config) genérico chamado por dezenas de testes diferentes, escondendo em um arquivo separado qual ação e asserção realmente ocorrem para cada caso.',
    badExample: {
      language: 'typescript',
      framework: 'Jest',
      code: `// utils/testRunner.ts
export function runScenario(step1, step2, step3, assertFn) {
  const ctx = step1();
  const ctx2 = step2(ctx);
  const result = step3(ctx2);
  assertFn(result);
}

// pedido.test.ts
test('cenário 1', () => {
  runScenario(setupCart, applyCoupon, checkout, expectTotalIsDiscounted);
});`,
    },
    goodExample: {
      language: 'typescript',
      framework: 'Jest',
      code: `test('aplica cupom de 10% e finaliza a compra', () => {
  const cart = buildCart({ total: 100 });

  const checkedOut = checkout(applyCoupon(cart, 'SAVE10'));

  expect(checkedOut.total).toBe(90);
});`,
    },
    detectionRule: {
      name: 'excessive-indirection-in-test',
      description:
        'Medir a "profundidade de indireção": quantas funções utilitárias externas ao arquivo de teste são necessárias para entender a ação e a asserção de um teste; sinalizar acima de um limiar.',
      pseudocode: `ON TestFunctionBody:
  indirection = countExternalHelperCallsNeededToTraceAssertion(body)
  IF indirection > 3:
     REPORT 'Over-Refactoring: torne o fluxo do teste explícito novamente'`,
      tool: 'ts-morph / TS Compiler API',
    },
    tags: ['abstração excessiva', 'legibilidade', 'DAMP vs DRY'],
  },
  {
    id: 36,
    slug: 'commented-out-test',
    name: 'Commented-Out Test',
    aka: ['Zombie Test'],
    category: 'duplication',
    impact: ['Manutenibilidade'],
    definition:
      'Um teste inteiro é desativado comentando seu código com // ou /* */, em vez de usar os mecanismos semânticos do framework (test.skip, test.todo), perdendo rastreabilidade sobre por que foi desativado.',
    manifestation:
      '// test("valida limite de crédito", () => { ... }) deixado no arquivo por meses, sem ticket ou comentário explicando o motivo, aparecendo como código morto em revisões.',
    badExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `// test('valida limite de crédito', () => {
//   expect(checkCreditLimit(5000)).toBe(true);
// });

test('valida limite de crédito negativo', () => {
  expect(checkCreditLimit(-100)).toBe(false);
});`,
    },
    goodExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `// TODO(JIRA-482): reativar após corrigir regra de limite promocional
test.skip('valida limite de crédito', () => {
  expect(checkCreditLimit(5000)).toBe(true);
});

test('valida limite de crédito negativo', () => {
  expect(checkCreditLimit(-100)).toBe(false);
});`,
    },
    detectionRule: {
      name: 'commented-test-block',
      description:
        'Analisar comentários de linha/bloco consecutivos cujo conteúdo corresponde à sintaxe de uma chamada it/test/describe, indicando código de teste desativado via comentário.',
      pseudocode: `ON CommentBlock:
  IF matches(/^\\s*\\/\\/\\s*(it|test|describe)\\(/):
     REPORT 'Commented-Out Test: use test.skip()/test.todo() com justificativa'`,
      tool: 'ESLint Rule (Babel AST)',
    },
    tags: ['test.skip', 'test.todo', 'código morto', 'rastreabilidade'],
  },

  // ─────────────────────────────────────────────────────────
  // Categoria 5 — Test Execution & Behavior (37–44)
  // ─────────────────────────────────────────────────────────
  {
    id: 37,
    slug: 'sleepy-test-stinky-synchronization',
    name: 'Sleepy Test / Stinky Synchronization',
    aka: ['Stinky Synchronization', 'Arbitrary Delay'],
    category: 'execution',
    impact: ['Flakiness', 'Performance'],
    definition:
      'O teste usa um delay arbitrário e fixo (setTimeout, sleep) para "esperar" uma operação assíncrona terminar, em vez de aguardar uma condição real — é lento quando desnecessário e ainda pode falhar quando insuficiente.',
    manifestation:
      'await new Promise(r => setTimeout(r, 2000)) antes de verificar um efeito colateral assíncrono, em vez de waitFor() (Testing Library) ou jest.advanceTimersByTime() com fake timers.',
    badExample: {
      language: 'javascript',
      framework: 'Testing Library',
      code: `test('mostra mensagem de sucesso após salvar', async () => {
  render(<Form onSubmit={saveAsync} />);
  fireEvent.click(screen.getByText('Salvar'));

  await new Promise((r) => setTimeout(r, 2000)); // espera arbitrária

  expect(screen.getByText('Salvo com sucesso')).toBeInTheDocument();
});`,
    },
    goodExample: {
      language: 'javascript',
      framework: 'Testing Library',
      code: `test('mostra mensagem de sucesso após salvar', async () => {
  render(<Form onSubmit={saveAsync} />);
  fireEvent.click(screen.getByText('Salvar'));

  expect(await screen.findByText('Salvo com sucesso')).toBeInTheDocument();
});`,
    },
    detectionRule: {
      name: 'arbitrary-timeout-based-wait',
      description:
        'Detectar setTimeout/sleep com valor numérico fixo cujo callback é a única forma de sincronizar com uma asserção subsequente, quando existe alternativa de espera baseada em condição (waitFor/findBy*).',
      pseudocode: `ON CallExpression('setTimeout', duration: NumericLiteral):
  IF usedOnlyForSynchronization(duration) AND NOT usesWaitForInstead:
     REPORT 'Sleepy Test: use waitFor()/findBy() ou fake timers'`,
      tool: 'ESLint Rule (Babel AST)',
    },
    tags: ['waitFor', 'findBy', 'setTimeout', 'sincronização'],
  },
  {
    id: 38,
    slug: 'flaky-test-intermittent-failures',
    name: 'Flaky Test (Intermittent Failures)',
    aka: ['Non-Deterministic Test'],
    category: 'execution',
    impact: ['Flakiness', 'Confiabilidade'],
    definition:
      'O teste falha de forma não-determinística — às vezes passa, às vezes falha, sem mudança no código — geralmente por condição de corrida entre Promises concorrentes ou dependência de timing.',
    manifestation:
      'Promise.all() disparando múltiplas operações que competem por um recurso compartilhado (contador, arquivo) sem sincronização, ou asserções que dependem da ordem de resolução de Promises não garantida.',
    badExample: {
      language: 'javascript',
      framework: 'Vitest',
      code: `test('processa fila de tarefas concorrentemente', async () => {
  let counter = 0;

  await Promise.all([
    processTask(() => counter++),
    processTask(() => counter++),
    processTask(() => counter++),
  ]);

  expect(counter).toBe(3); // pode falhar por condição de corrida no incremento
});`,
    },
    goodExample: {
      language: 'javascript',
      framework: 'Vitest',
      code: `test('processa fila de tarefas de forma segura para concorrência', async () => {
  const results = await Promise.all([
    processTask(),
    processTask(),
    processTask(),
  ]);

  expect(results.filter((r) => r.success)).toHaveLength(3);
});`,
    },
    detectionRule: {
      name: 'shared-mutable-state-in-concurrent-promises',
      description:
        'Detectar Promise.all()/Promise.race() cujos callbacks mutam uma variável externa compartilhada (closure) sem primitiva de sincronização, indicando potencial condição de corrida.',
      pseudocode: `ON CallExpression('Promise.all'|'Promise.race')(callbacks):
  IF callbacks.any(mutatesClosureVariable) AND sharedAcrossCallbacks:
     REPORT 'Flaky Test: evite mutação compartilhada entre tarefas concorrentes'`,
      tool: 'ts-morph / TS Compiler API',
    },
    tags: ['race condition', 'Promise.all', 'não-determinismo'],
  },
  {
    id: 39,
    slug: 'chatty-logging-print-statement',
    name: 'Chatty Logging / Print Statement',
    aka: ['Print Statement Smell'],
    category: 'execution',
    impact: ['Legibilidade', 'Performance'],
    definition:
      'Chamadas de depuração como console.log foram deixadas no teste após o desenvolvimento, poluindo a saída da suíte e do relatório de CI sem valor informativo permanente.',
    manifestation:
      'console.log(result) ou console.debug(JSON.stringify(payload)) esquecidos dentro de um teste que já está passando, aumentando o ruído em milhares de execuções na esteira de CI.',
    badExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `test('calcula desconto por volume', () => {
  const result = calculateVolumeDiscount(120);
  console.log('resultado:', result); // esquecido do debug

  expect(result).toBe(12);
});`,
    },
    goodExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `test('calcula desconto por volume', () => {
  const result = calculateVolumeDiscount(120);

  expect(result).toBe(12);
});`,
    },
    detectionRule: {
      name: 'console-call-in-test-file',
      description:
        'Sinalizar chamadas a console.log/console.debug/console.info dentro de arquivos *.test.ts/*.spec.ts, exceto quando dentro de um bloco explicitamente marcado como depuração temporária via comentário padronizado.',
      pseudocode: `ON CallExpression('console.log'|'console.debug') in TestFile:
  IF NOT precededByComment(/eslint-disable|debug-only/):
     REPORT 'Chatty Logging: remova o console.log antes do commit'`,
      tool: 'ESLint Rule (Babel AST)',
    },
    tags: ['console.log', 'ruído na CI', 'debug esquecido'],
  },
  {
    id: 40,
    slug: 'ignored-disabled-test',
    name: 'Ignored / Disabled Test',
    aka: ['Skipped Test Debt'],
    category: 'execution',
    impact: ['Confiabilidade'],
    sources: [STEEL],
    definition:
      'Testes marcados permanentemente com skip/xit/xdescribe acumulam débito técnico invisível: continuam existindo no código, mas nunca são executados, dando falsa sensação de cobertura.',
    manifestation:
      'test.skip("valida integração com gateway de pagamento") presente há vários releases sem ticket associado, contado erroneamente como "existente" nos relatórios de suíte.',
    badExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `test.skip('valida integração com gateway de pagamento', () => {
  // desabilitado há 8 meses, motivo perdido
  expect(chargeGateway(100)).resolves.toBe('approved');
});`,
    },
    goodExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `// TODO(PAY-231): reabilitar quando o sandbox do gateway for restaurado (prazo: Q3)
test.skip('valida integração com gateway de pagamento', () => {
  expect(chargeGateway(100)).resolves.toBe('approved');
});`,
    },
    detectionRule: {
      name: 'skipped-test-without-tracking',
      description:
        'Detectar test.skip/xit/xdescribe sem um comentário imediatamente anterior contendo referência a um ticket (padrão ABC-123) e sinalizar também skips com "idade" acima de um limite via git blame.',
      pseudocode: `ON CallExpression('test.skip'|'xit'|'xdescribe'):
  IF NOT precedingCommentMatches(/[A-Z]+-\\d+/):
     REPORT 'Ignored Test: associe um ticket e prazo de reativação'`,
      tool: 'ESLint Rule (Babel AST)',
    },
    tags: ['test.skip', 'xit', 'débito técnico', 'cobertura enganosa'],
  },
  {
    id: 41,
    slug: 'slow-test',
    name: 'Slow Test',
    aka: ['Heavy Unit Test'],
    category: 'execution',
    impact: ['Performance'],
    definition:
      'Um teste classificado como unitário leva um tempo excessivo para rodar, geralmente por falta de isolamento (I/O real) ou por computação pesada síncrona, degradando o feedback rápido da suíte.',
    manifestation:
      'Um teste "unitário" que grava/lê em disco real, usa bcrypt com custo alto de produção, ou roda um algoritmo O(n²) sobre um dataset grande só para validar uma função pura.',
    badExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `test('faz hash de senha', async () => {
  const hash = await bcrypt.hash('minhaSenha123', 14); // custo de produção em teste unitário

  expect(await bcrypt.compare('minhaSenha123', hash)).toBe(true);
});`,
    },
    goodExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `test('faz hash de senha', async () => {
  const TEST_COST_FACTOR = 4; // custo reduzido, adequado para testes

  const hash = await bcrypt.hash('minhaSenha123', TEST_COST_FACTOR);

  expect(await bcrypt.compare('minhaSenha123', hash)).toBe(true);
});`,
    },
    detectionRule: {
      name: 'expensive-computation-in-unit-test',
      description:
        'Cruzar o tempo de execução reportado pelo runner (relatório JSON de Jest/Vitest) por teste com um limiar (ex.: > 200ms) e sinalizar testes fora de suítes marcadas como integração/e2e.',
      pseudocode: `ON TestResult (from jest --json):
  IF duration > 200ms AND suiteTag NOT IN ['integration','e2e']:
     REPORT 'Slow Test: revise custo de operações (crypto, I/O, loops)'`,
      tool: 'ts-morph / TS Compiler API',
    },
    tags: ['performance', 'bcrypt', 'tempo de execução', 'CI'],
  },
  {
    id: 42,
    slug: 'interactive-test',
    name: 'Interactive Test',
    aka: ['Manual-Step Test'],
    category: 'execution',
    impact: ['Confiabilidade', 'Performance'],
    definition:
      'O teste requer intervenção manual do desenvolvedor (observar uma janela, clicar fisicamente, inspecionar visualmente um resultado) ou abre um navegador real fora do modo headless, impedindo execução automatizada e paralela.',
    manifestation:
      'Configuração do Playwright/Puppeteer com headless: false e page.pause() deixados em testes que rodam na esteira de CI, ou um debugger statement aguardando inspeção manual.',
    badExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `test('login abre painel', async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');

  debugger; // aguarda inspeção manual do desenvolvedor
  expect(await page.title()).toBe('Painel');
});`,
    },
    goodExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `test('login abre painel', async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');

  expect(await page.title()).toBe('Painel');
  await browser.close();
});`,
    },
    detectionRule: {
      name: 'non-headless-or-manual-pause',
      description:
        'Detectar configuração headless: false em chamadas de launch() de ferramentas de automação de navegador, e/ou presença de debugger statement ou page.pause() dentro de arquivos de teste versionados para CI.',
      pseudocode: `ON CallExpression('puppeteer.launch'|'chromium.launch')({ headless: false }):
  REPORT 'Interactive Test: rode em modo headless na CI'
ON DebuggerStatement in TestFile:
  REPORT 'Interactive Test: remova debugger/page.pause() antes do commit'`,
      tool: 'ESLint Rule (Babel AST)',
    },
    tags: ['headless', 'puppeteer', 'playwright', 'automação'],
  },
  {
    id: 43,
    slug: 'premature-teardown',
    name: 'Premature Teardown',
    aka: ['Early Cleanup'],
    category: 'execution',
    impact: ['Flakiness'],
    definition:
      'A limpeza de recursos (fechar conexão, desmontar componente, cancelar timers) é executada antes que Promises pendentes relacionadas ao teste terminem de rodar, causando erros de "objeto já destruído" intermitentes.',
    manifestation:
      'afterEach(() => connection.close()) disparado enquanto uma query assíncrona iniciada pelo teste ainda está em voo, ou unmount() de um componente antes de uma atualização de estado assíncrona pendente resolver.',
    badExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `let connection;

beforeEach(() => { connection = openConnection(); });
afterEach(() => connection.close());

test('consulta usuário', () => {
  connection.query('SELECT * FROM users').then((rows) => {
    expect(rows.length).toBeGreaterThan(0);
  });
  // o teste termina (e o afterEach roda) antes da Promise resolver
});`,
    },
    goodExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `let connection;

beforeEach(() => { connection = openConnection(); });
afterEach(() => connection.close());

test('consulta usuário', async () => {
  const rows = await connection.query('SELECT * FROM users');

  expect(rows.length).toBeGreaterThan(0);
});`,
    },
    detectionRule: {
      name: 'teardown-races-pending-promise',
      description:
        'Verificar se o corpo do teste inicia uma operação assíncrona sem await/return e se existe um afterEach que libera recursos usados por essa operação, indicando possível corrida entre teardown e a Promise pendente.',
      pseudocode: `ON TestFunctionBody:
  IF hasUnawaitedPromise(body) AND afterEachReleasesResourceUsedBy(body):
     REPORT 'Premature Teardown: aguarde (await) a operação antes do teardown'`,
      tool: 'ts-morph / TS Compiler API',
    },
    tags: ['afterEach', 'race condition', 'await'],
  },
  {
    id: 44,
    slug: 'unsound-test-false-positive-negative',
    name: 'Unsound Test (False Positive/Negative)',
    aka: ['Vacuous Test', 'Tautological Test'],
    category: 'execution',
    impact: ['Confiabilidade'],
    definition:
      'O teste continua passando mesmo depois de uma falha real ser introduzida no código de produção (falso negativo de detecção), geralmente por comparar um valor consigo mesmo ou por um matcher sempre verdadeiro.',
    manifestation:
      'expect(result).toEqual(result) (compara a variável com ela mesma), expect(true).toBe(true), ou uma asserção que usa a mesma função de produção para calcular o "esperado" (ver também Calculating Expected On The Fly).',
    badExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `test('normaliza texto', () => {
  const result = normalizeText('  Olá Mundo  ');

  expect(result).toEqual(result); // tautologia: sempre passa
});`,
    },
    goodExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `test('normaliza texto removendo espaços e caixa', () => {
  const result = normalizeText('  Olá Mundo  ');

  expect(result).toBe('olá mundo');
});`,
    },
    detectionRule: {
      name: 'tautological-assertion',
      description:
        'Detectar expect(x).toEqual(x)/toBe(x) onde os dois operandos são a mesma expressão (identidade textual/AST), ou expect(true).toBe(true) e variações com literais idênticos.',
      pseudocode: `ON CallExpression(expect(x).toBe(y) | toEqual(y)):
  IF astEquals(x, y):
     REPORT 'Unsound Test: a asserção é sempre verdadeira, corrija o valor esperado'`,
      tool: 'ESLint Rule (Babel AST)',
    },
    tags: ['tautologia', 'falso positivo', 'mutation testing'],
  },

  // ─────────────────────────────────────────────────────────
  // Categoria 6 — Test Semantic & Design (45–50); extensões da literatura (51–66)
  // ─────────────────────────────────────────────────────────
  {
    id: 45,
    slug: 'the-silent-catcher-empty-catch',
    name: 'The Silent Catcher / Empty Catch',
    aka: ['Empty Catch Block'],
    category: 'semantics',
    impact: ['Confiabilidade'],
    definition:
      'Um bloco try/catch vazio no teste silencia qualquer exceção inesperada, fazendo o teste passar mesmo quando o código sob teste lançou um erro que deveria ter sido investigado.',
    manifestation:
      'try { await riskyOperation(); expect(...).toBe(...); } catch (e) {} — se riskyOperation() lançar antes da asserção, o catch vazio absorve o erro e o teste é reportado como verde.',
    badExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `test('processa upload de arquivo', async () => {
  try {
    const result = await processUpload(file);
    expect(result.status).toBe('ok');
  } catch (e) {
    // silenciado — erros inesperados desaparecem
  }
});`,
    },
    goodExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `test('processa upload de arquivo', async () => {
  const result = await processUpload(file);

  expect(result.status).toBe('ok');
});

test('rejeita upload de arquivo corrompido', async () => {
  await expect(processUpload(corruptedFile)).rejects.toThrow('invalid file');
});`,
    },
    detectionRule: {
      name: 'empty-or-swallowing-catch-block',
      description:
        'Detectar CatchClause com corpo vazio, apenas comentário, ou que apenas faz console.log(e) sem re-throw nem assert sobre o erro, dentro de um arquivo de teste.',
      pseudocode: `ON CatchClause in TestFile:
  IF body.isEmpty() OR onlyLogsWithoutRethrow(body):
     REPORT 'Empty Catch: use expect(...).rejects.toThrow() para o caminho de erro'`,
      tool: 'ESLint Rule (Babel AST)',
    },
    tags: ['try/catch', 'exceção silenciada', 'rejects.toThrow'],
  },
  {
    id: 46,
    slug: 'eager-test',
    name: 'Eager Test',
    aka: ['Multi-Method Test'],
    category: 'semantics',
    impact: ['Legibilidade', 'Manutenibilidade'],
    definition:
      'Um único teste tenta exercitar múltiplos métodos ou casos de uso distintos da unidade sob teste, misturando responsabilidades e dificultando saber qual comportamento quebrou quando ele falha.',
    manifestation:
      'Um it("gerencia carrinho") que chama add(), remove(), applyCoupon() e checkout() do mesmo serviço em sequência, testando 4 comportamentos diferentes em uma única função de teste.',
    badExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `test('gerencia carrinho', () => {
  const cart = new Cart();

  cart.add({ sku: 'a', price: 10 });
  expect(cart.total).toBe(10);

  cart.applyCoupon('SAVE5');
  expect(cart.total).toBe(5);

  cart.remove('a');
  expect(cart.items.length).toBe(0);
});`,
    },
    goodExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `test('adiciona item ao carrinho', () => {
  const cart = new Cart();
  cart.add({ sku: 'a', price: 10 });
  expect(cart.total).toBe(10);
});

test('aplica cupom sobre o total', () => {
  const cart = new Cart();
  cart.add({ sku: 'a', price: 10 });
  cart.applyCoupon('SAVE5');
  expect(cart.total).toBe(5);
});`,
    },
    detectionRule: {
      name: 'multiple-distinct-methods-under-test',
      description:
        'Contar quantos métodos públicos distintos do objeto sob teste são invocados e seguidos de asserção dentro de um único bloco de teste; sinalizar quando esse número é maior que 1.',
      pseudocode: `ON TestFunctionBody:
  distinctMethodsCalled = uniqueMethodNamesFollowedByAssertion(body)
  IF distinctMethodsCalled.length > 1:
     REPORT 'Eager Test: divida em um teste por comportamento'`,
      tool: 'ts-morph / TS Compiler API',
    },
    tags: ['single responsibility', 'AAA pattern', 'escopo do teste'],
  },
  {
    id: 47,
    slug: 'lazy-test',
    name: 'Lazy Test',
    aka: ['Redundant Coverage Test'],
    category: 'semantics',
    impact: ['Manutenibilidade'],
    definition:
      'Múltiplos testes exercitam exatamente o mesmo caminho de código com os mesmos tipos de entrada, sem variar parâmetros ou cenários — o oposto do Eager Test: testes de menos, cobrindo o mesmo caso repetidamente.',
    manifestation:
      'Vários it() chamando a mesma função com valores diferentes mas equivalentes (ex.: sempre números positivos "normais"), nunca exercitando bordas, negativos, zero ou nulos.',
    badExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `test('soma dois números - caso 1', () => {
  expect(sum(2, 3)).toBe(5);
});
test('soma dois números - caso 2', () => {
  expect(sum(10, 20)).toBe(30);
});
test('soma dois números - caso 3', () => {
  expect(sum(1, 1)).toBe(2);
}); // os três testes exercitam exatamente o mesmo caminho`,
    },
    goodExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `test.each([
  [2, 3, 5],
  [0, 0, 0],
  [-5, 5, 0],
  [Number.MAX_SAFE_INTEGER, 1, Number.MAX_SAFE_INTEGER + 1],
])('sum(%i, %i) deve retornar %i', (a, b, expected) => {
  expect(sum(a, b)).toBe(expected);
});`,
    },
    detectionRule: {
      name: 'redundant-equivalent-path-coverage',
      description:
        'Agrupar testes que chamam a mesma função sob teste e classificar as entradas por classe de equivalência (positivo, negativo, zero, limite); sinalizar quando todos os testes caem na mesma classe.',
      pseudocode: `ON Describe testing same function:
  classes = classifyInputsByEquivalencePartition(allTestInputs)
  IF classes.size === 1 AND testCount > 2:
     REPORT 'Lazy Test: cubra outras partições de equivalência (zero, negativo, limite)'`,
      tool: 'ts-morph / TS Compiler API',
    },
    tags: ['classes de equivalência', 'cobertura de casos', 'test.each'],
  },
  {
    id: 48,
    slug: 'what-are-we-testing-poor-naming',
    name: 'What Are We Testing? (Poor Naming)',
    aka: ['Poor Test Naming', 'Uninformative Test Name'],
    category: 'semantics',
    impact: ['Legibilidade'],
    definition:
      'O nome do teste não descreve o comportamento esperado nem o cenário testado, obrigando o leitor a abrir o corpo do teste (ou o relatório de falha) para entender o que estava sendo verificado.',
    manifestation:
      'it("works"), it("test 1"), test("should work correctly") — nomes que não mencionam a ação, o estado de entrada ou o resultado esperado.',
    badExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `it('works', () => {
  const result = calculateDiscount(200, 'VIP');
  expect(result).toBe(180);
});

it('test 2', () => {
  expect(calculateDiscount(200, 'REGULAR')).toBe(200);
});`,
    },
    goodExample: {
      language: 'javascript',
      framework: 'Jest',
      code: `it('aplica 10% de desconto para clientes VIP', () => {
  expect(calculateDiscount(200, 'VIP')).toBe(180);
});

it('não aplica desconto para clientes regulares', () => {
  expect(calculateDiscount(200, 'REGULAR')).toBe(200);
});`,
    },
    detectionRule: {
      name: 'non-descriptive-test-title',
      description:
        'Comparar a string de título passada a it/test contra uma lista de termos genéricos (works, test, ok, case N) e/ou verificar ausência de verbo de ação e de referência a um resultado esperado.',
      pseudocode: `ON CallExpression(it|test)(title: StringLiteral, ...):
  IF title matches /^(works|test ?\\d*|ok|should work)$/i:
     REPORT 'Poor Naming: descreva o comportamento e o cenário no título'`,
      tool: 'ESLint Rule (Babel AST)',
    },
    tags: ['nomenclatura', 'given-when-then', 'legibilidade'],
  },
  {
    id: 49,
    slug: 'testing-private-implementation',
    name: 'Testing Private Implementation',
    aka: ['White-Box Overreach'],
    category: 'semantics',
    impact: ['Manutenibilidade'],
    definition:
      'O teste acessa propriedades ou funções privadas/não exportadas de um módulo, forçando gambiarras como espelhamento (mirroring) do módulo ou uso de APIs internas do TypeScript, e quebrando a cada refatoração interna mesmo sem mudança de comportamento público.',
    manifestation:
      'Uso de (instance as any)._internalState ou reexportar uma função não exportada apenas para testá-la isoladamente, em vez de testar através da API pública do módulo.',
    badExample: {
      language: 'typescript',
      framework: 'Jest',
      code: `class OrderProcessor {
  private calculateInternalDiscount(total: number) {
    return total * 0.9;
  }
  process(total: number) { return this.calculateInternalDiscount(total); }
}

test('calcula desconto interno', () => {
  const processor = new OrderProcessor();
  // acessa método privado via cast forçado
  expect((processor as any).calculateInternalDiscount(100)).toBe(90);
});`,
    },
    goodExample: {
      language: 'typescript',
      framework: 'Jest',
      code: `test('processa pedido aplicando desconto', () => {
  const processor = new OrderProcessor();

  expect(processor.process(100)).toBe(90); // testa via API pública
});`,
    },
    detectionRule: {
      name: 'access-to-private-member-via-cast',
      description:
        'Detectar TSAsExpression para any/unknown seguido de acesso a uma propriedade cujo nome começa com underscore ou que é declarada private/protected na classe original.',
      pseudocode: `ON MemberExpression(object: TSAsExpression(to: 'any'|'unknown')):
  IF referencedMember.isPrivateOrProtected():
     REPORT 'Testing Private Implementation: teste através da API pública'`,
      tool: 'ts-morph / TS Compiler API',
    },
    tags: ['private/protected', 'as any', 'API pública', 'encapsulamento'],
  },
  {
    id: 50,
    slug: 'second-class-citizens',
    name: 'Second-Class Citizens',
    aka: ['Untyped/Unlinted Test Code'],
    category: 'semantics',
    impact: ['Manutenibilidade', 'Confiabilidade'],
    definition:
      'O código de teste é tratado com menos rigor que o código de produção: abuso do tipo any, regras de lint desabilitadas, e negligência técnica geral — como se testes não merecessem a mesma qualidade de engenharia.',
    manifestation:
      'function makeFixture(): any { ... } e blocos inteiros de teste com /* eslint-disable */ no topo do arquivo, escondendo erros de tipo que o próprio TypeScript detectaria.',
    badExample: {
      language: 'typescript',
      framework: 'Jest',
      code: `/* eslint-disable */
function makeUser(overrides: any = {}): any {
  return { id: 1, name: 'Ana', ...overrides };
}

test('atualiza nome', () => {
  const user: any = makeUser();
  user.nome = 'Ana Silva'; // erro de digitação não detectado: campo é "name"
  expect(updateUserName(user, 'Ana Silva').name).toBe('Ana Silva');
});`,
    },
    goodExample: {
      language: 'typescript',
      framework: 'Jest',
      code: `interface User { id: number; name: string; }

function makeUser(overrides: Partial<User> = {}): User {
  return { id: 1, name: 'Ana', ...overrides };
}

test('atualiza nome do usuário', () => {
  const user = makeUser();
  expect(updateUserName(user, 'Ana Silva').name).toBe('Ana Silva');
});`,
    },
    detectionRule: {
      name: 'any-type-or-lint-disable-in-test',
      description:
        'Contar ocorrências do tipo any explícito e de comentários eslint-disable em arquivos *.test.ts/*.spec.ts e comparar à taxa equivalente no código de produção do mesmo projeto; sinalizar discrepância alta.',
      pseudocode: `ON TestFile:
  anyCount = count(TSAnyKeyword)
  lintDisableCount = count(/eslint-disable/)
  IF (anyCount + lintDisableCount) / fileSize > productionCodeRatio * 2:
     REPORT 'Second-Class Citizens: aplique o mesmo rigor de tipos/lint dos testes'`,
      tool: 'ts-morph / TS Compiler API',
    },
    tags: ['any', 'eslint-disable', 'qualidade de código', 'TypeScript'],
  },

  literatureSmell({
    id: 51, slug: 'anonymous-test', name: 'Anonymous Test', aka: ['Poorly Named Test'], category: 'semantics', impact: ['Legibilidade', 'Manutenibilidade'], flakiness: 'none',
    definition: 'Teste cujo nome é vago ou não comunica o comportamento verificado.',
    manifestation: 'Descrições como “teste 1” ou “funciona” não explicam cenário nem resultado esperado.',
    bad: "test('teste 1', () => { expect(total(1, 2)).toBe(3); });",
    good: "test('soma dois valores positivos', () => { expect(total(1, 2)).toBe(3); });",
    rule: 'anonymous-or-vague-test-name', tags: ['nome', 'semântica', 'clareza'], sources: [DISSERTATION]
  }),
  literatureSmell({
    id: 52, slug: 'conditional-test-logic', name: 'Conditional Test Logic', aka: ['Conditional Test'], category: 'semantics', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'possible',
    definition: 'Uso de condicionais ou laços para decidir a lógica de verificação dentro de um teste.',
    manifestation: 'if/else, switch ou loop em it/test tornam os caminhos do teste difíceis de interpretar e podem ocultar resultados dependentes do estado.',
    bad: "test('valida status', () => { if (user.admin) expect(role()).toBe('admin'); else expect(role()).toBe('user'); });",
    good: "test.each([['admin', 'admin'], ['user', 'user']])('retorna %s', (role, expected) => { expect(roleFor(role)).toBe(expected); });",
    rule: 'control-flow-inside-test', tags: ['if', 'loop', 'controle de fluxo'], sources: [DISSERTATION, STEEL]
  }),
  literatureSmell({
    id: 53, slug: 'exception-handling', name: 'Exception Handling', aka: ['Expected Exception Test'], category: 'execution', impact: ['Confiabilidade', 'Manutenibilidade'], flakiness: 'possible',
    definition: 'Verificação de exceção por try/catch ou throw manual em vez de matcher declarativo do framework.',
    manifestation: 'Um catch pode engolir a falha ou deixar o teste passar quando a exceção esperada não acontece.',
    bad: "test('rejeita e-mail inválido', async () => { try { await createUser('x'); } catch (error) { expect(error.message).toBe('invalid'); } });",
    good: "test('rejeita e-mail inválido', async () => { await expect(createUser('x')).rejects.toThrow('invalid'); });",
    rule: 'manual-exception-handling', tags: ['try-catch', 'rejects', 'exceção'], sources: [DISSERTATION, STEEL]
  }),
  literatureSmell({
    id: 54, slug: 'overcommented-test', name: 'Overcommented Test', aka: ['Excessive Comments'], category: 'semantics', impact: ['Legibilidade', 'Manutenibilidade'], flakiness: 'none',
    definition: 'Teste com comentários em excesso que repetem o que o código já expressa.',
    manifestation: 'Comentários descrevem cada passo trivial de setup e asserção, encobrindo a intenção real do cenário.',
    bad: `test('soma valores', () => { // cria a calculadora\n  const calc = new Calc(); // soma os números\n  const result = calc.sum(1, 2); // verifica o resultado\n  expect(result).toBe(3); });`,
    good: "test('soma dois valores', () => { expect(new Calc().sum(1, 2)).toBe(3); });",
    rule: 'comment-density-in-test', tags: ['comentários', 'legibilidade'], sources: [DISSERTATION, SNUTS]
  }),
  literatureSmell({
    id: 55, slug: 'suboptimal-assertion', name: 'Suboptimal Assertion', aka: ['Suboptimal Assert'], category: 'assertions', impact: ['Confiabilidade', 'Legibilidade'], flakiness: 'none',
    definition: 'Asserção genérica que não expressa precisamente o comportamento esperado apesar de haver um matcher mais adequado.',
    manifestation: 'expect(resultado).toBeTruthy() esconde a propriedade relevante que deveria ser especificada.',
    bad: "test('cria usuário', () => { const user = createUser(); expect(user).toBeTruthy(); });",
    good: "test('cria usuário ativo', () => { const user = createUser(); expect(user.status).toBe('active'); });",
    rule: 'generic-assertion-where-specific-is-available', tags: ['expect', 'asserção', 'precisão'], sources: [DISSERTATION, SILVA]
  }),
  literatureSmell({
    id: 56, slug: 'unknown-test', name: 'Unknown Test', aka: ['No Assertion Test'], category: 'assertions', impact: ['Confiabilidade', 'Manutenibilidade'], flakiness: 'none',
    definition: 'Teste sem asserções explícitas que não deixa claro qual comportamento está sendo validado.',
    manifestation: 'A chamada é executada e o teste passa mesmo quando o resultado funcional está errado.',
    bad: "test('atualiza perfil', async () => { await updateProfile({ name: 'Ana' }); });",
    good: "test('atualiza o nome do perfil', async () => { const user = await updateProfile({ name: 'Ana' }); expect(user.name).toBe('Ana'); });",
    rule: 'missing-explicit-assertion', tags: ['assertionless', 'expect', 'confiabilidade'], sources: [DISSERTATION, STEEL]
  }),
  literatureSmell({
    id: 57, slug: 'verbose-test', name: 'Verbose Test', aka: ['Verbose Statement'], category: 'semantics', impact: ['Manutenibilidade', 'Legibilidade'], flakiness: 'none',
    definition: 'Teste excessivamente longo que agrega vários objetivos e torna o diagnóstico difícil.',
    manifestation: 'Setup, execução e várias verificações independentes ficam concentrados em um único callback.',
    bad: "test('processa pedido', () => { const order = createOrder(); pay(order); ship(order); expect(order.status).toBe('shipped'); expect(order.total).toBe(10); expect(order.emailSent).toBe(true); });",
    good: "test('envia pedido pago', () => { const order = paidOrder(); ship(order); expect(order.status).toBe('shipped'); });",
    rule: 'oversized-test-callback', tags: ['linhas', 'responsabilidade única'], sources: [DISSERTATION, SILVA]
  }),
  literatureSmell({
    id: 58, slug: 'comments-only-test', name: 'Comments Only Test', aka: ['Commented-Out Test'], category: 'execution', impact: ['Manutenibilidade'], flakiness: 'none',
    definition: 'Teste ou bloco de teste inteiramente comentado, portanto ausente da execução.',
    manifestation: 'Código de teste é desativado por comentários em vez de removido, corrigido ou marcado explicitamente.',
    bad: `// test('remove usuário', () => {\n//   expect(removeUser(1)).toBe(true);\n// });`,
    good: "test.skip('remove usuário: aguarda correção #123', () => { expect(removeUser(1)).toBe(true); });",
    rule: 'commented-out-test-block', tags: ['comentado', 'execução'], sources: [SNUTS]
  }),
  literatureSmell({
    id: 59, slug: 'complex-snapshot-test', name: 'Complex Snapshot Test', aka: ['Complex Snapshot'], category: 'assertions', impact: ['Manutenibilidade', 'Flakiness'], flakiness: 'possible',
    definition: 'Snapshot excessivamente grande ou estruturalmente complexo, difícil de revisar e sujeito a mudanças incidentais.',
    manifestation: 'toMatchSnapshot() registra uma árvore completa com valores voláteis em vez de validar uma saída estável e pequena.',
    bad: "test('renderiza painel', () => { expect(render(<Dashboard user={user} />).container).toMatchSnapshot(); });",
    good: "test('mostra o nome do usuário', () => { render(<Dashboard user={user} />); expect(screen.getByText(user.name)).toBeInTheDocument(); });",
    rule: 'large-or-volatile-snapshot', tags: ['snapshot', 'ui', 'flakiness'], sources: [SILVA, SNUTS]
  }),
  literatureSmell({
    id: 60, slug: 'identical-test-description', name: 'Identical Description Test', aka: ['Identical Test Description'], category: 'semantics', impact: ['Legibilidade', 'Manutenibilidade'], flakiness: 'none',
    definition: 'Dois ou mais testes no mesmo escopo compartilham a mesma descrição.',
    manifestation: 'Relatórios de CI não permitem distinguir facilmente qual cenário falhou.',
    bad: `test('valida usuário', () => expect(valid('a@b.com')).toBe(true));\ntest('valida usuário', () => expect(valid('invalido')).toBe(false));`,
    good: `test('aceita e-mail válido', () => expect(valid('a@b.com')).toBe(true));\ntest('rejeita e-mail inválido', () => expect(valid('invalido')).toBe(false));`,
    rule: 'duplicate-test-description-in-scope', tags: ['descrição', 'nome', 'relatório'], sources: [SILVA, SNUTS]
  }),
  literatureSmell({
    id: 61, slug: 'non-functional-statement', name: 'Non-Functional Statement', aka: ['Non Functional Statement'], category: 'semantics', impact: ['Manutenibilidade', 'Legibilidade'], flakiness: 'none',
    definition: 'Instrução no teste que não contribui para setup, execução ou verificação do comportamento.',
    manifestation: 'Expressões soltas, cálculos sem uso e declarações sem efeito adicionam ruído à especificação executável.',
    bad: "test('calcula total', () => { const order = orderFactory(); order.id; expect(total(order)).toBe(10); });",
    good: "test('calcula total', () => { const order = orderFactory(); expect(total(order)).toBe(10); });",
    rule: 'statement-without-test-effect', tags: ['código morto', 'ruído'], sources: [SILVA, SNUTS]
  }),
  literatureSmell({
    id: 62, slug: 'test-without-description', name: 'Test Without Description', aka: ['TWD'], category: 'semantics', impact: ['Legibilidade', 'Manutenibilidade'], flakiness: 'none',
    definition: 'Caso de teste criado sem texto descritivo.',
    manifestation: 'Jest/Vitest permite passar diretamente o callback; o relatório resultante perde o contexto do comportamento testado.',
    bad: "test(() => { expect(sum(1, 2)).toBe(3); });",
    good: "test('soma dois números', () => { expect(sum(1, 2)).toBe(3); });",
    rule: 'test-call-without-description', tags: ['descrição', 'jest', 'vitest'], sources: [SNUTS]
  }),
  literatureSmell({
    id: 63, slug: 'transcripting-test', name: 'Transcripting Test', aka: ['Print Statement in Test'], category: 'semantics', impact: ['Legibilidade', 'Performance'], flakiness: 'none',
    definition: 'Uso de comandos de impressão no corpo do teste.',
    manifestation: 'console.log, console.debug ou print permanecem como registro transitório e poluem a saída da suíte.',
    bad: "test('calcula total', () => { const value = total(order); console.log(value); expect(value).toBe(10); });",
    good: "test('calcula total', () => { expect(total(order)).toBe(10); });",
    rule: 'console-output-in-test', tags: ['console', 'log', 'saída'], sources: [SNUTS]
  }),
  literatureSmell({
    id: 64, slug: 'verify-in-setup', name: 'Verify in Setup', aka: ['Verifying in Setup Method'], category: 'fixtures', impact: ['Confiabilidade', 'Manutenibilidade'], flakiness: 'possible',
    definition: 'Asserção executada em hook de setup compartilhado em vez do teste que define a expectativa.',
    manifestation: 'Falhas em beforeEach são atribuídas a todos os casos dependentes e escondem a intenção de cada cenário.',
    bad: `beforeEach(() => { user = createUser(); expect(user.id).toBeDefined(); });\ntest('envia mensagem', () => { expect(send(user)).toBe(true); });`,
    good: `beforeEach(() => { user = createUser(); });\ntest('cria usuário com id', () => { expect(user.id).toBeDefined(); });`,
    rule: 'assertion-inside-setup-hook', tags: ['beforeEach', 'setup', 'assertion'], sources: [SILVA, SNUTS]
  }),
  literatureSmell({
    id: 65, slug: 'constructor-initialization', name: 'Constructor Initialization', aka: ['Initialization in Constructor'], category: 'fixtures', impact: ['Manutenibilidade', 'Legibilidade'], flakiness: 'none',
    definition: 'Fixture de teste inicializada no construtor da classe de teste em vez de em hook apropriado.',
    manifestation: 'A criação fica distante dos cenários e pode compartilhar estado de forma pouco explícita.',
    bad: "class CartTest { constructor() { this.cart = new Cart(); } testTotal() { expect(this.cart.total()).toBe(0); } }",
    good: "describe('Cart', () => { let cart; beforeEach(() => { cart = new Cart(); }); test('inicia vazinho', () => { expect(cart.total()).toBe(0); }); });",
    rule: 'fixture-created-in-test-constructor', tags: ['constructor', 'fixture', 'setup'], sources: [STEEL]
  }),
  literatureSmell({
    id: 66, slug: 'empty-test', name: 'Empty Test', aka: ['Empty Test Method'], category: 'execution', impact: ['Confiabilidade', 'Manutenibilidade'], flakiness: 'none',
    definition: 'Caso de teste sem instruções executáveis.',
    manifestation: 'Um it/test vazio aparece como aprovado e cria uma falsa impressão de cobertura.',
    bad: "test('remove usuário', () => {});",
    good: "test('remove usuário', () => { expect(removeUser(1)).toBe(true); });",
    rule: 'empty-test-callback', tags: ['vazio', 'cobertura', 'execução'], sources: [STEEL]
  }),
  readTheDocsSmell({
    id: 67, slug: 'readthedocs-only-test', name: 'Only Test', aka: [], category: 'execution', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Only Test”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reescreva o caso com uma intenção única, estrutura Arrange–Act–Assert e nomes que expressem o comportamento esperado.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Only Test', () => {\n  subject.execute(input);\n});", good: "test('executa e verifica um comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-only-test', href: 'only_test.html',
    tags: ['readthedocs', 'execution']
  }),
  readTheDocsSmell({
    id: 68, slug: 'readthedocs-non-deterministic-data-test', name: 'Non-deterministic Data Test', aka: [], category: 'semantics', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'possible',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Non-deterministic Data Test”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Pode tornar o resultado intermitente: dados aleatórios ou relógios não controlados podem alterar o resultado entre execuções. Também dificulta diagnosticar a causa real da falha.',
    refactoring: 'Reescreva o caso com uma intenção única, estrutura Arrange–Act–Assert e nomes que expressem o comportamento esperado.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Non-deterministic Data Test', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('descreve e verifica o comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-non-deterministic-data-test', href: 'non_deterministic_data_test.html',
    flakinessProfile: { factors: ["aleatoriedade"], explanation: 'Dados aleatórios ou relógios não controlados podem alterar o resultado entre execuções.', example: "test('Non-deterministic Data Test', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});" },
    tags: ['readthedocs', 'semantics']
  }),
  readTheDocsSmell({
    id: 69, slug: 'readthedocs-assertion-loop', name: 'Assertion Loop', aka: [], category: 'assertions', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Assertion Loop”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Substitua verificações genéricas por uma expectativa pequena, explícita e ligada ao comportamento do cenário.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Assertion Loop', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('verifica o resultado esperado', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-assertion-loop', href: 'assertion_loop.html',
    tags: ['readthedocs', 'assertions']
  }),
  readTheDocsSmell({
    id: 70, slug: 'readthedocs-return-in-test', name: 'Return in Test', aka: [], category: 'execution', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Return in Test”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reescreva o caso com uma intenção única, estrutura Arrange–Act–Assert e nomes que expressem o comportamento esperado.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Return in Test', () => {\n  subject.execute(input);\n});", good: "test('executa e verifica um comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-return-in-test', href: 'return_in_test.html',
    tags: ['readthedocs', 'execution']
  }),
  readTheDocsSmell({
    id: 71, slug: 'readthedocs-resource-optmism-test', name: 'Resource Optimism', aka: [], category: 'dependencies', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'possible',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Resource Optimism”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Pode tornar o resultado intermitente: a disponibilidade de arquivos, banco de dados ou rede varia entre máquinas e execuções. Também dificulta diagnosticar a causa real da falha.',
    refactoring: 'Isole a dependência por stub, fake ou recurso controlado; sincronize por eventos e restaure o estado ao final.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Resource Optimism', async () => {\n  const result = await subject.execute();\n  expect(result).toBeTruthy();\n});", good: "test('isola a dependência e aguarda o evento', async () => {\n  const result = await subject.execute(dependencyStub);\n  expect(result).toEqual(expected);\n});", rule: 'readthedocs-resource-optmism-test', href: 'resource_optmism_test.html',
    flakinessProfile: { factors: ["ambiente externo"], explanation: 'A disponibilidade de arquivos, banco de dados ou rede varia entre máquinas e execuções.', example: "test('Resource Optimism', async () => {\n  const result = await subject.execute();\n  expect(result).toBeTruthy();\n});" },
    tags: ['readthedocs', 'dependencies']
  }),
  readTheDocsSmell({
    id: 72, slug: 'readthedocs-army-of-clones', name: 'Army of Clones Test', aka: [], category: 'duplication', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Army of Clones Test”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Remova a repetição e extraia somente a intenção comum, mantendo cada cenário legível de forma independente.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Army of Clones Test', () => {\n  const result = subject.execute(input);\n  expect(result).toEqual(expected);\n  expect(result).toEqual(expected);\n});", good: "test('documenta uma expectativa por comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-army-of-clones', href: 'army_of_clones.html',
    tags: ['readthedocs', 'duplication']
  }),
  readTheDocsSmell({
    id: 73, slug: 'readthedocs-assertion-chorus-test', name: 'Assertion Chorus Test', aka: [], category: 'assertions', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Assertion Chorus Test”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Substitua verificações genéricas por uma expectativa pequena, explícita e ligada ao comportamento do cenário.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Assertion Chorus Test', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('verifica o resultado esperado', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-assertion-chorus-test', href: 'assertion_chorus_test.html',
    tags: ['readthedocs', 'assertions']
  }),
  readTheDocsSmell({
    id: 74, slug: 'readthedocs-duplicate-statements-test', name: 'Duplicate Statements Test', aka: [], category: 'duplication', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Duplicate Statements Test”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Remova a repetição e extraia somente a intenção comum, mantendo cada cenário legível de forma independente.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Duplicate Statements Test', () => {\n  const result = subject.execute(input);\n  expect(result).toEqual(expected);\n  expect(result).toEqual(expected);\n});", good: "test('documenta uma expectativa por comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-duplicate-statements-test', href: 'duplicate_statements_test.html',
    tags: ['readthedocs', 'duplication']
  }),
  readTheDocsSmell({
    id: 75, slug: 'readthedocs-duplicated-actions', name: 'Duplicated Actions', aka: [], category: 'duplication', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Duplicated Actions”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Remova a repetição e extraia somente a intenção comum, mantendo cada cenário legível de forma independente.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Duplicated Actions', () => {\n  const result = subject.execute(input);\n  expect(result).toEqual(expected);\n  expect(result).toEqual(expected);\n});", good: "test('documenta uma expectativa por comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-duplicated-actions', href: 'duplicated_actions.html',
    tags: ['readthedocs', 'duplication']
  }),
  readTheDocsSmell({
    id: 76, slug: 'readthedocs-duplicated-code-in-conditional', name: 'Duplicated Code in Conditional', aka: [], category: 'duplication', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Duplicated Code in Conditional”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Remova a repetição e extraia somente a intenção comum, mantendo cada cenário legível de forma independente.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Duplicated Code in Conditional', () => {\n  const result = subject.execute(input);\n  expect(result).toEqual(expected);\n  expect(result).toEqual(expected);\n});", good: "test('documenta uma expectativa por comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-duplicated-code-in-conditional', href: 'duplicated_code_in_conditional.html',
    tags: ['readthedocs', 'duplication']
  }),
  readTheDocsSmell({
    id: 77, slug: 'readthedocs-half-a-helper-method', name: 'Half a Helper Method', aka: [], category: 'semantics', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Half a Helper Method”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reescreva o caso com uma intenção única, estrutura Arrange–Act–Assert e nomes que expressem o comportamento esperado.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Half a Helper Method', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('descreve e verifica o comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-half-a-helper-method', href: 'half_a_helper_method.html',
    tags: ['readthedocs', 'semantics']
  }),
  readTheDocsSmell({
    id: 78, slug: 'readthedocs-missing-test-data-factory', name: 'Missing Test Data Factory', aka: [], category: 'fixtures', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Missing Test Data Factory”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reduza o setup ao mínimo necessário, crie dados explícitos por cenário e preserve o isolamento entre testes.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "let shared;\nbeforeEach(() => { shared = createLargeFixture(); });\ntest('Missing Test Data Factory', () => expect(subject.execute(shared)).toBeTruthy());", good: "test('executa com dados mínimos', () => {\n  const fixture = createFixture({ needed: true });\n  expect(subject.execute(fixture)).toEqual(expected);\n});", rule: 'readthedocs-missing-test-data-factory', href: 'missing_test_data_factory.html',
    tags: ['readthedocs', 'fixtures']
  }),
  readTheDocsSmell({
    id: 79, slug: 'readthedocs-test-redundancy', name: 'Test Redundancy', aka: [], category: 'duplication', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Test Redundancy”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Remova a repetição e extraia somente a intenção comum, mantendo cada cenário legível de forma independente.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Test Redundancy', () => {\n  const result = subject.execute(input);\n  expect(result).toEqual(expected);\n  expect(result).toEqual(expected);\n});", good: "test('documenta uma expectativa por comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-test-redundancy', href: 'test_redundancy.html',
    tags: ['readthedocs', 'duplication']
  }),
  readTheDocsSmell({
    id: 80, slug: 'readthedocs-the-first-and-last-rites', name: 'The First and Last Rites', aka: [], category: 'semantics', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “The First and Last Rites”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reescreva o caso com uma intenção única, estrutura Arrange–Act–Assert e nomes que expressem o comportamento esperado.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('The First and Last Rites', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('descreve e verifica o comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-the-first-and-last-rites', href: 'the_first_and_last_rites.html',
    tags: ['readthedocs', 'semantics']
  }),
  readTheDocsSmell({
    id: 81, slug: 'readthedocs-two-for-the-price-of-one', name: 'Two for the Price of One', aka: [], category: 'semantics', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Two for the Price of One”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reescreva o caso com uma intenção única, estrutura Arrange–Act–Assert e nomes que expressem o comportamento esperado.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Two for the Price of One', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('descreve e verifica o comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-two-for-the-price-of-one', href: 'two_for_the_price_of_one.html',
    tags: ['readthedocs', 'semantics']
  }),
  readTheDocsSmell({
    id: 82, slug: 'readthedocs-hard-coded-values', name: 'Hard-Coded Values', aka: [], category: 'semantics', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Hard-Coded Values”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reescreva o caso com uma intenção única, estrutura Arrange–Act–Assert e nomes que expressem o comportamento esperado.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Hard-Coded Values', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('descreve e verifica o comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-hard-coded-values', href: 'hard_coded_values.html',
    tags: ['readthedocs', 'semantics']
  }),
  readTheDocsSmell({
    id: 83, slug: 'readthedocs-hardcoded-literals', name: 'Hardcoded Literals', aka: [], category: 'semantics', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Hardcoded Literals”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reescreva o caso com uma intenção única, estrutura Arrange–Act–Assert e nomes que expressem o comportamento esperado.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Hardcoded Literals', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('descreve e verifica o comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-hardcoded-literals', href: 'hardcoded_literals.html',
    tags: ['readthedocs', 'semantics']
  }),
  readTheDocsSmell({
    id: 84, slug: 'readthedocs-hidden-complexity', name: 'Hidden Complexity', aka: [], category: 'semantics', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Hidden Complexity”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reescreva o caso com uma intenção única, estrutura Arrange–Act–Assert e nomes que expressem o comportamento esperado.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Hidden Complexity', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('descreve e verifica o comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-hidden-complexity', href: 'hidden_complexity.html',
    tags: ['readthedocs', 'semantics']
  }),
  readTheDocsSmell({
    id: 85, slug: 'readthedocs-large-module', name: 'Large Module', aka: [], category: 'semantics', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Large Module”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reescreva o caso com uma intenção única, estrutura Arrange–Act–Assert e nomes que expressem o comportamento esperado.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Large Module', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('descreve e verifica o comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-large-module', href: 'large_module.html',
    tags: ['readthedocs', 'semantics']
  }),
  readTheDocsSmell({
    id: 86, slug: 'readthedocs-long-class', name: 'Long Class', aka: [], category: 'semantics', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Long Class”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reescreva o caso com uma intenção única, estrutura Arrange–Act–Assert e nomes que expressem o comportamento esperado.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Long Class', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('descreve e verifica o comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-long-class', href: 'long_class.html',
    tags: ['readthedocs', 'semantics']
  }),
  readTheDocsSmell({
    id: 87, slug: 'readthedocs-long-method', name: 'Long Function or Long Method', aka: [], category: 'semantics', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Long Function or Long Method”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reescreva o caso com uma intenção única, estrutura Arrange–Act–Assert e nomes que expressem o comportamento esperado.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Long Function or Long Method', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('descreve e verifica o comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-long-method', href: 'long_method.html',
    tags: ['readthedocs', 'semantics']
  }),
  readTheDocsSmell({
    id: 88, slug: 'readthedocs-self-important-test-data', name: 'Self Important Test Data', aka: [], category: 'semantics', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Self Important Test Data”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reescreva o caso com uma intenção única, estrutura Arrange–Act–Assert e nomes que expressem o comportamento esperado.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Self Important Test Data', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('descreve e verifica o comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-self-important-test-data', href: 'self_important_test_data.html',
    tags: ['readthedocs', 'semantics']
  }),
  readTheDocsSmell({
    id: 89, slug: 'readthedocs-using-complicated-path', name: 'Using Complicated X-Path or CSS Selectors', aka: [], category: 'semantics', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Using Complicated X-Path or CSS Selectors”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reescreva o caso com uma intenção única, estrutura Arrange–Act–Assert e nomes que expressem o comportamento esperado.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Using Complicated X-Path or CSS Selectors', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('descreve e verifica o comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-using-complicated-path', href: 'using_complicated_path.html',
    tags: ['readthedocs', 'semantics']
  }),
  readTheDocsSmell({
    id: 90, slug: 'readthedocs-disorder', name: 'Disorder', aka: [], category: 'dependencies', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Disorder”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Isole a dependência por stub, fake ou recurso controlado; sincronize por eventos e restaure o estado ao final.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Disorder', async () => {\n  const result = await subject.execute();\n  expect(result).toBeTruthy();\n});", good: "test('isola a dependência e aguarda o evento', async () => {\n  const result = await subject.execute(dependencyStub);\n  expect(result).toEqual(expected);\n});", rule: 'readthedocs-disorder', href: 'disorder.html',
    tags: ['readthedocs', 'dependencies']
  }),
  readTheDocsSmell({
    id: 91, slug: 'readthedocs-undefined-test', name: 'Undefined Test', aka: [], category: 'execution', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Undefined Test”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reescreva o caso com uma intenção única, estrutura Arrange–Act–Assert e nomes que expressem o comportamento esperado.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Undefined Test', () => {\n  subject.execute(input);\n});", good: "test('executa e verifica um comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-undefined-test', href: 'undefined_test.html',
    tags: ['readthedocs', 'execution']
  }),
  readTheDocsSmell({
    id: 92, slug: 'readthedocs-the-distant-relative', name: 'The Distant Relative', aka: [], category: 'semantics', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “The Distant Relative”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reescreva o caso com uma intenção única, estrutura Arrange–Act–Assert e nomes que expressem o comportamento esperado.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('The Distant Relative', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('descreve e verifica o comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-the-distant-relative', href: 'the_distant_relative.html',
    tags: ['readthedocs', 'semantics']
  }),
  readTheDocsSmell({
    id: 93, slug: 'readthedocs-assert-the-world', name: 'Assert the World', aka: [], category: 'assertions', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Assert the World”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Substitua verificações genéricas por uma expectativa pequena, explícita e ligada ao comportamento do cenário.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Assert the World', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('verifica o resultado esperado', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-assert-the-world', href: 'assert_the_world.html',
    tags: ['readthedocs', 'assertions']
  }),
  readTheDocsSmell({
    id: 94, slug: 'readthedocs-field-level-assertion', name: 'Field-Level Assertion', aka: [], category: 'assertions', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Field-Level Assertion”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Substitua verificações genéricas por uma expectativa pequena, explícita e ligada ao comportamento do cenário.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Field-Level Assertion', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('verifica o resultado esperado', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-field-level-assertion', href: 'field_level_assertion.html',
    tags: ['readthedocs', 'assertions']
  }),
  readTheDocsSmell({
    id: 95, slug: 'readthedocs-method-based-testing', name: 'Method-Based Testing', aka: [], category: 'semantics', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Method-Based Testing”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reescreva o caso com uma intenção única, estrutura Arrange–Act–Assert e nomes que expressem o comportamento esperado.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Method-Based Testing', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('descreve e verifica o comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-method-based-testing', href: 'method_based_testing.html',
    tags: ['readthedocs', 'semantics']
  }),
  readTheDocsSmell({
    id: 96, slug: 'readthedocs-existing-tests', name: 'Existing Tests', aka: [], category: 'execution', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Existing Tests”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reescreva o caso com uma intenção única, estrutura Arrange–Act–Assert e nomes que expressem o comportamento esperado.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Existing Tests', () => {\n  subject.execute(input);\n});", good: "test('executa e verifica um comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-existing-tests', href: 'existing_tests.html',
    tags: ['readthedocs', 'execution']
  }),
  readTheDocsSmell({
    id: 97, slug: 'readthedocs-split-logic', name: 'Split Logic', aka: [], category: 'semantics', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Split Logic”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reescreva o caso com uma intenção única, estrutura Arrange–Act–Assert e nomes que expressem o comportamento esperado.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Split Logic', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('descreve e verifica o comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-split-logic', href: 'split_logic.html',
    tags: ['readthedocs', 'semantics']
  }),
  readTheDocsSmell({
    id: 98, slug: 'readthedocs-abnormal', name: 'Abnormal UTF-Use', aka: [], category: 'semantics', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Abnormal UTF-Use”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reescreva o caso com uma intenção única, estrutura Arrange–Act–Assert e nomes que expressem o comportamento esperado.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Abnormal UTF-Use', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('descreve e verifica o comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-abnormal', href: 'abnormal.html',
    tags: ['readthedocs', 'semantics']
  }),
  readTheDocsSmell({
    id: 99, slug: 'readthedocs-frequent-debugging', name: 'Frequent Debugging', aka: [], category: 'execution', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Frequent Debugging”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reescreva o caso com uma intenção única, estrutura Arrange–Act–Assert e nomes que expressem o comportamento esperado.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Frequent Debugging', () => {\n  subject.execute(input);\n});", good: "test('executa e verifica um comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-frequent-debugging', href: 'frequent_debugging.html',
    tags: ['readthedocs', 'execution']
  }),
  readTheDocsSmell({
    id: 100, slug: 'readthedocs-asynchronous-test', name: 'Asynchronous Test', aka: [], category: 'dependencies', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'possible',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Asynchronous Test”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Pode tornar o resultado intermitente: a conclusão de operações assíncronas depende de agendamento e pode ocorrer depois da asserção. Também dificulta diagnosticar a causa real da falha.',
    refactoring: 'Isole a dependência por stub, fake ou recurso controlado; sincronize por eventos e restaure o estado ao final.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Asynchronous Test', async () => {\n  const result = await subject.execute();\n  expect(result).toBeTruthy();\n});", good: "test('isola a dependência e aguarda o evento', async () => {\n  const result = await subject.execute(dependencyStub);\n  expect(result).toEqual(expected);\n});", rule: 'readthedocs-asynchronous-test', href: 'asynchronous_test.html',
    flakinessProfile: { factors: ["tempo"], explanation: 'A conclusão de operações assíncronas depende de agendamento e pode ocorrer depois da asserção.', example: "test('Asynchronous Test', async () => {\n  const result = await subject.execute();\n  expect(result).toBeTruthy();\n});" },
    tags: ['readthedocs', 'dependencies']
  }),
  readTheDocsSmell({
    id: 101, slug: 'readthedocs-inefficient-waits', name: 'Inefficient Waits', aka: [], category: 'dependencies', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'possible',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Inefficient Waits”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Pode tornar o resultado intermitente: esperas arbitrárias podem ser insuficientes sob carga ou excessivas quando o ambiente está rápido. Também dificulta diagnosticar a causa real da falha.',
    refactoring: 'Isole a dependência por stub, fake ou recurso controlado; sincronize por eventos e restaure o estado ao final.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Inefficient Waits', async () => {\n  const result = await subject.execute();\n  expect(result).toBeTruthy();\n});", good: "test('isola a dependência e aguarda o evento', async () => {\n  const result = await subject.execute(dependencyStub);\n  expect(result).toEqual(expected);\n});", rule: 'readthedocs-inefficient-waits', href: 'inefficient_waits.html',
    flakinessProfile: { factors: ["tempo"], explanation: 'Esperas arbitrárias podem ser insuficientes sob carga ou excessivas quando o ambiente está rápido.', example: "test('Inefficient Waits', async () => {\n  const result = await subject.execute();\n  expect(result).toBeTruthy();\n});" },
    tags: ['readthedocs', 'dependencies']
  }),
  readTheDocsSmell({
    id: 102, slug: 'readthedocs-constrained-test-order', name: 'Constrained Test Order', aka: [], category: 'dependencies', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'possible',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Constrained Test Order”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Pode tornar o resultado intermitente: o resultado depende de uma sequência específica e do estado deixado por outros testes. Também dificulta diagnosticar a causa real da falha.',
    refactoring: 'Isole a dependência por stub, fake ou recurso controlado; sincronize por eventos e restaure o estado ao final.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Constrained Test Order', async () => {\n  const result = await subject.execute();\n  expect(result).toBeTruthy();\n});", good: "test('isola a dependência e aguarda o evento', async () => {\n  const result = await subject.execute(dependencyStub);\n  expect(result).toEqual(expected);\n});", rule: 'readthedocs-constrained-test-order', href: 'constrained_test_order.html',
    flakinessProfile: { factors: ["ordem","estado compartilhado"], explanation: 'O resultado depende de uma sequência específica e do estado deixado por outros testes.', example: "test('Constrained Test Order', async () => {\n  const result = await subject.execute();\n  expect(result).toBeTruthy();\n});" },
    tags: ['readthedocs', 'dependencies']
  }),
  readTheDocsSmell({
    id: 103, slug: 'readthedocs-coupling-between-test-methods', name: 'Coupling Between Test Methods', aka: [], category: 'semantics', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'possible',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Coupling Between Test Methods”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Pode tornar o resultado intermitente: métodos de teste acoplados compartilham pré-condições e falham se a ordem mudar. Também dificulta diagnosticar a causa real da falha.',
    refactoring: 'Reescreva o caso com uma intenção única, estrutura Arrange–Act–Assert e nomes que expressem o comportamento esperado.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Coupling Between Test Methods', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('descreve e verifica o comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-coupling-between-test-methods', href: 'coupling_between_test_methods.html',
    flakinessProfile: { factors: ["ordem","estado compartilhado"], explanation: 'Métodos de teste acoplados compartilham pré-condições e falham se a ordem mudar.', example: "test('Coupling Between Test Methods', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});" },
    tags: ['readthedocs', 'semantics']
  }),
  readTheDocsSmell({
    id: 104, slug: 'readthedocs-dependent-test', name: 'Dependent Test', aka: [], category: 'dependencies', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'possible',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Dependent Test”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Pode tornar o resultado intermitente: um teste depende do efeito colateral de outro, tornando a suíte sensível à ordem. Também dificulta diagnosticar a causa real da falha.',
    refactoring: 'Isole a dependência por stub, fake ou recurso controlado; sincronize por eventos e restaure o estado ao final.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Dependent Test', async () => {\n  const result = await subject.execute();\n  expect(result).toBeTruthy();\n});", good: "test('isola a dependência e aguarda o evento', async () => {\n  const result = await subject.execute(dependencyStub);\n  expect(result).toEqual(expected);\n});", rule: 'readthedocs-dependent-test', href: 'dependent_test.html',
    flakinessProfile: { factors: ["ordem","estado compartilhado"], explanation: 'Um teste depende do efeito colateral de outro, tornando a suíte sensível à ordem.', example: "test('Dependent Test', async () => {\n  const result = await subject.execute();\n  expect(result).toBeTruthy();\n});" },
    tags: ['readthedocs', 'dependencies']
  }),
  readTheDocsSmell({
    id: 105, slug: 'readthedocs-lack-of-cohesion', name: 'Lack of Cohesion of Test Cases', aka: [], category: 'semantics', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Lack of Cohesion of Test Cases”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reescreva o caso com uma intenção única, estrutura Arrange–Act–Assert e nomes que expressem o comportamento esperado.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Lack of Cohesion of Test Cases', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('descreve e verifica o comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-lack-of-cohesion', href: 'lack_of_cohesion.html',
    tags: ['readthedocs', 'semantics']
  }),
  readTheDocsSmell({
    id: 106, slug: 'readthedocs-litter-bugs', name: 'Litter Bugs', aka: [], category: 'fixtures', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'possible',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Litter Bugs”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Pode tornar o resultado intermitente: arquivos, variáveis ou dados não removidos contaminam execuções posteriores. Também dificulta diagnosticar a causa real da falha.',
    refactoring: 'Reduza o setup ao mínimo necessário, crie dados explícitos por cenário e preserve o isolamento entre testes.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "let shared;\nbeforeEach(() => { shared = createLargeFixture(); });\ntest('Litter Bugs', () => expect(subject.execute(shared)).toBeTruthy());", good: "test('executa com dados mínimos', () => {\n  const fixture = createFixture({ needed: true });\n  expect(subject.execute(fixture)).toEqual(expected);\n});", rule: 'readthedocs-litter-bugs', href: 'litter_bugs.html',
    flakinessProfile: { factors: ["estado compartilhado"], explanation: 'Arquivos, variáveis ou dados não removidos contaminam execuções posteriores.', example: "let shared;\nbeforeEach(() => { shared = createLargeFixture(); });\ntest('Litter Bugs', () => expect(subject.execute(shared)).toBeTruthy());" },
    tags: ['readthedocs', 'fixtures']
  }),
  readTheDocsSmell({
    id: 107, slug: 'readthedocs-lonely-test', name: 'Lonely Test', aka: [], category: 'semantics', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Lonely Test”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reescreva o caso com uma intenção única, estrutura Arrange–Act–Assert e nomes que expressem o comportamento esperado.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Lonely Test', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('descreve e verifica o comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-lonely-test', href: 'lonely_test.html',
    tags: ['readthedocs', 'semantics']
  }),
  readTheDocsSmell({
    id: 108, slug: 'readthedocs-test-run-war', name: 'Test Run War', aka: [], category: 'dependencies', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'possible',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Test Run War”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Pode tornar o resultado intermitente: execuções concorrentes disputam recursos ou dados e interferem umas nas outras. Também dificulta diagnosticar a causa real da falha.',
    refactoring: 'Isole a dependência por stub, fake ou recurso controlado; sincronize por eventos e restaure o estado ao final.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Test Run War', async () => {\n  const result = await subject.execute();\n  expect(result).toBeTruthy();\n});", good: "test('isola a dependência e aguarda o evento', async () => {\n  const result = await subject.execute(dependencyStub);\n  expect(result).toEqual(expected);\n});", rule: 'readthedocs-test-run-war', href: 'test_run_war.html',
    flakinessProfile: { factors: ["estado compartilhado"], explanation: 'Execuções concorrentes disputam recursos ou dados e interferem umas nas outras.', example: "test('Test Run War', async () => {\n  const result = await subject.execute();\n  expect(result).toBeTruthy();\n});" },
    tags: ['readthedocs', 'dependencies']
  }),
  readTheDocsSmell({
    id: 109, slug: 'readthedocs-unusual-test-order', name: 'Unusual Test Order', aka: [], category: 'dependencies', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Unusual Test Order”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Isole a dependência por stub, fake ou recurso controlado; sincronize por eventos e restaure o estado ao final.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Unusual Test Order', async () => {\n  const result = await subject.execute();\n  expect(result).toBeTruthy();\n});", good: "test('isola a dependência e aguarda o evento', async () => {\n  const result = await subject.execute(dependencyStub);\n  expect(result).toEqual(expected);\n});", rule: 'readthedocs-unusual-test-order', href: 'unusual_test_order.html',
    tags: ['readthedocs', 'dependencies']
  }),
  readTheDocsSmell({
    id: 110, slug: 'readthedocs-data-sensitivity', name: 'Data Sensitivity', aka: [], category: 'dependencies', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'possible',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Data Sensitivity”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Pode tornar o resultado intermitente: dados de localidade, codificação ou configuração mudam entre ambientes. Também dificulta diagnosticar a causa real da falha.',
    refactoring: 'Isole a dependência por stub, fake ou recurso controlado; sincronize por eventos e restaure o estado ao final.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Data Sensitivity', async () => {\n  const result = await subject.execute();\n  expect(result).toBeTruthy();\n});", good: "test('isola a dependência e aguarda o evento', async () => {\n  const result = await subject.execute(dependencyStub);\n  expect(result).toEqual(expected);\n});", rule: 'readthedocs-data-sensitivity', href: 'data_sensitivity.html',
    flakinessProfile: { factors: ["ambiente externo"], explanation: 'Dados de localidade, codificação ou configuração mudam entre ambientes.', example: "test('Data Sensitivity', async () => {\n  const result = await subject.execute();\n  expect(result).toBeTruthy();\n});" },
    tags: ['readthedocs', 'dependencies']
  }),
  readTheDocsSmell({
    id: 111, slug: 'readthedocs-hidden-dependency', name: 'Hidden Dependency', aka: [], category: 'dependencies', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'possible',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Hidden Dependency”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Pode tornar o resultado intermitente: uma dependência não declarada pode estar disponível localmente e ausente na ci. Também dificulta diagnosticar a causa real da falha.',
    refactoring: 'Isole a dependência por stub, fake ou recurso controlado; sincronize por eventos e restaure o estado ao final.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Hidden Dependency', async () => {\n  const result = await subject.execute();\n  expect(result).toBeTruthy();\n});", good: "test('isola a dependência e aguarda o evento', async () => {\n  const result = await subject.execute(dependencyStub);\n  expect(result).toEqual(expected);\n});", rule: 'readthedocs-hidden-dependency', href: 'hidden_dependency.html',
    flakinessProfile: { factors: ["ambiente externo"], explanation: 'Uma dependência não declarada pode estar disponível localmente e ausente na CI.', example: "test('Hidden Dependency', async () => {\n  const result = await subject.execute();\n  expect(result).toBeTruthy();\n});" },
    tags: ['readthedocs', 'dependencies']
  }),
  readTheDocsSmell({
    id: 112, slug: 'readthedocs-the-operating-system-evangelist', name: 'The Operating System Evangelist', aka: [], category: 'dependencies', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'possible',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “The Operating System Evangelist”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Pode tornar o resultado intermitente: o comportamento depende do sistema operacional, caminhos ou comandos disponíveis. Também dificulta diagnosticar a causa real da falha.',
    refactoring: 'Isole a dependência por stub, fake ou recurso controlado; sincronize por eventos e restaure o estado ao final.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('The Operating System Evangelist', async () => {\n  const result = await subject.execute();\n  expect(result).toBeTruthy();\n});", good: "test('isola a dependência e aguarda o evento', async () => {\n  const result = await subject.execute(dependencyStub);\n  expect(result).toEqual(expected);\n});", rule: 'readthedocs-the-operating-system-evangelist', href: 'the_operating_system_evangelist.html',
    flakinessProfile: { factors: ["ambiente externo"], explanation: 'O comportamento depende do sistema operacional, caminhos ou comandos disponíveis.', example: "test('The Operating System Evangelist', async () => {\n  const result = await subject.execute();\n  expect(result).toBeTruthy();\n});" },
    tags: ['readthedocs', 'dependencies']
  }),
  readTheDocsSmell({
    id: 113, slug: 'readthedocs-branch-to-assumption-anti-pattern', name: 'Branch To Assumption Anti-Pattern', aka: [], category: 'semantics', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Branch To Assumption Anti-Pattern”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reescreva o caso com uma intenção única, estrutura Arrange–Act–Assert e nomes que expressem o comportamento esperado.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Branch To Assumption Anti-Pattern', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('descreve e verifica o comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-branch-to-assumption-anti-pattern', href: 'branch_to_assumption_anti_pattern.html',
    tags: ['readthedocs', 'semantics']
  }),
  readTheDocsSmell({
    id: 114, slug: 'readthedocs-chafing', name: 'Chafing', aka: [], category: 'semantics', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Chafing”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reescreva o caso com uma intenção única, estrutura Arrange–Act–Assert e nomes que expressem o comportamento esperado.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Chafing', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('descreve e verifica o comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-chafing', href: 'chafing.html',
    tags: ['readthedocs', 'semantics']
  }),
  readTheDocsSmell({
    id: 115, slug: 'readthedocs-contaminated-test-subject', name: 'Contaminated Test Subject', aka: [], category: 'dependencies', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'possible',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Contaminated Test Subject”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Pode tornar o resultado intermitente: o sujeito sob teste já alterado produz resultados diferentes conforme o histórico de uso. Também dificulta diagnosticar a causa real da falha.',
    refactoring: 'Isole a dependência por stub, fake ou recurso controlado; sincronize por eventos e restaure o estado ao final.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Contaminated Test Subject', async () => {\n  const result = await subject.execute();\n  expect(result).toBeTruthy();\n});", good: "test('isola a dependência e aguarda o evento', async () => {\n  const result = await subject.execute(dependencyStub);\n  expect(result).toEqual(expected);\n});", rule: 'readthedocs-contaminated-test-subject', href: 'contaminated_test_subject.html',
    flakinessProfile: { factors: ["estado compartilhado"], explanation: 'O sujeito sob teste já alterado produz resultados diferentes conforme o histórico de uso.', example: "test('Contaminated Test Subject', async () => {\n  const result = await subject.execute();\n  expect(result).toBeTruthy();\n});" },
    tags: ['readthedocs', 'dependencies']
  }),
  readTheDocsSmell({
    id: 116, slug: 'readthedocs-evolve-or', name: 'Evolve Or', aka: [], category: 'semantics', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Evolve Or”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reescreva o caso com uma intenção única, estrutura Arrange–Act–Assert e nomes que expressem o comportamento esperado.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Evolve Or', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('descreve e verifica o comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-evolve-or', href: 'evolve_or.html',
    tags: ['readthedocs', 'semantics']
  }),
  readTheDocsSmell({
    id: 117, slug: 'readthedocs-flexible-test', name: 'Flexible Test', aka: [], category: 'semantics', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Flexible Test”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reescreva o caso com uma intenção única, estrutura Arrange–Act–Assert e nomes que expressem o comportamento esperado.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Flexible Test', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('descreve e verifica o comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-flexible-test', href: 'flexible_test.html',
    tags: ['readthedocs', 'semantics']
  }),
  readTheDocsSmell({
    id: 118, slug: 'readthedocs-fully-gotten-green-test', name: 'Fully Rotten Green Test', aka: [], category: 'assertions', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Fully Rotten Green Test”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Substitua verificações genéricas por uma expectativa pequena, explícita e ligada ao comportamento do cenário.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Fully Rotten Green Test', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('verifica o resultado esperado', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-fully-gotten-green-test', href: 'fully_gotten_green_test.html',
    tags: ['readthedocs', 'assertions']
  }),
  readTheDocsSmell({
    id: 119, slug: 'readthedocs-generative', name: 'Generative', aka: [], category: 'dependencies', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Generative”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Isole a dependência por stub, fake ou recurso controlado; sincronize por eventos e restaure o estado ao final.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Generative', async () => {\n  const result = await subject.execute();\n  expect(result).toBeTruthy();\n});", good: "test('isola a dependência e aguarda o evento', async () => {\n  const result = await subject.execute(dependencyStub);\n  expect(result).toEqual(expected);\n});", rule: 'readthedocs-generative', href: 'generative.html',
    tags: ['readthedocs', 'dependencies']
  }),
  readTheDocsSmell({
    id: 120, slug: 'readthedocs-happy-path', name: 'Happy Path', aka: [], category: 'semantics', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Happy Path”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reescreva o caso com uma intenção única, estrutura Arrange–Act–Assert e nomes que expressem o comportamento esperado.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Happy Path', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('descreve e verifica o comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-happy-path', href: 'happy_path.html',
    tags: ['readthedocs', 'semantics']
  }),
  readTheDocsSmell({
    id: 121, slug: 'readthedocs-indecisive', name: 'Indecisive', aka: [], category: 'semantics', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Indecisive”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reescreva o caso com uma intenção única, estrutura Arrange–Act–Assert e nomes que expressem o comportamento esperado.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Indecisive', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('descreve e verifica o comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-indecisive', href: 'indecisive.html',
    tags: ['readthedocs', 'semantics']
  }),
  readTheDocsSmell({
    id: 122, slug: 'readthedocs-multiple-test-conditions', name: 'Multiple Test Conditions', aka: [], category: 'semantics', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Multiple Test Conditions”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reescreva o caso com uma intenção única, estrutura Arrange–Act–Assert e nomes que expressem o comportamento esperado.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Multiple Test Conditions', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('descreve e verifica o comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-multiple-test-conditions', href: 'multiple_test_conditions.html',
    tags: ['readthedocs', 'semantics']
  }),
  readTheDocsSmell({
    id: 123, slug: 'readthedocs-parsed-data', name: 'Parsed Data', aka: [], category: 'semantics', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Parsed Data”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reescreva o caso com uma intenção única, estrutura Arrange–Act–Assert e nomes que expressem o comportamento esperado.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Parsed Data', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('descreve e verifica o comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-parsed-data', href: 'parsed_data.html',
    tags: ['readthedocs', 'semantics']
  }),
  readTheDocsSmell({
    id: 124, slug: 'readthedocs-paranoid', name: 'Paranoid', aka: [], category: 'assertions', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Paranoid”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Substitua verificações genéricas por uma expectativa pequena, explícita e ligada ao comportamento do cenário.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Paranoid', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('verifica o resultado esperado', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-paranoid', href: 'paranoid.html',
    tags: ['readthedocs', 'assertions']
  }),
  readTheDocsSmell({
    id: 125, slug: 'readthedocs-quixotic', name: 'Quixotic', aka: [], category: 'assertions', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Quixotic”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Substitua verificações genéricas por uma expectativa pequena, explícita e ligada ao comportamento do cenário.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Quixotic', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('verifica o resultado esperado', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-quixotic', href: 'quixotic.html',
    tags: ['readthedocs', 'assertions']
  }),
  readTheDocsSmell({
    id: 126, slug: 'readthedocs-rotten-green-test', name: 'Rotten Green Test', aka: [], category: 'assertions', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Rotten Green Test”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Substitua verificações genéricas por uma expectativa pequena, explícita e ligada ao comportamento do cenário.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Rotten Green Test', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('verifica o resultado esperado', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-rotten-green-test', href: 'rotten_green_test.html',
    tags: ['readthedocs', 'assertions']
  }),
  readTheDocsSmell({
    id: 127, slug: 'readthedocs-skip-rotten-green-test', name: 'Skip Rotten Green Test', aka: [], category: 'assertions', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Skip Rotten Green Test”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Substitua verificações genéricas por uma expectativa pequena, explícita e ligada ao comportamento do cenário.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Skip Rotten Green Test', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('verifica o resultado esperado', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-skip-rotten-green-test', href: 'skip_rotten_green_test.html',
    tags: ['readthedocs', 'assertions']
  }),
  readTheDocsSmell({
    id: 128, slug: 'readthedocs-tangential', name: 'Tangential', aka: [], category: 'semantics', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Tangential”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reescreva o caso com uma intenção única, estrutura Arrange–Act–Assert e nomes que expressem o comportamento esperado.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Tangential', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('descreve e verifica o comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-tangential', href: 'tangential.html',
    tags: ['readthedocs', 'semantics']
  }),
  readTheDocsSmell({
    id: 129, slug: 'readthedocs-test-by-number', name: 'Test By Number', aka: [], category: 'assertions', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Test By Number”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Substitua verificações genéricas por uma expectativa pequena, explícita e ligada ao comportamento do cenário.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Test By Number', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('verifica o resultado esperado', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-test-by-number', href: 'test_by_number.html',
    tags: ['readthedocs', 'assertions']
  }),
  readTheDocsSmell({
    id: 130, slug: 'readthedocs-the-ugly-mirror', name: 'The Ugly Mirror', aka: [], category: 'semantics', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “The Ugly Mirror”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reescreva o caso com uma intenção única, estrutura Arrange–Act–Assert e nomes que expressem o comportamento esperado.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('The Ugly Mirror', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('descreve e verifica o comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-the-ugly-mirror', href: 'the_ugly_mirror.html',
    tags: ['readthedocs', 'semantics']
  }),
  readTheDocsSmell({
    id: 131, slug: 'readthedocs-mock-everything', name: 'Mock Everything', aka: [], category: 'semantics', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Mock Everything”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reescreva o caso com uma intenção única, estrutura Arrange–Act–Assert e nomes que expressem o comportamento esperado.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Mock Everything', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('descreve e verifica o comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-mock-everything', href: 'mock_everything.html',
    tags: ['readthedocs', 'semantics']
  }),
  readTheDocsSmell({
    id: 132, slug: 'readthedocs-excessive-mocking', name: 'Excessive Mocking', aka: [], category: 'semantics', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Excessive Mocking”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reescreva o caso com uma intenção única, estrutura Arrange–Act–Assert e nomes que expressem o comportamento esperado.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Excessive Mocking', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('descreve e verifica o comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-excessive-mocking', href: 'excessive_mocking.html',
    tags: ['readthedocs', 'semantics']
  }),
  readTheDocsSmell({
    id: 133, slug: 'readthedocs-mocking-framework', name: 'Mocking a Mocking Framework', aka: [], category: 'semantics', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Mocking a Mocking Framework”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reescreva o caso com uma intenção única, estrutura Arrange–Act–Assert e nomes que expressem o comportamento esperado.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Mocking a Mocking Framework', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('descreve e verifica o comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-mocking-framework', href: 'mocking_framework.html',
    tags: ['readthedocs', 'semantics']
  }),
  readTheDocsSmell({
    id: 134, slug: 'readthedocs-remote-control-mocking', name: 'Remote Control Mocking', aka: [], category: 'semantics', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Remote Control Mocking”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reescreva o caso com uma intenção única, estrutura Arrange–Act–Assert e nomes que expressem o comportamento esperado.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Remote Control Mocking', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('descreve e verifica o comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-remote-control-mocking', href: 'remote_control_mocking.html',
    tags: ['readthedocs', 'semantics']
  }),
  readTheDocsSmell({
    id: 135, slug: 'readthedocs-blethery-prefixes', name: 'Blethery Prefixes', aka: [], category: 'semantics', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Blethery Prefixes”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reescreva o caso com uma intenção única, estrutura Arrange–Act–Assert e nomes que expressem o comportamento esperado.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Blethery Prefixes', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('descreve e verifica o comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-blethery-prefixes', href: 'blethery_prefixes.html',
    tags: ['readthedocs', 'semantics']
  }),
  readTheDocsSmell({
    id: 136, slug: 'readthedocs-constant-actual-parameter-value', name: 'Constant Actual Parameter Value', aka: [], category: 'fixtures', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Constant Actual Parameter Value”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reduza o setup ao mínimo necessário, crie dados explícitos por cenário e preserve o isolamento entre testes.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "let shared;\nbeforeEach(() => { shared = createLargeFixture(); });\ntest('Constant Actual Parameter Value', () => expect(subject.execute(shared)).toBeTruthy());", good: "test('executa com dados mínimos', () => {\n  const fixture = createFixture({ needed: true });\n  expect(subject.execute(fixture)).toEqual(expected);\n});", rule: 'readthedocs-constant-actual-parameter-value', href: 'constant_actual_parameter_value.html',
    tags: ['readthedocs', 'fixtures']
  }),
  readTheDocsSmell({
    id: 137, slug: 'readthedocs-empty-method', name: 'Empty Method', aka: [], category: 'execution', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Empty Method”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reescreva o caso com uma intenção única, estrutura Arrange–Act–Assert e nomes que expressem o comportamento esperado.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Empty Method', () => {\n  subject.execute(input);\n});", good: "test('executa e verifica um comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-empty-method', href: 'empty_method.html',
    tags: ['readthedocs', 'execution']
  }),
  readTheDocsSmell({
    id: 138, slug: 'readthedocs-everything-is-property', name: 'Everything Is A Property', aka: [], category: 'semantics', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Everything Is A Property”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reescreva o caso com uma intenção única, estrutura Arrange–Act–Assert e nomes que expressem o comportamento esperado.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Everything Is A Property', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('descreve e verifica o comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-everything-is-property', href: 'everything_is_property.html',
    tags: ['readthedocs', 'semantics']
  }),
  readTheDocsSmell({
    id: 139, slug: 'readthedocs-hidden-test-call', name: 'Hidden Test Call', aka: [], category: 'execution', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Hidden Test Call”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reescreva o caso com uma intenção única, estrutura Arrange–Act–Assert e nomes que expressem o comportamento esperado.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Hidden Test Call', () => {\n  subject.execute(input);\n});", good: "test('executa e verifica um comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-hidden-test-call', href: 'hidden_test_call.html',
    tags: ['readthedocs', 'execution']
  }),
  readTheDocsSmell({
    id: 140, slug: 'readthedocs-long-parameter-list', name: 'Long Parameter List', aka: [], category: 'fixtures', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Long Parameter List”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reduza o setup ao mínimo necessário, crie dados explícitos por cenário e preserve o isolamento entre testes.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "let shared;\nbeforeEach(() => { shared = createLargeFixture(); });\ntest('Long Parameter List', () => expect(subject.execute(shared)).toBeTruthy());", good: "test('executa com dados mínimos', () => {\n  const fixture = createFixture({ needed: true });\n  expect(subject.execute(fixture)).toEqual(expected);\n});", rule: 'readthedocs-long-parameter-list', href: 'long_parameter_list.html',
    tags: ['readthedocs', 'fixtures']
  }),
  readTheDocsSmell({
    id: 141, slug: 'readthedocs-missed-skip-rotten-green-test', name: 'Missed Skip Rotten Green Test', aka: [], category: 'assertions', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Missed Skip Rotten Green Test”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Substitua verificações genéricas por uma expectativa pequena, explícita e ligada ao comportamento do cenário.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Missed Skip Rotten Green Test', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('verifica o resultado esperado', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-missed-skip-rotten-green-test', href: 'missed_skip_rotten_green_test.html',
    tags: ['readthedocs', 'assertions']
  }),
  readTheDocsSmell({
    id: 142, slug: 'readthedocs-mistaken-identity', name: 'Mistaken Identity', aka: [], category: 'semantics', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Mistaken Identity”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reescreva o caso com uma intenção única, estrutura Arrange–Act–Assert e nomes que expressem o comportamento esperado.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Mistaken Identity', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('descreve e verifica o comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-mistaken-identity', href: 'mistaken_identity.html',
    tags: ['readthedocs', 'semantics']
  }),
  readTheDocsSmell({
    id: 143, slug: 'readthedocs-overreferencing', name: 'Overreferencing', aka: [], category: 'semantics', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Overreferencing”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reescreva o caso com uma intenção única, estrutura Arrange–Act–Assert e nomes que expressem o comportamento esperado.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Overreferencing', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('descreve e verifica o comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-overreferencing', href: 'overreferencing.html',
    tags: ['readthedocs', 'semantics']
  }),
  readTheDocsSmell({
    id: 144, slug: 'readthedocs-stop-in-function', name: 'Stop in Function', aka: [], category: 'execution', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Stop in Function”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reescreva o caso com uma intenção única, estrutura Arrange–Act–Assert e nomes que expressem o comportamento esperado.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Stop in Function', () => {\n  subject.execute(input);\n});", good: "test('executa e verifica um comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-stop-in-function', href: 'stop_in_function.html',
    tags: ['readthedocs', 'execution']
  }),
  readTheDocsSmell({
    id: 145, slug: 'readthedocs-test-body-is-somewhere-else', name: 'Test Body Is Somewhere Else', aka: [], category: 'execution', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Test Body Is Somewhere Else”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reescreva o caso com uma intenção única, estrutura Arrange–Act–Assert e nomes que expressem o comportamento esperado.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Test Body Is Somewhere Else', () => {\n  subject.execute(input);\n});", good: "test('executa e verifica um comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-test-body-is-somewhere-else', href: 'test_body_is_somewhere_else.html',
    tags: ['readthedocs', 'execution']
  }),
  readTheDocsSmell({
    id: 146, slug: 'readthedocs-the-stepford-fields', name: 'The Stepford Fields', aka: [], category: 'fixtures', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “The Stepford Fields”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reduza o setup ao mínimo necessário, crie dados explícitos por cenário e preserve o isolamento entre testes.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "let shared;\nbeforeEach(() => { shared = createLargeFixture(); });\ntest('The Stepford Fields', () => expect(subject.execute(shared)).toBeTruthy());", good: "test('executa com dados mínimos', () => {\n  const fixture = createFixture({ needed: true });\n  expect(subject.execute(fixture)).toEqual(expected);\n});", rule: 'readthedocs-the-stepford-fields', href: 'the_stepford_fields.html',
    tags: ['readthedocs', 'fixtures']
  }),
  readTheDocsSmell({
    id: 147, slug: 'readthedocs-time-bomb-data', name: 'Time Bomb Data', aka: [], category: 'dependencies', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'possible',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Time Bomb Data”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Pode tornar o resultado intermitente: datas fixas expiram ou passam a representar um contexto inválido com o tempo. Também dificulta diagnosticar a causa real da falha.',
    refactoring: 'Isole a dependência por stub, fake ou recurso controlado; sincronize por eventos e restaure o estado ao final.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Time Bomb Data', async () => {\n  const result = await subject.execute();\n  expect(result).toBeTruthy();\n});", good: "test('isola a dependência e aguarda o evento', async () => {\n  const result = await subject.execute(dependencyStub);\n  expect(result).toEqual(expected);\n});", rule: 'readthedocs-time-bomb-data', href: 'time_bomb_data.html',
    flakinessProfile: { factors: ["tempo"], explanation: 'Datas fixas expiram ou passam a representar um contexto inválido com o tempo.', example: "test('Time Bomb Data', async () => {\n  const result = await subject.execute();\n  expect(result).toBeTruthy();\n});" },
    tags: ['readthedocs', 'dependencies']
  }),
  readTheDocsSmell({
    id: 148, slug: 'readthedocs-time-bombs', name: 'Time Bombs', aka: [], category: 'dependencies', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'possible',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Time Bombs”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Pode tornar o resultado intermitente: o teste só falha depois de uma data, prazo ou condição temporal específica. Também dificulta diagnosticar a causa real da falha.',
    refactoring: 'Isole a dependência por stub, fake ou recurso controlado; sincronize por eventos e restaure o estado ao final.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Time Bombs', async () => {\n  const result = await subject.execute();\n  expect(result).toBeTruthy();\n});", good: "test('isola a dependência e aguarda o evento', async () => {\n  const result = await subject.execute(dependencyStub);\n  expect(result).toEqual(expected);\n});", rule: 'readthedocs-time-bombs', href: 'time_bombs.html',
    flakinessProfile: { factors: ["tempo"], explanation: 'O teste só falha depois de uma data, prazo ou condição temporal específica.', example: "test('Time Bombs', async () => {\n  const result = await subject.execute();\n  expect(result).toBeTruthy();\n});" },
    tags: ['readthedocs', 'dependencies']
  }),
  readTheDocsSmell({
    id: 149, slug: 'readthedocs-time-sensitive-test', name: 'Time Sensitive Test', aka: [], category: 'dependencies', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'possible',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Time Sensitive Test”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Pode tornar o resultado intermitente: a execução varia conforme fuso, relógio do sistema ou instante da execução. Também dificulta diagnosticar a causa real da falha.',
    refactoring: 'Isole a dependência por stub, fake ou recurso controlado; sincronize por eventos e restaure o estado ao final.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Time Sensitive Test', async () => {\n  const result = await subject.execute();\n  expect(result).toBeTruthy();\n});", good: "test('isola a dependência e aguarda o evento', async () => {\n  const result = await subject.execute(dependencyStub);\n  expect(result).toEqual(expected);\n});", rule: 'readthedocs-time-sensitive-test', href: 'time_sensitive_test.html',
    flakinessProfile: { factors: ["tempo"], explanation: 'A execução varia conforme fuso, relógio do sistema ou instante da execução.', example: "test('Time Sensitive Test', async () => {\n  const result = await subject.execute();\n  expect(result).toBeTruthy();\n});" },
    tags: ['readthedocs', 'dependencies']
  }),
  readTheDocsSmell({
    id: 150, slug: 'readthedocs-unrestricted-imports', name: 'Unrestricted Imports', aka: [], category: 'fixtures', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Unrestricted Imports”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reduza o setup ao mínimo necessário, crie dados explícitos por cenário e preserve o isolamento entre testes.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "let shared;\nbeforeEach(() => { shared = createLargeFixture(); });\ntest('Unrestricted Imports', () => expect(subject.execute(shared)).toBeTruthy());", good: "test('executa com dados mínimos', () => {\n  const fixture = createFixture({ needed: true });\n  expect(subject.execute(fixture)).toEqual(expected);\n});", rule: 'readthedocs-unrestricted-imports', href: 'unrestricted_imports.html',
    tags: ['readthedocs', 'fixtures']
  }),
  readTheDocsSmell({
    id: 151, slug: 'readthedocs-unused-imports', name: 'Unused Imports', aka: [], category: 'fixtures', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Unused Imports”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reduza o setup ao mínimo necessário, crie dados explícitos por cenário e preserve o isolamento entre testes.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "let shared;\nbeforeEach(() => { shared = createLargeFixture(); });\ntest('Unused Imports', () => expect(subject.execute(shared)).toBeTruthy());", good: "test('executa com dados mínimos', () => {\n  const fixture = createFixture({ needed: true });\n  expect(subject.execute(fixture)).toEqual(expected);\n});", rule: 'readthedocs-unused-imports', href: 'unused_imports.html',
    tags: ['readthedocs', 'fixtures']
  }),
  readTheDocsSmell({
    id: 152, slug: 'readthedocs-unused-inputs', name: 'Unused Inputs', aka: [], category: 'semantics', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Unused Inputs”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reescreva o caso com uma intenção única, estrutura Arrange–Act–Assert e nomes que expressem o comportamento esperado.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Unused Inputs', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('descreve e verifica o comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-unused-inputs', href: 'unused_inputs.html',
    tags: ['readthedocs', 'semantics']
  }),
  readTheDocsSmell({
    id: 153, slug: 'readthedocs-complex-teardown', name: 'Complex Teardown', aka: [], category: 'fixtures', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'possible',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Complex Teardown”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Pode tornar o resultado intermitente: limpeza complexa pode terminar fora de ordem e deixar estado para o próximo teste. Também dificulta diagnosticar a causa real da falha.',
    refactoring: 'Reduza o setup ao mínimo necessário, crie dados explícitos por cenário e preserve o isolamento entre testes.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "let shared;\nbeforeEach(() => { shared = createLargeFixture(); });\ntest('Complex Teardown', () => expect(subject.execute(shared)).toBeTruthy());", good: "test('executa com dados mínimos', () => {\n  const fixture = createFixture({ needed: true });\n  expect(subject.execute(fixture)).toEqual(expected);\n});", rule: 'readthedocs-complex-teardown', href: 'complex_teardown.html',
    flakinessProfile: { factors: ["tempo","estado compartilhado"], explanation: 'Limpeza complexa pode terminar fora de ordem e deixar estado para o próximo teste.', example: "let shared;\nbeforeEach(() => { shared = createLargeFixture(); });\ntest('Complex Teardown', () => expect(subject.execute(shared)).toBeTruthy());" },
    tags: ['readthedocs', 'fixtures']
  }),
  readTheDocsSmell({
    id: 154, slug: 'readthedocs-generous-leftovers', name: 'Generous Leftovers', aka: [], category: 'semantics', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'possible',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Generous Leftovers”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Pode tornar o resultado intermitente: artefatos deixados por cenários anteriores podem alterar a entrada dos próximos testes. Também dificulta diagnosticar a causa real da falha.',
    refactoring: 'Reescreva o caso com uma intenção única, estrutura Arrange–Act–Assert e nomes que expressem o comportamento esperado.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Generous Leftovers', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('descreve e verifica o comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-generous-leftovers', href: 'generous_leftovers.html',
    flakinessProfile: { factors: ["estado compartilhado"], explanation: 'Artefatos deixados por cenários anteriores podem alterar a entrada dos próximos testes.', example: "test('Generous Leftovers', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});" },
    tags: ['readthedocs', 'semantics']
  }),
  readTheDocsSmell({
    id: 155, slug: 'readthedocs-shared-state-corruption', name: 'Shared-State Corruption', aka: [], category: 'semantics', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'possible',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Shared-State Corruption”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Pode tornar o resultado intermitente: estado mutável compartilhado faz o resultado depender de quem executou antes. Também dificulta diagnosticar a causa real da falha.',
    refactoring: 'Reescreva o caso com uma intenção única, estrutura Arrange–Act–Assert e nomes que expressem o comportamento esperado.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Shared-State Corruption', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('descreve e verifica o comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-shared-state-corruption', href: 'shared_state_corruption.html',
    flakinessProfile: { factors: ["estado compartilhado","ordem"], explanation: 'Estado mutável compartilhado faz o resultado depender de quem executou antes.', example: "test('Shared-State Corruption', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});" },
    tags: ['readthedocs', 'semantics']
  }),
  readTheDocsSmell({
    id: 156, slug: 'readthedocs-teardown-only-test', name: 'Teardown Only Test', aka: [], category: 'fixtures', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'possible',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Teardown Only Test”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Pode tornar o resultado intermitente: a limpeza isolada pode alterar recursos usados por outros cenários. Também dificulta diagnosticar a causa real da falha.',
    refactoring: 'Reduza o setup ao mínimo necessário, crie dados explícitos por cenário e preserve o isolamento entre testes.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "let shared;\nbeforeEach(() => { shared = createLargeFixture(); });\ntest('Teardown Only Test', () => expect(subject.execute(shared)).toBeTruthy());", good: "test('executa com dados mínimos', () => {\n  const fixture = createFixture({ needed: true });\n  expect(subject.execute(fixture)).toEqual(expected);\n});", rule: 'readthedocs-teardown-only-test', href: 'teardown_only_test.html',
    flakinessProfile: { factors: ["estado compartilhado"], explanation: 'A limpeza isolada pode alterar recursos usados por outros cenários.', example: "let shared;\nbeforeEach(() => { shared = createLargeFixture(); });\ntest('Teardown Only Test', () => expect(subject.execute(shared)).toBeTruthy());" },
    tags: ['readthedocs', 'fixtures']
  }),
  readTheDocsSmell({
    id: 157, slug: 'readthedocs-the-painful-clean-up', name: 'The Painful Clean-Up', aka: [], category: 'fixtures', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'possible',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “The Painful Clean-Up”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Pode tornar o resultado intermitente: limpezas manuais e extensas são fáceis de executar parcialmente ou tarde demais. Também dificulta diagnosticar a causa real da falha.',
    refactoring: 'Reduza o setup ao mínimo necessário, crie dados explícitos por cenário e preserve o isolamento entre testes.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "let shared;\nbeforeEach(() => { shared = createLargeFixture(); });\ntest('The Painful Clean-Up', () => expect(subject.execute(shared)).toBeTruthy());", good: "test('executa com dados mínimos', () => {\n  const fixture = createFixture({ needed: true });\n  expect(subject.execute(fixture)).toEqual(expected);\n});", rule: 'readthedocs-the-painful-clean-up', href: 'the_painful_clean_up.html',
    flakinessProfile: { factors: ["tempo","estado compartilhado"], explanation: 'Limpezas manuais e extensas são fáceis de executar parcialmente ou tarde demais.', example: "let shared;\nbeforeEach(() => { shared = createLargeFixture(); });\ntest('The Painful Clean-Up', () => expect(subject.execute(shared)).toBeTruthy());" },
    tags: ['readthedocs', 'fixtures']
  }),
  readTheDocsSmell({
    id: 158, slug: 'readthedocs-the-soloist', name: 'The Soloist', aka: [], category: 'fixtures', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “The Soloist”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reduza o setup ao mínimo necessário, crie dados explícitos por cenário e preserve o isolamento entre testes.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "let shared;\nbeforeEach(() => { shared = createLargeFixture(); });\ntest('The Soloist', () => expect(subject.execute(shared)).toBeTruthy());", good: "test('executa com dados mínimos', () => {\n  const fixture = createFixture({ needed: true });\n  expect(subject.execute(fixture)).toEqual(expected);\n});", rule: 'readthedocs-the-soloist', href: 'the_soloist.html',
    tags: ['readthedocs', 'fixtures']
  }),
  readTheDocsSmell({
    id: 159, slug: 'readthedocs-exception-catch-throw', name: 'Exception Catch/Throw', aka: [], category: 'semantics', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Exception Catch/Throw”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reescreva o caso com uma intenção única, estrutura Arrange–Act–Assert e nomes que expressem o comportamento esperado.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Exception Catch/Throw', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('descreve e verifica o comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-exception-catch-throw', href: 'exception_catch_throw.html',
    tags: ['readthedocs', 'semantics']
  }),
  readTheDocsSmell({
    id: 160, slug: 'readthedocs-exception-catching-throwing', name: 'Exception Catching Throwing', aka: [], category: 'semantics', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Exception Catching Throwing”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reescreva o caso com uma intenção única, estrutura Arrange–Act–Assert e nomes que expressem o comportamento esperado.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Exception Catching Throwing', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('descreve e verifica o comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-exception-catching-throwing', href: 'exception_catching_throwing.html',
    tags: ['readthedocs', 'semantics']
  }),
  readTheDocsSmell({
    id: 161, slug: 'readthedocs-expecting-exceptions-anywhere', name: 'Expecting Exceptions Anywhere', aka: [], category: 'semantics', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Expecting Exceptions Anywhere”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reescreva o caso com uma intenção única, estrutura Arrange–Act–Assert e nomes que expressem o comportamento esperado.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Expecting Exceptions Anywhere', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('descreve e verifica o comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-expecting-exceptions-anywhere', href: 'expecting_exceptions_anywhere.html',
    tags: ['readthedocs', 'semantics']
  }),
  readTheDocsSmell({
    id: 162, slug: 'readthedocs-issues-in-exception-handling', name: 'Issues In Exception Handling', aka: [], category: 'semantics', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Issues In Exception Handling”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reescreva o caso com uma intenção única, estrutura Arrange–Act–Assert e nomes que expressem o comportamento esperado.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Issues In Exception Handling', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('descreve e verifica o comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-issues-in-exception-handling', href: 'issues_in_exception_handling.html',
    tags: ['readthedocs', 'semantics']
  }),
  readTheDocsSmell({
    id: 163, slug: 'readthedocs-excessive-setup', name: 'Excessive Setup', aka: [], category: 'fixtures', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Excessive Setup”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reduza o setup ao mínimo necessário, crie dados explícitos por cenário e preserve o isolamento entre testes.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "let shared;\nbeforeEach(() => { shared = createLargeFixture(); });\ntest('Excessive Setup', () => expect(subject.execute(shared)).toBeTruthy());", good: "test('executa com dados mínimos', () => {\n  const fixture = createFixture({ needed: true });\n  expect(subject.execute(fixture)).toEqual(expected);\n});", rule: 'readthedocs-excessive-setup', href: 'excessive_setup.html',
    tags: ['readthedocs', 'fixtures']
  }),
  readTheDocsSmell({
    id: 164, slug: 'readthedocs-factories-unnecessary-data', name: 'Factories That Contain Unnecessary Data', aka: [], category: 'semantics', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Factories That Contain Unnecessary Data”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reescreva o caso com uma intenção única, estrutura Arrange–Act–Assert e nomes que expressem o comportamento esperado.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Factories That Contain Unnecessary Data', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('descreve e verifica o comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-factories-unnecessary-data', href: 'factories_unnecessary_data.html',
    tags: ['readthedocs', 'semantics']
  }),
  readTheDocsSmell({
    id: 165, slug: 'readthedocs-noisy-logging', name: 'Noisy Logging', aka: [], category: 'semantics', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Noisy Logging”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reescreva o caso com uma intenção única, estrutura Arrange–Act–Assert e nomes que expressem o comportamento esperado.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Noisy Logging', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('descreve e verifica o comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-noisy-logging', href: 'noisy_logging.html',
    tags: ['readthedocs', 'semantics']
  }),
  readTheDocsSmell({
    id: 166, slug: 'readthedocs-noisy-setup', name: 'Noisy Setup', aka: [], category: 'fixtures', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Noisy Setup”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reduza o setup ao mínimo necessário, crie dados explícitos por cenário e preserve o isolamento entre testes.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "let shared;\nbeforeEach(() => { shared = createLargeFixture(); });\ntest('Noisy Setup', () => expect(subject.execute(shared)).toBeTruthy());", good: "test('executa com dados mínimos', () => {\n  const fixture = createFixture({ needed: true });\n  expect(subject.execute(fixture)).toEqual(expected);\n});", rule: 'readthedocs-noisy-setup', href: 'noisy_setup.html',
    tags: ['readthedocs', 'fixtures']
  }),
  readTheDocsSmell({
    id: 167, slug: 'readthedocs-obscure-in-line-setup', name: 'Obscure In-Line Setup', aka: [], category: 'fixtures', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Obscure In-Line Setup”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reduza o setup ao mínimo necessário, crie dados explícitos por cenário e preserve o isolamento entre testes.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "let shared;\nbeforeEach(() => { shared = createLargeFixture(); });\ntest('Obscure In-Line Setup', () => expect(subject.execute(shared)).toBeTruthy());", good: "test('executa com dados mínimos', () => {\n  const fixture = createFixture({ needed: true });\n  expect(subject.execute(fixture)).toEqual(expected);\n});", rule: 'readthedocs-obscure-in-line-setup', href: 'obscure_in_line_setup.html',
    tags: ['readthedocs', 'fixtures']
  }),
  readTheDocsSmell({
    id: 168, slug: 'readthedocs-oversharing-on-setup', name: 'Oversharing On Setup', aka: [], category: 'fixtures', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Oversharing On Setup”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reduza o setup ao mínimo necessário, crie dados explícitos por cenário e preserve o isolamento entre testes.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "let shared;\nbeforeEach(() => { shared = createLargeFixture(); });\ntest('Oversharing On Setup', () => expect(subject.execute(shared)).toBeTruthy());", good: "test('executa com dados mínimos', () => {\n  const fixture = createFixture({ needed: true });\n  expect(subject.execute(fixture)).toEqual(expected);\n});", rule: 'readthedocs-oversharing-on-setup', href: 'oversharing_on_setup.html',
    tags: ['readthedocs', 'fixtures']
  }),
  readTheDocsSmell({
    id: 169, slug: 'readthedocs-refused-bequest', name: 'Refused Bequest', aka: [], category: 'fixtures', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Refused Bequest”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reduza o setup ao mínimo necessário, crie dados explícitos por cenário e preserve o isolamento entre testes.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "let shared;\nbeforeEach(() => { shared = createLargeFixture(); });\ntest('Refused Bequest', () => expect(subject.execute(shared)).toBeTruthy());", good: "test('executa com dados mínimos', () => {\n  const fixture = createFixture({ needed: true });\n  expect(subject.execute(fixture)).toEqual(expected);\n});", rule: 'readthedocs-refused-bequest', href: 'refused_bequest.html',
    tags: ['readthedocs', 'fixtures']
  }),
  readTheDocsSmell({
    id: 170, slug: 'readthedocs-share-the-world', name: 'Share The World', aka: [], category: 'fixtures', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'possible',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Share The World”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Pode tornar o resultado intermitente: um fixture grande e compartilhado cria interações ocultas entre cenários. Também dificulta diagnosticar a causa real da falha.',
    refactoring: 'Reduza o setup ao mínimo necessário, crie dados explícitos por cenário e preserve o isolamento entre testes.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "let shared;\nbeforeEach(() => { shared = createLargeFixture(); });\ntest('Share The World', () => expect(subject.execute(shared)).toBeTruthy());", good: "test('executa com dados mínimos', () => {\n  const fixture = createFixture({ needed: true });\n  expect(subject.execute(fixture)).toEqual(expected);\n});", rule: 'readthedocs-share-the-world', href: 'share_the_world.html',
    flakinessProfile: { factors: ["estado compartilhado"], explanation: 'Um fixture grande e compartilhado cria interações ocultas entre cenários.', example: "let shared;\nbeforeEach(() => { shared = createLargeFixture(); });\ntest('Share The World', () => expect(subject.execute(shared)).toBeTruthy());" },
    tags: ['readthedocs', 'fixtures']
  }),
  readTheDocsSmell({
    id: 171, slug: 'readthedocs-test-maverick', name: 'Test Maverick', aka: [], category: 'semantics', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Test Maverick”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reescreva o caso com uma intenção única, estrutura Arrange–Act–Assert e nomes que expressem o comportamento esperado.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Test Maverick', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('descreve e verifica o comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-test-maverick', href: 'test_maverick.html',
    tags: ['readthedocs', 'semantics']
  }),
  readTheDocsSmell({
    id: 172, slug: 'readthedocs-test-objects-initialized-in-a-describe-block', name: 'Test Objects Initialized In A Describe Block', aka: [], category: 'fixtures', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'possible',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Test Objects Initialized In A Describe Block”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Pode tornar o resultado intermitente: o mesmo objeto é reutilizado por testes e mutações vazam entre cenários. Também dificulta diagnosticar a causa real da falha.',
    refactoring: 'Reduza o setup ao mínimo necessário, crie dados explícitos por cenário e preserve o isolamento entre testes.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "let shared;\nbeforeEach(() => { shared = createLargeFixture(); });\ntest('Test Objects Initialized In A Describe Block', () => expect(subject.execute(shared)).toBeTruthy());", good: "test('executa com dados mínimos', () => {\n  const fixture = createFixture({ needed: true });\n  expect(subject.execute(fixture)).toEqual(expected);\n});", rule: 'readthedocs-test-objects-initialized-in-a-describe-block', href: 'test_objects_initialized_in_a_describe_block.html',
    flakinessProfile: { factors: ["estado compartilhado","ordem"], explanation: 'O mesmo objeto é reutilizado por testes e mutações vazam entre cenários.', example: "let shared;\nbeforeEach(() => { shared = createLargeFixture(); });\ntest('Test Objects Initialized In A Describe Block', () => expect(subject.execute(shared)).toBeTruthy());" },
    tags: ['readthedocs', 'fixtures']
  }),
  readTheDocsSmell({
    id: 173, slug: 'readthedocs-test-objects-initialized-in-each-test', name: 'Test Objects Initialized In Each Test', aka: [], category: 'fixtures', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Test Objects Initialized In Each Test”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reduza o setup ao mínimo necessário, crie dados explícitos por cenário e preserve o isolamento entre testes.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "let shared;\nbeforeEach(() => { shared = createLargeFixture(); });\ntest('Test Objects Initialized In Each Test', () => expect(subject.execute(shared)).toBeTruthy());", good: "test('executa com dados mínimos', () => {\n  const fixture = createFixture({ needed: true });\n  expect(subject.execute(fixture)).toEqual(expected);\n});", rule: 'readthedocs-test-objects-initialized-in-each-test', href: 'test_objects_initialized_in_each_test.html',
    tags: ['readthedocs', 'fixtures']
  }),
  readTheDocsSmell({
    id: 174, slug: 'readthedocs-test-setup-is-somewhere-else', name: 'Test Setup Is Somewhere Else', aka: [], category: 'fixtures', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Test Setup Is Somewhere Else”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Reduza o setup ao mínimo necessário, crie dados explícitos por cenário e preserve o isolamento entre testes.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "let shared;\nbeforeEach(() => { shared = createLargeFixture(); });\ntest('Test Setup Is Somewhere Else', () => expect(subject.execute(shared)).toBeTruthy());", good: "test('executa com dados mínimos', () => {\n  const fixture = createFixture({ needed: true });\n  expect(subject.execute(fixture)).toEqual(expected);\n});", rule: 'readthedocs-test-setup-is-somewhere-else', href: 'test_setup_is_somewhere_else.html',
    tags: ['readthedocs', 'fixtures']
  }),
  readTheDocsSmell({
    id: 175, slug: 'readthedocs-using-fixtures', name: 'Using Fixtures', aka: [], category: 'fixtures', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'possible',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Using Fixtures”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Pode tornar o resultado intermitente: fixtures compartilhadas e grandes podem carregar estado inesperado entre testes. Também dificulta diagnosticar a causa real da falha.',
    refactoring: 'Reduza o setup ao mínimo necessário, crie dados explícitos por cenário e preserve o isolamento entre testes.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "let shared;\nbeforeEach(() => { shared = createLargeFixture(); });\ntest('Using Fixtures', () => expect(subject.execute(shared)).toBeTruthy());", good: "test('executa com dados mínimos', () => {\n  const fixture = createFixture({ needed: true });\n  expect(subject.execute(fixture)).toEqual(expected);\n});", rule: 'readthedocs-using-fixtures', href: 'using_fixtures.html',
    flakinessProfile: { factors: ["estado compartilhado"], explanation: 'Fixtures compartilhadas e grandes podem carregar estado inesperado entre testes.', example: "let shared;\nbeforeEach(() => { shared = createLargeFixture(); });\ntest('Using Fixtures', () => expect(subject.execute(shared)).toBeTruthy());" },
    tags: ['readthedocs', 'fixtures']
  }),
  readTheDocsSmell({
    id: 176, slug: 'readthedocs-layer-testing', name: 'Layer Testing', aka: [], category: 'semantics', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'possible',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Layer Testing”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Pode tornar o resultado intermitente: múltiplas camadas e dependências indiretas tornam o cenário sujeito a latência e falhas externas. Também dificulta diagnosticar a causa real da falha.',
    refactoring: 'Reescreva o caso com uma intenção única, estrutura Arrange–Act–Assert e nomes que expressem o comportamento esperado.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Layer Testing', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('descreve e verifica o comportamento', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-layer-testing', href: 'layer_testing.html',
    flakinessProfile: { factors: ["ambiente externo","tempo"], explanation: 'Múltiplas camadas e dependências indiretas tornam o cenário sujeito a latência e falhas externas.', example: "test('Layer Testing', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});" },
    tags: ['readthedocs', 'semantics']
  }),
  readTheDocsSmell({
    id: 177, slug: 'readthedocs-asserting-pre-condition-and-invariants', name: 'Asserting Pre-Condition And Invariants', aka: [], category: 'assertions', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Asserting Pre-Condition And Invariants”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Substitua verificações genéricas por uma expectativa pequena, explícita e ligada ao comportamento do cenário.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Asserting Pre-Condition And Invariants', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('verifica o resultado esperado', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-asserting-pre-condition-and-invariants', href: 'asserting_pre_condition_and_invariants.html',
    tags: ['readthedocs', 'assertions']
  }),
  readTheDocsSmell({
    id: 178, slug: 'readthedocs-assertion-diversion', name: 'Assertion Diversion', aka: [], category: 'assertions', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Assertion Diversion”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Substitua verificações genéricas por uma expectativa pequena, explícita e ligada ao comportamento do cenário.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Assertion Diversion', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('verifica o resultado esperado', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-assertion-diversion', href: 'assertion_diversion.html',
    tags: ['readthedocs', 'assertions']
  }),
  readTheDocsSmell({
    id: 179, slug: 'readthedocs-brittle-assertion', name: 'Brittle-Assertion', aka: [], category: 'assertions', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Brittle-Assertion”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Substitua verificações genéricas por uma expectativa pequena, explícita e ligada ao comportamento do cenário.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Brittle-Assertion', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('verifica o resultado esperado', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-brittle-assertion', href: 'brittle_assertion.html',
    tags: ['readthedocs', 'assertions']
  }),
  readTheDocsSmell({
    id: 180, slug: 'readthedocs-broad-assertion', name: 'Broad Assertion', aka: [], category: 'assertions', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Broad Assertion”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Substitua verificações genéricas por uma expectativa pequena, explícita e ligada ao comportamento do cenário.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Broad Assertion', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('verifica o resultado esperado', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-broad-assertion', href: 'broad_assertion.html',
    tags: ['readthedocs', 'assertions']
  }),
  readTheDocsSmell({
    id: 181, slug: 'readthedocs-fantasy-tests', name: 'Fantasy Tests', aka: [], category: 'assertions', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Fantasy Tests”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Substitua verificações genéricas por uma expectativa pequena, explícita e ligada ao comportamento do cenário.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Fantasy Tests', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('verifica o resultado esperado', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-fantasy-tests', href: 'fantasy_tests.html',
    tags: ['readthedocs', 'assertions']
  }),
  readTheDocsSmell({
    id: 182, slug: 'readthedocs-invisible-assertions', name: 'Invisible Assertions', aka: [], category: 'assertions', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Invisible Assertions”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Substitua verificações genéricas por uma expectativa pequena, explícita e ligada ao comportamento do cenário.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Invisible Assertions', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('verifica o resultado esperado', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-invisible-assertions', href: 'invisible_assertions.html',
    tags: ['readthedocs', 'assertions']
  }),
  readTheDocsSmell({
    id: 183, slug: 'readthedocs-missed-fail-rotten-green-test', name: 'Missed Fail Rotten Green Test', aka: [], category: 'assertions', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Missed Fail Rotten Green Test”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Substitua verificações genéricas por uma expectativa pequena, explícita e ligada ao comportamento do cenário.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Missed Fail Rotten Green Test', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('verifica o resultado esperado', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-missed-fail-rotten-green-test', href: 'missed_fail_rotten_green_test.html',
    tags: ['readthedocs', 'assertions']
  }),
  readTheDocsSmell({
    id: 184, slug: 'readthedocs-missing-assertions', name: 'Missing Assertions', aka: [], category: 'assertions', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Missing Assertions”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Substitua verificações genéricas por uma expectativa pequena, explícita e ligada ao comportamento do cenário.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Missing Assertions', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('verifica o resultado esperado', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-missing-assertions', href: 'missing_assertions.html',
    tags: ['readthedocs', 'assertions']
  }),
  readTheDocsSmell({
    id: 185, slug: 'readthedocs-over-exertion-assertion', name: 'Over Exertion Assertion', aka: [], category: 'assertions', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Over Exertion Assertion”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Substitua verificações genéricas por uma expectativa pequena, explícita e ligada ao comportamento do cenário.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Over Exertion Assertion', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('verifica o resultado esperado', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-over-exertion-assertion', href: 'over_exertion_assertion.html',
    tags: ['readthedocs', 'assertions']
  }),
  readTheDocsSmell({
    id: 186, slug: 'readthedocs-returning-assertion', name: 'Returning Assertion', aka: [], category: 'assertions', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Returning Assertion”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Substitua verificações genéricas por uma expectativa pequena, explícita e ligada ao comportamento do cenário.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Returning Assertion', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('verifica o resultado esperado', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-returning-assertion', href: 'returning_assertion.html',
    tags: ['readthedocs', 'assertions']
  }),
  readTheDocsSmell({
    id: 187, slug: 'readthedocs-self-test', name: 'Self-Test', aka: [], category: 'assertions', impact: ['Manutenibilidade', 'Confiabilidade'], flakiness: 'none',
    definition: 'Padrão de teste descrito no catálogo ReadTheDocs como “Self-Test”. Ele introduz uma estrutura, dependência ou verificação que torna o caso menos claro, isolado ou confiável.',
    consequences: 'Reduz a clareza e a confiabilidade da suíte, elevando o custo para diagnosticar falhas e manter o cenário.',
    refactoring: 'Substitua verificações genéricas por uma expectativa pequena, explícita e ligada ao comportamento do cenário.',
    manifestation: 'A presença do padrão pode ser localizada no AST de callbacks de teste, hooks ou declarações relacionadas ao cenário.',
    bad: "test('Self-Test', () => {\n  const result = subject.execute(input);\n  expect(result).toBeTruthy();\n});", good: "test('verifica o resultado esperado', () => {\n  expect(subject.execute(input)).toEqual(expected);\n});", rule: 'readthedocs-self-test', href: 'self_test.html',
    tags: ['readthedocs', 'assertions']
  })
];


const ACADEMIC_SOURCES_BY_SMELL: Record<string, LiteratureSource[]> = {
  // Catálogo Gabriel/Meneses
  'slow-test': [DISSERTATION],
  'anonymous-test': [DISSERTATION],
  'conditional-test-logic': [DISSERTATION],
  'duplicate-assert': [DISSERTATION],
  'exception-handling': [DISSERTATION],
  'magic-number-magic-values': [DISSERTATION],
  'overcommented-test': [DISSERTATION],
  'sleepy-test-stinky-synchronization': [DISSERTATION],
  'suboptimal-assertion': [DISSERTATION],
  'unknown-test': [DISSERTATION],
  'verbose-test': [DISSERTATION],

  // SNUTS.js
  'comments-only-test': [SNUTS],
  'complex-snapshot-test': [SNUTS],
  'general-fixture': [SNUTS],
  'identical-test-description': [SNUTS],
  'non-functional-statement': [SNUTS],
  'readthedocs-only-test': [SNUTS],
  'sensitive-equality': [SNUTS],
  'test-without-description': [SNUTS],
  'transcripting-test': [SNUTS],
  'verify-in-setup': [SNUTS],

  // Steel
  'assertion-roulette': [STEEL],
  'constructor-initialization': [STEEL],
  'empty-test': [STEEL],
  'ignored-disabled-test': [STEEL],
  'redundant-assertion': [STEEL],
};


function openCatalogSource(page: string, href: string): LiteratureSource {
  return {
    ...OPEN_CATALOG,
    title: `The Open Catalog of Test Smells — ${page}`,
    url: new URL(href, OPEN_CATALOG_BASE_URL).href,
  };
}

const OPEN_CATALOG_SOURCES_BY_SMELL: Record<string, LiteratureSource[]> = {
  'assertion-free-test': [openCatalogSource('Assertion-Free', 'Issues%20in%20test%20steps/Issues%20in%20assertions/Assertion-Free.html')],
  'missing-assertions-line-hitter': [openCatalogSource('Missing Assertions', 'Issues%20in%20test%20steps/Issues%20in%20assertions/Missing%20Assertions.html')],
  'over-checking-nitpicker': [openCatalogSource('Over-Checking', 'Issues%20in%20test%20steps/Issues%20in%20assertions/Over-Checking.html')],
  'calculating-expected-results-on-the-fly': [openCatalogSource('Second Guess The Calculation', 'Issues%20in%20test%20steps/Issues%20in%20assertions/Second%20Guess%20The%20Calculation.html')],
  'under-the-carpet-assertion': [openCatalogSource('Under-The-Carpet Assertion', 'Issues%20in%20test%20steps/Issues%20in%20assertions/Under-The-Carpet%20Assertion.html')],
  'premature-assertions': [openCatalogSource('Premature Assertions', 'Issues%20in%20test%20steps/Issues%20in%20assertions/Premature%20Assertions.html')],
  'equality-sledgehammer-assertion': [openCatalogSource('Equality Sledgehammer Assertion', 'Issues%20in%20test%20steps/Issues%20in%20assertions/Equality%20Sledgehammer%20Assertion.html')],
  'vague-header-setup': [openCatalogSource('Vague Header Setup', 'Issues%20in%20test%20steps/Issues%20in%20setup/Vague%20Header%20Setup.html')],
  'curdled-test-fixtures': [openCatalogSource('Curdled Test Fixtures', 'Issues%20in%20test%20steps/Issues%20in%20setup/Curdled%20Test%20Fixtures.html')],
  'excessive-inline-setup': [openCatalogSource('Excessive Inline Setup', 'Issues%20in%20test%20steps/Issues%20in%20setup/Excessive%20Inline%20Setup.html')],
  'empty-shared-fixture': [openCatalogSource('Empty Shared-Fixture', 'Issues%20in%20test%20steps/Issues%20in%20setup/Empty%20Shared-Fixture.html')],
  'hidden-test-data-bury-the-lede': [openCatalogSource('Bury The Lede', 'Issues%20in%20test%20steps/Issues%20in%20setup/Bury%20The%20Lede.html')],
  'the-mother-hen': [openCatalogSource('The Mother Hen', 'Issues%20in%20test%20steps/Issues%20in%20setup/The%20Mother%20Hen.html')],
  'unused-definition': [openCatalogSource('Unused Definition', 'Issues%20in%20test%20steps/Issues%20in%20setup/Unused%20Definition.html')],
  'resource-leakage-missing-teardown': [openCatalogSource('Resource Leakage', 'Dependencies/External%20dependencies/Resource%20Leakage.html')],
  'mystery-guest': [openCatalogSource('Mystery Guest', 'Dependencies/External%20dependencies/Mystery%20Guest.html')],
  'chain-gang-dependent-test': [openCatalogSource('Chain Gang', 'Dependencies/Dependencies%20among%20tests/Chain%20Gang.html')],
  'test-pollution-environmental-vandal': [openCatalogSource('Test Pollution', 'Dependencies/Dependencies%20among%20tests/Test%20Pollution.html')],
  'context-sensitivity': [openCatalogSource('Context Sensitivity', 'Dependencies/External%20dependencies/Context%20Sensitivity.html')],
  'local-only-testing-the-local-hero': [openCatalogSource('The Local Hero', 'Dependencies/External%20dependencies/The%20Local%20Hero.html')],
  'web-browsing-test-hidden-integration': [openCatalogSource('Web-Browsing Test', 'Dependencies/External%20dependencies/Web-Browsing%20Test.html')],
  'counting-on-spies': [openCatalogSource('Counting On Spies', 'Dependencies/External%20dependencies/Counting%20On%20Spies.html')],
  'middle-man': [openCatalogSource('Middle Man', 'Dependencies/External%20dependencies/Middle%20Man.html')],
  'programming-paradigms-blend': [openCatalogSource('Programming Paradigms Blend', 'Dependencies/External%20dependencies/Programming%20Paradigms%20Blend.html')],
  'duplicate-test-code-copy-paste': [openCatalogSource('Duplicate Test Code', 'Code%20related/Code%20duplication/Duplicate%20Test%20Code.html')],
  'long-test': [openCatalogSource('Long Test', 'Code%20related/Complex%20-%20Hard%20to%20understand/Long%20Test.html')],
  'complicated-logic-in-tests': [openCatalogSource('Complicated Logic In Tests', 'Code%20related/Complex%20-%20Hard%20to%20understand/Complicated%20Logic%20In%20Tests.html')],
  'hardcoded-environment-configuration': [openCatalogSource('Hardcoded Environment Configuration', 'Code%20related/Complex%20-%20Hard%20to%20understand/Hardcoded%20Environment%20Configuration.html')],
  'over-refactoring-overly-dry-tests': [openCatalogSource('Overly Dry Tests', 'Code%20related/Complex%20-%20Hard%20to%20understand/Overly%20Dry%20Tests.html')],
  'commented-out-test': [openCatalogSource('Commented Test', 'Issues%20in%20test%20steps/Issues%20in%20assertions/Commented%20Test.html')],
  'flaky-test-intermittent-failures': [openCatalogSource('Flaky Test', 'Code%20related/Violating%20coding%20best%20practices/Flaky%20Test.html')],
  'chatty-logging-print-statement': [openCatalogSource('Chatty Logging', 'Test%20execution%20-%20behavior/Other%20test%20execution%20-%20behavior/Chatty%20Logging.html')],
  'interactive-test': [openCatalogSource('Interactive Test', 'Test%20execution%20-%20behavior/Other%20test%20execution%20-%20behavior/Interactive%20Test.html')],
  'premature-teardown': [openCatalogSource('Improper Clean Up After Tests Have Been Run', 'Issues%20in%20test%20steps/Issues%20in%20teardown/Improper%20Clean%20Up%20After%20Tests%20Have%20Been%20Run.html')],
  'unsound-test-false-positive-negative': [openCatalogSource('Test Tautology', 'Code%20related/In%20association%20with%20production%20code/Test%20Tautology.html')],
  'the-silent-catcher-empty-catch': [openCatalogSource('The Silent Catcher', 'Issues%20in%20test%20steps/Issues%20in%20exception%20handling/The%20Silent%20Catcher.html')],
  'eager-test': [openCatalogSource('Eager Test', 'Test%20semantic-logic/Testing%20many%20things/Eager%20Test.html')],
  'lazy-test': [openCatalogSource('Lazy Test', 'Test%20semantic-logic/Other%20test%20logic%20related/Lazy%20Test.html')],
  'what-are-we-testing-poor-naming': [openCatalogSource('What Are We Testing?', 'Code%20related/Complex%20-%20Hard%20to%20understand/What%20Are%20We%20Testing.html')],
  'testing-private-implementation': [openCatalogSource('Testing Internal Implementation', 'Test%20semantic-logic/Other%20test%20logic%20related/Testing%20Internal%20Implementation.html')],
  'second-class-citizens': [openCatalogSource('Treating Test Code As A Second Class Citizen', 'Code%20related/Violating%20coding%20best%20practices/Treating%20Test%20Code%20As%20A%20Second%20Class%20Citizen.html')],
};

function mergeSources(existing: LiteratureSource[] | undefined, additional: LiteratureSource[] | undefined) {
  return [...(existing ?? []), ...(additional ?? [])].filter(
    (source, index, sources) => sources.findIndex((candidate) => candidate.authors === source.authors && candidate.year === source.year && candidate.title === source.title) === index,
  );
}

export const TEST_SMELLS: TestSmell[] = RAW_TEST_SMELLS.map((smell) => ({
  ...smell,
  consequences: smell.consequences ?? CONSEQUENCES[smell.slug],
  refactoring: smell.refactoring ?? DEFAULT_REFACTORING_BY_CATEGORY[smell.category],
  exampleProvenance: smell.exampleProvenance ?? 'ai-generated-and-adapted',
  flakinessProfile: FLAKINESS_PROFILES[smell.slug],
  sources: mergeSources(
    mergeSources(smell.sources, ACADEMIC_SOURCES_BY_SMELL[smell.slug]),
    OPEN_CATALOG_SOURCES_BY_SMELL[smell.slug],
  ),
}));
