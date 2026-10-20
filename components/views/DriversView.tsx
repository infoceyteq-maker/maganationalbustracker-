'use client';

import { Award, Phone, Plus, Star, Users } from 'lucide-react';
import { cn, fmt } from '@/lib/utils';
import { DRIVERS, type Driver } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/badge';
import { PersonCell } from '@/components/ui/primitives';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { DataTable, type Column } from '@/components/dashboard/DataTable';

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-2" aria-label={`Rated ${rating} of 5`}>
      <span className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={cn('h-3.5 w-3.5', i <= Math.round(rating) ? 'fill-brand-500 text-brand-500' : 'fill-ash-200 text-ash-200')}
          />
        ))}
      </span>
      <span className="tnum text-[13px] font-semibold text-ink">{rating.toFixed(1)}</span>
    </span>
  );
}

export function DriversView({ notify }: { notify: (title: string, detail?: string) => void }) {
  const columns: Column<Driver>[] = [
    {
      key: 'driver',
      header: 'Driver',
      sortValue: (d) => d.name,
      render: (d) => <PersonCell name={d.name} sub={`${d.depot} depot`} />,
    },
    {
      key: 'licence',
      header: 'Licence No.',
      sortValue: (d) => d.licence,
      render: (d) => <span className="tnum whitespace-nowrap font-medium text-ink">{d.licence}</span>,
    },
    {
      key: 'contact',
      header: 'Contact',
      sortValue: (d) => d.phone,
      hideOnMobile: true,
      render: (d) => (
        <span className="tnum flex items-center gap-1.5 whitespace-nowrap text-ash-600">
          <Phone className="h-3.5 w-3.5 text-ash-400" /> {d.phone}
        </span>
      ),
    },
    {
      key: 'exp',
      header: 'Experience',
      sortValue: (d) => parseInt(d.experience),
      hideOnMobile: true,
      render: (d) => <span className="font-medium text-ink">{d.experience}</span>,
    },
    {
      key: 'trips',
      header: 'Trips Done',
      sortValue: (d) => d.tripsCompleted,
      align: 'right',
      render: (d) => <span className="tnum font-semibold text-ink">{fmt(d.tripsCompleted)}</span>,
    },
    { key: 'rating', header: 'Passenger Rating', sortValue: (d) => d.rating, render: (d) => <Stars rating={d.rating} /> },
    { key: 'status', header: 'Status', sortValue: (d) => d.status, render: (d) => <StatusBadge status={d.status} /> },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Registered Drivers" value="24,806" delta={1.8} deltaNote="vs last quarter" icon={Users} spark={[23800, 24100, 24350, 24520, 24690, 24806]} footnote="plus 21,340 conductors" />
        <MetricCard label="On Duty Now" value="13,214" delta={2.6} deltaNote="vs yesterday" icon={Users} accent spark={[11200, 11900, 12400, 12800, 13050, 13214]} footnote="53% of the driver pool" />
        <MetricCard label="Average Rating" value="4.7 / 5" delta={0.9} deltaNote="vs last month" icon={Star} spark={[4.5, 4.5, 4.6, 4.6, 4.7, 4.7]} footnote="from 86,400 passenger reviews" />
        <MetricCard label="Safety Awards (2026)" value="312" delta={14.6} deltaNote="vs 2025" icon={Award} spark={[210, 236, 258, 274, 295, 312]} footnote="zero-incident drivers honoured" />
      </div>

      <DataTable<Driver>
        title="Driver Registry"
        subtitle="Licence-verified crew synced with the Department of Motor Traffic"
        columns={columns}
        rows={DRIVERS}
        rowKey={(d) => d.id}
        searchText={(d) => `${d.name} ${d.depot} ${d.licence} ${d.phone} ${d.status}`}
        searchPlaceholder="Search by name, depot, licence…"
        filterBy={(d) => d.status}
        pageSize={8}
        primaryAction={
          <Button onClick={() => notify('Register driver', 'New crew onboarding verifies the licence against DMT records before activation.')}>
            <Plus className="h-4 w-4" /> Register Driver
          </Button>
        }
      />
    </div>
  );
}
