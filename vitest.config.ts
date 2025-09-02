import { defineConfig } from 'vitest/config'

export default defineConfig({
  css: {
    // Prevent Vite from trying to load your project's PostCSS config in tests
    postcss: null,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
})


