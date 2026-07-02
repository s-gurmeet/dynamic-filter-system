import { useCallback, useEffect, useState } from 'react';
import type { FilterCondition, FilterFieldDefinition } from '../types/filter';
import {
  createEmptyFilterValue,
  createFilterCondition,
} from '../utils/filterValidation';
import { getDefaultOperator } from '../config/operators';

const STORAGE_KEY = 'dynamic-filter-system:filters';

interface UseFiltersOptions {
  fields: FilterFieldDefinition[];
  persist?: boolean;
  storageKey?: string;
}

function loadPersistedFilters(storageKey: string): FilterCondition[] {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as FilterCondition[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function useFilters({
  fields,
  persist = true,
  storageKey = STORAGE_KEY,
}: UseFiltersOptions) {
  const [conditions, setConditions] = useState<FilterCondition[]>(() =>
    persist ? loadPersistedFilters(storageKey) : [],
  );

  useEffect(() => {
    if (!persist) return;
    localStorage.setItem(storageKey, JSON.stringify(conditions));
  }, [conditions, persist, storageKey]);

  const addFilter = useCallback(() => {
    const defaultField = fields[0];
    if (!defaultField) return;

    setConditions((current) => [...current, createFilterCondition(defaultField)]);
  }, [fields]);

  const removeFilter = useCallback((id: string) => {
    setConditions((current) => current.filter((item) => item.id !== id));
  }, []);

  const clearFilters = useCallback(() => {
    setConditions([]);
  }, []);

  const updateFilter = useCallback(
    (id: string, updates: Partial<FilterCondition>) => {
      setConditions((current) =>
        current.map((condition) => {
          if (condition.id !== id) return condition;

          const next = { ...condition, ...updates };

          if (updates.fieldKey && updates.fieldKey !== condition.fieldKey) {
            const field = fields.find((item) => item.key === updates.fieldKey);
            if (field) {
              next.operator = getDefaultOperator(field.type);
              next.value = createEmptyFilterValue(field.type);
            }
          }

          return next;
        }),
      );
    },
    [fields],
  );

  return {
    conditions,
    addFilter,
    removeFilter,
    clearFilters,
    updateFilter,
  };
}
