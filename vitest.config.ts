import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    exclude: ['node_modules', 'src/**'],
    include: ['**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary'],
      thresholds: { statements: 80, branches: 80, functions: 80, lines: 80 },
      include: ['lib/**', 'components/**', 'app/api/**', 'app/dashboard/**'],
      exclude: ['**/*.test.*', '**/*.d.ts', 'node_modules'],
    },
  },
  resolve: {
    alias: { '@': path.resolve(__dirname) },
  },
});
