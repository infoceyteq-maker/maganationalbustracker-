'use client';

import * as React from 'react';
import { Bell, Bus, ChevronRight, Menu, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROLES, ROLE_ORDER, navItemFor, type RoleKey, type ViewKey } from '@/lib/roles';
import { NOTIFICATIONS, type RegistrationSearchHit } from '@/lib/searchTypes';
import { StatusBadge } from '@/components/ui/badge';

/**
 * Navbar — a floating glass pill-bar.
 * Centrepiece: the ROLE SWITCHER. Switching role rebuilds the entire
 * console (nav, identity, permissions) to prove the RBAC boundaries.
 */
export function Navbar({
  role,
  view,
  onSwitchRole,
  onOpenMobileNav,
  notify,
  searchHits,
}: {
  role: RoleKey;
  view: ViewKey;
  onSwitchRole: (r: RoleKey) => void;
  onOpenMobileNav: () => void;
  notify: (title: string, detail?: string) => void;
  searchHits: (q: string) => RegistrationSearchHit[];
}) {
  const [clock, setClock] = React.useState('');
  const [query, setQuery] = React.useState('');
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [notifOpen, setNotifOpen] = React.useState(false);
  const [readAll, setReadAll] = React.useState(false);

  React.useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);

  const unread = readAll ? 0 : NOTIFICATIONS.filter((n) => n.unread).length;
  const item = navItemFor(role, view);
  const hits = React.useMemo(() => searchHits(query), [searchHits, query]);
  const roleDef = ROLES[role];

  return (
    <header className="sticky top-3 z-40 px-4 sm:px-6 lg:px-8">
      {(searchOpen || notifOpen) && (
        <button className="fixed inset-0 z-0 cursor-default" aria-hidden tabIndex={-1} onClick={() => { setSearchOpen(false); setNotifOpen(false); }} />
      )}

      <div className="relative z-10 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-[24px] border border-white bg-white/85 px-4 py-2.5 shadow-card backdrop-blur-xl sm:px-5">
        <button
          onClick={onOpenMobileNav}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ash-600 transition-all hover:bg-[#F7F4EC] md:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Breadcrumb / title */}
        <div className="min-w-0">
          <nav className="hidden items-center gap-1 text-[11px] font-medium text-ash-400 sm:flex" aria-label="Breadcrumb">
            <span>{roleDef.organisation}</span>
            <ChevronRight className="h-3 w-3" aria-hidden />
            <span className="text-ash-600">{item?.breadcrumb ?? ''}</span>
          </nav>
          <h1 className="truncate text-[17px] font-extrabold leading-tight tracking-tight text-ink">{item?.label ?? ''}</h1>
        </div>

        {/* Search registrations */}
        <div className="relative order-3 w-full sm:order-none sm:mx-auto sm:w-auto sm:max-w-xs sm:flex-1 lg:max-w-sm">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ash-400" />
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setSearchOpen(true); }}
              onFocus={() => setSearchOpen(true)}
              placeholder="Search by number plate or owner…"
              className="input h-10 rounded-full pl-10"
              aria-label="Search registrations"
            />
          </div>
          {searchOpen && query.trim() && (
            <div className="card absolute left-0 right-0 top-[calc(100%+10px)] z-20 max-h-80 overflow-y-auto p-2 shadow-pop animate-fade-in">
              {hits.length === 0 && <p className="px-3 py-4 text-sm text-ash-500">No registrations match “{query}”.</p>}
              {hits.map((h) => (
                <button
                  key={h.id}
                  onClick={() => {
                    setSearchOpen(false);
                    notify(`${h.regNo} · ${h.status}`, `${h.ownerName} · ${h.routeApplied} · ${h.depot} depot, ${h.province} Province.`);
                  }}
                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors hover:bg-[#F7F4EC]"
                >
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F4F2EE] text-brand-700 shadow-neuSm">
                    <Bus className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="tnum block truncate text-sm font-bold text-ink">{h.regNo}</span>
                    <span className="block truncate text-xs text-ash-500">{h.ownerName} · {h.routeApplied}</span>
                  </span>
                  <StatusBadge status={h.status} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Role switcher — the RBAC proof */}
        <div className="ml-auto flex items-center gap-2 sm:ml-0">
          <div className="flex items-center rounded-full bg-[#F1EEE5] p-1 shadow-insetSoft" role="tablist" aria-label="Switch role (RBAC demo)">
            {ROLE_ORDER.map((r) => {
              const def = ROLES[r];
              const Icon = def.icon;
              const activeRole = role === r;
              return (
                <button
                  key={r}
                  role="tab"
                  aria-selected={activeRole}
                  title={`${def.title} — ${def.scopeLabel}`}
                  onClick={() => onSwitchRole(r)}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold transition-all duration-200',
                    activeRole ? 'bg-brand-600 text-white shadow-btn3d' : 'text-ash-500 hover:text-ink',
                  )}
                >
                  <Icon className="h-3.5 w-3.5" strokeWidth={2.4} />
                  <span className="hidden xl:inline">{def.short}</span>
                </button>
              );
            })}
          </div>

          {/* Live clock */}
          <span className="hidden items-center gap-1.5 rounded-full bg-[#F1EEE5] px-3 py-2 shadow-insetSoft lg:inline-flex" aria-label="Live time">
            <span className="h-2 w-2 rounded-full bg-brand-600 animate-pulse-dot" aria-hidden />
            <span className="tnum text-xs font-extrabold text-ink">{clock || '--:--'}</span>
          </span>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen((o) => !o)}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-ash-600 shadow-btnMatte transition-all hover:text-ink"
              aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
            >
              <Bell className="h-5 w-5" />
              {unread > 0 && (
                <span className="tnum absolute -right-0.5 -top-0.5 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-amber-glass px-1 text-[10px] font-extrabold text-white ring-2 ring-white">
                  {unread}
                </span>
              )}
            </button>
            {notifOpen && (
              <div className="card absolute right-0 top-[calc(100%+10px)] z-20 w-[340px] max-w-[86vw] shadow-pop animate-fade-in">
                <div className="flex items-center justify-between px-5 py-4">
                  <p className="text-sm font-extrabold text-ink">Notifications</p>
                  <button
                    className="text-xs font-bold text-brand-700 hover:text-brand-600"
                    onClick={() => { setReadAll(true); notify('All caught up', 'Every notification has been marked as read.'); }}
                  >
                    Mark all read
                  </button>
                </div>
                <ul className="max-h-80 divide-y divide-ash-100 overflow-y-auto px-2 pb-2">
                  {NOTIFICATIONS.map((n) => (
                    <li key={n.id} className="flex gap-3 rounded-2xl px-3 py-3 transition-colors hover:bg-[#F7F4EC]">
                      <span className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', n.unread && !readAll ? 'bg-tang-500' : 'bg-ash-200')} />
                      <span>
                        <span className="block text-[13px] font-bold leading-snug text-ink">{n.title}</span>
                        <span className="mt-0.5 block text-xs leading-relaxed text-ash-500">{n.detail}</span>
                        <span className="mt-1 block text-[11px] font-semibold text-ash-400">{n.time}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scope ribbon — states exactly whose eyes you are looking through */}
      <p className="relative z-0 mx-2 mt-2 flex flex-wrap items-center gap-x-2 gap-y-0.5 px-3 text-xs font-medium text-ash-500">
        <roleDef.icon className="h-3.5 w-3.5 text-brand-700" aria-hidden />
        Viewing as <span className="font-extrabold text-ink">{roleDef.person}</span> · {roleDef.title} · scope:
        <span className="font-bold text-brand-700">{roleDef.scopeLabel}</span>
        <span className="hidden text-ash-400 sm:inline">— switch roles above to watch permissions change.</span>
      </p>
    </header>
  );
}
