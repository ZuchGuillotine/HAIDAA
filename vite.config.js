
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'crypto': 'crypto-browserify',
      'buffer': 'buffer',
      'stream': 'stream-browserify',
      'util': 'util',
      'events': 'events-browserify'
    }
  },
  optimizeDeps: {
    include: ['buffer', 'process'],
    exclude: ['@mapbox/node-pre-gyp', 'mock-aws-s3', 'aws-sdk', 'nock', 'bcrypt']
  },
  define: {
    'process.env': {},
    global: {}
  },
  build: {
    rollupOptions: {
      external: ['@mapbox/node-pre-gyp', 'mock-aws-s3', 'aws-sdk', 'nock', 'bcrypt']
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5174,
    allowedHosts: ['localhost', '.replit.dev', '.repl.co']
  }
});
