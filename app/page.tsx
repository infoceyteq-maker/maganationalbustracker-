'use client';

import * as React from 'react';
import { Bus, CheckCircle2, Lock, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DEFAULT_VIEW,
  ROLES,
  ROLE_NAV,
  ROLE_ORDER,
  type RoleKey,
  type ViewKey,
} from '@/lib/roles';
import {
  PROVINCE_CODE,
  SEED_ADMINS,
  SEED_AUTOMATION,
  SEED_REGISTRATIONS,
  type AdminAccount,
  type AutomationEvent,
  type Registration,
} from '@/lib/pipeline';
import type { RegistrationSearchHit } from '@/lib/searchTypes';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { MasterOverview } from '@/components/views/MasterOverview';
import { AdminAccountsView } from '@/components/views/AdminAccountsView';
import { RegistryView } from '@/components/views/RegistryView';
import { PipelineView } from '@/components/views/PipelineView';
import { DepotVerificationView, RecommendedHistoryView } from '@/components/views/DepotVerificationView';
import { GrantedPermitsView, ProvincialApprovalsView } from '@/components/views/ProvincialApprovalsView';
import { CrewRegistrationView, MySubmissionsView, type NewRegistrationInput } from '@/components/views/CrewRegistrationView';
import { AccessPolicyView } from '@/components/views/AccessPolicyView';
import { ReportsView, SettingsView } from '@/components/views/OtherViews';

interface Toast {
  id: number;
  title: string;
  detail?: string;
}

const DEPOT_SCOPE = 'Negombo';
const PROVINCE_SCOPE = 'Western';

function nowStamp() {
  return new Date()
    .toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    .replace(',', ' ·');
}

