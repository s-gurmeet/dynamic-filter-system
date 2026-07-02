import {
  Box,
  Button,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import { Filter, Plus, X } from 'lucide-react';
import type { FilterCondition, FilterFieldDefinition } from '../../types/filter';
import { FilterRow } from './FilterRow';

interface FilterBuilderProps {
  conditions: FilterCondition[];
  fields: FilterFieldDefinition[];
  activeFilterCount: number;
  onAdd: () => void;
  onClear: () => void;
  onUpdate: (id: string, updates: Partial<FilterCondition>) => void;
  onRemove: (id: string) => void;
}

export function FilterBuilder({
  conditions,
  fields,
  activeFilterCount,
  onAdd,
  onClear,
  onUpdate,
  onRemove,
}: FilterBuilderProps) {
  return (
    <Box
      component="section"
      aria-label="Filter builder"
      sx={{
        p: 2.5,
        borderRadius: 3,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.06)',
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        sx={{
          mb: 2,
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
        }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Filter size={20} />
          <Typography variant="h6" component="h2">
            Filters
          </Typography>
          {activeFilterCount > 0 && (
            <Chip
              size="small"
              color="primary"
              label={`${activeFilterCount} active`}
            />
          )}
        </Stack>

        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Plus size={16} />}
            onClick={onAdd}
          >
            Add Filter
          </Button>
          <Button
            variant="text"
            size="small"
            color="inherit"
            startIcon={<X size={16} />}
            onClick={onClear}
            disabled={conditions.length === 0}
          >
            Clear All
          </Button>
        </Stack>
      </Stack>

      {conditions.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No filters applied. Add a filter to narrow down the employee table.
        </Typography>
      ) : (
        <Stack spacing={1.5}>
          {conditions.map((condition) => (
            <FilterRow
              key={condition.id}
              condition={condition}
              fields={fields}
              onUpdate={onUpdate}
              onRemove={onRemove}
            />
          ))}
        </Stack>
      )}

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
        Multiple filters on different fields use AND logic. Multiple filters on the
        same field use OR logic.
      </Typography>
    </Box>
  );
}
