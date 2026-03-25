// Client Side
import { setupWorker } from 'msw/browser';

import { handlers } from './handlers';

console.log('[MSW] 핸들러 목록:', handlers);

export const worker = setupWorker(...handlers);
