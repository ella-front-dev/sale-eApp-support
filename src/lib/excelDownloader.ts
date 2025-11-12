import * as XLSX from 'xlsx';
import dayjs from 'dayjs';

// 컬럼 너비 타입 정의
interface ColumnWidth {
  wch: number;
}

// API 데이터 타입 정의
export interface ApiEndpoint {
  id: string;
  name: string;
  url: string;
  description?: string;
}

// 엑셀 다운로드 옵션
export interface ExcelDownloadOptions {
  filename?: string;
  sheetName?: string;
  includeTimestamp?: boolean;
  autoWidth?: boolean;
}

// 다중 시트 옵션
export interface MultiSheetOptions {
  filename?: string;
  includeTimestamp?: boolean;
  autoWidth?: boolean;
}

/**
 * 워크시트 컬럼 너비 자동 조정
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const setAutoWidth = (worksheet: any, data: Record<string, unknown>[]): void => {
  if (!data || data.length === 0) return;

  const keys = Object.keys(data[0]);
  const columnWidths: ColumnWidth[] = keys.map((key) => {
    // 헤더 길이
    const headerLength = key.length;
    
    // 샘플값(최대 100개) 길이들을 number[]로 수집
    const sampleLengths = data
      .slice(0, 100)
      .map((row) => {
        const value = row[key];
        return value !== undefined && value !== null ? String(value).length : 0;
      })
      .filter((length): length is number => typeof length === 'number');

    // 샘플 데이터 중 최대 길이
    const maxSampleLength = sampleLengths.length > 0 ? Math.max(...sampleLengths) : 0;
    
    // 헤더와 샘플 데이터 중 더 긴 길이 선택
    const maxLength = Math.max(headerLength, maxSampleLength);
    
    // 최소 10, 최대 50으로 제한하고 여백 2 추가
    const wch = Math.min(Math.max(maxLength + 2, 10), 50);
    
    return { wch } as ColumnWidth;
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (worksheet as any)['!cols'] = columnWidths;
};

/**
 * 데이터를 엑셀로 다운로드 (내부 함수)
 */
export const downloadDataAsExcel = async (
  data: Record<string, unknown>[] | Record<string, unknown>,
  options: ExcelDownloadOptions = {}
): Promise<void> => {
  const workbook = XLSX.utils.book_new();
  const dataArray = Array.isArray(data) ? data : [data];
  const worksheet = XLSX.utils.json_to_sheet(dataArray) as XLSX.WorkSheet;
  
  // 자동 컬럼 너비 설정
  if (options.autoWidth) {
    setAutoWidth(worksheet, dataArray);
  }

  XLSX.utils.book_append_sheet(workbook, worksheet, options.sheetName || 'Sheet1');
  
  // 파일명 생성
  const timestamp = options.includeTimestamp 
    ? `_${dayjs().format('YYYYMMDD')}`
    : '';
  
  const filename = `${options.filename || 'data'}${timestamp}.xlsx`;
  XLSX.writeFile(workbook, filename);
};

/**
 * 단일 API 데이터를 엑셀로 다운로드
 */
export const downloadSingleApi = async (
  apiUrl: string,
  options: ExcelDownloadOptions = {}
): Promise<void> => {
  try {
    // API 호출 (실제 환경에서는 axios 등 사용)
    const response = await fetch(apiUrl);
    const data: Record<string, unknown>[] | Record<string, unknown> = await response.json();
    
    await downloadDataAsExcel(data, {
      filename: options.filename || `api_data_${Date.now()}`,
      sheetName: options.sheetName || 'Data',
      includeTimestamp: options.includeTimestamp ?? true,
      autoWidth: options.autoWidth ?? true
    });
  } catch (error) {
    console.error('API 데이터 다운로드 실패:', error);
    throw new Error('API 데이터 다운로드 중 오류가 발생했습니다.');
  }
};

/**
 * 여러 API 데이터를 하나의 시트로 통합하여 다운로드
 */
export const downloadMultipleApis = async (
  apiEndpoints: ApiEndpoint[],
  options: ExcelDownloadOptions = {}
): Promise<void> => {
  try {
    let allData: Record<string, unknown>[] = [];

    // 모든 API 호출
    for (const endpoint of apiEndpoints) {
      try {
        const response = await fetch(endpoint.url);
        const data: Record<string, unknown>[] | Record<string, unknown> = await response.json();
        
        // 데이터에 소스 정보 추가
        const dataWithSource = Array.isArray(data) 
          ? data.map(item => ({ API_소스: endpoint.name, ...item }))
          : [{ API_소스: endpoint.name, ...data }];
        
        allData = [...allData, ...dataWithSource];
      } catch (error) {
        console.warn(`API ${endpoint.name} 호출 실패:`, error);
      }
    }

    await downloadDataAsExcel(allData, {
      filename: options.filename || `multi_api_data_${Date.now()}`,
      sheetName: options.sheetName || '통합데이터',
      includeTimestamp: options.includeTimestamp ?? true,
      autoWidth: options.autoWidth ?? true
    });
  } catch (error) {
    console.error('다중 API 데이터 다운로드 실패:', error);
    throw new Error('다중 API 데이터 다운로드 중 오류가 발생했습니다.');
  }
};