export default function DashboardPage() {
  const [role, setRole] = React.useState<RoleKey>('master');
  const [view, setView] = React.useState<ViewKey>('overview');
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [registrations, setRegistrations] = React.useState<Registration[]>(SEED_REGISTRATIONS);
  const [admins, setAdmins] = React.useState<AdminAccount[]>(SEED_ADMINS);
  const [automation, setAutomation] = React.useState<AutomationEvent[]>(SEED_AUTOMATION);
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const [liveBuses, setLiveBuses] = React.useState(12486);
  const regSeq = React.useRef(1042);
  const admSeq = React.useRef(45);

  React.useEffect(() => {
    const id = setInterval(() => {
      setLiveBuses((n) => Math.max(11800, Math.min(13200, n + Math.round((Math.random() - 0.45) * 36))));
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const notify = React.useCallback((title: string, detail?: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t.slice(-3), { id, title, detail }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 5600);
  }, []);

  const navigate = React.useCallback((v: ViewKey) => {
    setView(v);
    setMobileOpen(false);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  /* ------------------------- Role switching ------------------------- */
  const switchRole = React.useCallback(
    (r: RoleKey) => {
      setRole(r);
      setView(DEFAULT_VIEW[r]);
      setMobileOpen(false);
      const def = ROLES[r];
      notify(
        `Now viewing as ${def.title}`,
        `${def.person} · ${def.scopeLabel}. Can: ${def.can[0].toLowerCase()}. Locked: ${def.locked[0].toLowerCase()}.`,
      );
    },
    [notify],
  );

  /* ---------------------- Master: admin accounts --------------------- */
  const createAdmin = React.useCallback(
    (input: { name: string; email: string; role: 'Provincial Admin' | 'Depot Admin'; assignment: string }) => {
      const account: AdminAccount = {
        id: `ADM-${String(admSeq.current++).padStart(3, '0')}`,
        name: input.name,
        email: input.email,
        role: input.role,
        assignment: input.assignment,
        status: 'Invitation Sent',
        lastActive: '—',
      };
      setAdmins((prev) => [prev[0], account, ...prev.slice(1)]);
      notify('Admin account created', `${input.name} · ${input.role} (${input.assignment}). Invitation + MFA enrolment emailed to ${input.email}. Logged to audit trail.`);
    },
    [notify],
  );

  const toggleAdminStatus = React.useCallback(
    (a: AdminAccount) => {
      setAdmins((prev) => prev.map((x) => (x.id === a.id ? { ...x, status: a.status === 'Suspended' ? 'Active' : 'Suspended' } : x)));
      notify(
        a.status === 'Suspended' ? 'Account reactivated' : 'Account suspended',
        `${a.name} (${a.role} · ${a.assignment}) ${a.status === 'Suspended' ? 'can sign in again.' : 'can no longer sign in. Active sessions revoked.'}`,
      );
    },
    [notify],
  );

  /* ------------------------- Pipeline actions ------------------------ */
  const submitRegistration = React.useCallback(
    (input: NewRegistrationInput) => {
      const reg: Registration = {
        id: `REG-${regSeq.current++}`,
        regNo: input.regNo,
        make: input.make,
        year: input.year,
        seats: input.seats,
        ownerName: input.ownerName,
        ownerNIC: input.ownerNIC,
        ownerPhone: input.ownerPhone,
        driverName: input.driverName,
        driverLicence: input.driverLicence,
        conductorName: input.conductorName,
        routeApplied: input.routeApplied,
        depot: input.depot,
        province: input.province,
        submittedAt: nowStamp(),
        status: 'Pending Depot Verification',
        documents: input.documents,
        checks: {},
        mine: true,
        history: [{ stage: 'Self-registered', by: `${input.ownerName} (Crew App)`, at: nowStamp(), note: `Submitted with ${input.documents.length} supporting documents.` }],
      };
      setRegistrations((prev) => [reg, ...prev]);
      navigate('submissions');
      notify('🎉 Submitted to your depot', `${reg.regNo} is now in the ${input.depot} depot verification queue. Bring the bus + original documents for the physical check. Ref ${reg.id}.`);
    },
    [navigate, notify],
  );

  const patchReg = React.useCallback((id: string, patch: Partial<Registration>) => {
    setRegistrations((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }, []);

  const recommend = React.useCallback(
    (r: Registration, checks: Record<string, boolean>) => {
      patchReg(r.id, {
        status: 'Recommended to Province',
        checks,
        history: [
          ...r.history,
          { stage: 'Depot verified', by: `Ruwan Fernando · ${r.depot} Depot`, at: nowStamp(), note: 'All 7 physical checks sighted and passed.' },
          { stage: 'Recommended', by: `Ruwan Fernando · ${r.depot} Depot`, at: nowStamp(), note: `Forwarded to ${r.province} Province for final permit.` },
        ],
      });
      notify('Recommended to Province', `${r.regNo} passed physical verification at ${r.depot} depot and is now with the ${r.province} Provincial Admin. Switch to the Provincial role to grant its permit.`);
    },
    [patchReg, notify],
  );

  const returnForCorrection = React.useCallback(
    (r: Registration) => {
      patchReg(r.id, {
        status: 'Returned for Correction',
        returnNote: 'Verification could not be completed — please check your documents and vehicle condition, then resubmit in the Crew App.',
        history: [...r.history, { stage: 'Returned', by: `Ruwan Fernando · ${r.depot} Depot`, at: nowStamp(), note: 'Returned to crew for correction. Admins cannot fix crew data.' }],
      });
      notify('Returned to crew', `${r.regNo} was sent back to ${r.ownerName} with notes. Only the crew can correct and resubmit their own data.`);
    },
    [patchReg, notify],
  );

  const grantPermit = React.useCallback(
    (r: Registration) => {
      const permitNo = `${PROVINCE_CODE[r.province] ?? 'WP'}/2026/${10000 + Math.floor(Math.random() * 8999)}`;
      const at = nowStamp();
      patchReg(r.id, {
        status: 'Permit Granted',
        permitNo,
        history: [
          ...r.history,
          { stage: 'Permit granted', by: `Kumari Jayasuriya · ${r.province} Province`, at, note: `Permit ${permitNo} issued · live tracking unlocked automatically.` },
        ],
      });
      setAutomation((prev) => [
        { id: Date.now() + 3, text: `Crew notified in-app & by SMS · ${r.ownerName} (${r.ownerPhone})`, at, tone: 'notify' },
        { id: Date.now() + 2, text: `GPS live-tracking unlocked for ${r.regNo} · device bound to permit`, at, tone: 'gps' },
        { id: Date.now() + 1, text: `Published to the national register · ${r.regNo} on route ${r.routeApplied.split('·')[0].trim()}`, at, tone: 'register' },
        { id: Date.now(), text: `Digital permit ${permitNo} issued to ${r.regNo} · QR + PDF generated`, at, tone: 'permit' },
        ...prev,
      ]);
      setLiveBuses((n) => n + 1);
      notify('🎉 Final Permit Granted — bus is LIVE', `${r.regNo} · permit ${permitNo}. Automation unlocked GPS tracking and notified ${r.ownerName}. Find it in Granted Permits (and in the Master’s read-only register).`);
    },
    [patchReg, notify],
  );

  const returnToDepot = React.useCallback(
    (r: Registration) => {
      patchReg(r.id, {
        status: 'Pending Depot Verification',
        history: [...r.history, { stage: 'Returned to depot', by: `Kumari Jayasuriya · ${r.province} Province`, at: nowStamp(), note: 'Provincial review requested re-verification at the depot.' }],
      });
      notify('Returned to depot', `${r.regNo} is back in the ${r.depot} depot queue for re-verification. No record was edited at any point.`);
    },
    [patchReg, notify],
  );

  /* --------------------------- Scoped data --------------------------- */
  const pendingDepotAll = registrations.filter((r) => r.status === 'Pending Depot Verification');
  const pendingProvinceAll = registrations.filter((r) => r.status === 'Recommended to Province');
  const depotQueue = pendingDepotAll.filter((r) => r.depot === DEPOT_SCOPE);
  const depotSent = registrations.filter(
    (r) => r.depot === DEPOT_SCOPE && (r.status === 'Recommended to Province' || r.status === 'Permit Granted'),
  );
  const provinceQueue = pendingProvinceAll.filter((r) => r.province === PROVINCE_SCOPE);
  const provinceGranted = registrations.filter((r) => r.status === 'Permit Granted' && r.province === PROVINCE_SCOPE);
  const mySubmissions = registrations.filter((r) => r.mine);
  const myReturned = mySubmissions.filter((r) => r.status === 'Returned for Correction').length;

  const badges: Partial<Record<ViewKey, number>> =
    role === 'master'
      ? { pipeline: pendingDepotAll.length + pendingProvinceAll.length }
      : role === 'provincial'
        ? { finalApprovals: provinceQueue.length }
        : role === 'depot'
          ? { verification: depotQueue.length }
          : { submissions: myReturned };

  /* Scope-aware search: each role searches only what it may see. */
  const searchHits = React.useCallback(
    (q: string): RegistrationSearchHit[] => {
      const needle = q.trim().toLowerCase();
      if (!needle) return [];
      const scoped =
        role === 'master'
          ? registrations
          : role === 'provincial'
            ? registrations.filter((r) => r.province === PROVINCE_SCOPE)
            : role === 'depot'
              ? registrations.filter((r) => r.depot === DEPOT_SCOPE)
              : registrations.filter((r) => r.mine);
      return scoped
        .filter((r) => `${r.regNo} ${r.ownerName} ${r.driverName} ${r.routeApplied}`.toLowerCase().includes(needle))
        .slice(0, 5)
        .map((r) => ({ id: r.id, regNo: r.regNo, ownerName: r.ownerName, routeApplied: r.routeApplied, depot: r.depot, province: r.province, status: r.status }));
    },
    [role, registrations],
  );

  const roleDef = ROLES[role];

  return (
    <div className="flex min-h-screen bg-cream">
      <Sidebar
        role={role}
        active={view}
        onNavigate={navigate}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        badges={badges}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar
          role={role}
          view={view}
          onSwitchRole={switchRole}
          onOpenMobileNav={() => setMobileOpen(true)}
          notify={notify}
          searchHits={searchHits}
        />

        <main className="mx-auto w-full max-w-[1460px] flex-1 px-4 py-6 sm:px-6 lg:px-8" key={`${role}-${view}`}>
          {/* MASTER ADMIN */}
          {role === 'master' && view === 'overview' && (
            <MasterOverview registrations={registrations} adminCount={admins.length} liveBuses={liveBuses} onNavigate={navigate} notify={notify} />
          )}
          {role === 'master' && view === 'accounts' && (
            <AdminAccountsView admins={admins} onCreate={createAdmin} onToggleStatus={toggleAdminStatus} notify={notify} />
          )}
          {role === 'master' && view === 'registry' && <RegistryView registrations={registrations} notify={notify} />}
          {role === 'master' && view === 'pipeline' && <PipelineView registrations={registrations} notify={notify} />}
          {role === 'master' && view === 'reports' && <ReportsView notify={notify} />}
          {role === 'master' && view === 'settings' && <SettingsView notify={notify} />}

          {/* PROVINCIAL ADMIN */}
          {role === 'provincial' && view === 'finalApprovals' && (
            <ProvincialApprovalsView queue={provinceQueue} province={PROVINCE_SCOPE} automation={automation} onGrant={grantPermit} onReturnToDepot={returnToDepot} notify={notify} />
          )}
          {role === 'provincial' && view === 'permits' && <GrantedPermitsView rows={provinceGranted} province={PROVINCE_SCOPE} />}

          {/* DEPOT ADMIN */}
          {role === 'depot' && view === 'verification' && (
            <DepotVerificationView queue={depotQueue} depotName={DEPOT_SCOPE} onRecommend={recommend} onReturn={returnForCorrection} notify={notify} />
          )}
          {role === 'depot' && view === 'recommended' && <RecommendedHistoryView rows={depotSent} depotName={DEPOT_SCOPE} />}

          {/* CREW / OWNER */}
          {role === 'crew' && view === 'register' && <CrewRegistrationView onSubmitRegistration={submitRegistration} notify={notify} />}
          {role === 'crew' && view === 'submissions' && (
            <MySubmissionsView rows={mySubmissions} onRegisterAnother={() => navigate('register')} />
          )}

          {/* SHARED */}
          {view === 'policy' && <AccessPolicyView role={role} />}
        </main>

        <footer className="px-4 pb-6 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-[1460px] flex-wrap items-center justify-between gap-2 rounded-[20px] bg-white/60 px-5 py-3.5 text-xs font-medium text-ash-400 shadow-insetSoft">
            <p>
              <span className="font-extrabold text-ash-600">Maga · National Bus Digitization</span> — RBAC build 2.0 · Neo-Apple 3D Tactile UI
            </p>
            <p className="flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-brand-700" /> Bus & driver data: crew self-registration only · admins verify & permit
            </p>
          </div>
        </footer>
      </div>

      {/* Mobile drawer — role-aware */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <button className="absolute inset-0 bg-ink/30 backdrop-blur-[2px]" onClick={() => setMobileOpen(false)} aria-label="Close navigation" />
          <div className="absolute inset-y-0 left-0 w-[292px] overflow-y-auto bg-white p-4 shadow-pop animate-fade-in">
            <div className="flex items-center gap-3 px-1 pb-3 pt-1">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-[16px] bg-brand-600 text-white shadow-btn3d">
                <Bus className="h-5 w-5" />
              </span>
              <span className="leading-tight">
                <span className="block text-base font-extrabold tracking-tight text-ink">Maga<span className="text-brand-600">.</span></span>
                <span className="block text-[10px] font-bold uppercase tracking-[0.1em] text-ash-400">National Bus Digitization</span>
              </span>
              <button onClick={() => setMobileOpen(false)} className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-full text-ash-500 hover:bg-[#F7F4EC]" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="px-2 pb-1.5 pt-2 text-[10px] font-bold uppercase tracking-[0.12em] text-ash-400">View as role</p>
            <div className="grid grid-cols-2 gap-1.5">
              {ROLE_ORDER.map((r) => {
                const def = ROLES[r];
                return (
                  <button
                    key={r}
                    onClick={() => switchRole(r)}
                    className={cn(
                      'flex items-center gap-2 rounded-full px-3 py-2.5 text-[13px] font-bold transition-all',
                      role === r ? 'bg-brand-600 text-white shadow-btn3d' : 'bg-[#F7F4EC] text-ash-600',
                    )}
                  >
                    <def.icon className="h-4 w-4" /> {def.short}
                  </button>
                );
              })}
            </div>

            {ROLE_NAV[role].map((section) => (
              <div key={section.heading} className="mt-4">
                <p className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-ash-400">{section.heading}</p>
                <ul className="space-y-1">
                  {section.items.map((item) => (
                    <li key={item.key}>
                      <button
                        onClick={() => navigate(item.key)}
                        aria-current={view === item.key ? 'page' : undefined}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-full px-3.5 py-2.5 text-sm transition-all',
                          view === item.key ? 'bg-brand-600 font-bold text-white shadow-btn3d' : 'font-semibold text-ash-600 hover:bg-[#F7F4EC]',
                        )}
                      >
                        <item.icon className={cn('h-5 w-5', view === item.key ? 'text-white' : 'text-ash-400')} />
                        {item.label}
                        {badges[item.key] ? (
                          <span className="tnum ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-glass px-1.5 text-[11px] font-extrabold text-white">
                            {badges[item.key]}
                          </span>
                        ) : null}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <p className="mt-5 rounded-2xl bg-[#F7F4EC] p-3.5 text-xs font-medium leading-relaxed text-ash-500 shadow-insetSoft">
              Signed in as <span className="font-extrabold text-ink">{roleDef.person}</span> · {roleDef.scopeLabel}
            </p>
          </div>
        </div>
      )}

      {/* Toasts */}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[60] flex w-[min(92vw,392px)] flex-col gap-2.5" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className="card pointer-events-auto flex gap-3 p-4 shadow-pop animate-toast-in">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-btn3d">
              <CheckCircle2 className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-extrabold leading-snug text-ink">{t.title}</p>
              {t.detail && <p className="mt-0.5 text-[13px] leading-relaxed text-ash-500">{t.detail}</p>}
            </div>
            <button
              onClick={() => setToasts((x) => x.filter((y) => y.id !== t.id))}
              className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-ash-400 transition-all hover:bg-[#F7F4EC] hover:text-ink"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
