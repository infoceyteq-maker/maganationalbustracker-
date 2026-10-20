'use client';

import * as React from 'react';
import {
  ArrowUpDown,
  BatteryMedium,
  Bell,
  Bus,
  CheckCircle2,
  ChevronRight,
  Globe2,
  Home,
  Languages,
  Map as MapIcon,
  Minus,
  Play,
  Plus,
  QrCode,
  Search,
  Share2,
  ShieldAlert,
  Signal,
  Square,
  Ticket,
  UserRound,
  Wifi,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, ProgressBar, RouteChip } from '@/components/ui/primitives';
import { Badge } from '@/components/ui/badge';

/* ------------------------------ Phone frame ------------------------------ */

function Phone({ caption, children }: { caption: string; children: React.ReactNode }) {
  return (
    <figure className="mx-auto w-full max-w-[320px] animate-fade-up">
      <div className="relative overflow-hidden rounded-[42px] border border-ash-300 bg-white shadow-pop ring-1 ring-ash-900/5">
        {/* Notch */}
        <span className="absolute left-1/2 top-2 z-20 h-[22px] w-24 -translate-x-1/2 rounded-full bg-ink" aria-hidden />
        {/* Status bar */}
        <div className="relative z-10 flex items-center justify-between px-6 pt-2.5 text-ink">
          <span className="tnum text-[11px] font-bold">8:04</span>
          <span className="flex items-center gap-1.5 text-ash-600" aria-hidden>
            <Signal className="h-3 w-3" />
            <Wifi className="h-3 w-3" />
            <BatteryMedium className="h-3.5 w-3.5" />
          </span>
        </div>
        <div className="h-[560px] overflow-hidden">{children}</div>
      </div>
      <figcaption className="mt-4 text-center text-sm font-semibold text-ink">{caption}</figcaption>
    </figure>
  );
}

function BottomNav({ active }: { active: number }) {
  const items = [
    { icon: Home, label: 'Home' },
    { icon: MapIcon, label: 'Track' },
    { icon: Ticket, label: 'Tickets' },
    { icon: UserRound, label: 'Profile' },
  ];
  return (
    <nav className="absolute inset-x-0 bottom-0 flex items-stretch justify-around border-t border-ash-200 bg-white/95 px-2 pb-4 pt-2 backdrop-blur" aria-label="App">
      {items.map((it, i) => (
        <span
          key={it.label}
          className={cn(
            'flex flex-col items-center gap-0.5 rounded-lg px-3 py-1 text-[10px] font-medium',
            i === active ? 'text-brand-700' : 'text-ash-400',
          )}
        >
          <it.icon className="h-5 w-5" strokeWidth={i === active ? 2.4 : 2} />
          {it.label}
          {i === active && <span className="h-1 w-1 rounded-full bg-brand-600" />}
        </span>
      ))}
    </nav>
  );
}

/* ------------------------------ Screens ------------------------------ */

