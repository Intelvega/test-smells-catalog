import { useEffect } from 'react';
import { X, ScanSearch } from 'lucide-react';
import { CodeBlock } from './CodeBlock';
import type { DetectionRule } from '../types/testSmell';

interface DetectionRuleModalProps {
  smellName: string;
  rule: DetectionRule;
  onClose: () => void;
}

export function DetectionRuleModal({ smellName, rule, onClose }: DetectionRuleModalProps) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-xl rounded-lg border border-border bg-surface shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border-soft p-4">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-surface-2 text-violet-300">
              <ScanSearch size={16} strokeWidth={1.75} />
            </span>
            <div>
              <p className="text-xs uppercase tracking-wide text-ink-faint">
                Heurística de detecção estática
              </p>
              <h3 className="font-mono text-sm font-medium text-ink">{rule.name}</h3>
              <p className="mt-0.5 text-xs text-ink-muted">para: {smellName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-ink-faint transition-colors hover:bg-surface-2 hover:text-ink"
            aria-label="Fechar"
          >
            <X size={16} />
          </button>
        </div>

        <div className="max-h-[70vh] space-y-4 overflow-auto p-4">
          <p className="text-sm leading-relaxed text-ink-muted">{rule.description}</p>

          <div>
            <p className="mb-1.5 text-[11px] uppercase tracking-wide text-ink-faint">
              Pseudocódigo da regra
            </p>
            <CodeBlock code={rule.pseudocode} language="typescript" />
          </div>

          <div className="flex items-center gap-2 rounded-md border border-border-soft bg-surface-2 px-3 py-2">
            <span className="text-[11px] uppercase tracking-wide text-ink-faint">
              Ferramenta sugerida
            </span>
            <span className="font-mono text-xs text-violet-300">{rule.tool}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
