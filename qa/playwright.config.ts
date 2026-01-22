import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  projects: [
    {
      name: 'smoke',
      testDir: './tests/smoke',
    },
    {
      name: 'regression',
      testDir: './tests/regression',
    },
  ],

  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
  ],

  use: {
    baseURL: 'http://frontend:3000',
    headless: true,

    // (สำหรับ debug CI)
    trace: 'retain-on-failure',        // เก็บ trace เฉพาะ fail
    video: 'retain-on-failure',        // เก็บ video เฉพาะ fail
    screenshot: 'only-on-failure',     // เก็บ screenshot เฉพาะ fail
  },
});