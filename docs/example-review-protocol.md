# Protocolo de revisão manual dos exemplos

## Propósito

Este protocolo avalia se os exemplos didáticos do catálogo representam corretamente cada test smell no ecossistema JavaScript/TypeScript. Ele complementa a validação automática: a automação verifica estrutura, sintaxe e rastreabilidade, mas não substitui o julgamento conceitual de um revisor.

## Origem do material

As definições, consequências e recomendações foram sintetizadas das referências apresentadas em cada cartão. Os exemplos de código foram gerados ou adaptados com apoio de IA a partir dessas descrições e ajustados para o contexto de Jest/Vitest. Portanto, cada exemplo deve ser tratado como material didático, e não como uma transcrição literal de um artigo ou de um repositório de terceiros.

## Procedimento

1. Abra o cartão e a referência indicada.
2. Leia a definição da fonte e compare-a com o exemplo “com smell”.
3. Confira se o trecho é JavaScript/TypeScript válido e se o framework declarado interpretaria a estrutura como esperado.
4. Confirme que o smell é visível no exemplo ruim.
5. Confirme que o exemplo refatorado remove ou reduz o smell sem alterar o comportamento que o teste pretende verificar.
6. Registre o resultado no arquivo `docs/example-review-register.csv` como `aprovado`, `ajuste necessário` ou `rejeitado`, incluindo observação e revisor.

## Critérios de aceite

- A fonte corresponde ao smell ou a um sinônimo explicitamente documentado.
- O exemplo ruim expressa o padrão descrito, sem depender apenas do nome do smell.
- O exemplo refatorado trata a causa do smell, e não somente muda a formatação.
- A sintaxe é compatível com JavaScript/TypeScript e com Jest/Vitest quando o framework é declarado.
- Referência, autor, ano e link permanecem disponíveis no cartão.

## Automação disponível

Execute `npm run validate:examples`. O comando analisa todos os exemplos com o parser TypeScript em modo TSX e verifica definição, consequências, estratégia de refatoração e referências. Ele não executa os snippets, pois vários usam sujeitos, fixtures ou dependências propositalmente simplificados para fins didáticos.
