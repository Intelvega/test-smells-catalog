import { Search, Bug } from 'lucide-react';

interface HeaderProps {
  total: number;
  query: string;
  onQueryChange: (value: string) => void;
}

export function Header({ total, query, onQueryChange }: HeaderProps) {
  return (
    <header className="border-b border-border-soft bg-canvas/95 backdrop-blur sticky top-0 z-30">
      <div className="mx-auto max-w-6xl px-5 py-4 sm:py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-amber-300">
              <Bug size={18} strokeWidth={1.75} />
            </span>
            <div>
              <h1 className="font-mono text-[15px] font-medium leading-tight text-ink">
                test-smells<span className="text-ink-faint">.catalog</span>
              </h1>
              <p className="text-xs text-ink-muted">
                {total} anti-padrões de teste em JavaScript &amp; TypeScript
              </p>
            </div>
          </div>

          <div className="relative w-full sm:w-80">
            <Search
              size={16}
              strokeWidth={1.75}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
            />
            <input
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              type="text"
              placeholder="Buscar por nome, tag ou palavra-chave..."
              className="w-full rounded-md border border-border bg-surface py-2 pl-9 pr-3 text-sm text-ink placeholder:text-ink-faint outline-none transition-colors focus:border-violet/60 focus:ring-1 focus:ring-violet/30"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
