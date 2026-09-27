import { CATEGORIES } from '../data/categories';
import { ACCENT_CLASSES } from '../data/accentStyles';
import type { FlakinessRelation, SmellCategory } from '../types/testSmell';

export type FlakinessFilter = 'catalog' | 'related' | FlakinessRelation;

const FLAKINESS_FILTERS: Array<{ id: FlakinessFilter; label: string; title: string }> = [
  { id: 'catalog', label: 'Catálogo completo', title: 'Exibe todos os smells, inclusive os sem relação identificada com flakiness.' },
  { id: 'related', label: 'Todas as relações', title: 'Exibe apenas smells com relação direta ou possível com flakiness.' },
  { id: 'direct', label: 'Flakiness direta', title: 'Exibe smells que caracterizam flakiness diretamente.' },
  { id: 'possible', label: 'Possível flakiness', title: 'Exibe smells que podem contribuir para comportamento intermitente.' },
  { id: 'none', label: 'Sem relação', title: 'Exibe smells sem relação identificada com flakiness.' },
];

interface FilterBarProps {
  activeCategory: SmellCategory | 'all';
  onCategoryChange: (category: SmellCategory | 'all') => void;
  activeFlakiness: FlakinessFilter;
  onFlakinessChange: (relation: FlakinessFilter) => void;
  resultCount: number;
}

export function FilterBar({ activeCategory, onCategoryChange, activeFlakiness, onFlakinessChange, resultCount }: FilterBarProps) {
  return <div className="space-y-3">
    <div className="flex flex-wrap gap-2">
      <button onClick={() => onCategoryChange('all')} className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${activeCategory === 'all' ? 'border-violet/50 bg-violet/10 text-violet-200' : 'border-border text-ink-muted hover:border-border-soft hover:text-ink'}`}>Todas as categorias</button>
      {CATEGORIES.map((cat) => { const accent = ACCENT_CLASSES[cat.accent]; const active = activeCategory === cat.id; return <button key={cat.id} onClick={() => onCategoryChange(cat.id)} title={cat.description} className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${active ? `${accent.border} ${accent.bg} ${accent.text}` : 'border-border text-ink-muted hover:border-border-soft hover:text-ink'}`}>{cat.shortLabel}</button>; })}
    </div>
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-ink-faint">Relação com flakiness:</span>
        {FLAKINESS_FILTERS.map(({ id, label, title }) => <button key={id} title={title} onClick={() => onFlakinessChange(id)} className={`rounded border px-2 py-1 text-xs transition-colors ${activeFlakiness === id ? 'border-border-soft bg-surface-2 text-ink' : 'border-transparent text-ink-faint hover:text-ink-muted'}`}>{label}</button>)}
      </div>
      <span className="text-xs text-ink-faint">{resultCount} {resultCount === 1 ? 'resultado' : 'resultados'}</span>
    </div>
  </div>;
}
