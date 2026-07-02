import {
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material';
import { ArrowDown, ArrowUp } from 'lucide-react';
import {
  formatCellValue,
  type TableColumn,
  useSortedData,
} from '../../hooks/useTableSort';
import { getNestedValue } from '../../utils/getNestedValue';

interface DataTableProps<T extends object> {
  title: string;
  rows: T[];
  columns: TableColumn<T>[];
  totalCount: number;
  filteredCount: number;
}

export function DataTable<T extends { id: number }>({
  title,
  rows,
  columns,
  totalCount,
  filteredCount,
}: DataTableProps<T>) {
  const defaultSortKey =
    columns.find((column) => column.sortable)?.key ?? columns[0]?.key ?? 'id';

  const { sortedData, sortKey, sortDirection, toggleSort } = useSortedData(
    rows,
    defaultSortKey,
  );

  return (
    <Box component="section" aria-label={`${title} data table`}>
      <StackedHeader
        title={title}
        totalCount={totalCount}
        filteredCount={filteredCount}
      />

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  align={column.align ?? 'left'}
                  sx={{ fontWeight: 600, bgcolor: 'grey.50' }}
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={sortKey === column.key}
                      direction={sortKey === column.key ? sortDirection : 'asc'}
                      onClick={() => toggleSort(column.key)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">
                    No results match the current filters.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((row) => (
                <TableRow key={row.id} hover>
                  {columns.map((column) => {
                    const rawValue = getNestedValue(row, column.key);

                    return (
                      <TableCell key={column.key} align={column.align ?? 'left'}>
                        {column.render
                          ? column.render(row)
                          : formatCellValue(rawValue)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

function StackedHeader({
  title,
  totalCount,
  filteredCount,
}: {
  title: string;
  totalCount: number;
  filteredCount: number;
}) {
  const isFiltered = filteredCount !== totalCount;

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 1.5,
        gap: 2,
        flexWrap: 'wrap',
      }}
    >
      <Typography variant="h6" component="h2">
        {title}
      </Typography>

      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <Chip
          size="small"
          variant="outlined"
          icon={<ArrowDown size={14} />}
          label={`Total: ${totalCount}`}
        />
        <Chip
          size="small"
          color={isFiltered ? 'primary' : 'default'}
          variant={isFiltered ? 'filled' : 'outlined'}
          icon={<ArrowUp size={14} />}
          label={`Showing: ${filteredCount}`}
        />
      </Box>
    </Box>
  );
}
