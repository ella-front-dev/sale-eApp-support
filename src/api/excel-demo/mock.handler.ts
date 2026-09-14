import { demoDataSets } from '@/components/demo/excelDemoData';
import { createMockHandler } from '@/lib/mocks/createMockHandler';

/**
 * 엑셀 다운로드 "호출 예시" 탭에서 부르는 API 의 Mock.
 * excelDownloader 가 응답 본문을 그대로 행 배열로 쓰므로 공통 응답 래퍼 없이 배열을 내려준다.
 */
const createDemoListHandler = (path: string, getData: () => object[]) =>
  createMockHandler({
    method: 'get',
    path,
    delayMs: 300,
    response: () => getData()
  });

export const excelDemoMockHandlers = [
  createDemoListHandler('/api/users', demoDataSets.users),
  createDemoListHandler('/api/products', demoDataSets.products),
  createDemoListHandler('/api/orders', demoDataSets.orders)
];
