import * as React from 'react';
import { cn, initials } from '@/lib/utils';

/** Initial-based avatar in a soft ash (or emerald) tile — no photos required. */
export function Avatar({
  name,
  size = 'md',
  tone = 'ash',
  className,
}: {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  tone?: 'ash' | 'emerald' | 'ink';
  className?: string;
}) {
  const sizes = { sm: 'h-8 w-8 text-[11px] rounded-lg', md: 'h-9 w-9 text-xs rounded-[10px]', lg: 'h-11 w-11 text-sm rounded-xl' };
  const tones = {
    ash: 'bg-ash-100 text-ash-700 ring-1 ring-ash-200',
    emerald: 'bg-brand-50 text-brand-700 ring-1 ring-brand-100',
    ink: 'bg-ink text-white',
  };
  return (
    <span
      className={cn('inline-flex shrink-0 select-none items-center justify-center font-bold', sizes[size], tones[tone], className)}
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}

/** Thin progress track — ash rail, emerald fill (amber/red when critical). */
export function ProgressBar({
  value,
  max = 100,
  className,
  tone = 'auto',
}: {
  value: number;
  max?: number;
  className?: string;
  tone?: 'auto' | 'emerald' | 'ash';
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const fill =
    tone === 'ash'
      ? 'bg-ash-400'
      : tone === 'emerald'
        ? 'bg-brand-500'
        : pct >= 90
          ? 'bg-red-500'
          : pct >= 75
            ? 'bg-amber-500'
            : 'bg-brand-500';
  return (
    <span className={cn('block h-1.5 w-full overflow-hidden rounded-full bg-ash-100', className)}>
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
        <span className="block truncate text-sm font-medium text-ink">{name}</span>
        {sub && <span className="block truncate text-xs text-ash-500">{sub}</span>}
      </span>
    </span>
  );
}

/** Route code chip — deep-black tile with the route number, like a bus board. */
export function RouteChip({ code, className }: { code: string; className?: string }) {
  return (
    <span
      className={cn(
        'tnum inline-flex min-w-[52px] items-center justify-center rounded-lg bg-ink px-2 py-1 text-xs font-bold tracking-wide text-white',
        className,
      )}
    >
      {code}
    </span>
  );
}
