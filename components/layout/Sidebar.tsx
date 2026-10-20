'use client';

import { Bus, ChevronLeft, Satellite } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV_SECTIONS, type ViewKey } from '@/lib/nav';
import { Avatar } from '@/components/ui/primitives';

/**
 * Sidebar — light-ash rail on a white canvas.
 * Active item: soft emerald wash + emerald label + inset indicator bar.
 * Collapses to an icon rail; fully keyboard accessible.
 */
export function Sidebar({
  active,
  onNavigate,
  collapsed,
  onToggleCollapse,
  approvalsPending,
}: {
  active: ViewKey;
  onNavigate: (v: ViewKey) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  approvalsPending: number;
}) {
  return (
    <aside
      className={cn(
        'sticky top-0 hidden h-screen shrink-0 flex-col border-r border-ash-200 bg-ash-50/70 transition-[width] duration-300 md:flex',
        collapsed ? 'w-[76px]' : 'w-[268px]',
      )}
      aria-label="Primary"
    >
      {/* Brand */}
      <div className={cn('flex items-center gap-3 px-4 pb-2 pt-5', collapsed && 'justify-center px-2')}>
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-brand-600 text-white shadow-cta">
          <Bus className="h-[22px] w-[22px]" strokeWidth={2.2} />
        </span>
        {!collapsed && (
          <span className="min-w-0 leading-tight">
            <span className="block text-[17px] font-extrabold tracking-tight text-ink">
              Maga<span className="text-brand-600">.</span>
            </span>
            <span className="block truncate text-[11px] font-medium uppercase tracking-[0.09em] text-ash-500">
              National Bus Tracker
            </span>
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="mt-4 flex-1 space-y-6 overflow-y-auto px-3 pb-4" aria-label="Console sections">
        {NAV_SECTIONS.map((section) => (
          <div key={section.heading}>
            {!collapsed ? (
              <p className="px-2.5 pb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-ash-400">{section.heading}</p>
            ) : (
              <div className="mx-3 mb-2 border-t border-ash-200" aria-hidden />
            )}
            <ul className="space-y-1">
              {section.items.map((item) => {
                const isActive = active === item.key;
                const Icon = item.icon;
                const badge = item.key === 'approvals' && approvalsPending > 0 ? approvalsPending : null;
                return (
                  <li key={item.key}>
                    <button
                      onClick={() => onNavigate(item.key)}
                      aria-current={isActive ? 'page' : undefined}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        'group relative flex w-full items-center gap-3 rounded-[10px] px-2.5 py-2.5 text-sm transition-all duration-200',
                        collapsed && 'justify-center px-0',
                        isActive
                          ? 'bg-brand-50 font-semibold text-brand-700'
                          : 'font-medium text-ash-600 hover:bg-ash-100 hover:text-ink',
                      )}
                    >
                      {isActive && <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-brand-600" aria-hidden />}
                      <Icon className={cn('h-5 w-5 shrink-0 transition-colors', isActive ? 'text-brand-600' : 'text-ash-400 group-hover:text-ash-600')} strokeWidth={2} />
                      {!collapsed && <span className="min-w-0 flex-1 truncate text-left">{item.label}</span>}
                      {!collapsed && badge !== null && (
                        <span className="tnum inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1.5 text-[11px] font-bold text-white">
                          {badge}
                        </span>
                      )}
                      {collapsed && badge !== null && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand-500 ring-2 ring-ash-50" aria-hidden />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Network status */}
      {!collapsed && (
        <div className="mx-3 mb-3 rounded-xl border border-ash-200 bg-white p-3.5 shadow-card">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brand-500 animate-pulse-dot" aria-hidden />
            <p className="text-[13px] font-semibold text-ink">GPS feed live</p>
            <Satellite className="ml-auto h-4 w-4 text-ash-400" />
          </div>
          <p className="tnum mt-1.5 text-xs leading-relaxed text-ash-500">
            18,940 trackers reporting · 99.98% uptime over the last 30 days.
          </p>
        </div>
      )}

      {/* Signed-in operator + collapse */}
      <div className={cn('flex items-center gap-2.5 border-t border-ash-200 px-4 py-3.5', collapsed && 'flex-col px-2')}>
        <span className="relative">
          <Avatar name="Nadeesha Perera" tone="emerald" />
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-brand-500 ring-2 ring-ash-50" aria-hidden />
        </span>
        {!collapsed && (
          <span className="min-w-0 flex-1 leading-tight">
            <span className="block truncate text-sm font-semibold text-ink">Nadeesha Perera</span>
            <span className="block truncate text-xs text-ash-500">National Operations Admin</span>
          </span>
        )}
        <button
          onClick={onToggleCollapse}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-ash-500 transition-colors hover:bg-ash-100 hover:text-ink"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft className={cn('h-4 w-4 transition-transform duration-300', collapsed && 'rotate-180')} />
        </button>
      </div>
    </aside>
  );
}
