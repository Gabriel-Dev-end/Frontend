import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.spec.ts'],
  },
  resolve: {
    alias: {
      '@core': path.resolve('./src/app/core'),
      '@shared': path.resolve('./src/app/shared'),
      '@features': path.resolve('./src/app/features'),
    },
  },
});
