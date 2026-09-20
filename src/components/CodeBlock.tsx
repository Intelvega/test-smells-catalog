import { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';

interface CodeBlockProps {
  code: string;
  language: 'javascript' | 'typescript' | 'tsx' | 'jsx';
  label?: string;
  accentClass?: string;
}

export function CodeBlock({ code, language, label, accentClass }: CodeBlockProps) {
  const ref = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (ref.current) {
      Prism.highlightElement(ref.current);
    }
  }, [code, language]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard indisponível — ignora silenciosamente */
    }
  }

  return (
    <div className="overflow-hidden rounded-md border border-border bg-[#0e0f12]">
      {label && (
        <div
          className={`flex items-center justify-between border-b border-border-soft px-3 py-1.5 text-[11px] font-medium ${
            accentClass ?? 'text-ink-muted'
          }`}
        >
          <span>{label}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 rounded px-1.5 py-0.5 text-ink-faint transition-colors hover:text-ink"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? 'Copiado' : 'Copiar'}
          </button>
        </div>
      )}
      <pre className="m-0 max-h-96 overflow-auto p-3">
        <code ref={ref} className={`language-${language}`}>
          {code}
        </code>
      </pre>
    </div>
  );
}
