'use client';

import * as React from 'react';
import {
  BellRing,
  Check,
  FileCheck2,
  FileText,
  Inbox,
  RotateCcw,
  Satellite,
  ScrollText,
  Stamp,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { VERIFICATION_CHECKS, type AutomationEvent, type Registration } from '@/lib/pipeline';
import { Button } from '@/components/ui/button';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { Badge, StatusBadge } from '@/components/ui/badge';
import { RouteChip } from '@/components/ui/primitives';
import { DataTable, type Column } from '@/components/dashboard/DataTable';

/**
 * PROVINCIAL ADMIN — Final Approvals.
 * Scope: ONLY depot-recommended records in this province. One decision:
 * "Grant Final Permit" → automation issues the permit and unlocks the
 * bus for live GPS tracking. No data entry exists on this screen.
 */
export function ProvincialApprovalsView({
  queue,
  province,
  automation,
  onGrant,
  onReturnToDepot,
  notify,
}: {
  queue: Registration[];
  province: string;
  automation: AutomationEvent[];
  onGrant: (r: Registration) => void;
  onReturnToDepot: (r: Registration) => void;
  notify: (t: string, d?: string) => void;
}) {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const selected = queue.find((r) => r.id === selectedId) ?? queue[0] ?? null;

  const toneIcon = {
    permit: { Icon: ScrollText, cls: 'bg-brand-50 text-brand-700' },
    gps: { Icon: Satellite, cls: 'bg-brand-50 text-brand-700' },
    notify: { Icon: BellRing, cls: 'bg-[#FFF4E2] text-[#9A5A00]' },
    register: { Icon: FileCheck2, cls: 'bg-blue-50 text-blue-700' },
  } as const;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3 animate-fade-up">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-ink">Final Approvals · {province} Province</h2>
          <p className="mt-0.5 max-w-2xl text-sm leading-relaxed text-ash-500">
            Depot timekeepers have physically verified these buses. Your single action —{' '}
            <span className="font-bold text-ink">Grant Final Permit</span> — triggers automation that issues the digital permit and
            unlocks live tracking. You cannot add or edit bus records.
          </p>
        </div>
        <Badge tone="blue" dot>{queue.length} awaiting your decision</Badge>
      </div>

      <div className="grid items-start gap-4 xl:grid-cols-3">
        {/* Decision workspace */}
        <div className="space-y-4 xl:col-span-2">
          {queue.length === 0 ? (
            <Card className="p-12 text-center animate-fade-up">
              <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-[24px] bg-[#F4F2EE] text-brand-700 shadow-neu">
                <Inbox className="h-8 w-8" />
              </span>
              <h3 className="mt-4 text-base font-extrabold text-ink">No records awaiting a permit</h3>
              <p className="mx-auto mt-1 max-w-sm text-sm text-ash-500">
                When a depot in the {province} Province recommends a verified bus, it lands here for your final decision.
              </p>
            </Card>
          ) : (
            <>
              {/* Queue chips */}
              <div className="flex flex-wrap gap-2 animate-fade-up" role="tablist" aria-label="Awaiting final permit">
                {queue.map((r) => (
                  <button
                    key={r.id}
                    role="tab"
                    aria-selected={selected?.id === r.id}
                    onClick={() => setSelectedId(r.id)}
                    className={cn(
                      'tnum inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-extrabold transition-all',
                      selected?.id === r.id
                        ? 'bg-brand-600 text-white shadow-btn3d'
                        : 'bg-white text-ash-600 shadow-btnMatte hover:text-ink',
                    )}
                  >
                    {r.regNo}
                    <span className={cn('text-[10px] font-bold uppercase', selected?.id === r.id ? 'text-white/75' : 'text-ash-400')}>{r.depot}</span>
                  </button>
                ))}
              </div>

              {selected && (
                <Card key={selected.id} className="animate-fade-up">
                  <CardHeader
                    title={`${selected.regNo} · ${selected.make}`}
                    subtitle={`${selected.routeApplied} · owner ${selected.ownerName} · driver ${selected.driverName}`}
                    action={<RouteChip code={selected.routeApplied.split('·')[0].trim()} />}
                  />
                  <CardBody>
                    {/* Depot verification summary — read-only evidence */}
                    <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-ash-400">
                      Depot verification evidence · {selected.depot} depot
                    </p>
                    <ul className="mt-2.5 grid gap-2 sm:grid-cols-2">
                      {VERIFICATION_CHECKS.map((c) => (
                        <li key={c.id} className="flex items-center gap-2.5 rounded-2xl bg-brand-50/60 px-3.5 py-2.5">
                          <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-brand-600 text-white">
                            <Check className="h-3 w-3" strokeWidth={3.5} />
                          </span>
                          <span className="text-[13px] font-semibold leading-snug text-ash-700">{c.label}</span>
                        </li>
                      ))}
                    </ul>

                    <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.1em] text-ash-400">Crew-uploaded documents</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selected.documents.map((d) => (
                        <button
                          key={d}
                          onClick={() => notify('Document preview', `“${d}” — supplied by the crew, sighted at ${selected.depot} depot, immutable in the register.`)}
                          className="inline-flex items-center gap-2 rounded-full border border-cream-line bg-white px-3.5 py-2 text-xs font-semibold text-ash-700 shadow-btnMatte transition-all hover:text-ink"
                        >
                          <FileText className="h-3.5 w-3.5 text-brand-700" /> {d}
                        </button>
                      ))}
                    </div>

                    {/* Audit trail */}
                    <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.1em] text-ash-400">Audit trail</p>
                    <ol className="mt-2 space-y-2">
                      {selected.history.map((h, i) => (
                        <li key={i} className="flex gap-3 text-sm">
                          <span className="mt-[7px] h-2 w-2 shrink-0 rounded-full bg-brand-600" aria-hidden />
                          <span className="text-ash-600">
                            <span className="font-bold text-ink">{h.stage}</span> · {h.by} · <span className="tnum">{h.at}</span>
                            <span className="block text-xs text-ash-400">{h.note}</span>
                          </span>
                        </li>
                      ))}
                    </ol>

                    {/* THE decision */}
                    <div className="mt-6 flex flex-col gap-2.5 border-t border-ash-100 pt-5 sm:flex-row">
                      <Button variant="amber" size="lg" className="flex-1" onClick={() => onGrant(selected)}>
                        <Stamp className="h-5 w-5" /> Grant Final Permit
                      </Button>
                      <Button variant="secondary" size="lg" onClick={() => onReturnToDepot(selected)}>
                        <RotateCcw className="h-4 w-4" /> Return to Depot
                      </Button>
                    </div>
                    <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-[#9A5A00]">
                      <Zap className="h-3.5 w-3.5" />
                      Granting fires automation: digital permit issued → GPS live-tracking unlocked → crew notified → national register updated.
                    </p>
                  </CardBody>
                </Card>
              )}
            </>
          )}
        </div>

        {/* Automation log */}
        <Card className="animate-fade-up">
          <CardHeader
            title="Automation Log"
            subtitle="What fires when a permit is granted"
            action={
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-extrabold text-brand-700 ring-1 ring-inset ring-brand-600/15">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-600 animate-pulse-dot" /> LIVE
              </span>
            }
          />
          <CardBody>
            <ul className="space-y-4">
              {automation.map((e) => {
                const { Icon, cls } = toneIcon[e.tone];
                return (
                  <li key={e.id} className="flex gap-3 animate-fade-up">
                    <span className={cn('inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-neuSm', cls)}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-[13px] font-semibold leading-snug text-ink">{e.text}</span>
                      <span className="tnum mt-0.5 block text-[11px] font-medium text-ash-400">{e.at}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-5 rounded-2xl bg-[#F7F4EC] p-3.5 text-xs leading-relaxed text-ash-500 shadow-insetSoft">
              Zero manual steps after your tap: the bus appears on the national live map within seconds, and the crew’s
              phone confirms “Permit active”.
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

/** PROVINCIAL ADMIN — register of permits this province has granted. */
export function GrantedPermitsView({ rows, province }: { rows: Registration[]; province: string }) {
  const columns: Column<Registration>[] = [
    {
      key: 'bus', header: 'Bus', sortValue: (r) => r.regNo,
      render: (r) => (
        <span className="block min-w-[140px]">
          <span className="tnum font-extrabold text-ink">{r.regNo}</span>
          <span className="block text-xs text-ash-500">{r.make}</span>
        </span>
      ),
    },
    {
      key: 'permit', header: 'Permit No.', sortValue: (r) => r.permitNo ?? '',
      render: (r) => <span className="tnum inline-flex rounded-full bg-brand-50 px-3 py-1 text-[13px] font-extrabold text-brand-700 ring-1 ring-inset ring-brand-600/15">{r.permitNo}</span>,
    },
    {
      key: 'route', header: 'Permitted Route', sortValue: (r) => r.routeApplied,
      render: (r) => (
        <span className="flex min-w-[180px] items-center gap-2.5">
          <RouteChip code={r.routeApplied.split('·')[0].trim()} />
          <span className="truncate font-semibold text-ink">{r.routeApplied.split('·')[1]?.trim()}</span>
        </span>
      ),
    },
    { key: 'owner', header: 'Owner · Driver', sortValue: (r) => r.ownerName, hideOnMobile: true, render: (r) => <span className="whitespace-nowrap">{r.ownerName} · {r.driverName}</span> },
    { key: 'depot', header: 'Verified At', sortValue: (r) => r.depot, hideOnMobile: true, render: (r) => <span>{r.depot} depot</span> },
    { key: 'live', header: 'Tracking', render: () => <StatusBadge status="Live Tracking Active" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="animate-fade-up">
        <h2 className="text-xl font-extrabold tracking-tight text-ink">Granted Permits · {province} Province</h2>
        <p className="mt-0.5 max-w-2xl text-sm leading-relaxed text-ash-500">
          Every permit below was self-registered by a crew, verified at a depot, and granted here — the full chain is in
          each record’s audit trail.
        </p>
      </div>
      <DataTable<Registration>
        title="Provincial Permit Register"
        subtitle="Permit-live buses currently trackable on the national map"
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        searchText={(r) => `${r.regNo} ${r.permitNo} ${r.ownerName} ${r.driverName} ${r.routeApplied} ${r.depot}`}
        searchPlaceholder="Search by plate or permit number…"
        pageSize={8}
        emptyLabel="No permits granted yet in this province."
      />
    </div>
  );
}