/**
 * 여러 API 데이터를 각각 다른 시트로 다운로드
 */
export const downloadMultipleApisAsSheets = async (
  apiEndpoints: ApiEndpoint[],
  options: MultiSheetOptions = {}
): Promise<void> => {
  try {
    const workbook = XLSX.utils.book_new();
    
    // 각 API별로 시트 생성
    for (const endpoint of apiEndpoints) {
      try {
        const response = await fetch(endpoint.url);
        const data: Record<string, unknown>[] | Record<string, unknown> = await response.json();
        
        const dataArray = Array.isArray(data) ? data : [data];
        const worksheet = XLSX.utils.json_to_sheet(dataArray) as XLSX.WorkSheet;
        
        // 자동 컬럼 너비 설정
        if (options.autoWidth ?? true) {
          setAutoWidth(worksheet, dataArray);
        }

        // 시트명 설정 (한글 지원)
        const sheetName = endpoint.name.length > 31 
          ? endpoint.name.substring(0, 28) + '...' 
          : endpoint.name;
        
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      } catch (error) {
        console.warn(`API ${endpoint.name} 처리 실패:`, error);
        // 에러 정보를 담은 시트 생성
        const errorSheet = XLSX.utils.json_to_sheet([
          { 오류: `${endpoint.name} 데이터 로드 실패`, 상세: String(error) }
        ]) as XLSX.WorkSheet;
        XLSX.utils.book_append_sheet(workbook, errorSheet, `${endpoint.name}_ERROR`);
      }
    }

    // 파일 다운로드
    const timestamp = options.includeTimestamp ?? true 
      ? `_${dayjs().format('YYYYMMDD')}`
      : '';
    
    const filename = `${options.filename || 'multi_sheet_data'}${timestamp}.xlsx`;
    XLSX.writeFile(workbook, filename);
    
  } catch (error) {
    console.error('다중 시트 다운로드 실패:', error);
    throw new Error('다중 시트 다운로드 중 오류가 발생했습니다.');
  }
};

/**
 * 간단한 사용을 위한 헬퍼 함수들
 */

// 단일 API 데이터 다운로드
export const downloadApiData = async (
  apiUrl: string, 
  filename?: string
): Promise<void> => {
  return downloadSingleApi(apiUrl, { filename });
};

// 여러 API 데이터 통합 다운로드
export const downloadMultiApiData = async (
  apiEndpoints: ApiEndpoint[], 
  filename?: string
): Promise<void> => {
  return downloadMultipleApis(apiEndpoints, { filename });
};

// 여러 API 데이터 다중 시트 다운로드
export const downloadMultiSheetData = async (
  apiEndpoints: ApiEndpoint[], 
  filename?: string
): Promise<void> => {
  return downloadMultipleApisAsSheets(apiEndpoints, { filename });
};

/**
 * Mock 데이터를 사용한 테스트 함수들
 */
export const testDownloadFunctions = {
  // 사용자 데이터 Mock
  users: () => Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `사용자${i + 1}`,
    email: `user${i + 1}@example.com`,
    department: ['개발팀', '디자인팀', '기획팀'][i % 3],
    joinDate: dayjs().subtract(i * 10, 'day').format('YYYY-MM-DD')
  })),

  // 상품 데이터 Mock
  products: () => Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    name: `상품${i + 1}`,
    category: ['전자제품', '의류', '도서'][i % 3],
    price: (i + 1) * 1000,
    stock: Math.floor(Math.random() * 100)
  })),

  // 주문 데이터 Mock
  orders: () => Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    orderNumber: `ORD${String(i + 1).padStart(6, '0')}`,
    customerName: `고객${i + 1}`,
    totalAmount: (i + 1) * 500,
    status: ['완료', '진행중', '취소'][i % 3],
    orderDate: dayjs().subtract(i * 2, 'day').format('YYYY-MM-DD')
  }))
};

/**
 * Mock 데이터로 테스트할 수 있는 헬퍼 함수들
 */

// Mock 데이터로 단일 다운로드 테스트
export const testSingleDownload = async (dataType: 'users' | 'products' | 'orders'): Promise<void> => {
  const data = testDownloadFunctions[dataType]();
  return downloadDataAsExcel(data, {
    filename: `test_${dataType}`,
    sheetName: dataType,
    includeTimestamp: true,
    autoWidth: true
  });
};

// Mock 데이터로 다중 시트 다운로드 테스트
export const testMultiSheetDownload = async (): Promise<void> => {
  const workbook = XLSX.utils.book_new();

  // 각 Mock 데이터를 시트로 추가
  Object.entries(testDownloadFunctions).forEach(([key, dataFunc]) => {
    const data = dataFunc();
    const worksheet = XLSX.utils.json_to_sheet(data) as XLSX.WorkSheet;
    setAutoWidth(worksheet, data);
    XLSX.utils.book_append_sheet(workbook, worksheet, key);
  });

  const filename = `test_multi_sheet_${Date.now()}.xlsx`;
  XLSX.writeFile(workbook, filename);
};