import * as React from 'react';
import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Button — pill-shaped, physically tactile.
 * Primary: solid deep emerald (#0E6A47) with a bevel of top-inner white
 * light and a weighted base shadow; pressing it sinks the button 1px.
 * Amber: glassy #FFB347 → #FF7B00 gradient for highlight moments.
 * Secondary: matte white object resting on the cream canvas.
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'amber' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const variants = {
  primary:
    'bg-brand-600 text-white shadow-btn3d hover:bg-brand-500 active:translate-y-[1px] active:shadow-btn3dPress',
  amber:
    'bg-amber-glass text-white shadow-btnAmber hover:brightness-[1.04] active:translate-y-[1px]',
  secondary:
    'bg-white text-ash-700 border border-cream-line shadow-btnMatte hover:text-ink hover:-translate-y-px active:translate-y-0',
  ghost: 'text-ash-600 hover:bg-white hover:text-ink hover:shadow-btnMatte',
  danger:
    'bg-white text-red-600 border border-red-200 shadow-btnMatte hover:bg-red-50 active:translate-y-[1px]',
};

const sizes = {
  sm: 'h-9 px-4 text-[13px] rounded-full gap-1.5',
  md: 'h-11 px-5 text-sm rounded-full gap-2',
  lg: 'h-12 px-6 text-sm rounded-full gap-2',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex select-none items-center justify-center font-semibold transition-all duration-200',
        'disabled:pointer-events-none disabled:opacity-45 disabled:shadow-none whitespace-nowrap',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = 'Button';

/**
 * LockedButton — RBAC demonstration control.
 * Rendered as a permanently disabled, greyed pill with a padlock. It stays
 * clickable ONLY so the console can explain *why* the action is forbidden
 * (aria-disabled, never performs the action).
 */
export function LockedButton({
  children,
  size = 'md',
  className,
  onExplain,
}: {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onExplain: () => void;
}) {
  return (
    <button
      type="button"
      aria-disabled="true"
      title="Locked by RBAC policy"
      onClick={onExplain}
      className={cn(
        'inline-flex cursor-not-allowed select-none items-center justify-center gap-2 whitespace-nowrap rounded-full',
        'border border-dashed border-ash-300 bg-ash-100/80 font-semibold text-ash-400 shadow-insetSoft',
        size === 'sm' && 'h-9 px-4 text-[13px]',
        size === 'md' && 'h-11 px-5 text-sm',
        size === 'lg' && 'h-12 px-6 text-sm',
        className,
      )}
    >
      <Lock className="h-4 w-4" aria-hidden />
      {children}
    </button>
  );
}
