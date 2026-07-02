import { useCallback, useEffect, useState } from 'react';
import { fetchEmployees as loadEmployees } from '../api/employeeService';
import type { Employee } from '../types/employee';

interface UseEmployeesResult {
  employees: Employee[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useEmployees(): UseEmployeesResult {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await loadEmployees();
      setEmployees(data);
    } catch (fetchError) {
      const message =
        fetchError instanceof Error
          ? fetchError.message
          : 'Unable to load employee data';
      setError(message);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchEmployees();
  }, [fetchEmployees]);

  return {
    employees,
    loading,
    error,
    refetch: fetchEmployees,
  };
}
