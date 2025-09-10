import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    pool: 'forks',
    maxThreads: 1,
    minThreads: 1,
    reporters: 'default',
    exclude: [
      'parking_lot/**' // exclude nested subproject, it uses its own test runner
    ]
  }
});
