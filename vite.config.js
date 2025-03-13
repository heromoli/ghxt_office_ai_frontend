import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig(function (_a) {
    var mode = _a.mode;
    return {
        plugins: [react()],
        base: mode === 'production' ? '/' : './',
        server: {
            port: 3000,
            proxy: {
                '/proxy': {
                    target: mode === 'production' ? 'http://192.168.13.133:8099' : 'http://127.0.0.1:8099',
                    changeOrigin: true,
                    rewrite: function (path) { return path.replace(/^\/proxy/, ''); }
                },
            },
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        build: {
            outDir: 'dist',
            assetsDir: 'assets',
            sourcemap: false,
            chunkSizeWarningLimit: 1500,
            rollupOptions: {
                output: {
                    manualChunks: {
                        'react-vendor': ['react', 'react-dom', 'react-router-dom'],
                        'antd-vendor': ['antd'],
                    },
                },
            },
        },
    };
});
