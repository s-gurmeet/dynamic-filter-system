import employeesData from '../data/employees.json';
import type { Employee } from '../types/employee';

export async function fetchEmployees(): Promise<Employee[]> {
  try {
    const response = await fetch('/api/employees');
    if (!response.ok) {
      throw new Error(`Failed to load employees (${response.status})`);
    }

    return (await response.json()) as Employee[];
  } catch {
    return employeesData as Employee[];
  }
}
