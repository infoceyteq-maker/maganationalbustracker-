import * as React from 'react';
import { cn } from '@/lib/utils';

/** Card — a matte-white 3D object (rounded-3xl) resting on the cream canvas. */
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('card', className)} {...props} />;
}

export function CardHeader({
  title,
  subtitle,
  action,
  className,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-wrap items-start justify-between gap-3 px-6 pt-6', className)}>
      <div className="min-w-0">
        <h3 className="truncate text-base font-extrabold tracking-tight text-ink">{title}</h3>
        {subtitle && <p className="mt-0.5 text-[13px] font-normal text-ash-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function CardBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-6 pb-6 pt-4', className)} {...props} />;
}
