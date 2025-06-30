import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        coverage: {
            provider: 'v8',
            exclude: [
                'node_modules/',
                'generated/',
                'dist/',
                '**/*.spec.ts',
            ],
            reportsDirectory: './coverage',
            reporter: ['text', 'html'],
        },
    },
})