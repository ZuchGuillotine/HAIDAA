
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
      'util': 'util',
      'stream': 'stream-browserify',
      'events': 'events-browserify'
    }
  },
  define: {
    'process.env': {},
    'process.platform': JSON.stringify(''),
    'process.version': JSON.stringify(''),
    'Buffer': ['buffer', 'Buffer'],
    'global': {},
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
