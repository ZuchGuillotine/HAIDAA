
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      stream: 'stream-browserify',
      crypto: 'crypto-browserify'
    },
  },
  optimizeDeps: {
    include: ['buffer', 'process'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'crypto': 'crypto-browserify',
      'buffer': 'buffer',
      'util': 'rollup-plugin-node-polyfills/polyfills/util',
      'stream': 'stream-browserify',
      'events': 'events-browserify'
    }
  },
  define: {
    'process.env': {},
    global: {}
  },
  optimizeDeps: {
    exclude: ['@mapbox/node-pre-gyp', 'mock-aws-s3', 'aws-sdk', 'nock', 'bcrypt']
  },
  build: {
    rollupOptions: {
      external: ['@mapbox/node-pre-gyp', 'mock-aws-s3', 'aws-sdk', 'nock', 'bcrypt']
    }
  },
  server: {
    host: '0.0.0.0'
  }
});
