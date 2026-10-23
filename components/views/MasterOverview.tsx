'use client';

import * as React from 'react';
import {
  ArrowRight,
  Bus,
  ClipboardCheck,
  FileCheck2,
  Landmark,
  Lock,
  ShieldCheck,
  Stamp,
  UserPlus,
  Users,
} from 'lucide-react';
import { fmt } from '@/lib/utils';
import type { ViewKey } from '@/lib/roles';
import type { Registration } from '@/lib/pipeline';
import { PROVINCE_STATS } from '@/lib/pipeline';
import { HOURLY_BOARDINGS, HOURLY_LABELS } from '@/lib/data';
import { Button, LockedButton } from '@/components/ui/button';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/primitives';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { AreaChart } from '@/components/dashboard/Charts';

/**
 * MASTER ADMIN — Island Overview (Ministry of Transport).
 * Read-mostly command view: the Master creates admin accounts and watches
 * the nation. Bus/Driver creation is visibly, permanently LOCKED.
 */
export function MasterOverview({
  registrations,
  adminCount,
  liveBuses,
  onNavigate,
  notify,
}: {
  registrations: Registration[];
  adminCount: number;
  liveBuses: number;
  onNavigate: (v: ViewKey) => void;
  notify: (t: string, d?: string) => void;
}) {
  const [today, setToday] = React.useState('');
  React.useEffect(() => {
    setToday(new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
  }, []);

  const pendingDepot = registrations.filter((r) => r.status === 'Pending Depot Verification').length;
  const pendingProvince = registrations.filter((r) => r.status === 'Recommended to Province').length;
  const granted = registrations.filter((r) => r.status === 'Permit Granted').length;

  const explainLock = (what: string) =>
    notify(
      `🔒 ${what} is locked for all admins`,
      'RBAC policy: bus & driver data can ONLY enter the system through Crew Self-Registration in the Crew App. Admins verify, recommend and grant permits — they never type vehicle data.',
    );

  const stages = [
    { icon: ClipboardCheck, label: 'At Depot Verification', count: pendingDepot, note: 'Timekeepers checking vehicles physically', view: 'pipeline' as ViewKey },
    { icon: Stamp, label: 'Awaiting Final Permit', count: pendingProvince, note: 'Recommended · with Provincial Admins', view: 'pipeline' as ViewKey },
    { icon: FileCheck2, label: 'Permits Granted (sample)', count: granted, note: 'Live tracking unlocked automatically', view: 'registry' as ViewKey },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 animate-fade-up">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-brand-700">
            <Landmark className="h-4 w-4" /> Ministry of Transport · Master Admin
          </p>
          <h2 className="mt-1.5 text-[28px] font-extrabold tracking-tight text-ink">Island-wide Command</h2>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-ash-500">
            {today} · You oversee all nine provinces and provision the admins who run them. Vehicle data entry is
            locked to crew self-registration — by design, not by convention.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Button variant="amber" onClick={() => onNavigate('accounts')}>
            <UserPlus className="h-4 w-4" /> Create Admin Account
          </Button>
          <Button variant="secondary" onClick={() => onNavigate('reports')}>
            View National Reports
          </Button>
        </div>
      </div>

      {/* KPI row — one amber-glass highlight */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="animate-fade-up">
          <MetricCard
            highlight
            label="Fleet Digitized Island-wide"
            value="78%"
            delta={9.4}
            deltaNote="vs last quarter"
            icon={Bus}
            spark={[52, 58, 63, 67, 71, 74, 78]}
            footnote="14,760 of 18,940 buses permit-live"
          />
        </div>
        <div className="animate-fade-up" style={{ animationDelay: '60ms' }}>
          <MetricCard
            label="Buses Live on GPS Now"
            value={fmt(liveBuses)}
            delta={4.8}
            deltaNote="vs yesterday"
            icon={Bus}
            accent
            spark={[8200, 9600, 10800, 11400, 11980, 12486]}
            footnote="unlocked only via granted permits"
          />
        </div>
        <div className="animate-fade-up" style={{ animationDelay: '120ms' }}>
          <MetricCard
            label="In Approval Pipeline"
            value={String(pendingDepot + pendingProvince)}
            delta={12.0}
            deltaNote="new self-registrations"
            icon={ClipboardCheck}
            spark={[3, 4, 5, 5, 6, pendingDepot + pendingProvince]}
            footnote={`${pendingDepot} at depots · ${pendingProvince} at provinces`}
          />
        </div>
        <div className="animate-fade-up" style={{ animationDelay: '180ms' }}>
          <MetricCard
            label="Admin Accounts"
            value={String(adminCount)}
            delta={0}
            deltaNote="provisioned by you"
            icon={Users}
            spark={[4, 5, 5, 6, 7, adminCount]}
            footnote="provincial + depot admins only"
          />
        </div>
      </div>

      {/* RBAC compliance banner — the locked functions, on full display */}
      <Card className="overflow-hidden animate-fade-up">
        <div className="flex flex-col gap-5 p-6 lg:flex-row lg:items-center">
          <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] bg-[#F4F2EE] text-brand-700 shadow-neu">
            <ShieldCheck className="h-7 w-7" strokeWidth={2} />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-extrabold tracking-tight text-ink">Zero admin data-entry — enforced by RBAC</h3>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ash-500">
              No Master, Provincial or Depot admin can add a bus or a driver. Records are born only in the{' '}
              <span className="font-bold text-ink">Crew App self-registration</span>, then verified at a depot and permitted by a
              province. Try the locked controls — they will explain themselves.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <div>
              <LockedButton onExplain={() => explainLock('Add Bus')}>Add Bus</LockedButton>
              <p className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-ash-400">
                <Lock className="h-3 w-3" /> Crew self-registration only
              </p>
            </div>
            <div>
              <LockedButton onExplain={() => explainLock('Add Driver')}>Add Driver</LockedButton>
              <p className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-ash-400">
                <Lock className="h-3 w-3" /> Crew self-registration only
              </p>
            </div>
            <div>
              <Button onClick={() => onNavigate('accounts')}>
                <UserPlus className="h-4 w-4" /> Create Admin
              </Button>
              <p className="mt-1.5 text-[11px] font-semibold text-brand-700">✓ Your one creation power</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Pipeline stage counters */}
      <div className="grid gap-4 md:grid-cols-3">
        {stages.map((s, i) => (
          <button
            key={s.label}
            onClick={() => onNavigate(s.view)}
            className="card card-hover group p-6 text-left animate-fade-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F4F2EE] text-brand-700 shadow-neu">
                <s.icon className="h-5 w-5" strokeWidth={2.2} />
              </span>
              <ArrowRight className="h-4 w-4 text-ash-300 transition-all group-hover:translate-x-1 group-hover:text-brand-700" />
            </div>
            <p className="tnum mt-4 text-3xl font-extrabold tracking-tight text-ink">{s.count}</p>
            <p className="mt-1 text-sm font-bold text-ink">{s.label}</p>
            <p className="text-[13px] text-ash-500">{s.note}</p>
          </button>
        ))}
      </div>

      {/* Ridership + provinces */}
      <div className="grid items-start gap-4 xl:grid-cols-3">
        <Card className="animate-fade-up xl:col-span-2">
          <CardHeader title="National Passenger Boardings" subtitle="Thousands per hour · permit-live fleet only" />
          <CardBody>
            <AreaChart data={HOURLY_BOARDINGS} labels={HOURLY_LABELS} unit="K boardings" />
          </CardBody>
        </Card>

        <Card className="animate-fade-up">
          <CardHeader title="Digitization by Province" subtitle="Share of fleet with live permits" />
          <CardBody>
            <ul className="space-y-3.5">
              {PROVINCE_STATS.map((p) => (
                <li key={p.province}>
                  <div className="flex items-baseline justify-between gap-2 text-sm">
                    <span className="font-semibold text-ink">{p.province}</span>
                    <span className="tnum text-xs font-medium text-ash-500">
                      {fmt(p.buses)} buses · <span className="font-extrabold text-brand-700">{p.digitized}%</span>
                    </span>
                  </div>
                  <ProgressBar value={p.digitized} tone="emerald" className="mt-1.5" />
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
