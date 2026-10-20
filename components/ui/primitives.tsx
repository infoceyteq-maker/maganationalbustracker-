import * as React from 'react';
import { cn, initials } from '@/lib/utils';

/** Initial-based avatar pressed into a soft neumorphic tile. */
export function Avatar({
  name,
  size = 'md',
  tone = 'ash',
  className,
}: {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  tone?: 'ash' | 'emerald' | 'ink' | 'amber';
  className?: string;
}) {
  const sizes = { sm: 'h-9 w-9 text-[11px] rounded-xl', md: 'h-10 w-10 text-xs rounded-2xl', lg: 'h-12 w-12 text-sm rounded-2xl' };
  const tones = {
    ash: 'bg-[#F1EEE6] text-ash-700 shadow-neuSm',
    emerald: 'bg-brand-600 text-white shadow-btn3d',
    ink: 'bg-ink text-white',
    amber: 'bg-amber-glass text-white shadow-btnAmber',
  };
  return (
    <span className={cn('inline-flex shrink-0 select-none items-center justify-center font-extrabold', sizes[size], tones[tone], className)} aria-hidden>
      {initials(name)}
    </span>
  );
}

/** Neumorphic progress well — inset ash-cream track, deep-emerald fill. */
export function ProgressBar({
  value,
  max = 100,
  className,
  tone = 'auto',
}: {
  value: number;
  max?: number;
  className?: string;
  tone?: 'auto' | 'emerald' | 'ash' | 'amber' | 'white';
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const fill =
    tone === 'ash'
      ? 'bg-ash-400'
      : tone === 'white'
        ? 'bg-white'
        : tone === 'amber'
          ? 'bg-amber-glass'
          : tone === 'emerald'
            ? 'bg-brand-600'
            : pct >= 90
              ? 'bg-red-500'
              : pct >= 75
                ? 'bg-tang-500'
                : 'bg-brand-600';
  return (
    <span className={cn('block h-2 w-full overflow-hidden rounded-full bg-[#EFEAE0] shadow-insetSoft', tone === 'white' && 'bg-white/30 shadow-none', className)}>
      <span className={cn('block h-full rounded-full transition-all duration-700', fill)} style={{ width: `${pct}%` }} />
    </span>
  );
}

/** Person cell — avatar + name + muted sub-line. */
export function PersonCell({ name, sub }: { name: string; sub?: string }) {
  return (
    <span className="flex min-w-0 items-center gap-2.5">
      <Avatar name={name} size="sm" />
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-ink">{name}</span>
        {sub && <span className="block truncate text-xs text-ash-500">{sub}</span>}
      </span>
    </span>
  );
}

/** Route code pill — deep ink tile like a physical bus destination board. */
export function RouteChip({ code, className }: { code: string; className?: string }) {
  return (
    <span
      className={cn(
        'tnum inline-flex min-w-[54px] items-center justify-center rounded-full bg-ink px-2.5 py-1 text-xs font-extrabold tracking-wide text-white shadow-btnMatte',
        className,
      )}
    >
      {code}
    </span>
  );
}
