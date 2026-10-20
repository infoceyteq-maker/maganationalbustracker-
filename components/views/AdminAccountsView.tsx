'use client';

import * as React from 'react';
import { Ban, Building2, KeyRound, Landmark, Lock, MailPlus, ShieldCheck, Stamp, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DEPOTS } from '@/lib/data';
import { PROVINCES, type AdminAccount } from '@/lib/pipeline';
import { Button } from '@/components/ui/button';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { Badge, StatusBadge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { PersonCell } from '@/components/ui/primitives';
import { DataTable, type Column } from '@/components/dashboard/DataTable';

type CreatableRole = 'Provincial Admin' | 'Depot Admin';

/**
 * MASTER ADMIN — Admin Accounts.
 * The Master may create ONLY Provincial and Depot admins. Not buses, not
 * drivers, not even other Masters — least-privilege, enforced in the form.
 */
export function AdminAccountsView({
  admins,
  onCreate,
  onToggleStatus,
  notify,
}: {
  admins: AdminAccount[];
  onCreate: (a: { name: string; email: string; role: CreatableRole; assignment: string }) => void;
  onToggleStatus: (a: AdminAccount) => void;
  notify: (t: string, d?: string) => void;
}) {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [role, setRole] = React.useState<CreatableRole>('Depot Admin');
  const [assignment, setAssignment] = React.useState('');

  const assignments = role === 'Provincial Admin' ? PROVINCES.map((p) => `${p} Province`) : DEPOTS.map((d) => d.name);
  const effectiveAssignment = assignment || assignments[0];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      notify('Almost there', 'Please add the officer’s full name and official email before creating the account.');
      return;
    }
    onCreate({ name: name.trim(), email: email.trim(), role, assignment: effectiveAssignment });
    setName('');
    setEmail('');
    setAssignment('');
  };

  const columns: Column<AdminAccount>[] = [
    {
      key: 'officer',
      header: 'Officer',
      sortValue: (a) => a.name,
      render: (a) => <PersonCell name={a.name} sub={a.email} />,
    },
    {
      key: 'role',
      header: 'Role',
      sortValue: (a) => a.role,
      render: (a) => (
        <Badge tone={a.role === 'Master Admin' ? 'dark' : a.role === 'Provincial Admin' ? 'blue' : 'emerald'}>
          {a.role}
          {a.system ? ' · System' : ''}
        </Badge>
      ),
    },
    {
      key: 'assignment',
      header: 'Assignment',
      sortValue: (a) => a.assignment,
      render: (a) => <span className="whitespace-nowrap font-semibold text-ink">{a.assignment}</span>,
    },
    {
      key: 'last',
      header: 'Last Active',
      sortValue: (a) => a.lastActive,
      hideOnMobile: true,
      render: (a) => <span>{a.lastActive}</span>,
    },
    { key: 'status', header: 'Status', sortValue: (a) => a.status, render: (a) => <StatusBadge status={a.status} /> },
    {
      key: 'action',
      header: '',
      align: 'right',
      render: (a) =>
        a.system ? (
          <span className="inline-flex items-center gap-1.5 pr-2 text-xs font-bold text-ash-400">
            <Lock className="h-3.5 w-3.5" /> Protected
          </span>
        ) : (
          <Button variant={a.status === 'Suspended' ? 'secondary' : 'ghost'} size="sm" onClick={() => onToggleStatus(a)}>
            <Ban className="h-3.5 w-3.5" /> {a.status === 'Suspended' ? 'Reactivate' : 'Suspend'}
          </Button>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="animate-fade-up">
        <h2 className="text-xl font-extrabold tracking-tight text-ink">Admin Account Management</h2>
        <p className="mt-0.5 max-w-2xl text-sm leading-relaxed text-ash-500">
          As Master Admin you may create <span className="font-bold text-ink">Provincial Admin</span> and{' '}
          <span className="font-bold text-ink">Depot Admin</span> accounts — nothing else. Bus and driver accounts do not exist:
          crews self-register in the Crew App.
        </p>
      </div>

      <div className="grid items-start gap-4 xl:grid-cols-5">
        {/* Create Admin — the Master's single creation power */}
        <Card className="animate-fade-up xl:col-span-2">
          <CardHeader
            title="Create Admin Account"
            subtitle="Invitation + MFA enrolment sent by email"
            action={
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-glass text-white shadow-btnAmber">
                <UserPlus className="h-5 w-5" />
              </span>
            }
          />
          <CardBody>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="label" htmlFor="adm-name">Officer’s full name</label>
                <Input id="adm-name" placeholder="e.g. Nilmini Fernando" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <label className="label" htmlFor="adm-email">Official email</label>
                <Input id="adm-email" type="email" placeholder="officer@transport.gov.lk" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div>
                <span className="label">Role (only two exist for creation)</span>
                <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Admin role">
                  {(
                    [
                      { value: 'Provincial Admin' as CreatableRole, icon: Stamp, hint: 'Grants final permits' },
                      { value: 'Depot Admin' as CreatableRole, icon: Building2, hint: 'Verifies vehicles' },
                    ]
                  ).map((opt) => {
                    const selected = role === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => { setRole(opt.value); setAssignment(''); }}
                        className={cn(
                          'rounded-[20px] border p-3.5 text-left transition-all duration-200',
                          selected
                            ? 'border-brand-600 bg-brand-600 text-white shadow-btn3d'
                            : 'border-cream-line bg-[#FBFAF6] text-ash-600 shadow-insetSoft hover:text-ink',
                        )}
                      >
                        <opt.icon className={cn('h-5 w-5', selected ? 'text-white' : 'text-brand-700')} />
                        <span className="mt-2 block text-[13px] font-extrabold leading-tight">{opt.value}</span>
                        <span className={cn('mt-0.5 block text-[11px] font-medium', selected ? 'text-white/80' : 'text-ash-400')}>{opt.hint}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-ash-400">
                  <Lock className="h-3 w-3" /> Master Admin accounts are provisioned by the Ministry secretary only — never here.
                </p>
              </div>

              <div>
                <label className="label" htmlFor="adm-assign">{role === 'Provincial Admin' ? 'Province assignment' : 'Depot assignment'}</label>
                <select id="adm-assign" className="input" value={effectiveAssignment} onChange={(e) => setAssignment(e.target.value)}>
                  {assignments.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
              </div>

              <Button type="submit" size="lg" className="w-full">
                <MailPlus className="h-4 w-4" /> Create Account & Send Invite
              </Button>
              <p className="flex items-start gap-1.5 text-[11px] leading-relaxed text-ash-400">
                <KeyRound className="mt-px h-3.5 w-3.5 shrink-0" />
                The officer sets their own password and enrols MFA on first sign-in. Every creation is written to the audit log.
              </p>
            </form>
          </CardBody>
        </Card>

        {/* Accounts register */}
        <div className="animate-fade-up xl:col-span-3">
          <DataTable<AdminAccount>
            title="Admin Register"
            subtitle="Every privileged account in the national system"
            columns={columns}
            rows={admins}
            rowKey={(a) => a.id}
            searchText={(a) => `${a.name} ${a.email} ${a.role} ${a.assignment} ${a.status}`}
            searchPlaceholder="Search officers…"
            filterBy={(a) => a.role}
            pageSize={7}
          />
          <p className="mt-3 flex items-center gap-2 px-2 text-xs font-medium text-ash-500">
            <ShieldCheck className="h-4 w-4 text-brand-700" />
            <Landmark className="hidden h-4 w-4" aria-hidden />
            Least-privilege by construction: {admins.length} accounts, each scoped to exactly one province or one depot.
          </p>
        </div>
      </div>
    </div>
  );
}
