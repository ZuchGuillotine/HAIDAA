
import { Buffer } from 'buffer';
import * as util from 'util';

window.Buffer = Buffer;
window.global = window;
window.process = { env: {} };
window.util = util;
