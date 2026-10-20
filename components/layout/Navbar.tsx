'use client';

import * as React from 'react';
import { Bell, Bus, ChevronDown, ChevronRight, LifeBuoy, LogOut, Menu, Play, Route as RouteIcon, Search, UserRound } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV_BY_KEY, type ViewKey } from '@/lib/nav';
import { BUSES, NOTIFICATIONS, ROUTES } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/primitives';

/**
 * Navbar (top bar) — pure-white, hairline bottom border.
 * Breadcrumb + global search + live clock + notifications + profile + CTA.
 * Emerald is reserved for the primary action and live indicators.
 */
export function Navbar({
  view,
  onNavigate,
  onOpenMobileNav,
  notify,
}: {
  view: ViewKey;
  onNavigate: (v: ViewKey) => void;
  onOpenMobileNav: () => void;
  notify: (title: string, detail?: string) => void;
}) {
  const [clock, setClock] = React.useState('');
  const [query, setQuery] = React.useState('');
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [notifOpen, setNotifOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [readAll, setReadAll] = React.useState(false);

  React.useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const unread = readAll ? 0 : NOTIFICATIONS.filter((n) => n.unread).length;
  const item = NAV_BY_KEY[view];

  const busHits = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return BUSES.filter((b) => `${b.reg} ${b.routeCode} ${b.routeName} ${b.driver}`.toLowerCase().includes(q)).slice(0, 4);
  }, [query]);
  const routeHits = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return ROUTES.filter((r) => `${r.code} ${r.name}`.toLowerCase().includes(q)).slice(0, 3);
  }, [query]);

  const closeAll = () => {
    setSearchOpen(false);
    setNotifOpen(false);
    setProfileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-ash-200 bg-white/90 backdrop-blur-md">
      {(searchOpen || notifOpen || profileOpen) && (
        <button className="fixed inset-0 z-0 cursor-default" aria-hidden tabIndex={-1} onClick={closeAll} />
      )}

      <div className="relative z-10 flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        {/* Mobile menu */}
        <button
          onClick={onOpenMobileNav}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-ash-600 transition-colors hover:bg-ash-100 md:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Breadcrumb / page title */}
        <div className="min-w-0">
          <nav className="hidden items-center gap-1 text-xs text-ash-400 sm:flex" aria-label="Breadcrumb">
            <span>Maga Console</span>
            <ChevronRight className="h-3 w-3" aria-hidden />
            <span className="font-medium text-ash-600">{item.breadcrumb}</span>
          </nav>
          <h1 className="truncate text-[17px] font-extrabold leading-tight tracking-tight text-ink">{item.label}</h1>
        </div>

        {/* Global search */}
        <div className="relative mx-auto w-full max-w-md flex-1 px-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ash-400" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              placeholder="Search buses, routes, drivers…"
              className="input pl-9 pr-14"
              aria-label="Global search"
            />
            <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded-md border border-ash-200 bg-ash-50 px-1.5 py-0.5 text-[10px] font-semibold text-ash-400 sm:block">
              ⌘K
            </kbd>
          </div>

          {searchOpen && query.trim() && (
            <div className="card absolute left-0 right-0 top-[calc(100%+8px)] z-20 max-h-80 overflow-y-auto p-2 shadow-pop animate-fade-in">
              {busHits.length === 0 && routeHits.length === 0 && (
                <p className="px-3 py-4 text-sm text-ash-500">No matches for “{query}”.</p>
              )}
              {busHits.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    closeAll();
                    onNavigate('fleet');
                    notify(`Bus ${b.reg}`, `${b.routeName} · driven by ${b.driver} · ${b.status}`);
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-ash-50"
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-ash-100 text-ash-600">
                    <Bus className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="tnum block truncate text-sm font-semibold text-ink">{b.reg}</span>
                    <span className="block truncate text-xs text-ash-500">Route {b.routeCode} · {b.routeName}</span>
                  </span>
                  <span className={cn('h-2 w-2 rounded-full', b.status === 'Delayed' ? 'bg-amber-500' : b.status === 'On Route' ? 'bg-brand-500' : 'bg-ash-300')} />
                </button>
              ))}
              {routeHits.map((r) => (
                <button
                  key={r.code}
                  onClick={() => {
                    closeAll();
                    onNavigate('routes');
                    notify(`Route ${r.code}`, `${r.name} · ${r.distanceKm} km · fare LKR ${r.fare}`);
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-ash-50"
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                    <RouteIcon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="tnum block truncate text-sm font-semibold text-ink">Route {r.code}</span>
                    <span className="block truncate text-xs text-ash-500">{r.name}</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Live clock */}
        <div className="hidden items-center gap-2 rounded-full border border-ash-200 bg-ash-50 py-1.5 pl-3 pr-3.5 lg:flex" aria-label="Live network time">
          <span className="h-2 w-2 rounded-full bg-brand-500 animate-pulse-dot" aria-hidden />
          <span className="tnum text-[13px] font-semibold text-ink">{clock || '--:--:--'}</span>
          <span className="text-[11px] font-medium uppercase tracking-wide text-ash-400">IST · Live</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setNotifOpen((o) => !o);
              setProfileOpen(false);
            }}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-[10px] text-ash-600 transition-colors hover:bg-ash-100 hover:text-ink"
            aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
          >
            <Bell className="h-5 w-5" />
            {unread > 0 && (
              <span className="tnum absolute -right-0.5 -top-0.5 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                {unread}
              </span>
            )}
          </button>
          {notifOpen && (
            <div className="card absolute right-0 top-[calc(100%+8px)] z-20 w-[340px] max-w-[86vw] shadow-pop animate-fade-in">
              <div className="flex items-center justify-between border-b border-ash-100 px-4 py-3">
                <p className="text-sm font-bold text-ink">Notifications</p>
                <button
                  className="text-xs font-medium text-brand-700 hover:text-brand-600"
                  onClick={() => {
                    setReadAll(true);
                    notify('All caught up', 'Every notification has been marked as read.');
                  }}
                >
                  Mark all read
                </button>
              </div>
              <ul className="max-h-80 divide-y divide-ash-100 overflow-y-auto">
                {NOTIFICATIONS.map((n) => (
                  <li key={n.id} className="flex gap-3 px-4 py-3 transition-colors hover:bg-ash-50">
                    <span className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', n.unread && !readAll ? 'bg-brand-500' : 'bg-ash-200')} />
                    <span>
                      <span className="block text-[13px] font-semibold leading-snug text-ink">{n.title}</span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-ash-500">{n.detail}</span>
                      <span className="mt-1 block text-[11px] font-medium text-ash-400">{n.time}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Primary CTA */}
        <Button
          className="hidden sm:inline-flex"
          onClick={() => {
            onNavigate('trips');
            notify('Trip planner ready', 'Pick a scheduled departure and press “Start Trip” to dispatch it.');
          }}
        >
          <Play className="h-4 w-4" /> Start Trip
        </Button>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => {
              setProfileOpen((o) => !o);
              setNotifOpen(false);
            }}
            className="flex items-center gap-2 rounded-[10px] p-1 transition-colors hover:bg-ash-100"
            aria-label="Account menu"
          >
            <Avatar name="Nadeesha Perera" tone="emerald" />
            <ChevronDown className={cn('h-4 w-4 text-ash-400 transition-transform', profileOpen && 'rotate-180')} />
          </button>
          {profileOpen && (
            <div className="card absolute right-0 top-[calc(100%+8px)] z-20 w-60 p-2 shadow-pop animate-fade-in">
              <div className="flex items-center gap-3 px-2.5 py-2">
                <Avatar name="Nadeesha Perera" tone="emerald" size="lg" />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold text-ink">Nadeesha Perera</span>
                  <span className="block truncate text-xs text-ash-500">nadeesha.perera@transport.gov.lk</span>
                </span>
              </div>
              <div className="my-1.5 border-t border-ash-100" />
              {[
                { icon: UserRound, label: 'My profile', action: () => onNavigate('settings') },
                { icon: LifeBuoy, label: 'Support centre', action: () => notify('Support', 'The operations support desk replies within one business hour.') },
              ].map((row) => (
                <button
                  key={row.label}
                  onClick={() => {
                    closeAll();
                    row.action();
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-ash-700 transition-colors hover:bg-ash-50 hover:text-ink"
                >
                  <row.icon className="h-4 w-4 text-ash-400" /> {row.label}
                </button>
              ))}
              <div className="my-1.5 border-t border-ash-100" />
              <button
                onClick={() => {
                  closeAll();
                  notify('Signed out (demo)', 'Authentication is illustrative in this design preview.');
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
