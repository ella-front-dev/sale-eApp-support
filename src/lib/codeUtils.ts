// API에서 받는 공통 코드 데이터 타입
export interface ApiCodeItem {
  CodeValue: string;
  Codelabel: string;
}

export interface ApiCodeGroup {
  codeid: number;
  codeList: ApiCodeItem[];
}

// 포맷팅된 코드 데이터 타입
export interface FormattedCodeItem {
  value: string;
  label: string;
}

export interface FormattedCodeGroup {
  id: number;
  codes: FormattedCodeItem[];
  defaultValue?: FormattedCodeItem;
}

/**
 * API 데이터를 포맷팅된 그룹 배열로 변환
 */
export function formatCodeData(apiData: ApiCodeGroup[]): FormattedCodeGroup[] {
  return apiData.map(group => ({
    id: group.codeid,
    codes: group.codeList.map(item => ({
      value: item.CodeValue,
      label: item.Codelabel
    }))
  }));
}

/**
 * 특정 ID의 코드 그룹 반환
 */
export function getCodeGroupById(formattedData: FormattedCodeGroup[], id: number): FormattedCodeGroup | undefined {
  return formattedData.find(group => group.id === id);
}

/**
 * 특정 ID의 codes 배열만 반환
 */
export function getCodesById(formattedData: FormattedCodeGroup[], id: number): FormattedCodeItem[] {
  const group = getCodeGroupById(formattedData, id);
  return group?.codes || [];
}

/**
 * 특정 ID의 첫 번째 코드(보통 기본값) 반환
 */
export function getFirstCodeById(formattedData: FormattedCodeGroup[], id: number): FormattedCodeItem | undefined {
  const codes = getCodesById(formattedData, id);
  return codes.length > 0 ? codes[0] : undefined;
}

/**
 * 특정 값을 가진 코드 아이템 찾기
 */
export function findCodeByValue(
  formattedData: FormattedCodeGroup[], 
  id: number, 
  value: string
): FormattedCodeItem | undefined {
  const codes = getCodesById(formattedData, id);
  return codes.find(code => code.value === value);
}

/**
 * Select 컴포넌트용 옵션 반환 (기본값 포함/제외 선택 가능)
 */
export function getSelectOptions(
  formattedData: FormattedCodeGroup[], 
  id: number, 
  includeDefault = true
): FormattedCodeItem[] {
  const codes = getCodesById(formattedData, id);
  
  if (!includeDefault) {
    // 빈 값이나 "선택하세요" 같은 기본값 제외
    return codes.filter(code => 
      code.value.trim() !== "" && 
      !code.label.includes("선택하세요")
    );
  }
  
  return codes;
}

/**
 * Radio 컴포넌트용 옵션 반환 (보통 기본값 제외)
 */
export function getRadioOptions(formattedData: FormattedCodeGroup[], id: number): FormattedCodeItem[] {
  return getSelectOptions(formattedData, id, false);
}

/**
 * 특정 조건으로 코드 필터링
 */
export function getFilteredCodes(
  formattedData: FormattedCodeGroup[],
  id: number, 
  filter: {
    excludeEmpty?: boolean;
    includeValues?: string[];
    excludeValues?: string[];
    labelContains?: string;
  }
): FormattedCodeItem[] {
  let codes = getCodesById(formattedData, id);

  if (filter.excludeEmpty) {
    codes = codes.filter(code => code.value.trim() !== "");
  }

  if (filter.includeValues) {
    codes = codes.filter(code => filter.includeValues!.includes(code.value));
  }

  if (filter.excludeValues) {
    codes = codes.filter(code => !filter.excludeValues!.includes(code.value));
  }

  if (filter.labelContains) {
    codes = codes.filter(code => 
      code.label.toLowerCase().includes(filter.labelContains!.toLowerCase())
    );
  }

  return codes;
}

/**
 * 편의를 위한 유틸리티 함수 묶음 생성
 */
