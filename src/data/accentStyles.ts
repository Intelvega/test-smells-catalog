export type Accent = 'amber' | 'teal' | 'rose' | 'violet' | 'sky' | 'lime';

/**
 * Mapa de classes Tailwind por acento, usado para colorir chips de categoria,
 * bordas ativas e indicadores de severidade sem depender de cores geradas dinamicamente
 * (o que o Tailwind não conseguiria purgar corretamente).
 */
export const ACCENT_CLASSES: Record<
  Accent,
  { text: string; bg: string; border: string; dot: string }
> = {
  amber: {
    text: 'text-amber-300',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/40',
    dot: 'bg-amber-400',
  },
  teal: {
    text: 'text-teal-300',
    bg: 'bg-teal-500/10',
    border: 'border-teal-500/40',
    dot: 'bg-teal-400',
  },
  rose: {
    text: 'text-rose-300',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/40',
    dot: 'bg-rose-400',
  },
  violet: {
    text: 'text-violet-300',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/40',
    dot: 'bg-violet-400',
  },
  sky: {
    text: 'text-sky-300',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/40',
    dot: 'bg-sky-400',
  },
  lime: {
    text: 'text-lime-300',
    bg: 'bg-lime-500/10',
    border: 'border-lime-500/40',
    dot: 'bg-lime-400',
  },
};

export const SEVERITY_ORDER = ['baixo', 'médio', 'alto', 'crítico'] as const;

export const SEVERITY_CLASSES: Record<string, string> = {
  baixo: 'text-ink-muted border-border',
  médio: 'text-amber-300 border-amber-500/40',
  alto: 'text-rose-300 border-rose-500/40',
  crítico: 'text-rose-200 border-rose-400/60 bg-rose-500/10',
};
