import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Button — premium emerald primary, outlined secondary, ghost tertiary.
 * Radius 8–12px · medium weight label · subtle lift on hover.
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const variants = {
  primary:
    'bg-brand-600 text-white shadow-cta hover:bg-brand-700 hover:-translate-y-px active:translate-y-0',
  secondary:
    'bg-white text-ash-700 border border-ash-300 shadow-sm hover:bg-ash-50 hover:border-ash-400 hover:-translate-y-px active:translate-y-0',
  ghost: 'text-ash-600 hover:bg-ash-100 hover:text-ink',
  danger:
    'bg-white text-red-600 border border-red-200 shadow-sm hover:bg-red-50 hover:border-red-300',
};

const sizes = {
  sm: 'h-8 px-3 text-[13px] rounded-lg gap-1.5',
  md: 'h-10 px-4 text-sm rounded-[10px] gap-2',
  lg: 'h-11 px-5 text-sm rounded-xl gap-2',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex select-none items-center justify-center font-medium transition-all duration-200',
        'disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = 'Button';
