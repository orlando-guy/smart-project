import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    alias: {
      'src': path.resolve(__dirname, './src'),
    },
    exclude: ['**/node_modules/**', '**/dist/**'],
  },
});
