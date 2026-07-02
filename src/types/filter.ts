export type FieldType =
  | 'text'
  | 'number'
  | 'date'
  | 'amount'
  | 'select'
  | 'multiselect'
  | 'boolean';

export type TextOperator =
  | 'equals'
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'notContains';

export type NumberOperator = 'equals' | 'gt' | 'lt' | 'gte' | 'lte';

export type DateOperator = 'between';

export type AmountOperator = 'between';

export type SelectOperator = 'is' | 'isNot';

export type MultiSelectOperator = 'in' | 'notIn';

export type BooleanOperator = 'is';

export type FilterOperator =
  | TextOperator
  | NumberOperator
  | DateOperator
  | AmountOperator
  | SelectOperator
  | MultiSelectOperator
  | BooleanOperator;

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterFieldDefinition {
  key: string;
  label: string;
  type: FieldType;
  options?: FilterOption[];
}

export interface RangeValue {
  min?: number;
  max?: number;
}

export interface DateRangeValue {
  from?: string;
  to?: string;
}

export type FilterValue =
  | string
  | number
  | boolean
  | string[]
  | RangeValue
  | DateRangeValue
  | null;

export interface FilterCondition {
  id: string;
  fieldKey: string;
  operator: FilterOperator;
  value: FilterValue;
}

export interface OperatorDefinition {
  value: FilterOperator;
  label: string;
}
