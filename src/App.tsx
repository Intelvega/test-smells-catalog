import { useMemo, useState } from 'react';
import { Header } from './components/Header';
import { DashboardMetrics } from './components/DashboardMetrics';
import { FilterBar } from './components/FilterBar';
import { SmellCard } from './components/SmellCard';
import { TEST_SMELLS } from './data/testSmells';
import { CATEGORY_MAP } from './data/categories';
import type { ImpactSeverity, SmellCategory } from './types/testSmell';
import { SearchX } from 'lucide-react';

function matchesQuery(haystack: string[], query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return haystack.some((field) => field.toLowerCase().includes(q));
}

function App() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<SmellCategory | 'all'>('all');
  const [severity, setSeverity] = useState<ImpactSeverity | 'all'>('all');
  const [openId, setOpenId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    return TEST_SMELLS.filter((smell) => {
      if (category !== 'all' && smell.category !== category) return false;
      if (severity !== 'all' && smell.severity !== severity) return false;
      return matchesQuery(
        [smell.name, ...smell.aka, ...smell.tags, smell.definition],
        query
      );
    });
  }, [query, category, severity]);

  return (
    <div className="min-h-screen">
      <Header query={query} onQueryChange={setQuery} />

      <main className="mx-auto max-w-6xl space-y-6 px-5 py-6">
        <DashboardMetrics />

        <FilterBar
          activeCategory={category}
          onCategoryChange={setCategory}
          activeSeverity={severity}
          onSeverityChange={setSeverity}
          resultCount={filtered.length}
        />

        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-16 text-center">
              <SearchX size={22} strokeWidth={1.5} className="text-ink-faint" />
              <p className="text-sm text-ink-muted">
                Nenhum smell encontrado para os filtros atuais.
              </p>
            </div>
          ) : (
            filtered.map((smell) => (
              <SmellCard
                key={smell.id}
                smell={smell}
                category={CATEGORY_MAP[smell.category]}
                isOpen={openId === smell.id}
                onToggle={() => setOpenId(openId === smell.id ? null : smell.id)}
              />
            ))
          )}
        </div>

        <footer className="border-t border-border-soft pt-5 pb-2 text-center text-xs text-ink-faint">
          Catálogo acadêmico de test smells em JavaScript/TypeScript · 50 anti-padrões, 6 categorias
        </footer>
      </main>
    </div>
  );
}

export default App;
