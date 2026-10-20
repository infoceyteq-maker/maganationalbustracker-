'use client';

import {
  AlertTriangle,
  ArrowRight,
  Bus,
  CheckCircle2,
  CircleDollarSign,
  Download,
  Info,
  Plus,
  Timer,
  Users,
} from 'lucide-react';
import { fmt, fmtLKR } from '@/lib/utils';
import type { ViewKey } from '@/lib/nav';
import { ACTIVITY, FLEET_STATUS, HOURLY_BOARDINGS, HOURLY_LABELS, TOP_ROUTES, TRIPS, type Trip } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/badge';
import { ProgressBar, RouteChip } from '@/components/ui/primitives';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { AreaChart, DonutChart } from '@/components/dashboard/Charts';
import { DataTable, type Column } from '@/components/dashboard/DataTable';

const toneIcon = {
  success: { Icon: CheckCircle2, cls: 'bg-brand-50 text-brand-600' },
  warning: { Icon: AlertTriangle, cls: 'bg-amber-50 text-amber-600' },
  info: { Icon: Info, cls: 'bg-blue-50 text-blue-600' },
  danger: { Icon: AlertTriangle, cls: 'bg-red-50 text-red-600' },
};

export function OverviewView({
  liveBuses,
  onNavigate,
  notify,
}: {
  liveBuses: number;
  onNavigate: (v: ViewKey) => void;
  notify: (title: string, detail?: string) => void;
}) {
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const tripColumns: Column<Trip>[] = [
    {
      key: 'route',
      header: 'Route',
      sortValue: (t) => t.routeCode,
      render: (t) => <RouteChip code={t.routeCode} />,
    },
    {
      key: 'journey',
      header: 'Journey',
      sortValue: (t) => t.from,
      render: (t) => (
        <span className="block min-w-[170px]">
          <span className="block font-medium text-ink">
            {t.from} <span className="text-ash-400">→</span> {t.to}
          </span>
          <span className="tnum block text-xs text-ash-500">{t.code}</span>
        </span>
      ),
    },
    {
      key: 'depart',
      header: 'Departs',
      sortValue: (t) => t.depart,
      render: (t) => (
        <span className="tnum whitespace-nowrap font-medium text-ink">
          {t.depart} <span className="font-normal text-ash-400">→ {t.arrive}</span>
        </span>
      ),
    },
    {
      key: 'bus',
      header: 'Bus',
      sortValue: (t) => t.bus,
      render: (t) => <span className="tnum font-semibold text-ink">{t.bus}</span>,
    },
    {
      key: 'load',
      header: 'Load',
      sortValue: (t) => t.passengers / t.capacity,
      render: (t) => (
        <span className="flex min-w-[110px] items-center gap-2">
          <ProgressBar value={t.passengers} max={t.capacity} className="w-16" />
          <span className="tnum text-xs text-ash-500">
            {t.passengers}/{t.capacity}
          </span>
        </span>
      ),
    },
    { key: 'status', header: 'Status', sortValue: (t) => t.status, render: (t) => <StatusBadge status={t.status} /> },
  ];

  return (
    <div className="space-y-6">
      {/* Greeting band */}
      <div className="flex flex-wrap items-end justify-between gap-4 animate-fade-up">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-ink sm:text-[28px]">
            {greeting}, Operations Control
          </h2>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-ash-500">
            {today} · The national network is running smoothly — <span className="font-semibold text-ink">{fmt(liveBuses)} buses</span> are
            currently on route across all nine provinces.
          </p>
        </div>
        <div className="flex gap-2.5">
          <Button variant="secondary" onClick={() => notify('Report queued', 'The daily operations summary (PDF) will be emailed to your inbox shortly.')}>
            <Download className="h-4 w-4" /> Export Report
          </Button>
          <Button onClick={() => onNavigate('trips')}>
            <Plus className="h-4 w-4" /> Schedule Trip
          </Button>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" style={{ animationDelay: '40ms' }}>
        <div className="animate-fade-up">
          <MetricCard
            label="Buses On Route"
            value={fmt(liveBuses)}
            delta={4.8}
            deltaNote="vs yesterday, same hour"
            icon={Bus}
            accent
            spark={[8200, 9600, 10800, 11400, 11980, 12240, 12486]}
            footnote="of 18,940 registered buses"
          />
        </div>
        <div className="animate-fade-up" style={{ animationDelay: '70ms' }}>
          <MetricCard
            label="Passengers Carried Today"
            value={fmt(1_284_530)}
            delta={6.2}
            deltaNote="vs yesterday"
            icon={Users}
            spark={[42, 58, 71, 66, 84, 97, 112, 128]}
            footnote="peak hour 07:00 – 08:00"
          />
        </div>
        <div className="animate-fade-up" style={{ animationDelay: '100ms' }}>
          <MetricCard
            label="Fare Revenue Today"
            value={fmtLKR(48_200_000)}
            delta={3.9}
            deltaNote="vs yesterday"
            icon={CircleDollarSign}
            spark={[30, 34, 33, 38, 41, 45, 48]}
            footnote="68% via digital payment"
          />
        </div>
        <div className="animate-fade-up" style={{ animationDelay: '130ms' }}>
          <MetricCard
            label="On-Time Performance"
            value="89.4%"
            delta={1.6}
            deltaNote="vs last week"
            icon={Timer}
            spark={[84, 85, 86, 85, 87, 88, 89]}
            footnote="2,140 trips delayed > 10 min"
          />
        </div>
      </div>

      {/* Ridership + fleet mix */}
      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2 animate-fade-up" >
          <CardHeader
            title="Passenger Boardings"
            subtitle="Thousands of boardings per hour · network-wide"
            action={
              <span className="inline-flex rounded-[10px] border border-ash-200 bg-ash-50 p-1 text-xs font-medium">
                <span className="rounded-md bg-white px-2.5 py-1 font-semibold text-ink shadow-sm">Today</span>
                <button className="px-2.5 py-1 text-ash-500 transition-colors hover:text-ink" onClick={() => onNavigate('reports')}>
                  7 days
                </button>
              </span>
            }
          />
          <CardBody>
            <div className="mb-2 flex flex-wrap gap-x-6 gap-y-1">
              <p className="text-sm text-ash-500">
                Peak <span className="tnum font-bold text-ink">138K</span> at 4 PM
              </p>
              <p className="text-sm text-ash-500">
                Morning peak <span className="tnum font-bold text-ink">118K</span> at 8 AM
              </p>
              <p className="flex items-center gap-1.5 text-sm text-ash-500">
                <span className="h-2 w-2 rounded-full bg-brand-500" /> Boardings (K)
              </p>
            </div>
            <AreaChart data={HOURLY_BOARDINGS} labels={HOURLY_LABELS} unit="K boardings" />
          </CardBody>
        </Card>

        <Card className="animate-fade-up">
          <CardHeader title="Fleet Status" subtitle="Live distribution of the national fleet" />
          <CardBody>
            <div className="flex justify-center py-1">
              <DonutChart segments={FLEET_STATUS} />
            </div>
            <ul className="mt-4 space-y-2.5">
              {FLEET_STATUS.map((s) => (
                <li key={s.label} className="flex items-center gap-2.5 text-sm">
                  <span className="h-2.5 w-2.5 rounded-[4px]" style={{ background: s.color }} aria-hidden />
                  <span className="flex-1 text-ash-600">{s.label}</span>
                  <span className="tnum font-semibold text-ink">{fmt(s.value)}</span>
                </li>
              ))}
            </ul>
            <Button variant="secondary" className="mt-5 w-full" onClick={() => onNavigate('fleet')}>
              Open Fleet Management <ArrowRight className="h-4 w-4" />
            </Button>
          </CardBody>
        </Card>
      </div>

      {/* Live departures + side rail */}
      <div className="grid items-start gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2 animate-fade-up">
          <DataTable<Trip>
            title="Live Departures"
            subtitle="Trips boarding, in progress or recently completed"
            columns={tripColumns}
            rows={TRIPS}
            rowKey={(t) => t.id}
            searchText={(t) => `${t.code} ${t.routeCode} ${t.from} ${t.to} ${t.bus} ${t.driver} ${t.status}`}
            searchPlaceholder="Search trips…"
            filterBy={(t) => t.status}
            pageSize={5}
            primaryAction={
              <Button size="md" onClick={() => onNavigate('trips')}>
                <Plus className="h-4 w-4" /> New Trip
              </Button>
            }
          />
        </div>

        <div className="space-y-4">
          <Card className="animate-fade-up">
            <CardHeader title="Top Routes Today" subtitle="By passenger volume" />
            <CardBody>
              <ul className="space-y-4">
                {TOP_ROUTES.map((r, i) => (
                  <li key={r.code}>
                    <div className="flex items-center gap-2.5">
                      <span className="tnum w-4 text-[13px] font-bold text-ash-300">{i + 1}</span>
                      <RouteChip code={r.code} className="min-w-[44px] py-0.5 text-[11px]" />
                      <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink">{r.name}</span>
                      <span className="tnum text-[13px] font-semibold text-ink">{fmt(r.passengers)}</span>
                    </div>
                    <ProgressBar value={r.share} tone="emerald" className="ml-[26px] mt-2 w-auto" />
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>

          <Card className="animate-fade-up">
            <CardHeader
              title="Operations Feed"
              subtitle="Network events as they happen"
              action={
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-700 ring-1 ring-inset ring-brand-600/15">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulse-dot" /> LIVE
                </span>
              }
            />
            <CardBody>
              <ul className="space-y-4">
                {ACTIVITY.map((a) => {
                  const { Icon, cls } = toneIcon[a.tone];
                  return (
                    <li key={a.id} className="flex gap-3">
                      <span className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${cls}`}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[13px] font-semibold leading-snug text-ink">{a.title}</span>
                        <span className="mt-0.5 block text-xs leading-relaxed text-ash-500">{a.detail}</span>
                        <span className="mt-1 block text-[11px] font-medium text-ash-400">{a.time}</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
