import type {
  DateRangeValue,
  FilterCondition,
  FilterFieldDefinition,
  FilterValue,
  RangeValue,
} from '../types/filter';
import { getNestedValue } from './getNestedValue';

function normalizeText(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value).toLowerCase();
}

function parseDate(value: unknown): number | null {
  if (!value) return null;
  const timestamp = Date.parse(String(value));
  return Number.isNaN(timestamp) ? null : timestamp;
}

function isRangeValue(value: FilterValue): value is RangeValue {
  return typeof value === 'object' && value !== null && !Array.isArray(value) && ('min' in value || 'max' in value) && !('from' in value);
}

function isDateRangeValue(value: FilterValue): value is DateRangeValue {
  return typeof value === 'object' && value !== null && !Array.isArray(value) && ('from' in value || 'to' in value);
}

function matchesTextOperator(
  fieldValue: unknown,
  operator: FilterCondition['operator'],
  filterValue: FilterValue,
): boolean {
  const haystack = normalizeText(fieldValue);
  const needle = normalizeText(filterValue);

  switch (operator) {
    case 'equals':
      return haystack === needle;
    case 'contains':
      return haystack.includes(needle);
    case 'startsWith':
      return haystack.startsWith(needle);
    case 'endsWith':
      return haystack.endsWith(needle);
    case 'notContains':
      return !haystack.includes(needle);
    default:
      return false;
  }
}

function matchesNumberOperator(
  fieldValue: unknown,
  operator: FilterCondition['operator'],
  filterValue: FilterValue,
): boolean {
  const numericValue = Number(fieldValue);
  const target = Number(filterValue);

  if (Number.isNaN(numericValue) || Number.isNaN(target)) return false;

  switch (operator) {
    case 'equals':
      return numericValue === target;
    case 'gt':
      return numericValue > target;
    case 'lt':
      return numericValue < target;
    case 'gte':
      return numericValue >= target;
    case 'lte':
      return numericValue <= target;
    default:
      return false;
  }
}

function matchesRangeOperator(
  fieldValue: unknown,
  filterValue: FilterValue,
): boolean {
  if (!isRangeValue(filterValue)) return false;

  const numericValue = Number(fieldValue);
  if (Number.isNaN(numericValue)) return false;

  const { min, max } = filterValue;
  if (min !== undefined && numericValue < min) return false;
  if (max !== undefined && numericValue > max) return false;
  return true;
}

function matchesDateRangeOperator(
  fieldValue: unknown,
  filterValue: FilterValue,
): boolean {
  if (!isDateRangeValue(filterValue)) return false;

  const fieldTimestamp = parseDate(fieldValue);
  if (fieldTimestamp === null) return false;

  const fromTs = filterValue.from ? parseDate(filterValue.from) : null;
  const toTs = filterValue.to ? parseDate(filterValue.to) : null;

  if (fromTs !== null && fieldTimestamp < fromTs) return false;
  if (toTs !== null && fieldTimestamp > toTs) return false;
  return true;
}

function matchesSelectOperator(
  fieldValue: unknown,
  operator: FilterCondition['operator'],
  filterValue: FilterValue,
): boolean {
  const fieldStr = normalizeText(fieldValue);
  const filterStr = normalizeText(filterValue);

  if (operator === 'is') return fieldStr === filterStr;
  if (operator === 'isNot') return fieldStr !== filterStr;
  return false;
}

function matchesMultiSelectOperator(
  fieldValue: unknown,
  operator: FilterCondition['operator'],
  filterValue: FilterValue,
): boolean {
  if (!Array.isArray(filterValue) || filterValue.length === 0) return false;

  const fieldArray = Array.isArray(fieldValue)
    ? fieldValue.map((item) => normalizeText(item))
    : [normalizeText(fieldValue)];

  const selected = filterValue.map((item) => normalizeText(item));

  const hasMatch = selected.some((item) => fieldArray.includes(item));

  if (operator === 'in') return hasMatch;
  if (operator === 'notIn') return !hasMatch;
  return false;
}

function matchesBooleanOperator(
  fieldValue: unknown,
  filterValue: FilterValue,
): boolean {
  return Boolean(fieldValue) === Boolean(filterValue);
}

function matchesCondition(
  record: object,
  condition: FilterCondition,
  fieldDef: FilterFieldDefinition,
): boolean {
  const fieldValue = getNestedValue(record, condition.fieldKey);
  const { operator, value } = condition;

  switch (fieldDef.type) {
    case 'text':
      return matchesTextOperator(fieldValue, operator, value);
    case 'number':
      return matchesNumberOperator(fieldValue, operator, value);
    case 'amount':
      return operator === 'between'
        ? matchesRangeOperator(fieldValue, value)
        : matchesNumberOperator(fieldValue, operator, value);
    case 'date':
      return matchesDateRangeOperator(fieldValue, value);
    case 'select':
      return matchesSelectOperator(fieldValue, operator, value);
    case 'multiselect':
      return matchesMultiSelectOperator(fieldValue, operator, value);
    case 'boolean':
      return matchesBooleanOperator(fieldValue, value);
    default:
      return true;
  }
}

/**
 * AND across fields, OR within the same field.
 */
export function applyFilters<T extends object>(
  data: T[],
  conditions: FilterCondition[],
  fieldDefinitions: FilterFieldDefinition[],
): T[] {
  const activeConditions = conditions.filter((condition) =>
    isConditionComplete(condition, fieldDefinitions),
  );

  if (activeConditions.length === 0) return data;

  const conditionsByField = activeConditions.reduce<
    Record<string, FilterCondition[]>
  >((groups, condition) => {
    const existing = groups[condition.fieldKey] ?? [];
    groups[condition.fieldKey] = [...existing, condition];
    return groups;
  }, {});

  return data.filter((record) =>
    Object.entries(conditionsByField).every(([fieldKey, fieldConditions]) => {
      const fieldDef = fieldDefinitions.find((field) => field.key === fieldKey);
      if (!fieldDef) return true;

      return fieldConditions.some((condition) =>
        matchesCondition(record, condition, fieldDef),
      );
    }),
  );
}

export function isConditionComplete(
  condition: FilterCondition,
  fieldDefinitions: FilterFieldDefinition[],
): boolean {
  const fieldDef = fieldDefinitions.find(
    (field) => field.key === condition.fieldKey,
  );
  if (!fieldDef) return false;

  const { value } = condition;

  switch (fieldDef.type) {
    case 'text':
    case 'select':
      return typeof value === 'string' && value.trim().length > 0;
    case 'number':
      return typeof value === 'number' && !Number.isNaN(value);
    case 'boolean':
      return typeof value === 'boolean';
    case 'multiselect':
      return Array.isArray(value) && value.length > 0;
    case 'amount':
    case 'date': {
      if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return false;
      }
      if ('from' in value || 'to' in value) {
        const range = value as DateRangeValue;
        return Boolean(range.from || range.to);
      }
      const range = value as RangeValue;
      return range.min !== undefined || range.max !== undefined;
    }
    default:
      return false;
  }
}
