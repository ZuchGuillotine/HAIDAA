
import { Buffer } from 'buffer';
import process from 'process';
import { net } from 'net';

if (typeof window !== 'undefined') {
  window.global = window;
  window.Buffer = Buffer;
  window.process = process;
  window.net = net;
}
