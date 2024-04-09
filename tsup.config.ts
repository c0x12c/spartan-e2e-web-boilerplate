import { defineConfig } from 'tsup';

export default defineConfig({
    entry: {
        page: 'src/pages/base.page.ts', 
        step: 'src/features/common.step.ts'
    },
    format: ['cjs', 'esm'],
    dts: true,
    clean: true,
    outDir: 'dist',
})