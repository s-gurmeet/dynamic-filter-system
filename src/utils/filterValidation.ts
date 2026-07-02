import type { FilterCondition, FilterFieldDefinition, FilterValue } from '../types/filter';
import { getDefaultOperator } from '../config/operators';

export function createEmptyFilterValue(
  fieldType: FilterFieldDefinition['type'],
): FilterValue {
  switch (fieldType) {
    case 'text':
    case 'select':
      return '';
    case 'number':
      return null;
    case 'boolean':
      return true;
    case 'multiselect':
      return [];
    case 'amount':
      return { min: undefined, max: undefined };
    case 'date':
      return { from: undefined, to: undefined };
    default:
      return '';
  }
}

export function createFilterCondition(
  field: FilterFieldDefinition,
): FilterCondition {
  return {
    id: crypto.randomUUID(),
    fieldKey: field.key,
    operator: getDefaultOperator(field.type),
    value: createEmptyFilterValue(field.type),
  };
}

export function validateFilterCondition(
  condition: FilterCondition,
  fields: FilterFieldDefinition[],
): string | null {
  const field = fields.find((item) => item.key === condition.fieldKey);
  if (!field) return 'Invalid field selected';

  if (field.type === 'number' || field.type === 'amount') {
    const value = condition.value;
    if (field.type === 'number' && typeof value === 'number' && value < 0) {
      return 'Number must be zero or greater';
    }
    if (
      field.type === 'amount' &&
      typeof value === 'object' &&
      value !== null &&
      !Array.isArray(value) &&
      'min' in value &&
      'max' in value
    ) {
      const { min, max } = value;
      if (min !== undefined && max !== undefined && min > max) {
        return 'Minimum amount cannot exceed maximum';
      }
    }
  }

  if (field.type === 'date') {
    const value = condition.value;
    if (
      typeof value === 'object' &&
      value !== null &&
      !Array.isArray(value) &&
      'from' in value &&
      'to' in value
    ) {
      const { from, to } = value;
      if (from && to && Date.parse(from) > Date.parse(to)) {
        return 'Start date cannot be after end date';
      }
    }
  }

  return null;
}