function PassengerHome({ notify }: { notify: (t: string, d?: string) => void }) {
  const nearYou = [
    { code: '240', name: 'Negombo → Colombo Fort', eta: '3 min', etaTone: 'emerald' as const, load: 46, cap: 54, plate: 'NA-3847' },
    { code: '187', name: 'Katunayake → Fort', eta: '7 min', etaTone: 'emerald' as const, load: 29, cap: 44, plate: 'NB-7710' },
    { code: '245', name: 'Negombo → Chilaw', eta: '12 min', etaTone: 'gray' as const, load: 21, cap: 44, plate: 'NC-8032' },
  ];
  return (
    <div className="relative h-full bg-white px-5 pb-24 pt-4">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-cta">
          <Bus className="h-[18px] w-[18px]" />
        </span>
        <div className="leading-tight">
          <p className="text-[11px] font-medium text-ash-500">ආයුබෝවන් · Good morning</p>
          <p className="text-sm font-extrabold tracking-tight text-ink">Where to today?</p>
        </div>
        <span className="relative ml-auto inline-flex h-9 w-9 items-center justify-center rounded-xl bg-ash-100 text-ash-600">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-brand-500" />
        </span>
      </div>

      {/* Journey search */}
      <div className="card mt-4 p-3.5">
        <div className="relative space-y-2">
          <label className="flex items-center gap-2.5 rounded-[10px] bg-ash-50 px-3 py-2.5 ring-1 ring-ash-200">
            <span className="h-2 w-2 rounded-full bg-brand-600" />
            <span className="text-[13px] font-semibold text-ink">Negombo Bus Stand</span>
          </label>
          <label className="flex items-center gap-2.5 rounded-[10px] bg-ash-50 px-3 py-2.5 ring-1 ring-ash-200">
            <span className="h-2 w-2 rounded-full bg-ink" />
            <span className="text-[13px] font-medium text-ash-500">Colombo Fort</span>
          </label>
          <span className="absolute -right-1 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-ash-200 bg-white text-ash-500 shadow-card">
            <ArrowUpDown className="h-3.5 w-3.5" />
          </span>
        </div>
        <button
          onClick={() => notify('Passenger app · search', 'Route 240 · next bus in 3 min · fare LKR 180. Live ETA from GPS.')}
          className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-[10px] bg-brand-600 text-sm font-semibold text-white shadow-cta transition-all hover:bg-brand-700 active:scale-[0.99]"
        >
          <Search className="h-4 w-4" /> Search Buses
        </button>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <h4 className="text-[13px] font-bold text-ink">Buses near you</h4>
        <span className="flex items-center gap-1 text-[11px] font-semibold text-brand-700">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulse-dot" /> LIVE
        </span>
      </div>

      <ul className="mt-2.5 space-y-2.5">
        {nearYou.map((b) => (
          <li key={b.plate}>
            <button
              onClick={() => notify(`Route ${b.code} · ${b.plate}`, `${b.name} — arriving in ${b.eta}. Tap Track in the app to follow it live.`)}
              className="card card-hover block w-full p-3.5 text-left"
            >
              <span className="flex items-center gap-2.5">
                <RouteChip code={b.code} className="min-w-[44px] py-0.5 text-[11px]" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-bold text-ink">{b.name}</span>
                  <span className="tnum block text-[11px] text-ash-500">{b.plate}</span>
                </span>
                <Badge tone={b.etaTone} className="tnum">{b.eta}</Badge>
              </span>
              <span className="mt-2.5 flex items-center gap-2">
                <ProgressBar value={b.load} max={b.cap} className="flex-1" />
                <span className="tnum text-[10px] font-medium text-ash-500">{b.load}/{b.cap} seats</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <BottomNav active={0} />
    </div>
  );
}

function PassengerTracking({ notify }: { notify: (t: string, d?: string) => void }) {
  const stops = [
    { name: 'Negombo Bus Stand', time: '07:45', state: 'done' },
    { name: 'Kochchikade', time: '07:53', state: 'done' },
    { name: 'Katunayake', time: '08:06', state: 'next' },
    { name: 'Seeduwa', time: '08:14', state: 'upcoming' },
    { name: 'Colombo Fort', time: '09:05', state: 'upcoming' },
  ] as const;
  return (
    <div className="relative h-full bg-white pb-24">
      {/* Mini map */}
      <div className="map-water map-grid relative h-[190px] border-b border-ash-200">
        <svg viewBox="0 0 320 190" className="absolute inset-0 h-full w-full" aria-hidden>
          <path d="M30,170 C90,140 120,110 165,88 C205,68 250,48 295,26" fill="none" stroke="#A7F3D0" strokeWidth="8" strokeLinecap="round" />
          <path d="M30,170 C90,140 120,110 165,88 C205,68 250,48 295,26" fill="none" stroke="#059669" strokeWidth="2.5" strokeDasharray="7 5" />
        </svg>
        <span className="absolute" style={{ left: '48%', top: '42%' }}>
          <span className="absolute -inset-2 rounded-full bg-brand-400/40 animate-map-ping" />
          <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white shadow-lift ring-2 ring-white">
            <Bus className="h-4 w-4" />
          </span>
        </span>
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-ash-600 shadow-sm ring-1 ring-ash-200 backdrop-blur">
          A3 · Negombo Road
        </span>
        <span className="tnum absolute bottom-3 right-4 rounded-lg bg-ink px-2 py-1 text-[10px] font-bold text-white">42 km/h</span>
      </div>

      <div className="px-5 pt-4">
        <div className="flex items-center gap-2.5">
          <RouteChip code="240" />
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-sm font-extrabold text-ink">Negombo → Colombo Fort</p>
            <p className="tnum text-[11px] text-ash-500">NA-3847 · Nimal Fernando</p>
          </div>
          <div className="text-right leading-tight">
            <p className="tnum text-lg font-extrabold text-brand-700">12 min</p>
            <p className="text-[10px] font-medium text-ash-400">to your stop</p>
          </div>
        </div>

        {/* Stop timeline */}
        <ol className="mt-4">
          {stops.map((s, i) => (
            <li key={s.name} className="relative flex gap-3 pb-3.5 last:pb-0">
              {i < stops.length - 1 && (
                <span className={cn('absolute left-[7px] top-4 h-[calc(100%-14px)] w-0.5 rounded', s.state === 'done' ? 'bg-brand-500' : 'bg-ash-200')} aria-hidden />
              )}
              <span
                className={cn(
                  'relative z-10 mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ring-2',
                  s.state === 'done' && 'bg-brand-600 ring-brand-100',
                  s.state === 'next' && 'bg-white ring-brand-600',
                  s.state === 'upcoming' && 'bg-white ring-ash-300',
                )}
              >
                {s.state === 'done' && <CheckCircle2 className="h-2.5 w-2.5 text-white" />}
                {s.state === 'next' && <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />}
              </span>
              <span className="flex flex-1 items-baseline justify-between">
                <span className={cn('text-[13px]', s.state === 'next' ? 'font-bold text-ink' : s.state === 'done' ? 'font-medium text-ash-400' : 'font-medium text-ash-600')}>
                  {s.name}
                  {s.state === 'next' && <span className="ml-1.5 text-[10px] font-bold uppercase tracking-wide text-brand-700">Next</span>}
                </span>
                <span className="tnum text-[11px] font-semibold text-ash-500">{s.time}</span>
              </span>
            </li>
          ))}
        </ol>

        <div className="mt-3 flex gap-2">
          <button
            onClick={() => notify('Trip shared', 'A live link was copied — family can follow NA-3847 without installing the app.')}
            className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-[10px] border border-ash-300 bg-white text-[13px] font-semibold text-ash-700 shadow-sm transition-all hover:bg-ash-50"
          >
            <Share2 className="h-4 w-4" /> Share Trip
          </button>
          <button
            onClick={() => notify('E-ticket', 'QR ticket issued · Negombo → Colombo Fort · LKR 180 · seat window, row 9.')}
            className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-[10px] bg-brand-600 text-[13px] font-semibold text-white shadow-cta transition-all hover:bg-brand-700"
          >
            <QrCode className="h-4 w-4" /> Buy Ticket · 180
          </button>
        </div>
      </div>

      <BottomNav active={1} />
    </div>
  );
}

function DriverConsole({ notify }: { notify: (t: string, d?: string) => void }) {
  const [running, setRunning] = React.useState(false);
  const [pax, setPax] = React.useState(21);
  const [seconds, setSeconds] = React.useState(0);

  React.useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const elapsed = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

  return (
    <div className="relative h-full bg-ash-50 px-5 pb-24 pt-4">
      <div className="flex items-center gap-3">
        <Avatar name="Nimal Fernando" tone="emerald" size="lg" />
        <div className="leading-tight">
          <p className="text-sm font-extrabold text-ink">Nimal Fernando</p>
          <p className="tnum text-[11px] text-ash-500">NA-3847 · Negombo depot</p>
        </div>
        <Badge tone={running ? 'emerald' : 'gray'} dot className="ml-auto">
          {running ? 'On Trip' : 'On Duty'}
        </Badge>
      </div>

      {/* Duty card */}
      <div className="card mt-4 p-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-ash-400">Today’s duty</p>
        <div className="mt-2 flex items-center gap-2.5">
          <RouteChip code="240" />
          <p className="text-sm font-bold text-ink">Negombo → Colombo Fort</p>
        </div>
        <div className="tnum mt-3 grid grid-cols-3 gap-2 border-t border-ash-100 pt-3 text-center">
          <span>
            <span className="block text-[10px] font-medium text-ash-400">DEPART</span>
            <span className="text-[13px] font-bold text-ink">08:10</span>
          </span>
          <span>
            <span className="block text-[10px] font-medium text-ash-400">ARRIVE</span>
            <span className="text-[13px] font-bold text-ink">09:30</span>
          </span>
          <span>
            <span className="block text-[10px] font-medium text-ash-400">DISTANCE</span>
            <span className="text-[13px] font-bold text-ink">38 km</span>
          </span>
        </div>
      </div>

      {/* Start / End trip */}
      {running ? (
        <div className="card mt-3 border-brand-200 bg-brand-50/60 p-4 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-brand-700">Trip in progress</p>
          <p className="tnum mt-1 text-[28px] font-extrabold leading-none text-ink">{elapsed}</p>
          <p className="mt-1 text-[11px] text-ash-500">GPS broadcasting · passengers can track you live</p>
          <button
            onClick={() => {
              setRunning(false);
              setSeconds(0);
              notify('Trip ended', `NA-3847 closed the trip with ${pax} passengers. Earnings were synced to the depot ledger.`);
            }}
            className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-ink text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.99]"
          >
            <Square className="h-4 w-4" /> End Trip
          </button>
        </div>
      ) : (
        <button
          onClick={() => {
            setRunning(true);
            notify('Trip started', 'Route 240 · NA-3847 is now live. The operations map and passenger app updated instantly.');
          }}
          className="mt-3 flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 text-[15px] font-bold tracking-wide text-white shadow-cta transition-all hover:bg-brand-700 active:scale-[0.99]"
        >
          <Play className="h-5 w-5" /> START TRIP
        </button>
      )}

      {/* Passenger counter */}
      <div className="card mt-3 flex items-center justify-between p-4">
        <div>
          <p className="text-[13px] font-bold text-ink">Passengers on board</p>
          <p className="text-[11px] text-ash-500">Conductor headcount</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button onClick={() => setPax((p) => Math.max(0, p - 1))} className="flex h-9 w-9 items-center justify-center rounded-lg border border-ash-300 bg-white text-ash-600 shadow-sm transition-all hover:bg-ash-50" aria-label="One passenger alighted">
            <Minus className="h-4 w-4" />
          </button>
          <span className="tnum w-10 text-center text-lg font-extrabold text-ink">{pax}</span>
          <button onClick={() => setPax((p) => Math.min(54, p + 1))} className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white shadow-cta transition-all hover:bg-brand-700" aria-label="One passenger boarded">
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="tnum mt-3 grid grid-cols-2 gap-3">
        <div className="card p-3.5">
          <p className="text-[10px] font-medium uppercase tracking-wide text-ash-400">Trips today</p>
          <p className="mt-0.5 text-base font-extrabold text-ink">3 of 5</p>
        </div>
        <div className="card p-3.5">
          <p className="text-[10px] font-medium uppercase tracking-wide text-ash-400">Fares collected</p>
          <p className="mt-0.5 text-base font-extrabold text-ink">LKR 18,420</p>
        </div>
      </div>

      <button
        onClick={() => notify('SOS armed', 'Holding SOS for 3 seconds alerts the control room and the nearest police station with your GPS pin.')}
        className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-[10px] border border-red-200 bg-white text-[13px] font-semibold text-red-600 shadow-sm transition-all hover:bg-red-50"
      >
        <ShieldAlert className="h-4 w-4" /> Emergency SOS
      </button>

      <BottomNav active={0} />
    </div>
  );
}

/* ------------------------------ Page ------------------------------ */

export function MobileAppsView({ notify }: { notify: (t: string, d?: string) => void }) {
  const features = [
    { icon: Globe2, title: 'One design language', text: 'The same white canvas, ash surfaces and emerald actions run from this console to every phone.' },
    { icon: Languages, title: 'Trilingual by default', text: 'සිංහල · தமிழ் · English across passenger and crew apps, switchable in one tap.' },
    { icon: QrCode, title: 'QR e-ticketing', text: 'Passengers pay by card, wallet or NFC; conductors validate offline-first QR codes.' },
    { icon: ChevronRight, title: 'Live everywhere', text: 'A “Start Trip” tap in the cab appears on this dashboard and in passengers’ hands within seconds.' },
  ];
  return (
    <div className="space-y-8">
      <div className="max-w-2xl animate-fade-up">
        <h2 className="text-xl font-extrabold tracking-tight text-ink">Maga Mobile Apps</h2>
        <p className="mt-1 text-sm leading-relaxed text-ash-500">
          The passenger and crew apps (Flutter) share this console’s premium light design system — pure-white surfaces,
          deep-black type and a single emerald reserved for action. Try the live controls inside the phones below.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        <Phone caption="Passenger App — Journey Search">
          <PassengerHome notify={notify} />
        </Phone>
        <Phone caption="Passenger App — Live Tracking">
          <PassengerTracking notify={notify} />
        </Phone>
        <Phone caption="Driver & Conductor App — Duty Console">
          <DriverConsole notify={notify} />
        </Phone>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {features.map((f) => (
          <div key={f.title} className="card card-hover p-5 animate-fade-up">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
              <f.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-3 text-sm font-bold text-ink">{f.title}</h3>
            <p className="mt-1 text-[13px] leading-relaxed text-ash-500">{f.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
