import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    pool: 'forks',
    maxThreads: 1,
    minThreads: 1,
    reporters: 'default',
    include: ['test/**/*.{test,spec}.ts'],
    exclude: [
      'node_modules/**',
      'dist/**',
      'coverage/**',
      '.git/**',
    ],
  },
});
