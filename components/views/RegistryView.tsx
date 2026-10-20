'use client';

import * as React from 'react';
import { Bus as BusIcon, Eye, Lock, ShieldCheck, Star, Users } from 'lucide-react';
import { cn, fmt } from '@/lib/utils';
import { BUSES, DRIVERS, type Bus, type Driver } from '@/lib/data';
import type { Registration } from '@/lib/pipeline';
import { LockedButton } from '@/components/ui/button';
import { Badge, StatusBadge } from '@/components/ui/badge';
import { PersonCell, ProgressBar, RouteChip } from '@/components/ui/primitives';
import { DataTable, type Column } from '@/components/dashboard/DataTable';

/**
 * MASTER ADMIN — National Register (READ-ONLY).
 * The register is a mirror of crew self-registrations that survived depot
 * verification + provincial permitting. There is no "Add" — only locks.
 */
export function RegistryView({
  registrations,
  notify,
}: {
  registrations: Registration[];
  notify: (t: string, d?: string) => void;
}) {
  const [tab, setTab] = React.useState<'buses' | 'drivers'>('buses');

  const grantedAsBuses: Bus[] = registrations
    .filter((r) => r.status === 'Permit Granted')
    .map((r) => ({
      id: r.id,
      reg: r.regNo,
      model: r.make,
      operator: 'Private' as const,
      routeCode: r.routeApplied.split('·')[0].trim(),
      routeName: r.routeApplied.split('·')[1]?.trim() ?? r.routeApplied,
      driver: r.driverName,
      depot: r.depot,
      status: 'On Route' as const,
      occupancy: 0,
      capacity: r.seats,
      fuel: 100,
      speed: 0,
      lastPing: 'live',
      nextStop: `Permit ${r.permitNo ?? ''}`,
    }));

  const knownRegs = new Set(BUSES.map((b) => b.reg));
  const mergedBuses: Bus[] = [...grantedAsBuses.filter((b) => !knownRegs.has(b.reg)), ...BUSES];

  const lockMsg = (what: string) =>
    notify(
      `🔒 ${what} is disabled for admins`,
      'This register is read-only. New records arrive exclusively through Crew Self-Registration → Depot Verification → Provincial Permit. Switch to the Crew App role (top-right) to see where data is born.',
    );

  const busColumns: Column<Bus>[] = [
    {
      key: 'bus', header: 'Bus', sortValue: (b) => b.reg,
      render: (b) => (
        <span className="block min-w-[150px]">
          <span className="flex items-center gap-2">
            <span className="tnum font-extrabold text-ink">{b.reg}</span>
            <Badge tone={b.operator === 'SLTB' ? 'dark' : 'gray'} className="px-1.5 py-0 text-[10px] font-bold">{b.operator}</Badge>
          </span>
          <span className="block text-xs text-ash-500">{b.model}</span>
        </span>
      ),
    },
    {
      key: 'route', header: 'Permitted Route', sortValue: (b) => b.routeCode,
      render: (b) => (
        <span className="flex min-w-[180px] items-center gap-2.5">
          <RouteChip code={b.routeCode} />
          <span className="truncate font-semibold text-ink">{b.routeName}</span>
        </span>
      ),
    },
    { key: 'driver', header: 'Driver (self-registered)', sortValue: (b) => b.driver, hideOnMobile: true, render: (b) => <PersonCell name={b.driver} sub={b.depot} /> },
    {
      key: 'occ', header: 'Occupancy', sortValue: (b) => b.occupancy / b.capacity,
      render: (b) => (
        <span className="flex min-w-[120px] items-center gap-2">
          <ProgressBar value={b.occupancy} max={b.capacity} className="w-16" />
          <span className="tnum text-xs text-ash-500">{b.occupancy}/{b.capacity}</span>
        </span>
      ),
    },
    { key: 'status', header: 'Status', sortValue: (b) => b.status, render: (b) => <StatusBadge status={b.status} /> },
    {
      key: 'origin', header: 'Record Origin', hideOnMobile: true,
      render: () => <Badge tone="emerald">Crew Self-Registration</Badge>,
    },
  ];

  const driverColumns: Column<Driver>[] = [
    { key: 'driver', header: 'Driver', sortValue: (d) => d.name, render: (d) => <PersonCell name={d.name} sub={`${d.depot} depot`} /> },
    { key: 'lic', header: 'Licence No.', sortValue: (d) => d.licence, render: (d) => <span className="tnum whitespace-nowrap font-semibold text-ink">{d.licence}</span> },
    { key: 'trips', header: 'Trips Done', sortValue: (d) => d.tripsCompleted, align: 'right', render: (d) => <span className="tnum font-bold text-ink">{fmt(d.tripsCompleted)}</span> },
    {
      key: 'rating', header: 'Rating', sortValue: (d) => d.rating,
      render: (d) => (
        <span className="flex items-center gap-1.5">
          <Star className="h-4 w-4 fill-tang-400 text-tang-400" />
          <span className="tnum font-bold text-ink">{d.rating.toFixed(1)}</span>
        </span>
      ),
    },
    { key: 'status', header: 'Status', sortValue: (d) => d.status, render: (d) => <StatusBadge status={d.status} /> },
    { key: 'origin', header: 'Record Origin', hideOnMobile: true, render: () => <Badge tone="emerald">Crew Self-Registration</Badge> },
  ];

  return (
    <div className="space-y-6">
      {/* Read-only compliance banner */}
      <div className="card flex flex-col gap-4 p-6 animate-fade-up lg:flex-row lg:items-center">
        <span className="inline-flex shrink-0 items-center justify-center rounded-[20px] bg-[#F4F2EE] p-3.5 text-brand-700 shadow-neu">
          <Eye className="h-6 w-6" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="flex flex-wrap items-center gap-2 text-lg font-extrabold tracking-tight text-ink">
            National Register <Badge tone="amber" dot>Read-only for all admins</Badge>
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ash-500">
            Every record below was <span className="font-bold text-ink">self-registered by its crew</span>, physically verified at a
            depot, and permitted by a province. No admin typed, edited or back-dated a single field — the “Add” controls are
            permanently locked to prove it.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <LockedButton onExplain={() => lockMsg('Add Bus')}>Add Bus</LockedButton>
          <LockedButton onExplain={() => lockMsg('Add Driver')}>Add Driver</LockedButton>
        </div>
      </div>

      {/* Tabs */}
      <div className="inline-flex rounded-full bg-[#F1EEE5] p-1 shadow-insetSoft" role="tablist" aria-label="Register type">
        {(
          [
            { key: 'buses' as const, icon: BusIcon, label: `Buses (${mergedBuses.length})` },
            { key: 'drivers' as const, icon: Users, label: `Drivers & Crew (${DRIVERS.length})` },
          ]
        ).map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              'inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-all',
              tab === t.key ? 'bg-white text-ink shadow-btnMatte' : 'text-ash-500 hover:text-ink',
            )}
          >
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      {tab === 'buses' ? (
        <DataTable<Bus>
          title="Permit-Live Buses"
          subtitle="Mirror of verified self-registrations · corrections only via return-to-crew"
          columns={busColumns}
          rows={mergedBuses}
          rowKey={(b) => b.id + b.reg}
          searchText={(b) => `${b.reg} ${b.model} ${b.routeCode} ${b.routeName} ${b.driver} ${b.depot} ${b.status}`}
          searchPlaceholder="Search the register…"
          filterBy={(b) => b.status}
          pageSize={8}
          primaryAction={<LockedButton size="sm" onExplain={() => lockMsg('Add Bus')}>Add Bus</LockedButton>}
        />
      ) : (
        <DataTable<Driver>
          title="Registered Drivers & Crew"
          subtitle="Licence details supplied by crews themselves and verified at depots"
          columns={driverColumns}
          rows={DRIVERS}
          rowKey={(d) => d.id}
          searchText={(d) => `${d.name} ${d.depot} ${d.licence} ${d.status}`}
          searchPlaceholder="Search crew…"
          filterBy={(d) => d.status}
          pageSize={8}
          primaryAction={<LockedButton size="sm" onExplain={() => lockMsg('Add Driver')}>Add Driver</LockedButton>}
        />
      )}

      <p className="flex items-center gap-2 px-2 text-xs font-medium text-ash-500">
        <ShieldCheck className="h-4 w-4 shrink-0 text-brand-700" />
        <Lock className="hidden h-3.5 w-3.5" aria-hidden />
        Audit guarantee: the API itself rejects bus/driver writes from admin tokens (HTTP 403 · RBAC_DENY). The UI lock you see is
        cosmetic honesty on top of a server-side wall.
      </p>
    </div>
  );
}
