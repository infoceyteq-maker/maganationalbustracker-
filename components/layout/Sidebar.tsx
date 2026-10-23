'use client';

import { Bus, Check, ChevronLeft, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROLES, ROLE_NAV, type RoleKey, type ViewKey } from '@/lib/roles';
import { Avatar } from '@/components/ui/primitives';

/**
 * Sidebar — a floating matte-white object on the cream canvas.
 * Navigation is generated from the ACTIVE ROLE's permission set: a role
 * literally cannot see functions it is not allowed to perform.
 */
export function Sidebar({
  role,
  active,
  onNavigate,
  collapsed,
  onToggleCollapse,
  badges,
}: {
  role: RoleKey;
  active: ViewKey;
  onNavigate: (v: ViewKey) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  badges: Partial<Record<ViewKey, number>>;
}) {
  const roleDef = ROLES[role];

  return (
    <aside className={cn('sticky top-0 hidden h-screen shrink-0 p-3 pr-0 transition-[width] duration-300 md:block', collapsed ? 'w-[104px]' : 'w-[296px]')} aria-label="Primary">
      <div className="flex h-full flex-col overflow-hidden rounded-[28px] border border-white bg-white shadow-card">
        {/* Brand */}
        <div className={cn('flex items-center gap-3 px-5 pb-2 pt-5', collapsed && 'justify-center px-2')}>
          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-brand-600 text-white shadow-btn3d">
            <Bus className="h-6 w-6" strokeWidth={2.2} />
          </span>
          {!collapsed && (
            <span className="min-w-0 leading-tight">
              <span className="block text-[19px] font-extrabold tracking-tight text-ink">
                Maga<span className="text-brand-600">.</span>
              </span>
              <span className="block truncate text-[10px] font-bold uppercase tracking-[0.12em] text-ash-400">
                National Bus Digitization
              </span>
            </span>
          )}
        </div>

        {/* Role-scoped navigation */}
        <nav className="mt-3 flex-1 space-y-6 overflow-y-auto px-3 pb-3" aria-label={`${roleDef.title} sections`} key={role}>
          {ROLE_NAV[role].map((section) => (
            <div key={section.heading}>
              {!collapsed ? (
                <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-ash-400">{section.heading}</p>
              ) : (
                <div className="mx-3 mb-2 border-t border-cream-line" aria-hidden />
              )}
              <ul className="space-y-1.5">
                {section.items.map((item) => {
                  const isActive = active === item.key;
                  const Icon = item.icon;
                  const badge = badges[item.key];
                  return (
                    <li key={item.key}>
                      <button
                        onClick={() => onNavigate(item.key)}
                        aria-current={isActive ? 'page' : undefined}
                        title={collapsed ? item.label : undefined}
                        className={cn(
                          'group relative flex w-full items-center gap-3 rounded-full px-3.5 py-2.5 text-sm transition-all duration-200',
                          collapsed && 'justify-center px-0',
                          isActive
                            ? 'bg-brand-600 font-bold text-white shadow-btn3d'
                            : 'font-semibold text-ash-600 hover:bg-[#F7F4EC] hover:text-ink',
                        )}
                      >
                        <Icon className={cn('h-5 w-5 shrink-0', isActive ? 'text-white' : 'text-ash-400 group-hover:text-brand-700')} strokeWidth={2.2} />
                        {!collapsed && <span className="min-w-0 flex-1 truncate text-left">{item.label}</span>}
                        {!collapsed && badge !== undefined && badge > 0 && (
                          <span
                            className={cn(
                              'tnum inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-extrabold',
                              isActive ? 'bg-white text-brand-700' : 'bg-amber-glass text-white shadow-btnAmber',
                            )}
                          >
                            {badge}
                          </span>
                        )}
                        {collapsed && badge !== undefined && badge > 0 && (
                          <span className="absolute right-2.5 top-2 h-2 w-2 rounded-full bg-tang-500 ring-2 ring-white" aria-hidden />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Your access — live RBAC summary for the signed-in role */}
        {!collapsed && (
          <div className="mx-3 mb-3 rounded-[20px] bg-[#F7F4EC] p-4 shadow-insetSoft">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-ash-400">Your access · {roleDef.title}</p>
            <ul className="mt-2.5 space-y-1.5">
              {roleDef.can.slice(0, 2).map((c) => (
                <li key={c} className="flex items-start gap-1.5 text-xs font-medium leading-snug text-ash-700">
                  <Check className="mt-px h-3.5 w-3.5 shrink-0 text-brand-600" strokeWidth={3} /> {c}
                </li>
              ))}
              {roleDef.locked.slice(0, 2).map((l) => (
                <li key={l} className="flex items-start gap-1.5 text-xs font-medium leading-snug text-ash-400">
                  <Lock className="mt-px h-3.5 w-3.5 shrink-0" /> {l}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Signed-in identity + collapse */}
        <div className={cn('flex items-center gap-2.5 border-t border-cream-line px-4 py-3.5', collapsed && 'flex-col px-2')}>
          <span className="relative">
            <Avatar name={roleDef.person} tone={role === 'crew' ? 'amber' : 'emerald'} />
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-brand-600 ring-2 ring-white" aria-hidden />
          </span>
          {!collapsed && (
            <span className="min-w-0 flex-1 leading-tight">
              <span className="block truncate text-sm font-bold text-ink">{roleDef.person}</span>
              <span className="block truncate text-[11px] font-medium text-ash-500">
                {roleDef.title} · {roleDef.organisation}
              </span>
            </span>
          )}
          <button
            onClick={onToggleCollapse}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ash-500 transition-all hover:bg-[#F7F4EC] hover:text-ink"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeft className={cn('h-4 w-4 transition-transform duration-300', collapsed && 'rotate-180')} />
          </button>
        </div>
      </div>
    </aside>
  );
}
