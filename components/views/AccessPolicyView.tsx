'use client';

import * as React from 'react';
import { ArrowRight, Check, ClipboardCheck, Landmark, Lock, Satellite, ShieldCheck, Smartphone, Stamp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROLES, ROLE_ORDER, type RoleKey } from '@/lib/roles';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { Avatar } from '@/components/ui/primitives';

/**
 * Access & RBAC Policy — visible to every role, identical for all.
 * The matrix is the contract: data entry belongs to crews alone.
 */
const MATRIX: { capability: string; master: boolean; provincial: boolean; depot: boolean; crew: boolean; note?: string }[] = [
  { capability: 'Register a bus (data entry)', master: false, provincial: false, depot: false, crew: true, note: 'SELF-REGISTRATION ONLY' },
  { capability: 'Register driver / conductor details', master: false, provincial: false, depot: false, crew: true, note: 'SELF-REGISTRATION ONLY' },
  { capability: 'Upload supporting documents', master: false, provincial: false, depot: false, crew: true },
  { capability: 'Create Provincial Admin accounts', master: true, provincial: false, depot: false, crew: false },
  { capability: 'Create Depot Admin accounts', master: true, provincial: false, depot: false, crew: false },
  { capability: 'Physical verification checklist', master: false, provincial: false, depot: true, crew: false },
  { capability: 'Recommend to Province', master: false, provincial: false, depot: true, crew: false },
  { capability: 'Grant Final Permit → unlock live tracking', master: false, provincial: true, depot: false, crew: false },
  { capability: 'Edit / delete a bus record', master: false, provincial: false, depot: false, crew: false, note: 'CORRECTIONS VIA RETURN-TO-CREW' },
  { capability: 'Island-wide analytics & reports', master: true, provincial: false, depot: false, crew: false, note: 'OTHERS SEE ONLY THEIR SCOPE' },
];

const FLOW = [
  { icon: Smartphone, who: 'Bus Crew / Owner', what: 'Self-registers bus + crew, uploads documents in the Crew App', tone: 'bg-amber-glass text-white shadow-btnAmber' },
  { icon: ClipboardCheck, who: 'Depot Admin (Timekeeper)', what: 'Sights the physical bus, ticks 7 checks, clicks “Recommend to Province”', tone: 'bg-[#F4F2EE] text-brand-700 shadow-neu' },
  { icon: Stamp, who: 'Provincial Admin', what: 'Reviews depot evidence, clicks “Grant Final Permit”', tone: 'bg-[#F4F2EE] text-brand-700 shadow-neu' },
  { icon: Satellite, who: 'Automation', what: 'Permit issued · GPS unlocked · crew notified · register updated', tone: 'bg-brand-600 text-white shadow-btn3d' },
];

