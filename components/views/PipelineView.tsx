'use client';

import { ArrowRight, ClipboardCheck, FileCheck2, RotateCcw, Smartphone, Stamp } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Registration, RegStatus } from '@/lib/pipeline';
import { Card } from '@/components/ui/card';
import { Badge, StatusBadge } from '@/components/ui/badge';
import { RouteChip } from '@/components/ui/primitives';

/**
 * MASTER ADMIN — Approval Pipeline (read-only national board).
 * The Ministry watches work flow; it never touches the records themselves.
 */
export function PipelineView({
  registrations,
  notify,
}: {
  registrations: Registration[];
  notify: (t: string, d?: string) => void;
}) {
  const columns: { status: RegStatus; title: string; icon: typeof Stamp; hint: string; tone: string }[] = [
    { status: 'Pending Depot Verification', title: '1 · Depot Verification', icon: ClipboardCheck, hint: 'Timekeepers inspect the physical bus', tone: 'bg-[#FFF4E2] text-[#9A5A00]' },
    { status: 'Recommended to Province', title: '2 · Provincial Decision', icon: Stamp, hint: 'Provincial Admin grants the final permit', tone: 'bg-blue-50 text-blue-700' },
    { status: 'Permit Granted', title: '3 · Live on the Network', icon: FileCheck2, hint: 'Permit issued · GPS unlocked by automation', tone: 'bg-brand-50 text-brand-700' },
  ];
  const returned = registrations.filter((r) => r.status === 'Returned for Correction');

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3 animate-fade-up">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-ink">Registration Pipeline — Island-wide</h2>
          <p className="mt-0.5 max-w-2xl text-sm leading-relaxed text-ash-500">
            Every card began as a <span className="font-bold text-ink">crew self-registration</span>. Your view is read-only:
            depots verify, provinces permit, automation unlocks live tracking.
          </p>
        </div>
        <Badge tone="emerald" dot>
          <Smartphone className="h-3.5 w-3.5" /> 100% crew-entered data
        </Badge>
      </div>

      <div className="grid items-start gap-4 xl:grid-cols-3">
        {columns.map((col, ci) => {
          const rows = registrations.filter((r) => r.status === col.status);
          return (
            <div key={col.status} className="space-y-3">
              <div className="flex items-center gap-2.5 px-1">
                <span className={cn('inline-flex h-9 w-9 items-center justify-center rounded-xl shadow-neuSm', col.tone)}>
                  <col.icon className="h-[18px] w-[18px]" />
                </span>
                <div className="min-w-0 flex-1 leading-tight">
                  <p className="truncate text-sm font-extrabold text-ink">{col.title}</p>
                  <p className="truncate text-[11px] font-medium text-ash-400">{col.hint}</p>
                </div>
                <span className="tnum rounded-full bg-white px-2.5 py-1 text-xs font-extrabold text-ink shadow-btnMatte">{rows.length}</span>
                {ci < 2 && <ArrowRight className="hidden h-4 w-4 text-ash-300 xl:block" aria-hidden />}
              </div>

              {rows.map((r) => (
                <button
                  key={r.id}
                  onClick={() =>
                    notify(
                      `${r.regNo} · ${r.status}`,
                      `${r.ownerName} · ${r.routeApplied} · ${r.depot} depot (${r.province}) · submitted ${r.submittedAt}${r.permitNo ? ` · permit ${r.permitNo}` : ''}.`,
                    )
                  }
                  className="card card-hover block w-full p-4 text-left animate-fade-up"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="tnum text-base font-extrabold tracking-tight text-ink">{r.regNo}</span>
                    <RouteChip code={r.routeApplied.split('·')[0].trim()} className="min-w-[44px] py-0.5 text-[11px]" />
                  </div>
                  <p className="mt-1 truncate text-[13px] font-semibold text-ash-600">{r.make} · {r.seats} seats</p>
                  <p className="truncate text-xs text-ash-500">{r.ownerName} · driver {r.driverName}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-ash-100 pt-3">
                    <StatusBadge status={r.status} />
                    <span className="ml-auto text-[11px] font-semibold text-ash-400">{r.depot} · {r.province}</span>
                  </div>
                </button>
              ))}
              {rows.length === 0 && (
                <Card className="border-dashed p-6 text-center shadow-none">
                  <p className="text-sm font-semibold text-ash-500">Queue clear</p>
                  <p className="mt-0.5 text-xs text-ash-400">Nothing waiting at this stage.</p>
                </Card>
              )}
            </div>
          );
        })}
      </div>

      {returned.length > 0 && (
        <Card className="p-5 animate-fade-up">
          <p className="flex items-center gap-2 text-sm font-extrabold text-ink">
            <RotateCcw className="h-4 w-4 text-red-500" /> Returned to crews for correction ({returned.length})
          </p>
          <ul className="mt-3 divide-y divide-ash-100">
            {returned.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center gap-3 py-3">
                <span className="tnum font-extrabold text-ink">{r.regNo}</span>
                <span className="min-w-0 flex-1 truncate text-sm text-ash-600">{r.returnNote}</span>
                <StatusBadge status={r.status} />
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-ash-400">Corrections are made by the crew in their own app — admins never edit the data for them.</p>
        </Card>
      )}
    </div>
  );
}
