'use client';

import { Bus as BusIcon, Fuel, MapPin, Plus, Wrench } from 'lucide-react';
import { BUSES, type Bus } from '@/lib/data';
import type { ViewKey } from '@/lib/nav';
import { Button } from '@/components/ui/button';
import { Badge, StatusBadge } from '@/components/ui/badge';
import { PersonCell, ProgressBar, RouteChip } from '@/components/ui/primitives';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { DataTable, type Column } from '@/components/dashboard/DataTable';

export function FleetView({
  onNavigate,
  notify,
}: {
  onNavigate: (v: ViewKey) => void;
  notify: (title: string, detail?: string) => void;
}) {
  const columns: Column<Bus>[] = [
    {
      key: 'bus',
      header: 'Bus',
      sortValue: (b) => b.reg,
      render: (b) => (
        <span className="block min-w-[150px]">
          <span className="flex items-center gap-2">
            <span className="tnum font-bold text-ink">{b.reg}</span>
            <Badge tone={b.operator === 'SLTB' ? 'dark' : 'gray'} className="px-1.5 py-0 text-[10px] font-bold">
              {b.operator}
            </Badge>
          </span>
          <span className="block text-xs text-ash-500">{b.model}</span>
        </span>
      ),
    },
    {
      key: 'route',
      header: 'Assigned Route',
      sortValue: (b) => b.routeCode,
      render: (b) => (
        <span className="flex min-w-[180px] items-center gap-2.5">
          <RouteChip code={b.routeCode} />
          <span className="truncate font-medium text-ink">{b.routeName}</span>
        </span>
      ),
    },
    {
      key: 'driver',
      header: 'Driver',
      sortValue: (b) => b.driver,
      hideOnMobile: true,
      render: (b) => <PersonCell name={b.driver} sub={b.depot} />,
    },
    {
      key: 'occupancy',
      header: 'Occupancy',
      sortValue: (b) => b.occupancy / b.capacity,
      render: (b) => (
        <span className="flex min-w-[120px] items-center gap-2">
          <ProgressBar value={b.occupancy} max={b.capacity} className="w-16" />
          <span className="tnum text-xs text-ash-500">
            {b.occupancy}/{b.capacity}
          </span>
        </span>
      ),
    },
    {
      key: 'fuel',
      header: 'Fuel',
      sortValue: (b) => b.fuel,
      hideOnMobile: true,
      render: (b) => (
        <span className="tnum whitespace-nowrap font-medium text-ink">
          {b.fuel}% <span className="font-normal text-ash-400">· {b.speed} km/h</span>
        </span>
      ),
    },
    {
      key: 'next',
      header: 'Next Stop',
      sortValue: (b) => b.nextStop,
      hideOnMobile: true,
      render: (b) => (
        <span className="block">
          <span className="block whitespace-nowrap font-medium text-ink">{b.nextStop}</span>
          <span className="block text-xs text-ash-500">ping {b.lastPing}</span>
        </span>
      ),
    },
    { key: 'status', header: 'Status', sortValue: (b) => b.status, render: (b) => <StatusBadge status={b.status} /> },
    {
      key: 'action',
      header: '',
      align: 'right',
      render: (b) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            onNavigate('live');
            notify(`Tracking ${b.reg}`, `${b.routeName} · next stop ${b.nextStop} · updated ${b.lastPing}.`);
          }}
        >
          <MapPin className="h-4 w-4 text-brand-600" /> Track
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Registered Fleet" value="18,940" delta={2.1} deltaNote="vs last quarter" icon={BusIcon} spark={[18100, 18350, 18520, 18680, 18810, 18940]} footnote="7,912 SLTB · 11,028 private" />
        <MetricCard label="Utilisation Today" value="78.6%" delta={3.4} deltaNote="vs yesterday" icon={Fuel} spark={[70, 72, 74, 73, 76, 79]} footnote="14,892 buses deployed" />
        <MetricCard label="In Maintenance" value="1,402" delta={-8.9} invertDelta deltaNote="vs last week" icon={Wrench} spark={[1620, 1580, 1510, 1540, 1460, 1402]} footnote="312 scheduled · 1,090 reactive" />
        <MetricCard label="Avg. Fleet Age" value="9.4 yrs" delta={-1.2} invertDelta deltaNote="vs last year" icon={BusIcon} spark={[10.2, 10.0, 9.9, 9.7, 9.5, 9.4]} footnote="640 new buses inducted in 2026" />
      </div>

      <DataTable<Bus>
        title="National Fleet Register"
        subtitle="Every GPS-equipped bus currently reporting to the platform"
        columns={columns}
        rows={BUSES}
        rowKey={(b) => b.id}
        searchText={(b) => `${b.reg} ${b.model} ${b.operator} ${b.routeCode} ${b.routeName} ${b.driver} ${b.depot} ${b.status}`}
        searchPlaceholder="Search by number plate, route, driver…"
        filterBy={(b) => b.status}
        pageSize={8}
        primaryAction={
          <Button onClick={() => notify('Register a bus', 'Vehicle onboarding opens the permit workflow — see Approvals for pending applications.')}>
            <Plus className="h-4 w-4" /> Register Bus
          </Button>
        }
      />
    </div>
  );
}
