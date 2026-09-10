import { defineConfig } from 'vite';

export default defineConfig({
    base: '/psychologist-website/',  // <- всегда, без условий
    server: {
        port: 3000,
        open: true
    },
    build: {
        outDir: 'dist',
        emptyOutDir: true
    }
});