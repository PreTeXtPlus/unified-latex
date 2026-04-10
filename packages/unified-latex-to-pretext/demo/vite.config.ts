import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
    root: './demo',
    server: {
        port: 5173,
        open: true,
        middlewareMode: false,
        fs: {
            allow: ['..'],
        },
    },
    resolve: {
        alias: {
            '@unified-latex/unified-latex-to-pretext': resolve(__dirname, '../dist/index.js'),
        },
    },
    build: {
        outDir: '../dist/demo',
        emptyOutDir: true,
    },
});
