import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { type Dayjs } from 'dayjs';
import type {
  DateRangeValue,
  FilterFieldDefinition,
  FilterOperator,
  FilterValue,
  RangeValue,
} from '../../types/filter';

interface FilterValueInputProps {
  field: FilterFieldDefinition;
  operator: FilterOperator;
  value: FilterValue;
  error?: string | null;
  onChange: (value: FilterValue) => void;
}

function AmountRangeInput({
  value,
  error,
  onChange,
}: {
  value: RangeValue;
  error?: string | null;
  onChange: (value: RangeValue) => void;
}) {
  return (
    <Box sx={{ display: 'flex', gap: 1, flex: 1, minWidth: 220 }}>
      <TextField
        label="Min"
        type="number"
        size="small"
        value={value.min ?? ''}
        onChange={(event) =>
          onChange({
            ...value,
            min: event.target.value === '' ? undefined : Number(event.target.value),
          })
        }
        error={Boolean(error)}
        slotProps={{ input: { inputProps: { min: 0 } } }}
        sx={{ flex: 1 }}
      />
      <TextField
        label="Max"
        type="number"
        size="small"
        value={value.max ?? ''}
        onChange={(event) =>
          onChange({
            ...value,
            max: event.target.value === '' ? undefined : Number(event.target.value),
          })
        }
        error={Boolean(error)}
        slotProps={{ input: { inputProps: { min: 0 } } }}
        sx={{ flex: 1 }}
      />
    </Box>
  );
}

function DateRangeInput({
  value,
  error,
  onChange,
}: {
  value: DateRangeValue;
  error?: string | null;
  onChange: (value: DateRangeValue) => void;
}) {
  const fromValue = value.from ? dayjs(value.from) : null;
  const toValue = value.to ? dayjs(value.to) : null;

  const updateDate = (key: 'from' | 'to', date: Dayjs | null) => {
    onChange({
      ...value,
      [key]: date ? date.format('YYYY-MM-DD') : undefined,
    });
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, flex: 1, minWidth: 280 }}>
      <DatePicker
        label="From"
        value={fromValue}
        onChange={(date) => updateDate('from', date)}
        slotProps={{
          textField: {
            size: 'small',
            error: Boolean(error),
            sx: { flex: 1 },
          },
        }}
      />
      <DatePicker
        label="To"
        value={toValue}
        onChange={(date) => updateDate('to', date)}
        slotProps={{
          textField: {
            size: 'small',
            error: Boolean(error),
            sx: { flex: 1 },
          },
        }}
      />
    </Box>
  );
}

export function FilterValueInput({
  field,
  value,
  error,
  onChange,
}: FilterValueInputProps) {
  switch (field.type) {
    case 'text':
      return (
        <TextField
          size="small"
          label="Value"
          value={typeof value === 'string' ? value : ''}
          onChange={(event) => onChange(event.target.value)}
          error={Boolean(error)}
          sx={{ flex: 1, minWidth: 180 }}
        />
      );

    case 'number':
      return (
        <TextField
          size="small"
          label="Value"
          type="number"
          value={typeof value === 'number' ? value : ''}
          onChange={(event) => {
            const next = event.target.value;
            onChange(next === '' ? null : Number(next));
          }}
          error={Boolean(error)}
          slotProps={{ input: { inputProps: { min: 0, step: 1 } } }}
          sx={{ flex: 1, minWidth: 140 }}
        />
      );

    case 'amount':
      return (
        <AmountRangeInput
          value={(value as RangeValue) ?? { min: undefined, max: undefined }}
          error={error}
          onChange={onChange}
        />
      );

    case 'date':
      return (
        <DateRangeInput
          value={(value as DateRangeValue) ?? { from: undefined, to: undefined }}
          error={error}
          onChange={onChange}
        />
      );

    case 'select':
      return (
        <FormControl size="small" sx={{ flex: 1, minWidth: 180 }}>
          <InputLabel>Value</InputLabel>
          <Select
            label="Value"
            value={typeof value === 'string' ? value : ''}
            onChange={(event) => onChange(event.target.value)}
            error={Boolean(error)}
          >
            {field.options?.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );

    case 'multiselect': {
      const selected = Array.isArray(value) ? value : [];
      return (
        <FormControl size="small" sx={{ flex: 1, minWidth: 220 }}>
          <InputLabel>Values</InputLabel>
          <Select
            multiple
            label="Values"
            value={selected}
            onChange={(event) => {
              const next = event.target.value;
              onChange(typeof next === 'string' ? next.split(',') : next);
            }}
            renderValue={(chosen) => (chosen as string[]).join(', ')}
            error={Boolean(error)}
          >
            {field.options?.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Checkbox checked={selected.includes(option.value)} />
                <ListItemText primary={option.label} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    }

    case 'boolean':
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 120, pl: 1 }}>
          <FormControlLabel
            control={
              <Switch
                checked={Boolean(value)}
                onChange={(event) => onChange(event.target.checked)}
                color="primary"
              />
            }
            label={Boolean(value) ? 'True' : 'False'}
          />
        </Box>
      );

    default:
      return <Typography color="text.secondary">Unsupported field type</Typography>;
  }
}
