import { useMemo, useState } from 'react';
import { Header } from './components/Header';
import { DashboardMetrics } from './components/DashboardMetrics';
import { FilterBar, type FlakinessFilter } from './components/FilterBar';
import { SmellCard } from './components/SmellCard';
import { TEST_SMELLS } from './data/testSmells';
import { CATEGORIES, CATEGORY_MAP } from './data/categories';
import type { FlakinessRelation, SmellCategory, TestSmell } from './types/testSmell';
import { SearchX } from 'lucide-react';

function flakinessRelation(smell: TestSmell): FlakinessRelation {
  if (smell.flakiness) return smell.flakiness;
  return smell.slug === 'flaky-test-intermittent-failures' ? 'direct' : smell.impact.includes('Flakiness') ? 'possible' : 'none';
}
function matchesFlakinessFilter(smell: TestSmell, filter: FlakinessFilter) {
  const relation = flakinessRelation(smell);
  if (filter === 'catalog') return true;
  if (filter === 'related') return relation === 'direct' || relation === 'possible';
  return relation === filter;
}
function matchesQuery(haystack: string[], query: string) { const q = query.trim().toLowerCase(); return !q || haystack.some((field) => field.toLowerCase().includes(q)); }
function App() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<SmellCategory | 'all'>('all');
  const [flakiness, setFlakiness] = useState<FlakinessFilter>('catalog');
  const [openId, setOpenId] = useState<number | null>(null);
  const filtered = useMemo(() => TEST_SMELLS.filter((smell) => (category === 'all' || smell.category === category) && matchesFlakinessFilter(smell, flakiness) && matchesQuery([smell.name, ...smell.aka, ...smell.tags, smell.definition], query)), [query, category, flakiness]);
  const groups = useMemo(() => CATEGORIES.map((meta) => ({ meta, smells: filtered.filter((smell) => smell.category === meta.id) })).filter((group) => group.smells.length > 0), [filtered]);
  const selectFlakiness = (filter: FlakinessFilter) => { setCategory('all'); setFlakiness(filter); setOpenId(null); };
  return <div className="min-h-screen"><Header total={TEST_SMELLS.length} query={query} onQueryChange={setQuery} /><main className="mx-auto max-w-6xl space-y-6 px-5 py-6"><DashboardMetrics onFlakinessFilterChange={selectFlakiness} /><FilterBar activeCategory={category} onCategoryChange={setCategory} activeFlakiness={flakiness} onFlakinessChange={selectFlakiness} resultCount={filtered.length} /><div id="results" className="space-y-7">{filtered.length === 0 ? <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-16 text-center"><SearchX size={22} strokeWidth={1.5} className="text-ink-faint" /><p className="text-sm text-ink-muted">Nenhum smell encontrado para os filtros atuais.</p></div> : groups.map(({ meta, smells }) => <section key={meta.id} aria-labelledby={`category-${meta.id}`} className="space-y-3"><div className="flex items-center gap-3"><h2 id={`category-${meta.id}`} className="text-sm font-medium text-ink">{meta.label}</h2><span className="rounded-full border border-border px-2 py-0.5 font-mono text-[11px] text-ink-faint">{smells.length}</span><div className="h-px flex-1 bg-border" /></div><div className="space-y-3">{smells.map((smell) => <SmellCard key={smell.id} smell={smell} category={CATEGORY_MAP[smell.category]} isOpen={openId === smell.id} onToggle={() => setOpenId(openId === smell.id ? null : smell.id)} />)}</div></section>)}</div><footer className="border-t border-border-soft pt-5 pb-2 text-center text-xs text-ink-faint">Catálogo acadêmico de test smells em JavaScript/TypeScript · {TEST_SMELLS.length} anti-padrões, 6 categorias</footer></main></div>;
}
export default App;
