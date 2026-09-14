import dayjs from 'dayjs';

import { downloadDataAsExcel, downloadDataAsMultiSheetExcel } from '@/lib/excelDownloader';

/**
 * 엑셀 다운로드 데모용 Mock 데이터와 실행 헬퍼.
 *
 * 다운로드 로직 자체는 `@/lib/excelDownloader` 에 있고, 이 파일은 데모 화면에서
 * 쓸 샘플 데이터만 담당한다. (라이브러리에 데모 픽스처가 섞이지 않도록 분리)
 *
 * 엑셀 데모 화면들(ExcelDownload / ApiExcelDownload / SimpleExcelDownload)이
 * 공통으로 이 데이터를 쓴다.
 */
export const demoDataSets = {
  users: () => Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `사용자${i + 1}`,
    email: `user${i + 1}@example.com`,
    phone: `010-0000-${String(i + 1).padStart(4, '0')}`,
    department: ['개발팀', '디자인팀', '기획팀', '마케팅팀'][i % 4],
    position: ['팀장', '대리', '사원', '주임'][i % 4],
    joinDate: dayjs().subtract(i * 10, 'day').format('YYYY-MM-DD'),
    status: ['활성', '비활성', '대기'][i % 3]
  })),

  products: () => Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `상품${i + 1}`,
    category: ['전자제품', '의류', '도서', '식품', '가구'][i % 5],
    price: (i + 1) * 1000,
    stock: (i * 7) % 100,
    brand: ['브랜드A', '브랜드B', '브랜드C'][i % 3],
    rating: (3 + (i % 20) / 10).toFixed(1),
    createdAt: dayjs().subtract(i * 3, 'day').format('YYYY-MM-DD')
  })),

  orders: () => Array.from({ length: 200 }, (_, i) => ({
    id: i + 1,
    orderNumber: `ORD${String(i + 1).padStart(6, '0')}`,
    customerName: `고객${i + 1}`,
    productName: `상품${(i % 100) + 1}`,
    quantity: (i % 5) + 1,
    totalAmount: (i + 1) * 500,
    status: ['주문완료', '배송중', '배송완료', '취소'][i % 4],
    orderDate: dayjs().subtract(i * 2, 'day').format('YYYY-MM-DD'),
    deliveryDate: dayjs().subtract(i * 2 - 3, 'day').format('YYYY-MM-DD')
  })),

  forms: () => Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    formCode: `FORM${String(i + 1).padStart(3, '0')}`,
    title: `서식${i + 1}`,
    category: ['개인정보', '계약서', '신청서', '확인서'][i % 4],
    version: `v${Math.floor(i / 10) + 1}.${i % 10}`,
    status: ['사용중', '검토중', '폐기'][i % 3],
    createdBy: `작성자${(i % 10) + 1}`,
    createdAt: dayjs().subtract(i * 5, 'day').format('YYYY-MM-DD'),
    lastModified: dayjs().subtract(i, 'day').format('YYYY-MM-DD')
  })),

  analytics: () => Array.from({ length: 365 }, (_, i) => ({
    date: dayjs().subtract(365 - i, 'day').format('YYYY-MM-DD'),
    pageViews: 100 + ((i * 37) % 1000),
    users: 50 + ((i * 13) % 200),
    sessions: 80 + ((i * 23) % 300),
    bounceRate: (20 + ((i * 7) % 30)).toFixed(2),
    avgSessionDuration: `${(i % 5) + 1}:${String((i * 11) % 60).padStart(2, '0')}`,
    conversions: (i * 3) % 20,
    revenue: 10000 + ((i * 977) % 100000)
  }))
};

export type DemoDataType = keyof typeof demoDataSets;

/** Mock 데이터 한 종류를 단일 시트로 다운로드 */
export const downloadDemoSingleSheet = async (dataType: DemoDataType): Promise<void> => {
  return downloadDataAsExcel(demoDataSets[dataType](), {
    filename: `demo_${dataType}`,
    sheetName: dataType,
    includeTimestamp: true,
    autoWidth: true
  });
};

/** Mock 데이터 전 종류를 각각의 시트로 다운로드 */
export const downloadDemoMultiSheet = async (): Promise<void> => {
  const sheets = Object.entries(demoDataSets).map(([name, buildData]) => ({
    name,
    data: buildData()
  }));

  downloadDataAsMultiSheetExcel(sheets, { filename: 'demo_multi_sheet', includeTimestamp: true });
};
