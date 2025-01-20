
import { spawn } from 'child_process';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Start the backend server
const backend = spawn('node', ['Server/server.js'], {
  stdio: 'inherit',
  cwd: __dirname
});

// Start the frontend
const frontend = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  cwd: __dirname
});

process.on('SIGINT', () => {
  backend.kill();
  frontend.kill();
  process.exit();
});
