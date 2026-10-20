import * as React from 'react';
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sparkline } from './Charts';

/**
 * MetricCard — the standard KPI tile of the console.
 * White surface · extra-bold value in deep black · emerald trend chip ·
 * sparkline · icon resting in a soft ash tile (emerald reserved for signal).
 */
export interface MetricCardProps {
  label: string;
  value: string;
  delta: number; // signed percentage, e.g. +4.8
  deltaNote: string;
  icon: LucideIcon;
  spark: number[];
  accent?: boolean; // emerald icon tile
  invertDelta?: boolean; // for metrics where "down" is good (e.g. delays)
  footnote?: string;
}

export function MetricCard({
  label,
  value,
  delta,
  deltaNote,
  icon: Icon,
  spark,
  accent = false,
  invertDelta = false,
  footnote,
}: MetricCardProps) {
  const positive = invertDelta ? delta < 0 : delta >= 0;
  const Arrow = delta >= 0 ? ArrowUpRight : ArrowDownRight;

  return (
    <section className="card card-hover p-5 sm:p-6" aria-label={label}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-[13px] font-medium text-ash-500">{label}</p>
        <span
          className={cn(
            'inline-flex h-10 w-10 items-center justify-center rounded-xl',
            accent ? 'bg-brand-600 text-white shadow-cta' : 'bg-ash-100 text-ash-600',
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={2} />
        </span>
      </div>

      <p className="tnum mt-2 text-[30px] font-extrabold leading-none tracking-tight text-ink">{value}</p>

      <div className="mt-3 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <span
            className={cn(
              'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset',
              positive ? 'bg-brand-50 text-brand-700 ring-brand-600/15' : 'bg-red-50 text-red-700 ring-red-600/15',
            )}
          >
            <Arrow className="h-3.5 w-3.5" />
            {Math.abs(delta).toFixed(1)}%
          </span>
          <p className="mt-1.5 truncate text-xs text-ash-500">{footnote ?? deltaNote}</p>
        </div>
        <Sparkline data={spark} />
      </div>
    </section>
  );
}
