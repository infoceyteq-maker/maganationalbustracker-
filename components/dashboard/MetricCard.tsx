import * as React from 'react';
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sparkline } from './Charts';

/**
 * MetricCard — a matte 3D object on the cream canvas.
 * Icon rests in a neumorphic tile; `highlight` swaps the whole card to the
 * glassy amber gradient (#FFB347 → #FF7B00) with frosted orbs.
 */
export interface MetricCardProps {
  label: string;
  value: string;
  delta: number;
  deltaNote: string;
  icon: LucideIcon;
  spark: number[];
  accent?: boolean;
  highlight?: boolean;
  invertDelta?: boolean;
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
  highlight = false,
  invertDelta = false,
  footnote,
}: MetricCardProps) {
  const positive = invertDelta ? delta < 0 : delta >= 0;
  const Arrow = delta >= 0 ? ArrowUpRight : ArrowDownRight;

  if (highlight) {
    return (
      <section
        className="relative overflow-hidden rounded-3xl bg-amber-glass p-6 text-white shadow-glowAmber transition-all duration-300 hover:-translate-y-[3px]"
        aria-label={label}
      >
        <span className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full bg-white/25 blur-2xl" aria-hidden />
        <span className="pointer-events-none absolute -bottom-12 right-16 h-28 w-28 rounded-full bg-white/15 blur-xl" aria-hidden />
        <div className="relative flex items-start justify-between gap-3">
          <p className="text-[13px] font-semibold text-white/85">{label}</p>
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/25 text-white shadow-insetSoft backdrop-blur-sm">
            <Icon className="h-5 w-5" strokeWidth={2.2} />
          </span>
        </div>
        <p className="tnum relative mt-2 text-[32px] font-extrabold leading-none tracking-tight">{value}</p>
        <div className="relative mt-3 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-0.5 rounded-full bg-white/25 px-2 py-0.5 text-xs font-bold backdrop-blur-sm">
              <Arrow className="h-3.5 w-3.5" />
              {Math.abs(delta).toFixed(1)}%
            </span>
            <p className="mt-1.5 truncate text-xs font-medium text-white/85">{footnote ?? deltaNote}</p>
          </div>
          <Sparkline data={spark} stroke="#FFFFFF" />
        </div>
      </section>
    );
  }

  return (
    <section className="card card-hover p-6" aria-label={label}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-[13px] font-semibold text-ash-500">{label}</p>
        <span
          className={cn(
            'inline-flex h-11 w-11 items-center justify-center rounded-2xl',
            accent ? 'bg-brand-600 text-white shadow-btn3d' : 'bg-[#F4F2EE] text-brand-700 shadow-neu',
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={2.2} />
        </span>
      </div>

      <p className="tnum mt-2 text-[32px] font-extrabold leading-none tracking-tight text-ink">{value}</p>

      <div className="mt-3 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <span
            className={cn(
              'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-bold ring-1 ring-inset',
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
