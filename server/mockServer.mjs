import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const mock = require('mock-json-api');

const employees = require('../src/data/employees.json');
const transactions = require('../src/data/transactions.json');

const mockApi = mock({
  logging: true,
  mockRoutes: [
    {
      name: 'getEmployees',
      mockRoute: '/api/employees',
      method: 'GET',
      testScope: 'success',
      jsonTemplate: () => JSON.stringify(employees),
    },
    {
      name: 'getEmployeeById',
      mockRoute: '/api/employees/:id',
      method: 'GET',
      testScope: 'success',
      jsonTemplate: (req) => {
        const employee = employees.find(
          (item) => String(item.id) === req.params.id,
        );
        return JSON.stringify(employee ?? { error: 'Not found' });
      },
    },
    {
      name: 'getTransactions',
      mockRoute: '/api/transactions',
      method: 'GET',
      testScope: 'success',
      jsonTemplate: () => JSON.stringify(transactions),
    },
  ],
});

const PORT = 3001;
const app = mockApi.createServer();

app.listen(PORT, () => {
  console.log(`Mock API running at http://localhost:${PORT}`);
});
