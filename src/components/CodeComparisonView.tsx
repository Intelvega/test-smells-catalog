import { useState } from 'react';
import { CodeBlock } from './CodeBlock';
import type { CodeExample } from '../types/testSmell';

interface CodeComparisonViewProps {
  badExample: CodeExample;
  goodExample: CodeExample;
}

export function CodeComparisonView({ badExample, goodExample }: CodeComparisonViewProps) {
  const [tab, setTab] = useState<'split' | 'bad' | 'good'>('split');

  return (
    <div>
      <div className="mb-2 flex gap-1 sm:hidden">
        <TabButton active={tab === 'bad'} onClick={() => setTab('bad')}>
          Com smell
        </TabButton>
        <TabButton active={tab === 'good'} onClick={() => setTab('good')}>
          Refatorado
        </TabButton>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className={tab === 'good' ? 'hidden sm:block' : ''}>
          <CodeBlock
            code={badExample.code}
            language={badExample.language}
            label={`❌ Com smell${badExample.framework ? ` · ${badExample.framework}` : ''}`}
            accentClass="text-rose-300"
          />
        </div>
        <div className={tab === 'bad' ? 'hidden sm:block' : ''}>
          <CodeBlock
            code={goodExample.code}
            language={goodExample.language}
            label={`✅ Refatorado${goodExample.framework ? ` · ${goodExample.framework}` : ''}`}
            accentClass="text-teal-300"
          />
        </div>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded border px-2 py-1.5 text-xs font-medium transition-colors ${
        active
          ? 'border-border-soft bg-surface-2 text-ink'
          : 'border-border text-ink-faint'
      }`}
    >
      {children}
    </button>
  );
}
