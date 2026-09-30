import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';

const root = path.resolve(import.meta.dirname, '..');
const dataPath = path.join(root, 'src', 'data', 'testSmells.ts');
const source = fs.readFileSync(dataPath, 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const sandbox = { exports: {}, require: () => { throw new Error('Módulo de execução inesperado'); }, URL };
vm.runInNewContext(compiled, sandbox, { filename: dataPath });
const smells = sandbox.exports.TEST_SMELLS;

const failures = [];
for (const smell of smells) {
  if (!smell.sources?.length) failures.push(`${smell.slug}: sem referência`);
  if (!smell.definition?.trim()) failures.push(`${smell.slug}: sem definição`);
  if (!smell.consequences?.trim()) failures.push(`${smell.slug}: sem consequência`);
  if (!smell.refactoring?.trim()) failures.push(`${smell.slug}: sem estratégia de refatoração`);
  for (const [kind, example] of [['ruim', smell.badExample], ['refatorado', smell.goodExample]]) {
    if (!example?.code?.trim()) { failures.push(`${smell.slug}: exemplo ${kind} ausente`); continue; }
    const parsed = ts.createSourceFile(`${smell.slug}.${example.language}`, example.code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    if (parsed.parseDiagnostics.length) failures.push(`${smell.slug}: sintaxe inválida no exemplo ${kind}`);
  }
}

if (process.argv.includes('--write-register')) {
  const escape = (value) => `"${String(value).replaceAll('"', '""')}"`;
  const rows = ['id,slug,name,fonte_principal,status_revisao_manual,revisor,observacoes'];
  for (const smell of smells) rows.push([smell.id, smell.slug, smell.name, smell.sources?.[0]?.title ?? '', 'pendente', '', ''].map(escape).join(','));
  fs.writeFileSync(path.join(root, 'docs', 'example-review-register.csv'), `${rows.join('\n')}\n`);
  console.log('Registro de revisão manual atualizado em docs/example-review-register.csv.');
}

if (failures.length) {
  console.error(`Falharam ${failures.length} verificações de exemplos:`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`Validação concluída: ${smells.length} smells, ${smells.length * 2} exemplos analisados, todas as fontes e campos obrigatórios presentes.`);