export function AccessPolicyView({ role }: { role: RoleKey }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3 animate-fade-up">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-ink">Access & RBAC Policy</h2>
          <p className="mt-0.5 max-w-2xl text-sm leading-relaxed text-ash-500">
            One rule above all: <span className="font-bold text-ink">admins never enter bus or driver data.</span> Crews
            self-register; the state verifies, recommends and permits. You are viewing as{' '}
            <span className="font-bold text-brand-700">{ROLES[role].title}</span> — your row is highlighted.
          </p>
        </div>
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-[18px] bg-[#F4F2EE] text-brand-700 shadow-neu">
          <ShieldCheck className="h-6 w-6" />
        </span>
      </div>

      {/* Flow */}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {FLOW.map((f, i) => (
          <div key={f.who} className="card card-hover relative p-5 animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
            {i < FLOW.length - 1 && <ArrowRight className="absolute -right-3 top-1/2 z-10 hidden h-5 w-5 -translate-y-1/2 text-ash-300 xl:block" aria-hidden />}
            <span className={cn('inline-flex h-11 w-11 items-center justify-center rounded-2xl', f.tone)}>
              <f.icon className="h-5 w-5" strokeWidth={2.2} />
            </span>
            <p className="mt-3 text-[10px] font-extrabold uppercase tracking-[0.12em] text-ash-400">Step {i + 1}</p>
            <h3 className="mt-0.5 text-sm font-extrabold text-ink">{f.who}</h3>
            <p className="mt-1 text-[13px] leading-relaxed text-ash-500">{f.what}</p>
          </div>
        ))}
      </div>

      {/* Matrix */}
      <Card className="overflow-hidden animate-fade-up">
        <CardHeader title="Permission Matrix" subtitle="Enforced server-side on every API call (admin bus/driver writes return HTTP 403 · RBAC_DENY)" />
        <div className="mt-2 overflow-x-auto px-2 pb-4">
          <table className="w-full min-w-[760px] border-collapse">
            <thead>
              <tr className="border-y border-cream-line bg-[#FAF7F0]">
                <th className="th">Capability</th>
                {ROLE_ORDER.map((r) => (
                  <th key={r} className={cn('th text-center', r === role && 'text-brand-700')}>
                    <span className="inline-flex items-center gap-1.5">
                      {React.createElement(ROLES[r].icon, { className: 'h-3.5 w-3.5' })}
                      {ROLES[r].short}
                      {r === role && <span className="rounded-full bg-brand-600 px-1.5 py-px text-[9px] font-extrabold text-white">YOU</span>}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MATRIX.map((row) => (
                <tr key={row.capability} className="border-b border-ash-100 last:border-0 hover:bg-[#FBF9F4]">
                  <td className="td">
                    <span className="font-semibold text-ink">{row.capability}</span>
                    {row.note && <span className="ml-2 rounded-full bg-[#FFF4E2] px-2 py-0.5 text-[9px] font-extrabold tracking-wide text-[#9A5A00] ring-1 ring-inset ring-tang-500/30">{row.note}</span>}
                  </td>
                  {([row.master, row.provincial, row.depot, row.crew] as boolean[]).map((allowed, i) => (
                    <td key={i} className="td text-center">
                      {allowed ? (
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-brand-600 text-white shadow-btn3d" aria-label="Allowed">
                          <Check className="h-3.5 w-3.5" strokeWidth={3.5} />
                        </span>
                      ) : (
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-ash-100 text-ash-400" aria-label="Locked">
                          <Lock className="h-3 w-3" />
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Role cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {ROLE_ORDER.map((r) => {
          const def = ROLES[r];
          const isYou = r === role;
          return (
            <Card key={r} className={cn('p-5 animate-fade-up', isYou && 'ring-2 ring-brand-600')}>
              <div className="flex items-center gap-3">
                <Avatar name={def.person} tone={r === 'crew' ? 'amber' : 'emerald'} />
                <div className="min-w-0 leading-tight">
                  <p className="truncate text-sm font-extrabold text-ink">{def.title}</p>
                  <p className="truncate text-[11px] font-semibold text-ash-400">{def.scopeLabel}</p>
                </div>
                {isYou && <span className="ml-auto rounded-full bg-brand-600 px-2 py-0.5 text-[9px] font-extrabold text-white">YOU</span>}
              </div>
              <ul className="mt-4 space-y-1.5 border-t border-ash-100 pt-3">
                {def.can.map((c) => (
                  <li key={c} className="flex items-start gap-1.5 text-xs font-medium leading-snug text-ash-700">
                    <Check className="mt-px h-3.5 w-3.5 shrink-0 text-brand-600" strokeWidth={3} /> {c}
                  </li>
                ))}
                {def.locked.map((l) => (
                  <li key={l} className="flex items-start gap-1.5 text-xs font-medium leading-snug text-ash-400">
                    <Lock className="mt-px h-3.5 w-3.5 shrink-0" /> {l}
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
      </div>

      <p className="flex items-center gap-2 px-2 text-xs font-medium text-ash-500">
        <Landmark className="h-4 w-4 shrink-0 text-brand-700" />
        Why so strict? When the state cannot invent vehicle records, ghost buses, duplicate permits and back-door
        registrations become structurally impossible — every live bus traces to a crew declaration, a named timekeeper’s
        physical inspection, and a named provincial officer’s permit.
      </p>
    </div>
  );
}
