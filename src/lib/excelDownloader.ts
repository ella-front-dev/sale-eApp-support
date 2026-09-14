import dayjs from 'dayjs';
import * as XLSX from 'xlsx';

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
 *
 * 컬럼 순서와 목록은 json_to_sheet 와 동일하게 첫 행의 키를 기준으로 한다.
 */
const setAutoWidth = (worksheet: XLSX.WorkSheet, data: object[]): void => {
  const [firstRow] = data;
  if (!firstRow) {
    return;
  }

  // 헤더 길이로 초기화한 뒤, 샘플 행(최대 100개)을 훑어 최대 길이로 갱신
  const maxLengthByKey = new Map<string, number>(
    Object.keys(firstRow).map((key) => [key, key.length])
  );

  data.slice(0, 100).forEach((row) => {
    Object.entries(row).forEach(([key, value]) => {
      const current = maxLengthByKey.get(key);
      if (current === undefined) {
        return;
      }

      const length = value === undefined || value === null ? 0 : String(value).length;
      if (length > current) {
        maxLengthByKey.set(key, length);
      }
    });
  });

  // 최소 10, 최대 50으로 제한하고 여백 2 추가
  const columnWidths: ColumnWidth[] = [...maxLengthByKey.values()].map((maxLength) => ({
    wch: Math.min(Math.max(maxLength + 2, 10), 50)
  }));

  worksheet['!cols'] = columnWidths;
};

/**
 * 데이터를 엑셀로 다운로드 (내부 함수)
 */
export const downloadDataAsExcel = async (
  data: object[] | object,
  options: ExcelDownloadOptions = {}
): Promise<void> => {
  const workbook = XLSX.utils.book_new();
  const dataArray: object[] = Array.isArray(data) ? data : [data];
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
 * API 응답을 JSON 으로 읽는다.
 * 404 같은 실패 응답은 본문이 JSON 이 아니거나 엉뚱한 데이터일 수 있어, 파싱 전에 상태 코드로 끊는다.
 */
const fetchJson = async (url: string): Promise<Record<string, unknown>[] | Record<string, unknown>> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${url} 응답 실패 (${response.status})`);
  }

  return response.json();
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
    const data = await fetchJson(apiUrl);

    await downloadDataAsExcel(data, {
      filename: options.filename || `api_data_${Date.now()}`,
      sheetName: options.sheetName || 'Data',
      includeTimestamp: options.includeTimestamp ?? true,
      autoWidth: options.autoWidth ?? true
    });
  } catch {
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
    let failedCount = 0;

    // 모든 API 호출
    for (const endpoint of apiEndpoints) {
      try {
        const data = await fetchJson(endpoint.url);

        // 데이터에 소스 정보 추가
        const dataWithSource = Array.isArray(data)
          ? data.map(item => ({ API_소스: endpoint.name, ...item }))
          : [{ API_소스: endpoint.name, ...data }];

        allData = [...allData, ...dataWithSource];
      } catch {
        // 개별 엔드포인트 실패는 건너뛰고 나머지 계속 진행
        failedCount++;
      }
    }

    // 전부 실패했는데 빈 파일을 내려주면 성공처럼 보이므로 에러로 끊는다
    if (failedCount === apiEndpoints.length) {
      throw new Error('모든 API 호출에 실패했습니다.');
    }

    await downloadDataAsExcel(allData, {
      filename: options.filename || `multi_api_data_${Date.now()}`,
      sheetName: options.sheetName || '통합데이터',
      includeTimestamp: options.includeTimestamp ?? true,
      autoWidth: options.autoWidth ?? true
    });
  } catch {
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
    let failedCount = 0;

    // 각 API별로 시트 생성
    for (const endpoint of apiEndpoints) {
      try {
        const data = await fetchJson(endpoint.url);

        const dataArray = Array.isArray(data) ? data : [data];
        const worksheet = XLSX.utils.json_to_sheet(dataArray) as XLSX.WorkSheet;
        
        // 자동 컬럼 너비 설정
        if (options.autoWidth ?? true) {
          setAutoWidth(worksheet, dataArray);
        }

        // 시트명 설정 (한글 지원)
        const sheetName = endpoint.name.length > 31 
          ? `${endpoint.name.substring(0, 28)  }...` 
          : endpoint.name;
        
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      } catch (error) {
        failedCount++;
        // 에러 정보를 담은 시트 생성
        const errorSheet = XLSX.utils.json_to_sheet([
          { 오류: `${endpoint.name} 데이터 로드 실패`, 상세: String(error) }
        ]) as XLSX.WorkSheet;
        XLSX.utils.book_append_sheet(workbook, errorSheet, `${endpoint.name}_ERROR`);
      }
    }

    // 전부 실패하면 에러 시트만 담긴 파일이 되므로 다운로드하지 않는다
    if (failedCount === apiEndpoints.length) {
      throw new Error('모든 API 호출에 실패했습니다.');
    }

    // 파일 다운로드
    const timestamp = options.includeTimestamp ?? true
      ? `_${dayjs().format('YYYYMMDD')}`
      : '';

    const filename = `${options.filename || 'multi_sheet_data'}${timestamp}.xlsx`;
    XLSX.writeFile(workbook, filename);

  } catch {
    throw new Error('다중 시트 다운로드 중 오류가 발생했습니다.');
  }
};

/**
 * 이미 메모리에 있는 데이터를 이름별로 나눠 다중 시트 엑셀로 다운로드
 * (API 호출 없이, 클라이언트에서 이미 들고 있는 데이터를 시트로 쪼갤 때 사용)
 */
export const downloadDataAsMultiSheetExcel = (
  sheets: { name: string; data: object[] }[],
  options: MultiSheetOptions = {}
): void => {
  const workbook = XLSX.utils.book_new();

  sheets.forEach(({ name, data }) => {
    if (data.length === 0) {
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(data) as XLSX.WorkSheet;
    if (options.autoWidth ?? true) {
      setAutoWidth(worksheet, data);
    }

    const sheetName = name.length > 31 ? `${name.substring(0, 28)}...` : name;
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  });

  const timestamp = options.includeTimestamp
    ? `_${dayjs().format('YYYYMMDD')}`
    : '';

  const filename = `${options.filename || 'multi_sheet_data'}${timestamp}.xlsx`;
  XLSX.writeFile(workbook, filename);
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
