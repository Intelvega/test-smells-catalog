import type { FlakinessProfile, TestSmell } from '../types/testSmell';

const DISSERTATION = { authors: 'Meneses', year: 2025, title: 'Master’s Dissertation: Test Smells in JavaScript' } as const;
const SNUTS = { authors: 'Oliveira, Mateus, Virgínio e Rocha', year: 2024, title: 'SNUTS.js: Sniffing Nasty Unit Test Smells in Javascript' } as const;
const STEEL = { authors: 'Jorge, Machado e Andrade', year: 2021, title: 'Steel: Test Smell Detection for JavaScript' } as const;
const SILVA = { authors: 'Silva', year: 2022, title: 'JavaScript Test Smell Detection Tool' } as const;

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

/**
 * Base de dados com os 66 test smells de JavaScript/TypeScript.
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
  expect(result.approved).toBe(true); // por que este fixture aprova? não dá pra saber aqui`,
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
];

export const TEST_SMELLS: TestSmell[] = RAW_TEST_SMELLS.map((smell) => ({
  ...smell,
  consequences: CONSEQUENCES[smell.slug],
  flakinessProfile: FLAKINESS_PROFILES[smell.slug],
}));
