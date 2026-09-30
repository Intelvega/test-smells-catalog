import { useState } from 'react';
import { ChevronDown, ScanSearch } from 'lucide-react';
import type { CategoryMeta, TestSmell } from '../types/testSmell';
import { ACCENT_CLASSES } from '../data/accentStyles';
import { CodeComparisonView } from './CodeComparisonView';
import { CodeBlock } from './CodeBlock';
import { DetectionRuleModal } from './DetectionRuleModal';

interface SmellCardProps {
  smell: TestSmell;
  category: CategoryMeta;
  isOpen: boolean;
  onToggle: () => void;
}

export function SmellCard({ smell, category, isOpen, onToggle }: SmellCardProps) {
  const [showRule, setShowRule] = useState(false);
  const accent = ACCENT_CLASSES[category.accent];
  const relation = smell.flakiness ?? (smell.slug === 'flaky-test-intermittent-failures' ? 'direct' : smell.impact.includes('Flakiness') ? 'possible' : 'none');

  return (
    <div
      className={`rounded-lg border bg-surface transition-colors ${
        isOpen ? 'border-border-soft' : 'border-border'
      }`}
    >
      <button
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-4 p-4 text-left"
        aria-expanded={isOpen}
      >
        <div className="min-w-0">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <span className="font-mono text-[11px] text-ink-faint">
              #{String(smell.id).padStart(2, '0')}
            </span>
            <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${accent.border} ${accent.bg} ${accent.text}`}>
              {category.shortLabel}
            </span>
          </div>
          <h3 className="truncate text-sm font-medium text-ink sm:text-[15px]">{smell.name}</h3>
          {smell.aka.length > 0 && (
            <p className="mt-0.5 truncate text-xs text-ink-faint">
              também conhecido como {smell.aka.join(', ')}
            </p>
          )}
        </div>
        <ChevronDown
          size={18}
          strokeWidth={1.75}
          className={`mt-1 shrink-0 text-ink-faint transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="space-y-5 border-t border-border-soft px-4 pb-5 pt-4">
          <div className="flex flex-wrap gap-1.5">
            {smell.impact.map((imp) => (
              <span key={imp} className="rounded border border-border-soft px-1.5 py-0.5 text-[11px] text-ink-muted">
                {imp}
              </span>
            ))}
          </div>

          {relation !== 'none' && (
            <span className={`inline-flex rounded border px-2 py-1 text-[11px] font-medium ${relation === 'direct' ? 'border-rose-500/50 bg-rose-500/10 text-rose-200' : 'border-amber-500/50 bg-amber-500/10 text-amber-200'}`}>
              {relation === 'direct' ? 'Flakiness direta' : 'Possível flakiness'}
            </span>
          )}

          <Section title="Definição teórica">
            <p className="text-sm leading-relaxed text-ink-muted">{smell.definition}</p>
          </Section>

          {smell.flakinessProfile && (
            <>
              <Section title="Relação com flakiness">
                <p className="text-sm leading-relaxed text-ink-muted">{smell.flakinessProfile.explanation}</p>
                {smell.flakinessProfile.factors.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {smell.flakinessProfile.factors.map((factor) => <span key={factor} className="rounded border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[11px] text-amber-200">{factor}</span>)}
                  </div>
                )}
              </Section>
              <Section title="Exemplo de risco de flakiness">
                <CodeBlock code={smell.flakinessProfile.example} language="javascript" label="Exemplo" accentClass="text-amber-300" />
              </Section>
            </>
          )}

          <Section title="Consequências">
            <p className="text-sm leading-relaxed text-ink-muted">{smell.consequences ?? 'Reduz a clareza, a confiabilidade ou a capacidade de manutenção da suíte de testes.'}</p>
          </Section>

          {smell.refactoring && (
            <Section title="Estratégia de refatoração">
              <p className="text-sm leading-relaxed text-ink-muted">{smell.refactoring}</p>
            </Section>
          )}

          <Section title="Manifestação no ecossistema JS/TS">
            <p className="text-sm leading-relaxed text-ink-muted">{smell.manifestation}</p>
          </Section>

          <Section title="Proveniência dos exemplos">
            <p className="text-sm leading-relaxed text-ink-muted">{smell.exampleProvenance === 'ai-generated-and-adapted' ? 'Exemplos didáticos gerados ou adaptados com apoio de IA a partir da descrição e das referências do smell, ajustados para JavaScript/Jest/Vitest. Eles devem ser revisados segundo o protocolo de validação do projeto.' : 'Proveniência registrada no catálogo.'}</p>
          </Section>

          <Section title="Comparador de código">
            <CodeComparisonView badExample={smell.badExample} goodExample={smell.goodExample} />
          </Section>

          {smell.sources && smell.sources.length > 0 && (
            <Section title="Referências">
              <ul className="space-y-1 text-xs leading-relaxed text-ink-muted">
                {smell.sources.map((source) => <li key={`${source.authors}-${source.year}-${source.url ?? source.title}`}>{source.authors} ({source.year}). {source.url ? <a href={source.url} target="_blank" rel="noreferrer" className="text-violet-300 underline underline-offset-2 hover:text-violet-200"><em>{source.title}</em></a> : <em>{source.title}</em>}.</li>)}
              </ul>
            </Section>
          )}

          <button
            onClick={() => setShowRule(true)}
            className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-xs font-medium text-violet-300 transition-colors hover:border-violet/40 hover:bg-violet/10"
          >
            <ScanSearch size={14} strokeWidth={1.75} />
            Ver heurística de detecção (AST)
          </button>

          <div className="flex flex-wrap gap-1.5 border-t border-border-soft pt-3">
            {smell.tags.map((tag) => (
              <span key={tag} className="font-mono text-[11px] text-ink-faint">
                #{tag.replace(/\s+/g, '-')}
              </span>
            ))}
          </div>
        </div>
      )}

      {showRule && (
        <DetectionRuleModal
          smellName={smell.name}
          rule={smell.detectionRule}
          onClose={() => setShowRule(false)}
        />
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-[11px] uppercase tracking-wide text-ink-faint">{title}</p>
      {children}
    </div>
  );
}
