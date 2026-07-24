import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  // Evita conflitos entre testes que usam os mesmos dados da API.
  fullyParallel: false,
  workers: 1,

  reporter: 'html',

  use: {
    baseURL: 'https://front.serverest.dev',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
});
