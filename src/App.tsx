import { useMemo, useState } from 'react';
import { Header } from './components/Header';
import { DashboardMetrics } from './components/DashboardMetrics';
import { FilterBar, type FlakinessFilter } from './components/FilterBar';
import { SmellCard } from './components/SmellCard';
import { ContributorsPage, Footer, MethodologyPage, ReferencesPage, type CatalogPage } from './components/InformationPages';
import { TEST_SMELLS } from './data/testSmells';
import { CATEGORIES, CATEGORY_MAP } from './data/categories';
import type { FlakinessRelation, SmellCategory, TestSmell } from './types/testSmell';
import { SearchX } from 'lucide-react';

function flakinessRelation(smell: TestSmell): FlakinessRelation { if (smell.flakiness) return smell.flakiness; return smell.slug === 'flaky-test-intermittent-failures' ? 'direct' : smell.impact.includes('Flakiness') ? 'possible' : 'none'; }
function matchesFlakinessFilter(smell: TestSmell, filter: FlakinessFilter) { const relation = flakinessRelation(smell); if (filter === 'catalog') return true; if (filter === 'related') return relation === 'direct' || relation === 'possible'; return relation === filter; }
function matchesQuery(haystack: string[], query: string) { const q = query.trim().toLowerCase(); return !q || haystack.some((field) => field.toLowerCase().includes(q)); }
function initialPage(): CatalogPage { const hash = window.location.hash.slice(1); return ['catalog', 'methodology', 'references', 'contributors'].includes(hash) ? hash as CatalogPage : 'catalog'; }

function App() {
  const [page, setPage] = useState<CatalogPage>(initialPage);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<SmellCategory | 'all'>('all');
  const [flakiness, setFlakiness] = useState<FlakinessFilter>('catalog');
  const [openId, setOpenId] = useState<number | null>(null);
  const filtered = useMemo(() => TEST_SMELLS.filter((smell) => (category === 'all' || smell.category === category) && matchesFlakinessFilter(smell, flakiness) && matchesQuery([smell.name, ...smell.aka, ...smell.tags, smell.definition], query)), [query, category, flakiness]);
  const groups = useMemo(() => CATEGORIES.map((meta) => ({ meta, smells: filtered.filter((smell) => smell.category === meta.id) })).filter((group) => group.smells.length > 0), [filtered]);
  const navigate = (nextPage: CatalogPage) => { setPage(nextPage); window.location.hash = nextPage; window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const selectFlakiness = (filter: FlakinessFilter) => { setCategory('all'); setFlakiness(filter); setOpenId(null); setPage('catalog'); window.location.hash = 'catalog'; };
  const catalog = <><section className="rounded-xl border border-border bg-surface p-5 sm:p-6"><p className="text-xs font-medium uppercase tracking-[0.16em] text-violet-300">Objetivo do catálogo</p><h2 className="mt-2 text-xl font-semibold text-ink">Entender e refatorar padrões que degradam testes automatizados</h2><p className="mt-3 max-w-4xl text-sm leading-relaxed text-ink-muted">Test smells podem ocultar a intenção do teste, dificultar manutenção, reduzir confiança nos resultados e favorecer falhas intermitentes. Este catálogo organiza evidências da literatura e exemplos didáticos em JavaScript/TypeScript para apoiar identificação, discussão e refatoração. As fontes e a proveniência dos exemplos estão registradas em cada cartão e na Metodologia.</p></section><DashboardMetrics onFlakinessFilterChange={selectFlakiness} /><FilterBar activeCategory={category} onCategoryChange={setCategory} activeFlakiness={flakiness} onFlakinessChange={selectFlakiness} resultCount={filtered.length} /><div id="results" className="space-y-7">{filtered.length === 0 ? <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-16 text-center"><SearchX size={22} strokeWidth={1.5} className="text-ink-faint" /><p className="text-sm text-ink-muted">Nenhum smell encontrado para os filtros atuais.</p></div> : groups.map(({ meta, smells }) => <section key={meta.id} aria-labelledby={`category-${meta.id}`} className="space-y-3"><div className="flex items-center gap-3"><h2 id={`category-${meta.id}`} className="text-sm font-medium text-ink">{meta.label}</h2><span className="rounded-full border border-border px-2 py-0.5 font-mono text-[11px] text-ink-faint">{smells.length}</span><div className="h-px flex-1 bg-border" /></div><div className="space-y-3">{smells.map((smell) => <SmellCard key={smell.id} smell={smell} category={CATEGORY_MAP[smell.category]} isOpen={openId === smell.id} onToggle={() => setOpenId(openId === smell.id ? null : smell.id)} />)}</div></section>)}</div></>;
  const content = page === 'catalog' ? catalog : page === 'methodology' ? <MethodologyPage total={TEST_SMELLS.length} /> : page === 'references' ? <ReferencesPage smells={TEST_SMELLS} /> : <ContributorsPage />;
  return <div className="min-h-screen"><Header total={TEST_SMELLS.length} query={query} onQueryChange={setQuery} activePage={page} onNavigate={navigate} /><main className="mx-auto max-w-6xl space-y-6 px-5 py-6">{content}<Footer onNavigate={navigate} /></main></div>;
}
export default App;
