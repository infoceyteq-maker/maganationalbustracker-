import * as React from 'react';
import { cn } from '@/lib/utils';

export type BadgeTone = 'emerald' | 'amber' | 'red' | 'gray' | 'blue' | 'dark';

const tones: Record<BadgeTone, string> = {
  emerald: 'bg-brand-50 text-brand-700 ring-brand-600/20',
  amber: 'bg-amber-50 text-amber-700 ring-amber-600/25',
  red: 'bg-red-50 text-red-700 ring-red-600/20',
  gray: 'bg-ash-100 text-ash-600 ring-ash-600/10',
  blue: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  dark: 'bg-ink text-white ring-ink/10',
};

const dots: Record<BadgeTone, string> = {
  emerald: 'bg-brand-500',
  amber: 'bg-amber-500',
  red: 'bg-red-500',
  gray: 'bg-ash-400',
  blue: 'bg-blue-500',
  dark: 'bg-white',
};

export function Badge({
  tone = 'gray',
  dot = false,
  className,
  children,
}: {
  tone?: BadgeTone;
  dot?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset',
        tones[tone],
        className,
      )}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', dots[tone])} />}
      {children}
    </span>
  );
}

/** Maps operational statuses to their semantic badge tone. */
export function statusTone(status: string): BadgeTone {
  switch (status) {
    case 'On Route':
    case 'In Progress':
    case 'Operational':
    case 'On Duty':
    case 'Approved':
    case 'Completed':
      return 'emerald';
    case 'Delayed':
    case 'Pending':
    case 'Partial Service':
    case 'On Leave':
      return 'amber';
    case 'Maintenance':
    case 'Rejected':
      return 'red';
    case 'Boarding':
      return 'blue';
    default:
      return 'gray'; // Scheduled / At Depot / Off Duty
  }
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge tone={statusTone(status)} dot>
      {status}
    </Badge>
  );
}
