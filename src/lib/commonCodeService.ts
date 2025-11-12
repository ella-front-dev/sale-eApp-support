import { useState, useEffect } from 'react';
import { api } from './axios';
import { 
  formatCodeData,
  createCodeUtils,
  getCodesById,
  getSelectOptions,
  getRadioOptions,
  getFirstCodeById,
  findCodeByValue,
  getCodeLabelByValue,
  convertValuesToLabels,
  replaceValueWithLabel,
  ApiCodeGroup, 
  FormattedCodeGroup, 
  FormattedCodeItem 
} from './codeUtils';
import { commonCodeService, type CommonCodeApiResponse } from './api/formService';

// 캐시 시스템
const codeCache = new Map<string, FormattedCodeGroup[]>();
const cacheExpiry = new Map<string, number>();
const CACHE_DURATION = 10 * 60 * 1000; // 10분

/**
 * API에서 공통 코드 데이터 가져오기
 */
export async function fetchCommonCodes(endpoint = '/common-codes'): Promise<ApiCodeGroup[]> {
  try {
    // 실제 API 호출
    const apiResponse: CommonCodeApiResponse[] = await commonCodeService.getCommonCodes();
    
    // API 응답을 내부 형식으로 변환
    return apiResponse.map(item => ({
      codeid: item.codeid,
      codeList: item.codeList.map(code => ({
        CodeValue: code.CodeValue,
        Codelabel: code.Codelabel
      }))
    }));
  } catch {
    // API 호출 실패 시 기본 fallback 사용
    return api.get(endpoint);
  }
}

/**
 * 캐시된 공통 코드 데이터 반환 또는 새로 생성
 */
export async function getCommonCodes(cacheKey = 'default'): Promise<FormattedCodeGroup[]> {
  const cached = codeCache.get(cacheKey);
  const expiry = cacheExpiry.get(cacheKey);
  
  // 캐시가 유효한 경우
  if (cached && expiry && Date.now() < expiry) {
    return cached;
  }

  // 새로운 데이터 로드
  const apiData = await fetchCommonCodes();
  const formatted = formatCodeData(apiData);
  
  // 캐시 저장
  codeCache.set(cacheKey, formatted);
  cacheExpiry.set(cacheKey, Date.now() + CACHE_DURATION);
  
  return formatted;
}

/**
 * 캐시 초기화
 */
export function clearCache(cacheKey?: string): void {
  if (cacheKey) {
    codeCache.delete(cacheKey);
    cacheExpiry.delete(cacheKey);
  } else {
    codeCache.clear();
    cacheExpiry.clear();
  }
}

/**
 * Mock 데이터 반환 (개발/테스트용)
 */
export function getMockData(): ApiCodeGroup[] {
  return [
    {
      codeid: 1,
      codeList: [
        { CodeValue: "", Codelabel: "선택하세요" },
        { CodeValue: "Y", Codelabel: "예" },
        { CodeValue: "N", Codelabel: "아니오" }
      ]
    },
    {
      codeid: 2,
      codeList: [
        { CodeValue: "1", Codelabel: "매우 불만족" },
        { CodeValue: "2", Codelabel: "불만족" },
        { CodeValue: "3", Codelabel: "보통" },
        { CodeValue: "4", Codelabel: "만족" },
        { CodeValue: "5", Codelabel: "매우 만족" }
      ]
    },
    {
      codeid: 3,
      codeList: [
        { CodeValue: "", Codelabel: "선택하세요" },
        { CodeValue: "mobile", Codelabel: "모바일" },
        { CodeValue: "tablet", Codelabel: "태블릿" },
        { CodeValue: "desktop", Codelabel: "데스크톱" }
      ]
    }
  ];
}

/**
 * Mock 데이터를 포맷팅해서 반환
 */
export function getMockFormattedData(): FormattedCodeGroup[] {
  return formatCodeData(getMockData());
}

/**
 * 공통 코드 React Hook
 */
export function useCommonCodes(cacheKey = 'default', useMockData = false) {
  const [formattedData, setFormattedData] = useState<FormattedCodeGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        let data: FormattedCodeGroup[];
        
        if (useMockData) {
          // Mock 데이터 사용
          data = getMockFormattedData();
        } else {
          // 실제 API 데이터 사용
          data = await getCommonCodes(cacheKey);
        }

        setFormattedData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [cacheKey, useMockData]);

  // 편의 함수들
  const getCodes = (id: number) => getCodesById(formattedData, id);
  const getSelectOpts = (id: number, includeDefault = true) => getSelectOptions(formattedData, id, includeDefault);
  const getRadioOpts = (id: number) => getRadioOptions(formattedData, id);
  const getFirstCode = (id: number) => getFirstCodeById(formattedData, id);
  const findByValue = (id: number, value: string) => findCodeByValue(formattedData, id, value);
  const getAllGroups = () => [...formattedData];
  
  // Label 치환 함수들
  const getLabel = (id: number, value: string) => getCodeLabelByValue(formattedData, id, value);
  const getLabels = (id: number, values: string[]) => convertValuesToLabels(formattedData, id, values);
  const addLabel = <T extends Record<string, string | number>>(
    id: number, 
    obj: T, 
    fieldName: keyof T
  ) => replaceValueWithLabel(formattedData, id, obj, fieldName);

  return {
    // 데이터
    formattedData,
    
    // 상태
    loading,
    error,
    isReady: !loading && !error && formattedData.length > 0,
    
    // 편의 함수들
    getCodes,
    getSelectOptions: getSelectOpts,
    getRadioOptions: getRadioOpts,
    getFirstCode,
    findCodeByValue: findByValue,
    getAllGroups,
    
    // Label 치환 함수들
    getCodeLabel: getLabel,
    getCodeLabels: getLabels,
    addCodeLabel: addLabel,
    
    // 유틸 객체 (선택적 사용)
    utils: formattedData.length > 0 ? createCodeUtils(formattedData) : null,
    
    // 캐시 관리
    clearCache: () => clearCache(cacheKey),
    clearAllCache: () => clearCache()
  };
}

// 편의 함수들 export
export {
  formatCodeData,
  getCodesById,
  getSelectOptions,
  getRadioOptions,
  getFirstCodeById,
  findCodeByValue,
  getCodeLabelByValue,
  convertValuesToLabels,
  replaceValueWithLabel,
  createCodeUtils
};