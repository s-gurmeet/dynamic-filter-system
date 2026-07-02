import { useState } from 'react';
import { Box, Container, Stack, Tab, Tabs, Typography } from '@mui/material';
import { DatasetPanel } from './components/DatasetPanel';
import { employeeFilterConfig } from './config/employeeFilterConfig';
import { transactionFilterConfig } from './config/transactionFilterConfig';
import { useEmployees } from './hooks/useEmployees';
import { employeeColumns, transactionColumns } from './hooks/useTableSort';
import { useTransactions } from './hooks/useTransactions';

type DatasetTab = 'employees' | 'transactions';

export default function App() {
  const [activeTab, setActiveTab] = useState<DatasetTab>('employees');
  const employeesState = useEmployees();
  const transactionsState = useTransactions();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="xl">
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Dynamic Filter System
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 820 }}>
              A configuration-driven filter component reused across different
              tables. Switch between Employees and Transactions — only the filter
              configuration changes, not the filter implementation.
            </Typography>
          </Box>

          <Tabs
            value={activeTab}
            onChange={(_, value: DatasetTab) => setActiveTab(value)}
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': { fontWeight: 600, textTransform: 'none' },
            }}
          >
            <Tab label="Employees" value="employees" />
            <Tab label="Transactions" value="transactions" />
          </Tabs>

          {activeTab === 'employees' ? (
            <DatasetPanel
              title="Employees"
              rows={employeesState.employees}
              totalCount={employeesState.employees.length}
              columns={employeeColumns}
              filterConfig={employeeFilterConfig}
              storageKey="dynamic-filter-system:employees"
              loading={employeesState.loading}
              error={employeesState.error}
              exportFilename="filtered-employees.csv"
              onRefresh={employeesState.refetch}
            />
          ) : (
            <DatasetPanel
              title="Transactions"
              rows={transactionsState.transactions}
              totalCount={transactionsState.transactions.length}
              columns={transactionColumns}
              filterConfig={transactionFilterConfig}
              storageKey="dynamic-filter-system:transactions"
              loading={transactionsState.loading}
              error={transactionsState.error}
              exportFilename="filtered-transactions.csv"
              onRefresh={transactionsState.refetch}
            />
          )}
        </Stack>
      </Container>
    </Box>
  );
}
