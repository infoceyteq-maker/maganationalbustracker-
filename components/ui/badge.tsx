import * as React from 'react';
import { cn } from '@/lib/utils';

export type BadgeTone = 'emerald' | 'amber' | 'red' | 'gray' | 'blue' | 'dark';

const tones: Record<BadgeTone, string> = {
  emerald: 'bg-brand-50 text-brand-700 ring-brand-600/20',
  amber: 'bg-[#FFF4E2] text-[#9A5A00] ring-tang-500/30',
  red: 'bg-red-50 text-red-700 ring-red-600/20',
  gray: 'bg-ash-100 text-ash-600 ring-ash-600/10',
  blue: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  dark: 'bg-ink text-white ring-ink/10',
};

const dots: Record<BadgeTone, string> = {
  emerald: 'bg-brand-600',
  amber: 'bg-tang-500',
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
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset',
        tones[tone],
        className,
      )}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', dots[tone])} />}
      {children}
    </span>
  );
}

/** Maps operational + RBAC-pipeline statuses to their semantic badge tone. */
export function statusTone(status: string): BadgeTone {
  switch (status) {
    /* Pipeline */
    case 'Permit Granted':
    case 'Live Tracking Active':
      return 'emerald';
    case 'Pending Depot Verification':
      return 'amber';
    case 'Recommended to Province':
      return 'blue';
    case 'Returned for Correction':
      return 'red';
    /* Accounts */
    case 'Active':
      return 'emerald';
    case 'Invitation Sent':
      return 'blue';
    case 'Suspended':
      return 'red';
    /* Operations */
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
      return 'gray';
  }
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge tone={statusTone(status)} dot>
      {status}
    </Badge>
  );
}
