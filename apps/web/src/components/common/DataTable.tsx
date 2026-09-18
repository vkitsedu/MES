import React, { useState, useMemo } from 'react';
import { 
  ArrowUpDown, ArrowUp, ArrowDown, Search, 
  Download, Filter, SlidersHorizontal 
} from 'lucide-react';

export interface ColumnDef<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  keyExtractor: (row: T) => string;
  searchablePlaceholder?: string;
  searchFilter?: (row: T, query: string) => boolean;
  defaultSortKey?: keyof T | string;
  defaultSortDirection?: 'asc' | 'desc';
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  denseByDefault?: boolean;
  exportFilename?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  keyExtractor,
  searchablePlaceholder = 'Search records...',
  searchFilter,
  defaultSortKey,
  defaultSortDirection = 'asc',
  title,
  subtitle,
  actions,
  denseByDefault = false,
  exportFilename = 'export_data.csv'
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<string | null>((defaultSortKey as string) || null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(defaultSortDirection);
  const [isDense, setIsDense] = useState(denseByDefault);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;
    if (searchFilter) {
      return data.filter(row => searchFilter(row, searchQuery));
    }
    const query = searchQuery.toLowerCase();
    return data.filter(row => {
      return Object.values(row).some(val => 
        val !== null && val !== undefined && String(val).toLowerCase().includes(query)
      );
    });
  }, [data, searchQuery, searchFilter]);

  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      let comparison = 0;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        comparison = aVal - bVal;
      } else {
        comparison = String(aVal).localeCompare(String(bVal));
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortKey, sortDirection]);

  const handleExportCsv = () => {
    const headers = columns.map(col => `"${col.header.replace(/"/g, '""')}"`);
    const rows = sortedData.map(row => {
      return columns.map(col => {
        const val = row[col.key as string];
        return `"${String(val ?? '').replace(/"/g, '""')}"`;
      }).join(',');
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', exportFilename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[var(--mes-bg-surface)] border border-[var(--mes-border-subtle)] rounded-[var(--mes-radius)] overflow-hidden shadow-sm font-sans">
      {/* Table Toolbar Header */}
      <div className="p-3 bg-[var(--mes-bg-header)] border-b border-[var(--mes-border-subtle)] flex flex-wrap items-center justify-between gap-2.5">
        <div>
          {title && (
            <h3 className="text-xs font-bold text-[var(--mes-text-primary)] font-mono tracking-tight flex items-center gap-2">
              <span>{title}</span>
              <span className="text-[10px] font-normal text-[var(--mes-text-muted)] bg-[var(--mes-bg-well)] px-1.5 py-0.5 rounded-[var(--mes-radius)] border border-[var(--mes-border-hairline)]">
                {sortedData.length} records
              </span>
            </h3>
          )}
          {subtitle && (
            <p className="text-[11px] text-[var(--mes-text-secondary)] mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--mes-text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchablePlaceholder}
              className="pl-8 pr-3 py-1 bg-[var(--mes-bg-well)] border border-[var(--mes-border-subtle)] hover:border-[var(--mes-border-strong)] focus:border-[var(--mes-accent-primary)] text-[var(--mes-text-primary)] placeholder-[var(--mes-text-dim)] text-xs rounded-[var(--mes-radius)] focus:outline-none transition-colors w-44 sm:w-56 font-mono"
            />
          </div>

          {/* Density Toggle Button */}
          <button
            onClick={() => setIsDense(!isDense)}
            className={`p-1 px-2 text-xs font-mono rounded-[var(--mes-radius)] border flex items-center gap-1 transition-colors ${
              isDense 
                ? 'bg-[var(--mes-accent-muted)] border-[var(--mes-accent-ring)] text-[var(--mes-accent-primary)]' 
                : 'bg-[var(--mes-bg-well)] border-[var(--mes-border-subtle)] text-[var(--mes-text-secondary)] hover:text-[var(--mes-text-primary)]'
            }`}
            title="Toggle dense layout"
          >
            <SlidersHorizontal className="w-3 h-3" />
            <span className="text-[10px] uppercase">{isDense ? 'Dense' : 'Comfortable'}</span>
          </button>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCsv}
            className="p-1 px-2 text-xs font-mono rounded-[var(--mes-radius)] border bg-[var(--mes-bg-well)] border-[var(--mes-border-subtle)] hover:border-[var(--mes-accent-primary)] text-[var(--mes-text-secondary)] hover:text-[var(--mes-text-primary)] flex items-center gap-1 transition-colors"
            title="Export view as CSV"
          >
            <Download className="w-3 h-3 text-[var(--mes-accent-primary)]" />
            <span className="text-[10px] uppercase">Export</span>
          </button>

          {actions}
        </div>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto">
        <table className="mes-table-themed w-full text-left">
          <thead>
            <tr>
              {columns.map((col) => {
                const isSorted = sortKey === col.key;
                const alignment = col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left';

                return (
                  <th
                    key={String(col.key)}
                    style={{ width: col.width }}
                    className={`${alignment} ${col.sortable !== false ? 'cursor-pointer select-none hover:bg-[var(--mes-bg-well)]' : ''}`}
                    onClick={() => col.sortable !== false && handleSort(String(col.key))}
                  >
                    <div className={`flex items-center gap-1 ${col.align === 'right' ? 'justify-end' : col.align === 'center' ? 'justify-center' : 'justify-start'}`}>
                      <span>{col.header}</span>
                      {col.sortable !== false && (
                        <span className="text-[var(--mes-text-dim)]">
                          {isSorted ? (
                            sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-[var(--mes-accent-primary)]" /> : <ArrowDown className="w-3 h-3 text-[var(--mes-accent-primary)]" />
                          ) : (
                            <ArrowUpDown className="w-3 h-3 opacity-40 hover:opacity-100" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-10 text-xs font-mono text-[var(--mes-text-muted)]">
                  No records matching current criteria
                </td>
              </tr>
            ) : (
              sortedData.map((row) => (
                <tr key={keyExtractor(row)}>
                  {columns.map((col) => {
                    const alignment = col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left';
                    const cellPadding = isDense ? 'py-1 px-2 text-[10.5px]' : 'py-2 px-3 text-[11.5px]';

                    return (
                      <td key={String(col.key)} className={`${alignment} ${cellPadding}`}>
                        {col.render ? col.render(row) : String(row[col.key as string] ?? '—')}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
