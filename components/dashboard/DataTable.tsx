'use client';

import * as React from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, Download, Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/input';

/**
 * DataTable — the standard data grid of the console.
 * Search + status filter chips + sortable headers + pagination,
 * on a white card with hairline ash dividers and calm hover states.
 */
export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  sortValue?: (row: T) => string | number;
  align?: 'left' | 'center' | 'right';
  className?: string;
  hideOnMobile?: boolean;
}

interface DataTableProps<T> {
  title: string;
  subtitle?: string;
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  searchText: (row: T) => string;
  searchPlaceholder?: string;
  /** When provided, renders filter chips derived from this accessor. */
  filterBy?: (row: T) => string;
  pageSize?: number;
  primaryAction?: React.ReactNode;
  onExport?: () => void;
  emptyLabel?: string;
}

export function DataTable<T>({
  title,
  subtitle,
  columns,
  rows,
  rowKey,
  searchText,
  searchPlaceholder = 'Search…',
  filterBy,
  pageSize = 8,
  primaryAction,
  onExport,
  emptyLabel = 'No records match your filters.',
}: DataTableProps<T>) {
  const [query, setQuery] = React.useState('');
  const [filter, setFilter] = React.useState('All');
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortDir, setSortDir] = React.useState<1 | -1>(1);
  const [page, setPage] = React.useState(1);

  const filters = React.useMemo(() => {
    if (!filterBy) return ['All'];
    return ['All', ...Array.from(new Set(rows.map(filterBy)))];
  }, [rows, filterBy]);

  const filtered = React.useMemo(() => {
    let out = rows;
    if (filterBy && filter !== 'All') out = out.filter((r) => filterBy(r) === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      out = out.filter((r) => searchText(r).toLowerCase().includes(q));
    }
    if (sortKey) {
      const col = columns.find((c) => c.key === sortKey);
      if (col?.sortValue) {
        out = [...out].sort((a, b) => {
          const va = col.sortValue!(a);
          const vb = col.sortValue!(b);
          return (va < vb ? -1 : va > vb ? 1 : 0) * sortDir;
        });
      }
    }
    return out;
  }, [rows, filter, query, sortKey, sortDir, columns, filterBy, searchText]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const pageRows = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const toggleSort = (col: Column<T>) => {
    if (!col.sortValue) return;
    if (sortKey === col.key) setSortDir((d) => (d === 1 ? -1 : 1));
    else {
      setSortKey(col.key);
      setSortDir(1);
    }
  };

  const downloadCsv = () => {
    if (onExport) return onExport();
    const head = columns.map((c) => c.header).join(',');
    const body = filtered
      .map((r) => columns.map((c) => `"${String(c.sortValue ? c.sortValue(r) : '').replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const url = URL.createObjectURL(new Blob([`${head}\n${body}`], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '-').toLowerCase()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="card overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 px-5 pt-5 sm:px-6">
        <div className="min-w-0 flex-1">
          <h3 className="text-[15px] font-bold tracking-tight text-ink">{title}</h3>
          {subtitle && <p className="mt-0.5 text-[13px] text-ash-500">{subtitle}</p>}
        </div>
        <SearchInput
          wrapperClassName="w-full sm:w-64"
          placeholder={searchPlaceholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          aria-label={searchPlaceholder}
        />
        <Button variant="secondary" size="md" onClick={downloadCsv}>
          <Download className="h-4 w-4" /> Export
        </Button>
        {primaryAction}
      </div>

      {/* Filter chips */}
      {filterBy && (
        <div className="mt-4 flex flex-wrap gap-2 px-5 sm:px-6" role="tablist" aria-label="Filter by status">
          {filters.map((f) => {
            const count = f === 'All' ? rows.length : rows.filter((r) => filterBy(r) === f).length;
            const active = filter === f;
            return (
              <button
                key={f}
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setFilter(f);
                  setPage(1);
                }}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-medium transition-all duration-200',
                  active
                    ? 'border-brand-600 bg-brand-600 text-white shadow-cta'
                    : 'border-ash-200 bg-white text-ash-600 hover:border-ash-300 hover:text-ink',
                )}
              >
                {f}
                <span
                  className={cn(
                    'tnum rounded-full px-1.5 text-[11px] font-semibold',
                    active ? 'bg-white/20 text-white' : 'bg-ash-100 text-ash-500',
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Grid */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse">
          <thead>
            <tr className="border-y border-ash-200 bg-ash-50">
              {columns.map((col) => {
                const active = sortKey === col.key;
                return (
                  <th
                    key={col.key}
                    className={cn(
                      'th',
                      col.align === 'right' && 'text-right',
                      col.align === 'center' && 'text-center',
                      col.hideOnMobile && 'hidden lg:table-cell',
                      col.className,
                    )}
                  >
                    {col.sortValue ? (
                      <button
                        onClick={() => toggleSort(col)}
                        className={cn(
                          'group inline-flex items-center gap-1 uppercase tracking-[0.08em] transition-colors hover:text-ink',
                          col.align === 'right' && 'flex-row-reverse',
                          active && 'text-brand-700',
                        )}
                        aria-label={`Sort by ${col.header}`}
                      >
                        {col.header}
                        {active ? (
                          sortDir === 1 ? (
                            <ArrowUp className="h-3 w-3" />
                          ) : (
                            <ArrowDown className="h-3 w-3" />
                          )
                        ) : (
                          <ArrowUpDown className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-60" />
                        )}
                      </button>
                    ) : (
                      col.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row) => (
              <tr key={rowKey(row)} className="border-b border-ash-100 transition-colors last:border-0 hover:bg-ash-50/80">
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      'td',
                      col.align === 'right' && 'text-right',
                      col.align === 'center' && 'text-center',
                      col.hideOnMobile && 'hidden lg:table-cell',
                      col.className,
                    )}
                  >
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-14 text-center">
                  <Inbox className="mx-auto h-8 w-8 text-ash-300" />
                  <p className="mt-3 text-sm font-medium text-ash-600">{emptyLabel}</p>
                  <p className="mt-1 text-[13px] text-ash-400">Try a different search term or clear the active filter.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ash-100 px-5 py-3.5 sm:px-6">
        <p className="tnum text-[13px] text-ash-500">
          Showing{' '}
          <span className="font-semibold text-ink">
            {filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, filtered.length)}
          </span>{' '}
          of <span className="font-semibold text-ink">{filtered.length}</span> records
        </p>
        <div className="flex items-center gap-1.5">
          <Button variant="secondary" size="sm" disabled={safePage <= 1} onClick={() => setPage(safePage - 1)} aria-label="Previous page">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              aria-current={p === safePage ? 'page' : undefined}
              className={cn(
                'tnum h-8 min-w-8 rounded-lg px-2 text-[13px] font-medium transition-all',
                p === safePage ? 'bg-brand-600 text-white shadow-cta' : 'text-ash-600 hover:bg-ash-100 hover:text-ink',
              )}
            >
              {p}
            </button>
          ))}
          <Button
            variant="secondary"
            size="sm"
            disabled={safePage >= pageCount}
            onClick={() => setPage(safePage + 1)}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
