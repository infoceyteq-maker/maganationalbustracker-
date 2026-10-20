'use client';

import * as React from 'react';
import { MapPin, Milestone, Plus, Timer } from 'lucide-react';
import { fmt } from '@/lib/utils';
import { ROUTES, type RouteInfo } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge, type BadgeTone } from '@/components/ui/badge';
import { ProgressBar, RouteChip } from '@/components/ui/primitives';
import { SearchInput } from '@/components/ui/input';

const TYPE_TONE: Record<RouteInfo['type'], BadgeTone> = {
  Interprovincial: 'dark',
  Expressway: 'emerald',
  Provincial: 'gray',
  City: 'blue',
};

export function RoutesView({ notify }: { notify: (title: string, detail?: string) => void }) {
  const [query, setQuery] = React.useState('');
  const [type, setType] = React.useState('All');
  const types = ['All', ...Array.from(new Set(ROUTES.map((r) => r.type)))];

  const visible = ROUTES.filter(
    (r) =>
      (type === 'All' || r.type === type) &&
      `${r.code} ${r.name}`.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3 animate-fade-up">
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-extrabold tracking-tight text-ink">National Route Network</h2>
          <p className="mt-0.5 text-sm text-ash-500">
            {fmt(1204)} permitted routes · {fmt(38640)} km of served network · fares set by the National Transport Commission.
          </p>
        </div>
        <SearchInput wrapperClassName="w-full sm:w-64" placeholder="Search routes…" value={query} onChange={(e) => setQuery(e.target.value)} />
        <Button onClick={() => notify('New route application', 'Route permits are processed in Approvals once an operator submits the NTC/RP form.')}>
          <Plus className="h-4 w-4" /> New Route
        </Button>
      </div>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Route type">
        {types.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={type === t}
            onClick={() => setType(t)}
            className={
              type === t
                ? 'rounded-full border border-brand-600 bg-brand-600 px-3.5 py-1.5 text-[13px] font-medium text-white shadow-cta transition-all'
                : 'rounded-full border border-ash-200 bg-white px-3.5 py-1.5 text-[13px] font-medium text-ash-600 transition-all hover:border-ash-300 hover:text-ink'
            }
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((r, i) => (
          <Card key={r.code} className="card-hover p-5 animate-fade-up" >
            <div className="flex items-start justify-between gap-3" style={{ animationDelay: `${i * 40}ms` }}>
              <RouteChip code={r.code} />
              <Badge tone={TYPE_TONE[r.type]}>{r.type}</Badge>
            </div>
            <h3 className="mt-3.5 text-[15px] font-bold leading-snug tracking-tight text-ink">{r.name}</h3>

            <dl className="mt-4 grid grid-cols-3 gap-3 border-t border-ash-100 pt-4 text-center">
              <div>
                <dt className="flex items-center justify-center gap-1 text-[11px] font-medium uppercase tracking-wide text-ash-400">
                  <Milestone className="h-3 w-3" /> Distance
                </dt>
                <dd className="tnum mt-1 text-sm font-bold text-ink">{r.distanceKm} km</dd>
              </div>
              <div>
                <dt className="flex items-center justify-center gap-1 text-[11px] font-medium uppercase tracking-wide text-ash-400">
                  <MapPin className="h-3 w-3" /> Stops
                </dt>
                <dd className="tnum mt-1 text-sm font-bold text-ink">{r.stops}</dd>
              </div>
              <div>
                <dt className="flex items-center justify-center gap-1 text-[11px] font-medium uppercase tracking-wide text-ash-400">Fare</dt>
                <dd className="tnum mt-1 text-sm font-bold text-ink">LKR {fmt(r.fare)}</dd>
              </div>
            </dl>

            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 font-medium text-ash-500">
                  <Timer className="h-3.5 w-3.5" /> On-time performance
                </span>
                <span className="tnum font-bold text-ink">{r.onTime}%</span>
              </div>
              <ProgressBar value={r.onTime} tone="emerald" />
              <p className="tnum text-xs text-ash-500">
                {r.busesAssigned} buses assigned · {fmt(r.dailyTrips)} trips / day
              </p>
            </div>

            <Button
              variant="secondary"
              className="mt-4 w-full"
              onClick={() => notify(`Route ${r.code}`, `${r.name} · full fare LKR ${fmt(r.fare)} · ${r.stops} scheduled stops.`)}
            >
              View Schedule & Fares
            </Button>
          </Card>
        ))}
      </div>

      {visible.length === 0 && (
        <Card className="p-10 text-center">
          <p className="text-sm font-medium text-ash-600">No routes match “{query}”.</p>
          <p className="mt-1 text-[13px] text-ash-400">Try a route number (e.g. 240) or a town name.</p>
        </Card>
      )}
    </div>
  );
}
