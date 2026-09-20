import { LayoutGrid, ShieldAlert, Layers, Flame } from 'lucide-react';
import { TEST_SMELLS } from '../data/testSmells';
import { CATEGORIES } from '../data/categories';

interface MetricProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  hint: string;
}

function Metric({ icon, label, value, hint }: MetricProps) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wide text-ink-faint">{label}</span>
        <span className="text-ink-faint">{icon}</span>
      </div>
      <div className="mt-2 font-mono text-2xl font-semibold text-ink">{value}</div>
      <p className="mt-1 text-xs text-ink-muted">{hint}</p>
    </div>
  );
}

export function DashboardMetrics() {
  const total = TEST_SMELLS.length;
  const categoriesCount = CATEGORIES.length;
  const critical = TEST_SMELLS.filter((s) => s.severity === 'crítico').length;
  const flakiness = TEST_SMELLS.filter((s) => s.impact.includes('Flakiness')).length;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <Metric
        icon={<LayoutGrid size={16} strokeWidth={1.75} />}
        label="Smells catalogados"
        value={total}
        hint="cobrindo todo o ciclo de vida do teste"
      />
      <Metric
        icon={<Layers size={16} strokeWidth={1.75} />}
        label="Categorias"
        value={categoriesCount}
        hint="de asserções a design do teste"
      />
      <Metric
        icon={<ShieldAlert size={16} strokeWidth={1.75} />}
        label="Severidade crítica"
        value={critical}
        hint="podem mascarar bugs reais em produção"
      />
      <Metric
        icon={<Flame size={16} strokeWidth={1.75} />}
        label="Ligados a flakiness"
        value={flakiness}
        hint="principais causas de testes intermitentes"
      />
    </div>
  );
}
