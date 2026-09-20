import { CATEGORIES } from '../data/categories';
import { ACCENT_CLASSES } from '../data/accentStyles';
import type { ImpactSeverity, SmellCategory } from '../types/testSmell';

const SEVERITIES: ImpactSeverity[] = ['baixo', 'médio', 'alto', 'crítico'];

interface FilterBarProps {
  activeCategory: SmellCategory | 'all';
  onCategoryChange: (category: SmellCategory | 'all') => void;
  activeSeverity: ImpactSeverity | 'all';
  onSeverityChange: (severity: ImpactSeverity | 'all') => void;
  resultCount: number;
}

export function FilterBar({
  activeCategory,
  onCategoryChange,
  activeSeverity,
  onSeverityChange,
  resultCount,
}: FilterBarProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategoryChange('all')}
          className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
            activeCategory === 'all'
              ? 'border-violet/50 bg-violet/10 text-violet-200'
              : 'border-border text-ink-muted hover:border-border-soft hover:text-ink'
          }`}
        >
          Todas as categorias
        </button>
        {CATEGORIES.map((cat) => {
          const accent = ACCENT_CLASSES[cat.accent];
          const active = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              title={cat.description}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                active
                  ? `${accent.border} ${accent.bg} ${accent.text}`
                  : 'border-border text-ink-muted hover:border-border-soft hover:text-ink'
              }`}
            >
              {cat.shortLabel}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-ink-faint">Severidade:</span>
          <button
            onClick={() => onSeverityChange('all')}
            className={`rounded border px-2 py-1 text-xs transition-colors ${
              activeSeverity === 'all'
                ? 'border-border-soft bg-surface-2 text-ink'
                : 'border-transparent text-ink-faint hover:text-ink-muted'
            }`}
          >
            todas
          </button>
          {SEVERITIES.map((sev) => (
            <button
              key={sev}
              onClick={() => onSeverityChange(sev)}
              className={`rounded border px-2 py-1 text-xs capitalize transition-colors ${
                activeSeverity === sev
                  ? 'border-border-soft bg-surface-2 text-ink'
                  : 'border-transparent text-ink-faint hover:text-ink-muted'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
        <span className="text-xs text-ink-faint">
          {resultCount} {resultCount === 1 ? 'resultado' : 'resultados'}
        </span>
      </div>
    </div>
  );
}
