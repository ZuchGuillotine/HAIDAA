
import { Buffer } from 'buffer';
import * as util from 'util';

// Create a complete util polyfill
const utilPolyfill = {
  ...util,
  debuglog: (section) => {
    return (...args) => {
      console.log(`[${section}]`, ...args);
    };
  },
  inspect: (obj, options = {}) => {
    return typeof obj === 'object' ? JSON.stringify(obj, null, 2) : String(obj);
  }
};

// Set up global polyfills
window.Buffer = Buffer;
window.global = window;
window.process = { env: {} };
window.util = utilPolyfill;
