'use client';

import * as React from 'react';
import { Gauge, LocateFixed, Minus, Navigation, Plus, Radio } from 'lucide-react';
import { cn, fmt } from '@/lib/utils';
import { MAP_BUSES } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/badge';
import { SearchInput } from '@/components/ui/input';

type MapBusItem = (typeof MAP_BUSES)[number];

/**
 * LiveOperations — a self-contained schematic of the western corridor.
 * In production this surface hosts the tile map; markers, selection and
 * the live roster already follow the final interaction model.
 */
export function LiveMapView({ liveBuses, notify }: { liveBuses: number; notify: (t: string, d?: string) => void }) {
  const [selected, setSelected] = React.useState<MapBusItem>(MAP_BUSES[0]);
  const [query, setQuery] = React.useState('');

  const roster = MAP_BUSES.filter((b) => `${b.reg} ${b.route}`.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3 animate-fade-up">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-ink">Live Network Map</h2>
          <p className="mt-0.5 flex items-center gap-2 text-sm text-ash-500">
            <span className="h-2 w-2 rounded-full bg-brand-500 animate-pulse-dot" aria-hidden />
            <span>
              <span className="tnum font-semibold text-ink">{fmt(liveBuses)}</span> buses transmitting · refreshed every 5 seconds
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => notify('Geofences', 'Depot and terminal geofences are shown when you zoom into a district.')}>
            <Radio className="h-4 w-4" /> Geofences
          </Button>
          <Button onClick={() => notify('Centred on network', 'The map now frames the full western corridor.')}>
            <LocateFixed className="h-4 w-4" /> Centre Network
          </Button>
        </div>
      </div>

      <div className="grid items-start gap-4 xl:grid-cols-3">
        {/* Map surface */}
        <Card className="map-water map-grid relative min-h-[520px] overflow-hidden xl:col-span-2 animate-fade-up">
          <svg viewBox="0 0 800 520" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
            {/* Sea (west coast) */}
            <path d="M0,0 L150,0 C170,120 150,210 175,300 C195,375 185,450 210,520 L0,520 Z" fill="#EAF3F0" />
            <path d="M150,0 C170,120 150,210 175,300 C195,375 185,450 210,520" fill="none" stroke="#CFE7DE" strokeWidth="2" />
            {/* A3 — Colombo → Negombo → Chilaw */}
            <path d="M185,300 C180,250 175,200 168,140 C164,100 160,60 158,20" fill="none" stroke="#D1D5DB" strokeWidth="6" strokeLinecap="round" />
            <path d="M185,300 C180,250 175,200 168,140 C164,100 160,60 158,20" fill="none" stroke="#fff" strokeWidth="2.5" strokeDasharray="7 6" />
            {/* A1 — Colombo → Kandy */}
            <path d="M185,300 C260,285 330,255 400,235 C440,224 475,218 510,215" fill="none" stroke="#D1D5DB" strokeWidth="6" strokeLinecap="round" />
            <path d="M185,300 C260,285 330,255 400,235 C440,224 475,218 510,215" fill="none" stroke="#fff" strokeWidth="2.5" strokeDasharray="7 6" />
            {/* A9 — Kandy → Dambulla → North */}
            <path d="M510,215 C520,160 515,110 500,60 C492,35 488,18 486,4" fill="none" stroke="#D1D5DB" strokeWidth="6" strokeLinecap="round" />
            <path d="M510,215 C520,160 515,110 500,60 C492,35 488,18 486,4" fill="none" stroke="#fff" strokeWidth="2.5" strokeDasharray="7 6" />
            {/* Southern Expressway — emerald corridor */}
            <path d="M230,330 C300,380 380,440 470,480 C520,500 570,508 620,510" fill="none" stroke="#A7F3D0" strokeWidth="7" strokeLinecap="round" />
            <path d="M230,330 C300,380 380,440 470,480 C520,500 570,508 620,510" fill="none" stroke="#059669" strokeWidth="2.5" strokeDasharray="8 6" />
            {/* A4 — Colombo → Badulla */}
            <path d="M200,315 C300,320 420,300 540,280 C620,268 700,262 780,260" fill="none" stroke="#D1D5DB" strokeWidth="6" strokeLinecap="round" />
            <path d="M200,315 C300,320 420,300 540,280 C620,268 700,262 780,260" fill="none" stroke="#fff" strokeWidth="2.5" strokeDasharray="7 6" />
          </svg>

          {/* City labels */}
          {[
            { name: 'Negombo', x: '19%', y: '16%' },
            { name: 'Colombo Fort', x: '21%', y: '60%' },
            { name: 'Kadawatha', x: '31%', y: '51%' },
            { name: 'Kandy', x: '63%', y: '38%' },
            { name: 'Dambulla', x: '61%', y: '9%' },
            { name: 'Galle', x: '38%', y: '90%' },
            { name: 'Matara', x: '56%', y: '95%' },
            { name: 'Badulla →', x: '84%', y: '46%' },
          ].map((c) => (
            <span
              key={c.name}
              className="pointer-events-none absolute -translate-x-1/2 rounded-md bg-white/85 px-1.5 py-0.5 text-[11px] font-semibold text-ash-600 shadow-sm ring-1 ring-ash-200/70 backdrop-blur-sm"
              style={{ left: c.x, top: c.y }}
            >
              {c.name}
            </span>
          ))}

          {/* Bus markers */}
          {MAP_BUSES.map((b) => {
            const isSel = selected.reg === b.reg;
            const color = b.status === 'Delayed' ? 'bg-amber-500' : 'bg-brand-600';
            return (
              <button
                key={b.reg}
                onClick={() => setSelected(b)}
                className="group absolute z-10 -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${b.x}%`, top: `${b.y}%` }}
                aria-label={`Bus ${b.reg}, ${b.route}, ${b.status}`}
              >
                <span className={cn('absolute inset-0 rounded-full bg-brand-400/40 animate-map-ping', b.status === 'Delayed' && 'bg-amber-400/40')} aria-hidden />
                <span
                  className={cn(
                    'relative flex h-7 w-7 items-center justify-center rounded-full text-white shadow-lift ring-2 ring-white transition-transform group-hover:scale-110',
                    color,
                    isSel && 'scale-125 ring-brand-200',
                  )}
                >
                  <Navigation className="h-3.5 w-3.5" />
                </span>
              </button>
            );
          })}

          {/* Zoom controls */}
          <div className="absolute right-4 top-4 flex flex-col overflow-hidden rounded-[10px] border border-ash-200 bg-white shadow-card">
            <button className="flex h-9 w-9 items-center justify-center text-ash-600 transition-colors hover:bg-ash-50" onClick={() => notify('Zoom', 'Tile zoom is enabled in the production map build.')} aria-label="Zoom in">
              <Plus className="h-4 w-4" />
            </button>
            <div className="border-t border-ash-100" />
            <button className="flex h-9 w-9 items-center justify-center text-ash-600 transition-colors hover:bg-ash-50" onClick={() => notify('Zoom', 'Tile zoom is enabled in the production map build.')} aria-label="Zoom out">
              <Minus className="h-4 w-4" />
            </button>
          </div>

          {/* Legend */}
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            {[
              { dot: 'bg-brand-600', label: 'On route' },
              { dot: 'bg-amber-500', label: 'Delayed' },
              { dot: 'bg-brand-500', label: 'Expressway corridor' },
            ].map((l) => (
              <span key={l.label} className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium text-ash-600 shadow-sm ring-1 ring-ash-200/80 backdrop-blur-sm">
                <span className={cn('h-2 w-2 rounded-full', l.dot)} /> {l.label}
              </span>
            ))}
          </div>

          {/* Selected bus card */}
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-[340px]">
            <div className="card p-4 shadow-pop" role="status">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="tnum text-base font-extrabold tracking-tight text-ink">{selected.reg}</p>
                  <p className="text-[13px] text-ash-500">{selected.route}</p>
                </div>
                <StatusBadge status={selected.status} />
              </div>
              <div className="mt-3 flex items-center gap-5 border-t border-ash-100 pt-3 text-sm">
                <span className="flex items-center gap-1.5 text-ash-600">
                  <Gauge className="h-4 w-4 text-ash-400" />
                  <span className="tnum font-bold text-ink">{selected.speed}</span> km/h
                </span>
                <span className="text-ash-500">GPS · 4s ago</span>
                <Button size="sm" className="ml-auto" onClick={() => notify(`Following ${selected.reg}`, 'The map will keep this bus centred until you select another vehicle.')}>
                  Follow
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Live roster */}
        <Card className="animate-fade-up">
          <CardHeader title="Live Roster" subtitle="Buses transmitting in this corridor" />
          <div className="px-5 pt-4 sm:px-6">
            <SearchInput placeholder="Filter by plate or route…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <ul className="max-h-[430px] divide-y divide-ash-100 overflow-y-auto px-2 py-2">
            {roster.map((b) => (
              <li key={b.reg}>
                <button
                  onClick={() => setSelected(b)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors',
                    selected.reg === b.reg ? 'bg-brand-50' : 'hover:bg-ash-50',
                  )}
                >
                  <span className={cn('h-2.5 w-2.5 shrink-0 rounded-full', b.status === 'Delayed' ? 'bg-amber-500' : 'bg-brand-500')} />
                  <span className="min-w-0 flex-1">
                    <span className="tnum block truncate text-sm font-bold text-ink">{b.reg}</span>
                    <span className="block truncate text-xs text-ash-500">{b.route}</span>
                  </span>
                  <span className="tnum text-xs font-semibold text-ash-600">{b.speed} km/h</span>
                </button>
              </li>
            ))}
            {roster.length === 0 && <li className="px-3 py-6 text-center text-sm text-ash-500">No buses match “{query}”.</li>}
          </ul>
        </Card>
      </div>
    </div>
  );
}
