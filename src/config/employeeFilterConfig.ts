import type { FilterFieldDefinition } from '../types/filter';

const DEPARTMENTS = [
  'Engineering',
  'Design',
  'Marketing',
  'Sales',
  'HR',
  'Finance',
  'Operations',
];

const SKILLS = [
  'React',
  'TypeScript',
  'Node.js',
  'GraphQL',
  'Python',
  'AWS',
  'Docker',
  'Figma',
  'SQL',
  'Vue',
];

export const employeeFilterConfig: FilterFieldDefinition[] = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'email', label: 'Email', type: 'text' },
  {
    key: 'department',
    label: 'Department',
    type: 'select',
    options: DEPARTMENTS.map((d) => ({ label: d, value: d })),
  },
  { key: 'role', label: 'Role', type: 'text' },
  { key: 'salary', label: 'Salary', type: 'amount' },
  { key: 'joinDate', label: 'Join Date', type: 'date' },
  {
    key: 'isActive',
    label: 'Active Status',
    type: 'boolean',
  },
  {
    key: 'skills',
    label: 'Skills',
    type: 'multiselect',
    options: SKILLS.map((s) => ({ label: s, value: s })),
  },
  { key: 'address.city', label: 'City', type: 'text' },
  { key: 'address.state', label: 'State', type: 'text' },
  { key: 'projects', label: 'Projects', type: 'number' },
  { key: 'lastReview', label: 'Last Review', type: 'date' },
  { key: 'performanceRating', label: 'Performance Rating', type: 'number' },
];
