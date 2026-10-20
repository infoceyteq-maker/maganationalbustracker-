'use client';

import * as React from 'react';
import { CalendarClock, CheckCircle2, Flag, Play, Plus } from 'lucide-react';
import { TRIPS, type Trip } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/badge';
import { PersonCell, ProgressBar, RouteChip } from '@/components/ui/primitives';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { DataTable, type Column } from '@/components/dashboard/DataTable';

export function TripsView({ notify }: { notify: (title: string, detail?: string) => void }) {
  const [trips, setTrips] = React.useState<Trip[]>(TRIPS);

  const setStatus = (trip: Trip, status: Trip['status']) => {
    setTrips((prev) => prev.map((t) => (t.id === trip.id ? { ...t, status } : t)));
    if (status === 'In Progress') {
      notify(`Trip started · ${trip.code}`, `${trip.bus} departed ${trip.from} for ${trip.to}. Passengers can now track it live in the Maga app.`);
    } else {
      notify(`Trip completed · ${trip.code}`, `${trip.bus} arrived at ${trip.to}. Fare reconciliation has been queued.`);
    }
  };

  const columns: Column<Trip>[] = [
    {
      key: 'trip',
      header: 'Trip',
      sortValue: (t) => t.code,
      render: (t) => (
        <span className="flex min-w-[150px] items-center gap-2.5">
          <RouteChip code={t.routeCode} />
          <span className="tnum text-[13px] font-semibold text-ink">{t.code}</span>
        </span>
      ),
    },
    {
      key: 'journey',
      header: 'Journey',
      sortValue: (t) => t.from,
      render: (t) => (
        <span className="block min-w-[190px]">
          <span className="block font-medium text-ink">
            {t.from} <span className="text-ash-400">→</span> {t.to}
          </span>
          <span className="tnum block text-xs text-ash-500">Bus {t.bus}</span>
        </span>
      ),
    },
    {
      key: 'time',
      header: 'Schedule',
      sortValue: (t) => t.depart,
      render: (t) => (
        <span className="tnum whitespace-nowrap font-medium text-ink">
          {t.depart} <span className="font-normal text-ash-400">→ {t.arrive}</span>
        </span>
      ),
    },
    {
      key: 'driver',
      header: 'Driver',
      sortValue: (t) => t.driver,
      hideOnMobile: true,
      render: (t) => <PersonCell name={t.driver} />,
    },
    {
      key: 'pax',
      header: 'Passengers',
      sortValue: (t) => t.passengers / t.capacity,
      render: (t) => (
        <span className="flex min-w-[120px] items-center gap-2">
          <ProgressBar value={t.passengers} max={t.capacity} className="w-16" />
          <span className="tnum text-xs text-ash-500">
            {t.passengers}/{t.capacity}
          </span>
        </span>
      ),
    },
    { key: 'status', header: 'Status', sortValue: (t) => t.status, render: (t) => <StatusBadge status={t.status} /> },
    {
      key: 'action',
      header: '',
      align: 'right',
      render: (t) =>
        t.status === 'Scheduled' || t.status === 'Boarding' ? (
          <Button size="sm" onClick={() => setStatus(t, 'In Progress')}>
            <Play className="h-3.5 w-3.5" /> Start Trip
          </Button>
        ) : t.status === 'In Progress' || t.status === 'Delayed' ? (
          <Button variant="secondary" size="sm" onClick={() => setStatus(t, 'Completed')}>
            <Flag className="h-3.5 w-3.5 text-brand-600" /> Complete
          </Button>
        ) : (
          <span className="inline-flex items-center gap-1.5 pr-2 text-[13px] font-medium text-ash-400">
            <CheckCircle2 className="h-4 w-4 text-brand-500" /> Done
          </span>
        ),
    },
  ];

  const active = trips.filter((t) => t.status === 'In Progress').length;
  const boarding = trips.filter((t) => t.status === 'Boarding').length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Departures Today" value="8,412" delta={3.1} deltaNote="vs yesterday" icon={CalendarClock} spark={[7600, 7850, 8020, 8180, 8305, 8412]} footnote="across 1,204 routes" />
        <MetricCard label="Trips In Progress (sample)" value={String(active)} delta={0} deltaNote="live" icon={Play} accent spark={[2, 3, 4, 5, 5, Math.max(active, 1)]} footnote={`${boarding} boarding now`} />
        <MetricCard label="Completed On Time" value="92.1%" delta={1.4} deltaNote="vs last week" icon={CheckCircle2} spark={[88, 89, 90, 90, 91, 92]} footnote="of today's finished trips" />
        <MetricCard label="Cancelled Trips" value="37" delta={-12.0} invertDelta deltaNote="vs yesterday" icon={Flag} spark={[58, 52, 49, 44, 41, 37]} footnote="0.4% of scheduled departures" />
      </div>

      <DataTable<Trip>
        title="Today’s Trip Board"
        subtitle="Dispatch departures with one tap — passengers see the change instantly"
        columns={columns}
        rows={trips}
        rowKey={(t) => t.id}
        searchText={(t) => `${t.code} ${t.routeCode} ${t.from} ${t.to} ${t.bus} ${t.driver} ${t.status}`}
        searchPlaceholder="Search trips by code, town, bus…"
        filterBy={(t) => t.status}
        pageSize={8}
        primaryAction={
          <Button onClick={() => notify('New trip', 'The trip scheduler is part of the next milestone — try “Start Trip” on a scheduled departure.')}>
            <Plus className="h-4 w-4" /> New Trip
          </Button>
        }
      />
    </div>
  );
}
