'use client';

import * as React from 'react';
import { Bus, CheckCircle2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV_SECTIONS, type ViewKey } from '@/lib/nav';
import { APPROVALS, type Approval } from '@/lib/data';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { OverviewView } from '@/components/views/OverviewView';
import { LiveMapView } from '@/components/views/LiveMapView';
import { TripsView } from '@/components/views/TripsView';
import { FleetView } from '@/components/views/FleetView';
import { RoutesView } from '@/components/views/RoutesView';
import { DriversView } from '@/components/views/DriversView';
import { ApprovalsView } from '@/components/views/ApprovalsView';
import { MobileAppsView } from '@/components/views/MobileAppsView';
import { DepotsView, ReportsView, SettingsView } from '@/components/views/OtherViews';

interface Toast {
  id: number;
  title: string;
  detail?: string;
}

export default function DashboardPage() {
  const [view, setView] = React.useState<ViewKey>('overview');
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [approvals, setApprovals] = React.useState<Approval[]>(APPROVALS);
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const [liveBuses, setLiveBuses] = React.useState(12486);

  /* Gentle live heartbeat so KPIs breathe like the real feed */
  React.useEffect(() => {
    const id = setInterval(() => {
      setLiveBuses((n) => Math.max(11800, Math.min(13200, n + Math.round((Math.random() - 0.45) * 36))));
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const notify = React.useCallback((title: string, detail?: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t.slice(-3), { id, title, detail }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 5200);
  }, []);

  const navigate = React.useCallback((v: ViewKey) => {
    setView(v);
    setMobileOpen(false);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const decideApproval = React.useCallback(
    (a: Approval, decision: 'Approved' | 'Rejected') => {
      setApprovals((prev) => prev.map((x) => (x.id === a.id ? { ...x, status: decision } : x)));
      notify(
        `${a.type} ${decision.toLowerCase()}`,
        decision === 'Approved'
          ? `${a.applicant} · ${a.reference} is now published to the public register.`
          : `${a.applicant} · ${a.reference} was returned with reviewer notes.`,
      );
    },
    [notify],
  );

  const pendingCount = approvals.filter((a) => a.status === 'Pending').length;

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar
        active={view}
        onNavigate={navigate}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        approvalsPending={pendingCount}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar view={view} onNavigate={navigate} onOpenMobileNav={() => setMobileOpen(true)} notify={notify} />

        <main className="mx-auto w-full max-w-[1460px] flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8" key={view}>
          {view === 'overview' && <OverviewView liveBuses={liveBuses} onNavigate={navigate} notify={notify} />}
          {view === 'live' && <LiveMapView liveBuses={liveBuses} notify={notify} />}
          {view === 'trips' && <TripsView notify={notify} />}
          {view === 'fleet' && <FleetView onNavigate={navigate} notify={notify} />}
          {view === 'routes' && <RoutesView notify={notify} />}
          {view === 'drivers' && <DriversView notify={notify} />}
          {view === 'depots' && <DepotsView notify={notify} />}
          {view === 'approvals' && <ApprovalsView approvals={approvals} onDecide={decideApproval} />}
          {view === 'reports' && <ReportsView notify={notify} />}
          {view === 'mobile' && <MobileAppsView notify={notify} />}
          {view === 'settings' && <SettingsView notify={notify} />}
        </main>

        <footer className="border-t border-ash-100 px-4 py-5 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-[1460px] flex-wrap items-center justify-between gap-2 text-xs text-ash-400">
            <p>
              <span className="font-semibold text-ash-600">Maga · National Bus Tracker</span> — National Bus Digitization Project.
              Design preview build 1.0.
            </p>
            <p>Ministry of Transport · National Transport Commission · Sri Lanka Transport Board</p>
          </div>
        </footer>
      </div>

      {/* Mobile navigation drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <button className="absolute inset-0 bg-ink/30 backdrop-blur-[2px]" onClick={() => setMobileOpen(false)} aria-label="Close navigation" />
          <div className="absolute inset-y-0 left-0 w-[280px] overflow-y-auto bg-white p-4 shadow-pop animate-fade-in">
            <div className="flex items-center gap-3 px-1 pb-3 pt-1">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-cta">
                <Bus className="h-5 w-5" />
              </span>
              <span className="leading-tight">
                <span className="block text-base font-extrabold tracking-tight text-ink">
                  Maga<span className="text-brand-600">.</span>
                </span>
                <span className="block text-[10px] font-medium uppercase tracking-[0.09em] text-ash-500">National Bus Tracker</span>
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg text-ash-500 hover:bg-ash-100"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {NAV_SECTIONS.map((section) => (
              <div key={section.heading} className="mt-3">
                <p className="px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-ash-400">{section.heading}</p>
                <ul className="space-y-1">
                  {section.items.map((item) => (
                    <li key={item.key}>
                      <button
                        onClick={() => navigate(item.key)}
                        aria-current={view === item.key ? 'page' : undefined}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm transition-colors',
                          view === item.key ? 'bg-brand-50 font-semibold text-brand-700' : 'font-medium text-ash-600 hover:bg-ash-100',
                        )}
                      >
                        <item.icon className={cn('h-5 w-5', view === item.key ? 'text-brand-600' : 'text-ash-400')} />
                        {item.label}
                        {item.key === 'approvals' && pendingCount > 0 && (
                          <span className="tnum ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1.5 text-[11px] font-bold text-white">
                            {pendingCount}
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toasts */}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[60] flex w-[min(92vw,380px)] flex-col gap-2.5" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className="card pointer-events-auto flex gap-3 p-4 shadow-pop animate-toast-in">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-brand-50 text-brand-600">
              <CheckCircle2 className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold leading-snug text-ink">{t.title}</p>
              {t.detail && <p className="mt-0.5 text-[13px] leading-relaxed text-ash-500">{t.detail}</p>}
            </div>
            <button
              onClick={() => setToasts((x) => x.filter((y) => y.id !== t.id))}
              className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-ash-400 transition-colors hover:bg-ash-100 hover:text-ink"
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