export function createCodeUtils(formattedData: FormattedCodeGroup[]) {
  return {
    getCodes: (id: number) => getCodesById(formattedData, id),
    getCodeGroup: (id: number) => getCodeGroupById(formattedData, id),
    getSelectOptions: (id: number, includeDefault = true) => 
      getSelectOptions(formattedData, id, includeDefault),
    getRadioOptions: (id: number) => getRadioOptions(formattedData, id),
    getFirstCode: (id: number) => getFirstCodeById(formattedData, id),
    findCodeByValue: (id: number, value: string) => findCodeByValue(formattedData, id, value),
    getFilteredCodes: (id: number, filter: Parameters<typeof getFilteredCodes>[2]) => 
      getFilteredCodes(formattedData, id, filter),
    getAllGroups: () => [...formattedData]
  };
}

/**
 * 간편 사용을 위한 헬퍼 함수들
 */

/**
 * API 데이터를 한 번에 포맷팅 (함수형 버전)
 */
export const formatCommonCodes = (apiData: ApiCodeGroup[]): FormattedCodeGroup[] => {
  return formatCodeData(apiData);
};

/**
 * 특정 ID의 코드들만 빠르게 추출
 */
export const getCodesByIdFromApi = (apiData: ApiCodeGroup[], id: number): FormattedCodeItem[] => {
  const group = apiData.find(item => item.codeid === id);
  if (!group) return [];

  return group.codeList.map(item => ({
    value: item.CodeValue,
    label: item.Codelabel
  }));
};

/**
 * 여러 ID의 코드들을 한 번에 추출
 */
export const getMultipleCodesFromApi = (
  apiData: ApiCodeGroup[], 
  ids: number[]
): Record<number, FormattedCodeItem[]> => {
  const result: Record<number, FormattedCodeItem[]> = {};
  
  ids.forEach(id => {
    result[id] = getCodesByIdFromApi(apiData, id);
  });

  return result;
};

/**
 * value 값을 label로 치환해서 표시하는 함수
 */
export function getCodeLabelByValue(
  formattedData: FormattedCodeGroup[], 
  id: number, 
  value: string
): string {
  const codes = getCodesById(formattedData, id);
  const foundCode = codes.find(code => code.value === value);
  return foundCode?.label || value; // 못 찾으면 원본 value 반환
}

/**
 * 여러 value들을 한 번에 label로 치환
 */
export function getMultipleLabels(
  formattedData: FormattedCodeGroup[],
  id: number,
  values: string[]
): Record<string, string> {
  const codes = getCodesById(formattedData, id);
  const result: Record<string, string> = {};
  
  values.forEach(value => {
    const foundCode = codes.find(code => code.value === value);
    result[value] = foundCode?.label || value;
  });
  
  return result;
}

/**
 * API 데이터에서 직접 value를 label로 치환
 */
export function getCodeLabelFromApi(
  apiData: ApiCodeGroup[],
  id: number,
  value: string
): string {
  const group = apiData.find(item => item.codeid === id);
  if (!group) return value;
  
  const foundCode = group.codeList.find(item => item.CodeValue === value);
  return foundCode?.Codelabel || value;
}

/**
 * 배열 형태의 value들을 label 배열로 변환
 */
export function convertValuesToLabels(
  formattedData: FormattedCodeGroup[],
  id: number,
  values: string[]
): string[] {
  return values.map(value => getCodeLabelByValue(formattedData, id, value));
}

/**
 * 객체의 특정 필드를 label로 치환해서 반환
 */
export function replaceValueWithLabel<T extends Record<string, string | number>>(
  formattedData: FormattedCodeGroup[],
  id: number,
  obj: T,
  fieldName: keyof T
): T & { [K in keyof T as `${string & K}Label`]: string } {
  const value = obj[fieldName];
  const label = getCodeLabelByValue(formattedData, id, String(value));
  
  return {
    ...obj,
    [`${String(fieldName)}Label`]: label
  } as T & { [K in keyof T as `${string & K}Label`]: string };
}
