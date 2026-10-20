'use client';

import { Check, ClipboardCheck, FileText, X } from 'lucide-react';
import type { Approval } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Badge, StatusBadge } from '@/components/ui/badge';
import { DataTable, type Column } from '@/components/dashboard/DataTable';

/**
 * Approvals — permit workflow queue. Approve / reject updates the record,
 * the sidebar badge and raises a toast, mirroring the production flow.
 */
export function ApprovalsView({
  approvals,
  onDecide,
}: {
  approvals: Approval[];
  onDecide: (a: Approval, decision: 'Approved' | 'Rejected') => void;
}) {
  const columns: Column<Approval>[] = [
    {
      key: 'application',
      header: 'Application',
      sortValue: (a) => a.reference,
      render: (a) => (
        <span className="flex min-w-[210px] items-center gap-3">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-ash-100 text-ash-600">
            <FileText className="h-4 w-4" />
          </span>
          <span className="min-w-0">
            <span className="block truncate font-semibold text-ink">{a.applicant}</span>
            <span className="tnum block text-xs text-ash-500">{a.reference}</span>
          </span>
        </span>
      ),
    },
    {
      key: 'type',
      header: 'Permit Type',
      sortValue: (a) => a.type,
      render: (a) => <Badge tone="gray">{a.type}</Badge>,
    },
    {
      key: 'region',
      header: 'Region',
      sortValue: (a) => a.region,
      hideOnMobile: true,
      render: (a) => <span className="whitespace-nowrap font-medium text-ink">{a.region}</span>,
    },
    {
      key: 'submitted',
      header: 'Submitted',
      sortValue: (a) => a.submitted,
      hideOnMobile: true,
      render: (a) => <span className="whitespace-nowrap">{a.submitted}</span>,
    },
    { key: 'status', header: 'Status', sortValue: (a) => a.status, render: (a) => <StatusBadge status={a.status} /> },
    {
      key: 'decision',
      header: 'Decision',
      align: 'right',
      render: (a) =>
        a.status === 'Pending' ? (
          <span className="inline-flex gap-2">
            <Button size="sm" onClick={() => onDecide(a, 'Approved')}>
              <Check className="h-3.5 w-3.5" /> Approve
            </Button>
            <Button variant="danger" size="sm" onClick={() => onDecide(a, 'Rejected')}>
              <X className="h-3.5 w-3.5" /> Reject
            </Button>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 pr-2 text-[13px] font-medium text-ash-400">
            <ClipboardCheck className="h-4 w-4" /> Decided
          </span>
        ),
    },
  ];

  const pending = approvals.filter((a) => a.status === 'Pending').length;

  return (
    <div className="space-y-6">
      <div className="animate-fade-up">
        <h2 className="text-xl font-extrabold tracking-tight text-ink">Permit Approval Queue</h2>
        <p className="mt-0.5 max-w-2xl text-sm leading-relaxed text-ash-500">
          <span className="font-semibold text-ink">{pending} applications</span> are awaiting a decision. Approved permits are
          published to operators and the public register immediately.
        </p>
      </div>

      <DataTable<Approval>
        title="Applications"
        subtitle="National Transport Commission · digital permit pipeline"
        columns={columns}
        rows={approvals}
        rowKey={(a) => a.id}
        searchText={(a) => `${a.applicant} ${a.reference} ${a.type} ${a.region} ${a.status}`}
        searchPlaceholder="Search applicant or reference…"
        filterBy={(a) => a.status}
        pageSize={8}
        emptyLabel="The queue is clear — nothing awaiting review."
      />
    </div>
  );
}
