'use client';

import * as React from 'react';
import {
  Bus,
  Check,
  FileText,
  Fingerprint,
  Inbox,
  Lock,
  Phone,
  RotateCcw,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { VERIFICATION_CHECKS, type Registration } from '@/lib/pipeline';
import { Button } from '@/components/ui/button';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/badge';
import { Avatar, ProgressBar, RouteChip } from '@/components/ui/primitives';

/**
 * DEPOT ADMIN (Timekeeper) — Physical Verification workspace.
 * Scope: ONLY this depot's newly self-registered buses. The timekeeper
 * ticks physical checks and recommends — never types bus/driver data.
 */
export function DepotVerificationView({
  queue,
  depotName,
  onRecommend,
  onReturn,
  notify,
}: {
  queue: Registration[];
  depotName: string;
  onRecommend: (r: Registration, checks: Record<string, boolean>) => void;
  onReturn: (r: Registration) => void;
  notify: (t: string, d?: string) => void;
}) {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [checks, setChecks] = React.useState<Record<string, boolean>>({});

  const selected = queue.find((r) => r.id === selectedId) ?? queue[0] ?? null;

  React.useEffect(() => {
    if (selected) setChecks({ ...selected.checks });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.id]);

  const done = VERIFICATION_CHECKS.filter((c) => checks[c.id]).length;
  const allDone = done === VERIFICATION_CHECKS.length;

  return (
    <div className="space-y-6">
      <div className="animate-fade-up">
        <h2 className="text-xl font-extrabold tracking-tight text-ink">Verification Queue · {depotName} Depot</h2>
        <p className="mt-0.5 max-w-2xl text-sm leading-relaxed text-ash-500">
          These buses were <span className="font-bold text-ink">self-registered by their crews</span>. Walk to the vehicle, tick each
          physical check you have personally sighted, then recommend it to the Province. You cannot edit their details —
          wrong data goes back to the crew.
        </p>
      </div>

      {queue.length === 0 ? (
        <Card className="p-12 text-center animate-fade-up">
          <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-[24px] bg-[#F4F2EE] text-brand-700 shadow-neu">
            <Inbox className="h-8 w-8" />
          </span>
          <h3 className="mt-4 text-base font-extrabold text-ink">Queue clear — nice work</h3>
          <p className="mx-auto mt-1 max-w-sm text-sm text-ash-500">
            No new self-registrations are waiting at {depotName} depot. New crew submissions will appear here instantly.
          </p>
        </Card>
      ) : (
        <div className="grid items-start gap-4 xl:grid-cols-5">
          {/* Queue list */}
          <div className="space-y-3 xl:col-span-2">
            {queue.map((r) => {
              const rDone = VERIFICATION_CHECKS.filter((c) => (selected?.id === r.id ? checks[c.id] : r.checks[c.id])).length;
              const active = selected?.id === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setSelectedId(r.id)}
                  aria-pressed={active}
                  className={cn(
                    'card block w-full p-4 text-left transition-all duration-200 animate-fade-up',
                    active ? 'ring-2 ring-brand-600 shadow-lift' : 'card-hover',
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="tnum text-base font-extrabold text-ink">{r.regNo}</span>
                    <RouteChip code={r.routeApplied.split('·')[0].trim()} className="min-w-[44px] py-0.5 text-[11px]" />
                  </div>
                  <p className="mt-1 truncate text-[13px] font-semibold text-ash-600">{r.make}</p>
                  <p className="truncate text-xs text-ash-500">{r.ownerName} · submitted {r.submittedAt}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <ProgressBar value={rDone} max={VERIFICATION_CHECKS.length} tone="emerald" className="flex-1" />
                    <span className="tnum text-[11px] font-extrabold text-ash-500">{rDone}/{VERIFICATION_CHECKS.length} checks</span>
                  </div>
                </button>
              );
            })}
            <p className="flex items-center gap-2 px-2 pt-1 text-xs font-medium text-ash-500">
              <ShieldCheck className="h-4 w-4 shrink-0 text-brand-700" />
              Scope-locked: you only ever see {depotName} depot submissions.
            </p>
          </div>

          {/* Workspace */}
          {selected && (
            <div className="space-y-4 xl:col-span-3" key={selected.id}>
              <Card className="animate-fade-up">
                <CardHeader
                  title={`${selected.regNo} · ${selected.make}`}
                  subtitle={`Self-registered ${selected.submittedAt} · applying for ${selected.routeApplied}`}
                  action={<StatusBadge status={selected.status} />}
                />
                <CardBody>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-[20px] bg-[#F7F4EC] p-4 shadow-insetSoft">
                      <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-ash-400">
                        <Bus className="h-3.5 w-3.5" /> Vehicle (crew-entered)
                      </p>
                      <p className="tnum mt-2 text-sm font-extrabold text-ink">{selected.year} · {selected.seats} seats</p>
                      <p className="text-xs text-ash-500">{selected.make}</p>
                    </div>
                    <div className="rounded-[20px] bg-[#F7F4EC] p-4 shadow-insetSoft">
                      <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-ash-400">
                        <Fingerprint className="h-3.5 w-3.5" /> Owner
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <Avatar name={selected.ownerName} size="sm" />
                        <div className="leading-tight">
                          <p className="text-sm font-extrabold text-ink">{selected.ownerName}</p>
                          <p className="tnum text-[11px] text-ash-500">NIC {selected.ownerNIC}</p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-[20px] bg-[#F7F4EC] p-4 shadow-insetSoft">
                      <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-ash-400">
                        <Phone className="h-3.5 w-3.5" /> Crew on record
                      </p>
                      <p className="mt-2 text-sm font-extrabold text-ink">{selected.driverName}</p>
                      <p className="tnum text-[11px] text-ash-500">Licence {selected.driverLicence} · cond. {selected.conductorName}</p>
                    </div>
                  </div>

                  {/* Crew-uploaded documents (read-only for depot) */}
                  <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.1em] text-ash-400">Documents uploaded by crew</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selected.documents.map((d) => (
                      <button
                        key={d}
                        onClick={() => notify('Document preview', `“${d}” was uploaded by ${selected.ownerName} in the Crew App. Depot staff can view — never replace — crew documents.`)}
                        className="inline-flex items-center gap-2 rounded-full border border-cream-line bg-white px-3.5 py-2 text-xs font-semibold text-ash-700 shadow-btnMatte transition-all hover:text-ink"
                      >
                        <FileText className="h-3.5 w-3.5 text-brand-700" /> {d}
                        <span className="text-[10px] font-extrabold uppercase text-brand-700">Uploaded</span>
                      </button>
                    ))}
                  </div>
                </CardBody>
              </Card>

              {/* Physical checklist */}
              <Card className="animate-fade-up">
                <CardHeader
                  title="Physical Verification Checklist"
                  subtitle="Tick only what you have personally sighted on the vehicle"
                  action={
                    <span className={cn('tnum rounded-full px-3 py-1.5 text-xs font-extrabold shadow-insetSoft', allDone ? 'bg-brand-600 text-white shadow-btn3d' : 'bg-[#F1EEE5] text-ash-600')}>
                      {done}/{VERIFICATION_CHECKS.length} verified
                    </span>
                  }
                />
                <CardBody>
                  <ul className="space-y-2.5">
                    {VERIFICATION_CHECKS.map((c) => {
                      const on = !!checks[c.id];
                      return (
                        <li key={c.id}>
                          <button
                            onClick={() => setChecks((p) => ({ ...p, [c.id]: !p[c.id] }))}
                            aria-pressed={on}
                            className={cn(
                              'flex w-full items-center gap-3.5 rounded-[20px] border p-4 text-left transition-all duration-200',
                              on
                                ? 'border-brand-200 bg-brand-50/70 shadow-none'
                                : 'border-cream-line bg-[#FBFAF6] shadow-insetSoft hover:bg-white',
                            )}
                          >
                            <span
                              className={cn(
                                'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all duration-200',
                                on ? 'bg-brand-600 text-white shadow-btn3d animate-pop-in' : 'bg-white text-transparent shadow-neuSm ring-1 ring-cream-line',
                              )}
                            >
                              <Check className="h-[18px] w-[18px]" strokeWidth={3} />
                            </span>
                            <span className="min-w-0">
                              <span className={cn('block text-sm font-bold leading-snug', on ? 'text-ink' : 'text-ash-700')}>{c.label}</span>
                              <span className="block text-xs text-ash-400">{c.hint}</span>
                            </span>
                            {on && <span className="ml-auto text-[10px] font-extrabold uppercase tracking-wide text-brand-700">Sighted</span>}
                          </button>
                        </li>
                      );
                    })}
                  </ul>

                  <ProgressBar value={done} max={VERIFICATION_CHECKS.length} tone="emerald" className="mt-4" />

                  <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
                    <Button size="lg" className="flex-1" disabled={!allDone} onClick={() => onRecommend(selected, checks)}>
                      <Send className="h-4 w-4" /> Recommend to Province
                    </Button>
                    <Button variant="danger" size="lg" onClick={() => onReturn(selected)}>
                      <RotateCcw className="h-4 w-4" /> Return for Correction
                    </Button>
                  </div>
                  {!allDone && (
                    <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-ash-400">
                      <Lock className="h-3.5 w-3.5" />
                      “Recommend to Province” unlocks only when all {VERIFICATION_CHECKS.length} physical checks pass
                      ({VERIFICATION_CHECKS.length - done} remaining).
                    </p>
                  )}
                </CardBody>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/** DEPOT ADMIN — history of what this depot has sent upward. */
export function RecommendedHistoryView({
  rows,
  depotName,
}: {
  rows: Registration[];
  depotName: string;
}) {
  return (
    <div className="space-y-6">
      <div className="animate-fade-up">
        <h2 className="text-xl font-extrabold tracking-tight text-ink">Sent to Province · {depotName} Depot</h2>
        <p className="mt-0.5 max-w-2xl text-sm leading-relaxed text-ash-500">
          Records you verified and recommended. From here the Provincial Admin decides — your depot’s role is complete.
        </p>
      </div>
      {rows.length === 0 ? (
        <Card className="p-10 text-center animate-fade-up">
          <p className="text-sm font-semibold text-ash-600">Nothing recommended yet from {depotName} depot in this session.</p>
          <p className="mt-1 text-[13px] text-ash-400">Complete a verification checklist and press “Recommend to Province”.</p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((r) => (
            <Card key={r.id} className="card-hover p-5 animate-fade-up">
              <div className="flex items-center justify-between gap-2">
                <span className="tnum text-base font-extrabold text-ink">{r.regNo}</span>
                <StatusBadge status={r.status} />
              </div>
              <p className="mt-1.5 text-[13px] font-semibold text-ash-600">{r.make} · {r.routeApplied}</p>
              <p className="text-xs text-ash-500">{r.ownerName} · driver {r.driverName}</p>
              <div className="mt-3 space-y-1.5 border-t border-ash-100 pt-3">
                {r.history.slice(-2).map((h, i) => (
                  <p key={i} className="text-xs leading-relaxed text-ash-500">
                    <span className="font-bold text-ink">{h.stage}</span> · {h.by} · {h.at}
                  </p>
                ))}
              </div>
              {r.permitNo && <p className="tnum mt-2 inline-block rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-extrabold text-brand-700">Permit {r.permitNo}</p>}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
