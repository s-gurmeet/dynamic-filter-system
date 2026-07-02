import type { FieldType, OperatorDefinition } from '../types/filter';

export const OPERATORS_BY_FIELD_TYPE: Record<FieldType, OperatorDefinition[]> = {
  text: [
    { value: 'equals', label: 'Equals' },
    { value: 'contains', label: 'Contains' },
    { value: 'startsWith', label: 'Starts With' },
    { value: 'endsWith', label: 'Ends With' },
    { value: 'notContains', label: 'Does Not Contain' },
  ],
  number: [
    { value: 'equals', label: 'Equals' },
    { value: 'gt', label: 'Greater Than' },
    { value: 'lt', label: 'Less Than' },
    { value: 'gte', label: 'Greater Than or Equal' },
    { value: 'lte', label: 'Less Than or Equal' },
  ],
  date: [{ value: 'between', label: 'Between' }],
  amount: [{ value: 'between', label: 'Between' }],
  select: [
    { value: 'is', label: 'Is' },
    { value: 'isNot', label: 'Is Not' },
  ],
  multiselect: [
    { value: 'in', label: 'In' },
    { value: 'notIn', label: 'Not In' },
  ],
  boolean: [{ value: 'is', label: 'Is' }],
};

export function getDefaultOperator(fieldType: FieldType) {
  return OPERATORS_BY_FIELD_TYPE[fieldType][0].value;
}
