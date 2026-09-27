import { LayoutGrid, Layers, ShieldAlert, Flame } from 'lucide-react';
import { TEST_SMELLS } from '../data/testSmells';
import { CATEGORIES } from '../data/categories';
import type { TestSmell } from '../types/testSmell';
import type { FlakinessFilter } from './FilterBar';

function relation(smell: TestSmell) { if (smell.flakiness) return smell.flakiness; return smell.slug === 'flaky-test-intermittent-failures' ? 'direct' : smell.impact.includes('Flakiness') ? 'possible' : 'none'; }
interface MetricProps { icon: React.ReactNode; label: string; value: string | number; hint: string; onClick?: () => void; }
function Metric({ icon, label, value, hint, onClick }: MetricProps) {
  const content = <><div className="flex items-center justify-between"><span className="text-xs uppercase tracking-wide text-ink-faint">{label}</span><span className="text-ink-faint">{icon}</span></div><div className="mt-2 font-mono text-2xl font-semibold text-ink">{value}</div><p className="mt-1 text-xs text-ink-muted">{hint}</p>{onClick && <p className="mt-2 text-[11px] font-medium text-violet-300">Clique para filtrar</p>}</>;
  return onClick ? <button type="button" onClick={onClick} className="rounded-lg border border-border bg-surface p-4 text-left transition-colors hover:border-violet/60 hover:bg-surface-2 focus:outline-none focus:ring-1 focus:ring-violet/60" aria-label={`Filtrar por ${label}`}>{content}</button> : <div className="rounded-lg border border-border bg-surface p-4">{content}</div>;
}

export function DashboardMetrics({ onFlakinessFilterChange }: { onFlakinessFilterChange: (filter: FlakinessFilter) => void }) {
  const direct = TEST_SMELLS.filter((s) => relation(s) === 'direct').length;
  const possible = TEST_SMELLS.filter((s) => relation(s) === 'possible').length;
  return <div className="grid grid-cols-2 gap-3 sm:grid-cols-4"><Metric icon={<LayoutGrid size={16} strokeWidth={1.75} />} label="Smells catalogados" value={TEST_SMELLS.length} hint="cobrindo todo o ciclo de vida do teste" onClick={() => onFlakinessFilterChange('catalog')} /><Metric icon={<Layers size={16} strokeWidth={1.75} />} label="Categorias" value={CATEGORIES.length} hint="agrupados por tipo de smell" /><Metric icon={<ShieldAlert size={16} strokeWidth={1.75} />} label="Flakiness direta" value={direct} hint="smells com impacto direto em flakiness" onClick={() => onFlakinessFilterChange('direct')} /><Metric icon={<Flame size={16} strokeWidth={1.75} />} label="Ligados a flakiness" value={direct + possible} hint={`${direct} direto + ${possible} possíveis`} onClick={() => onFlakinessFilterChange('related')} /></div>;
}
