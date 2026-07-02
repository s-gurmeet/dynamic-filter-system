import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
} from '@mui/material';
import { Trash2 } from 'lucide-react';
import { OPERATORS_BY_FIELD_TYPE } from '../../config/operators';
import type { FilterCondition, FilterFieldDefinition } from '../../types/filter';
import { validateFilterCondition } from '../../utils/filterValidation';
import { FilterValueInput } from './FilterValueInput';

interface FilterRowProps {
  condition: FilterCondition;
  fields: FilterFieldDefinition[];
  onUpdate: (id: string, updates: Partial<FilterCondition>) => void;
  onRemove: (id: string) => void;
}

export function FilterRow({
  condition,
  fields,
  onUpdate,
  onRemove,
}: FilterRowProps) {
  const field =
    fields.find((item) => item.key === condition.fieldKey) ?? fields[0];
  const operators = field ? OPERATORS_BY_FIELD_TYPE[field.type] : [];
  const validationError = validateFilterCondition(condition, fields);

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1.5,
        alignItems: 'flex-start',
        p: 1.5,
        borderRadius: 2,
        bgcolor: 'grey.50',
        border: '1px solid',
        borderColor: validationError ? 'error.light' : 'divider',
      }}
    >
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel>Field</InputLabel>
        <Select
          label="Field"
          value={condition.fieldKey}
          onChange={(event) => onUpdate(condition.id, { fieldKey: event.target.value })}
        >
          {fields.map((item) => (
            <MenuItem key={item.key} value={item.key}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel>Operator</InputLabel>
        <Select
          label="Operator"
          value={condition.operator}
          onChange={(event) =>
            onUpdate(condition.id, {
              operator: event.target.value as FilterCondition['operator'],
            })
          }
        >
          {operators.map((operator) => (
            <MenuItem key={operator.value} value={operator.value}>
              {operator.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {field && (
        <FilterValueInput
          field={field}
          operator={condition.operator}
          value={condition.value}
          error={validationError}
          onChange={(value) => onUpdate(condition.id, { value })}
        />
      )}

      <Tooltip title="Remove filter">
        <IconButton
          aria-label="Remove filter"
          onClick={() => onRemove(condition.id)}
          size="small"
          sx={{ mt: 0.25 }}
        >
          <Trash2 size={18} />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
