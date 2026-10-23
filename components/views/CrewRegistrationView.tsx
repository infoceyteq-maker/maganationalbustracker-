'use client';

import * as React from 'react';
import {
  BadgeCheck,
  Bus,
  Check,
  ClipboardCheck,
  FileCheck2,
  PartyPopper,
  RotateCcw,
  Send,
  Smartphone,
  Stamp,
  Upload,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES, DEPOTS } from '@/lib/data';
import type { Registration } from '@/lib/pipeline';
import { Button } from '@/components/ui/button';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { Badge, StatusBadge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { RouteChip } from '@/components/ui/primitives';

export interface NewRegistrationInput {
  regNo: string;
  make: string;
  year: number;
  seats: number;
  ownerName: string;
  ownerNIC: string;
  ownerPhone: string;
  driverName: string;
  driverLicence: string;
  conductorName: string;
  routeApplied: string;
  depot: string;
  province: string;
  documents: string[];
}

const MAKES = ['Ashok Leyland Viking', 'Ashok Leyland Lynx', 'Tata LPO 1512', 'Tata Marcopolo', 'Yutong ZK6110', 'King Long XMQ6106', 'Golden Dragon XML6112'];
const REQUIRED_DOCS = ['CR Book', 'Revenue Licence', 'Insurance Policy', 'Fitness Certificate'];

/**
 * CREW / OWNER — Self-Registration (Crew App simulation).
 * This form is the ONLY data-entry surface in the entire system.
 * No admin variant of it exists anywhere.
 */
export function CrewRegistrationView({
  onSubmitRegistration,
  notify,
}: {
  onSubmitRegistration: (input: NewRegistrationInput) => void;
  notify: (t: string, d?: string) => void;
}) {
  const [form, setForm] = React.useState({
    regNo: '',
    make: MAKES[0],
    year: '2021',
    seats: '54',
    ownerName: 'Nimal Fernando',
    ownerNIC: '198207801245',
    ownerPhone: '077 341 8820',
    driverName: 'Nimal Fernando',
    driverLicence: 'B/2009/48192',
    conductorName: 'Kasun Silva',
    routeApplied: `${ROUTES[0].code} · ${ROUTES[0].name.replace(' ↔ ', ' ↔ ')}`,
    depot: 'Negombo',
  });
  const [docs, setDocs] = React.useState<Record<string, boolean>>({});
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const docsDone = REQUIRED_DOCS.filter((d) => docs[d]).length;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.regNo.trim()) return notify('Number plate needed', 'Enter the vehicle registration number (e.g. NC-4521) to continue.');
    if (docsDone < REQUIRED_DOCS.length)
      return notify('Documents incomplete', `Attach all ${REQUIRED_DOCS.length} documents — the depot timekeeper will sight the originals at verification.`);
    const depotInfo = DEPOTS.find((d) => d.name.startsWith(form.depot));
    const province = depotInfo ? depotInfo.region.split('·')[0].trim() : 'Western';
    onSubmitRegistration({
      regNo: form.regNo.trim().toUpperCase(),
      make: form.make,
      year: parseInt(form.year) || 2020,
      seats: parseInt(form.seats) || 50,
      ownerName: form.ownerName,
      ownerNIC: form.ownerNIC,
      ownerPhone: form.ownerPhone,
      driverName: form.driverName,
      driverLicence: form.driverLicence,
      conductorName: form.conductorName,
      routeApplied: form.routeApplied,
      depot: form.depot,
      province: province === 'North Western' || province === 'North Central' ? province : province,
      documents: REQUIRED_DOCS.map((d) => `${d}.pdf`),
    });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Hero — amber glass */}
      <div className="relative overflow-hidden rounded-3xl bg-amber-glass p-7 text-white shadow-glowAmber animate-fade-up">
        <span className="pointer-events-none absolute -right-10 -top-12 h-44 w-44 rounded-full bg-white/25 blur-2xl" aria-hidden />
        <span className="pointer-events-none absolute -bottom-14 right-32 h-32 w-32 rounded-full bg-white/15 blur-xl" aria-hidden />
        <p className="relative flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.12em] text-white/85">
          <Smartphone className="h-4 w-4" /> Crew App · Self-Registration
        </p>
        <h2 className="relative mt-2 text-[26px] font-extrabold leading-tight tracking-tight">Register your bus — yourself.</h2>
        <p className="relative mt-1.5 max-w-lg text-sm leading-relaxed text-white/90">
          ආයුබෝවන් Nimal Fernando! This is the only place in the whole national system where bus details are entered.
          Fill in your own information, attach your documents, and your depot timekeeper will verify the vehicle in person.
        </p>
        <div className="relative mt-4 flex flex-wrap gap-2">
          {['No middlemen', 'No office queues', 'Sinhala · Tamil · English'].map((chip) => (
            <span key={chip} className="rounded-full bg-white/25 px-3 py-1 text-[11px] font-bold backdrop-blur-sm">{chip}</span>
          ))}
        </div>
      </div>

      <form onSubmit={submit} className="space-y-4">
        {/* Vehicle */}
        <Card className="animate-fade-up">
          <CardHeader title="1 · Your Vehicle" subtitle="Exactly as printed on the CR book" action={<span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F4F2EE] text-brand-700 shadow-neu"><Bus className="h-5 w-5" /></span>} />
          <CardBody>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="reg">Registration number *</label>
                <Input id="reg" placeholder="e.g. NC-4521" value={form.regNo} onChange={set('regNo')} className="tnum font-bold uppercase" />
              </div>
              <div>
                <label className="label" htmlFor="make">Make & model</label>
                <select id="make" className="input" value={form.make} onChange={set('make')}>
                  {MAKES.map((m) => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="label" htmlFor="year">Year of manufacture</label>
                <Input id="year" type="number" min={1990} max={2026} value={form.year} onChange={set('year')} className="tnum" />
              </div>
              <div>
                <label className="label" htmlFor="seats">Seating capacity</label>
                <Input id="seats" type="number" min={10} max={70} value={form.seats} onChange={set('seats')} className="tnum" />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* People */}
        <Card className="animate-fade-up">
          <CardHeader title="2 · Owner & Crew" subtitle="Licences are verified against DMT records at the depot" />
          <CardBody>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="owner">Owner’s full name</label>
                <Input id="owner" value={form.ownerName} onChange={set('ownerName')} />
              </div>
              <div>
                <label className="label" htmlFor="nic">Owner NIC / Business reg.</label>
                <Input id="nic" value={form.ownerNIC} onChange={set('ownerNIC')} className="tnum" />
              </div>
              <div>
                <label className="label" htmlFor="phone">Mobile (for permit alerts)</label>
                <Input id="phone" value={form.ownerPhone} onChange={set('ownerPhone')} className="tnum" />
              </div>
              <div>
                <label className="label" htmlFor="driver">Driver’s name</label>
                <Input id="driver" value={form.driverName} onChange={set('driverName')} />
              </div>
              <div>
                <label className="label" htmlFor="licence">Driver licence no.</label>
                <Input id="licence" value={form.driverLicence} onChange={set('driverLicence')} className="tnum" />
              </div>
              <div>
                <label className="label" htmlFor="conductor">Conductor’s name</label>
                <Input id="conductor" value={form.conductorName} onChange={set('conductorName')} />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Route & depot */}
        <Card className="animate-fade-up">
          <CardHeader title="3 · Route & Home Depot" subtitle="Your home depot performs the physical verification" />
          <CardBody>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="route">Route you are applying for</label>
                <select id="route" className="input" value={form.routeApplied} onChange={set('routeApplied')}>
                  {ROUTES.map((r) => (
                    <option key={r.code} value={`${r.code} · ${r.name}`}>{r.code} · {r.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label" htmlFor="depot">Home depot (verification point)</label>
                <select id="depot" className="input" value={form.depot} onChange={set('depot')}>
                  {DEPOTS.map((d) => (
                    <option key={d.name} value={d.name.replace(' Depot', '')}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Documents */}
        <Card className="animate-fade-up">
          <CardHeader
            title="4 · Your Documents"
            subtitle="Photograph or scan — originals are sighted at the depot"
            action={<Badge tone={docsDone === REQUIRED_DOCS.length ? 'emerald' : 'amber'} dot>{docsDone}/{REQUIRED_DOCS.length} attached</Badge>}
          />
          <CardBody>
            <div className="grid gap-3 sm:grid-cols-2">
              {REQUIRED_DOCS.map((d) => {
                const attached = !!docs[d];
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => {
                      setDocs((p) => ({ ...p, [d]: !p[d] }));
                      if (!attached) notify('Document attached', `${d}.pdf added to your submission.`);
                    }}
                    aria-pressed={attached}
                    className={cn(
                      'flex items-center gap-3 rounded-[20px] border border-dashed p-4 text-left transition-all duration-200',
                      attached
                        ? 'border-brand-300 bg-brand-50/70 shadow-none'
                        : 'border-[#D8D0BF] bg-[#FBFAF6] shadow-insetSoft hover:bg-white',
                    )}
                  >
                    <span className={cn('inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl', attached ? 'bg-brand-600 text-white shadow-btn3d animate-pop-in' : 'bg-white text-ash-400 shadow-neuSm')}>
                      {attached ? <Check className="h-5 w-5" strokeWidth={3} /> : <Upload className="h-5 w-5" />}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-bold text-ink">{d}</span>
                      <span className="block text-xs text-ash-400">{attached ? `${d}.pdf · ready` : 'Tap to attach (PDF/JPG)'}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <Button type="submit" size="lg" className="mt-6 w-full">
              <Send className="h-5 w-5" /> Submit for Depot Verification
            </Button>
            <p className="mt-3 text-center text-xs font-medium leading-relaxed text-ash-400">
              By submitting you confirm the details are true. False particulars are an offence under the Motor Traffic Act.
              Next step: bring the bus + originals to {form.depot} depot.
            </p>
          </CardBody>
        </Card>
      </form>
    </div>
  );
}

/* --------------------------- My submissions --------------------------- */

const STEPS = [
  { label: 'Self-Registered', icon: Smartphone },
  { label: 'Depot Verification', icon: ClipboardCheck },
  { label: 'Provincial Permit', icon: Stamp },
  { label: 'Live Tracking', icon: BadgeCheck },
];

function stepIndex(status: Registration['status']) {
  switch (status) {
    case 'Pending Depot Verification': return 1;
    case 'Recommended to Province': return 2;
    case 'Permit Granted': return 3;
    default: return 1;
  }
}

export function MySubmissionsView({
  rows,
  onRegisterAnother,
}: {
  rows: Registration[];
  onRegisterAnother: () => void;
}) {
  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3 animate-fade-up">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-ink">My Submissions</h2>
          <p className="mt-0.5 text-sm text-ash-500">Track each bus from your phone to the live national map.</p>
        </div>
        <Button onClick={onRegisterAnother}>
          <Bus className="h-4 w-4" /> Register Another Bus
        </Button>
      </div>

      {rows.map((r) => {
        const idx = stepIndex(r.status);
        const returned = r.status === 'Returned for Correction';
        return (
          <Card key={r.id} className="p-6 animate-fade-up">
            <div className="flex flex-wrap items-center gap-3">
              <span className="tnum text-lg font-extrabold tracking-tight text-ink">{r.regNo}</span>
              <RouteChip code={r.routeApplied.split('·')[0].trim()} className="min-w-[44px] py-0.5 text-[11px]" />
              <span className="text-sm font-semibold text-ash-600">{r.make}</span>
              <span className="ml-auto"><StatusBadge status={r.status} /></span>
            </div>

            {returned ? (
              <div className="mt-4 flex gap-3 rounded-[20px] bg-red-50 p-4">
                <RotateCcw className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                <div>
                  <p className="text-sm font-extrabold text-red-700">Action needed at {r.depot} depot</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-red-600/90">{r.returnNote}</p>
                  <p className="mt-1 text-xs font-semibold text-red-500">Fix it here in the app and resubmit — no office visit needed for paperwork.</p>
                </div>
              </div>
            ) : (
              <>
                {/* Stepper */}
                <ol className="mt-6 flex items-start" aria-label={`Progress for ${r.regNo}`}>
                  {STEPS.map((s, i) => {
                    const state = i < idx ? 'done' : i === idx ? (r.status === 'Permit Granted' ? 'done' : 'current') : 'todo';
                    const allDone = r.status === 'Permit Granted';
                    const st = allDone ? 'done' : state;
                    return (
                      <li key={s.label} className={cn('relative flex-1', i > 0 && 'pl-0')}>
                        {i > 0 && (
                          <span className={cn('absolute left-[-50%] top-5 h-1.5 w-full rounded-full', st !== 'todo' || i <= idx ? 'bg-brand-600' : 'bg-[#EFEAE0]', i <= idx ? 'bg-brand-600' : 'bg-[#EFEAE0]')} aria-hidden style={{ transform: 'translateX(20px)', width: 'calc(100% - 40px)' }} />
                        )}
                        <div className="relative flex flex-col items-center text-center">
                          <span
                            className={cn(
                              'z-10 inline-flex h-10 w-10 items-center justify-center rounded-2xl transition-all',
                              st === 'done' && 'bg-brand-600 text-white shadow-btn3d',
                              st === 'current' && 'bg-amber-glass text-white shadow-btnAmber animate-pop-in',
                              st === 'todo' && 'bg-[#F4F2EE] text-ash-400 shadow-neuSm',
                            )}
                          >
                            {st === 'done' ? <Check className="h-5 w-5" strokeWidth={3} /> : <s.icon className="h-5 w-5" />}
                          </span>
                          <span className={cn('mt-2 px-1 text-[11px] font-bold leading-tight', st === 'todo' ? 'text-ash-400' : 'text-ink')}>{s.label}</span>
                        </div>
                      </li>
                    );
                  })}
                </ol>

                {r.status === 'Permit Granted' && (
                  <p className="mt-5 flex items-center gap-2 rounded-[20px] bg-brand-50 p-4 text-sm font-semibold text-brand-800">
                    <PartyPopper className="h-5 w-5 shrink-0 text-brand-700" />
                    Permit <span className="tnum font-extrabold">{r.permitNo}</span> is active — passengers can track {r.regNo} live in the Maga app.
                    <FileCheck2 className="ml-auto h-5 w-5 shrink-0 text-brand-600" />
                  </p>
                )}
              </>
            )}

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 border-t border-ash-100 pt-3.5 text-xs font-medium text-ash-400">
              <span>Submitted {r.submittedAt}</span>
              <span>{r.depot} depot · {r.province} Province</span>
              <span>Ref {r.id}</span>
            </div>
          </Card>
        );
      })}

      {rows.length === 0 && (
        <Card className="p-10 text-center animate-fade-up">
          <p className="text-sm font-semibold text-ash-600">No submissions yet.</p>
          <p className="mt-1 text-[13px] text-ash-400">Your self-registered buses will be tracked here.</p>
        </Card>
      )}
    </div>
  );
}
