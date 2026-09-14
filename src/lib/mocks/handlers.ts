import { bizNaviMockHandlers } from '@/api/biz-navi/mock.handler';
import { excelDemoMockHandlers } from '@/api/excel-demo/mock.handler';

export const handlers = [
  ...bizNaviMockHandlers,
  ...excelDemoMockHandlers
];
