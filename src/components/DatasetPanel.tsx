import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
} from '@mui/material';
import { Download, RefreshCw } from 'lucide-react';
import { useMemo } from 'react';
import { FilterBuilder } from '../components/filter/FilterBuilder';
import { DataTable } from '../components/table/DataTable';
import type { FilterFieldDefinition } from '../types/filter';
import type { TableColumn } from '../hooks/useTableSort';
import { useFilters } from '../hooks/useFilters';
import { applyFilters, isConditionComplete } from '../utils/filterEngine';

interface DatasetPanelProps<T extends { id: number }> {
  title: string;
  rows: T[];
  totalCount: number;
  columns: TableColumn<T>[];
  filterConfig: FilterFieldDefinition[];
  storageKey: string;
  loading: boolean;
  error: string | null;
  exportFilename: string;
  onRefresh: () => Promise<void>;
}

function exportToCsv<T extends object>(filename: string, rows: T[]) {
  if (rows.length === 0) return;

  const headers = Object.keys(rows[0] as Record<string, unknown>);
  const csvLines = [
    headers.join(','),
    ...rows.map((row) => {
      const record = row as Record<string, unknown>;
      return headers
        .map((header) => {
          const value = record[header];
          const serialized = Array.isArray(value)
            ? `"${value.join('; ')}"`
            : typeof value === 'object' && value !== null
              ? `"${JSON.stringify(value).replaceAll('"', '""')}"`
              : `"${String(value ?? '').replaceAll('"', '""')}"`;
          return serialized;
        })
        .join(',');
    }),
  ];

  const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function DatasetPanel<T extends { id: number }>({
  title,
  rows,
  totalCount,
  columns,
  filterConfig,
  storageKey,
  loading,
  error,
  exportFilename,
  onRefresh,
}: DatasetPanelProps<T>) {
  const { conditions, addFilter, clearFilters, updateFilter, removeFilter } =
    useFilters({ fields: filterConfig, storageKey });

  const filteredRows = useMemo(
    () => applyFilters(rows, conditions, filterConfig),
    [rows, conditions, filterConfig],
  );

  const activeFilterCount = useMemo(
    () =>
      conditions.filter((condition) =>
        isConditionComplete(condition, filterConfig),
      ).length,
    [conditions, filterConfig],
  );

  return (
    <Stack spacing={3}>
      {error && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => void onRefresh()}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      <FilterBuilder
        conditions={conditions}
        fields={filterConfig}
        activeFilterCount={activeFilterCount}
        onAdd={addFilter}
        onClear={clearFilters}
        onUpdate={updateFilter}
        onRemove={removeFilter}
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<RefreshCw size={16} />}
          onClick={() => void onRefresh()}
          disabled={loading}
        >
          Refresh Data
        </Button>
        <Button
          variant="contained"
          size="small"
          startIcon={<Download size={16} />}
          onClick={() => exportToCsv(exportFilename, filteredRows)}
          disabled={filteredRows.length === 0}
        >
          Export CSV
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      ) : (
        <DataTable
          title={title}
          rows={filteredRows}
          columns={columns}
          totalCount={totalCount}
          filteredCount={filteredRows.length}
        />
      )}
    </Stack>
  );
}
