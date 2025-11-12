import { useState, useEffect, useCallback } from 'react';
import { api } from './axios';
import { 
  formatCodeData,
  createCodeUtils,
  getCodesById,
  getSelectOptions,
  getRadioOptions,
  getDefaultValueById,
  ApiCodeGroup, 
  FormattedCodeGroup, 
 
} from './codeUtils';
import { commonCodeService, type CommonCodeApiResponse } from './api/formService';

// 캐시 저장소
const codeCache = new Map<string, FormattedCodeGroup[]>();
const cacheExpiry = new Map<string, number>();
const CACHE_DURATION = 10 * 60 * 1000; // 10분

/**
 * API에서 공통 코드 데이터 가져오기
 */
async function fetchCommonCodes(endpoint = '/common-codes'): Promise<ApiCodeGroup[]> {
  try {
    // 실제 API 호출
    const apiResponse: CommonCodeApiResponse[] = await commonCodeService.getCommonCodes();
    
    // API 응답을 내부 형식으로 변환
    return apiResponse.map(item => ({
      codeid: item.codeid,
      codeList: item.codeList.map(code => ({
        CodeValue: code.CodeValue,
        Codelabel: code.Codelabel
      })),
      defaultValue: item.defaultValue || { value: '', label: '선택하세요' }
    }));
  } catch {
    // API 호출 실패 시 기본 fallback 사용
    return api.get(endpoint);
  }
}

/**
 * 캐시된 데이터 가져오기 또는 새로 생성
 */
async function getFormattedCommonCodes(cacheKey = 'default'): Promise<FormattedCodeGroup[]> {
  const now = Date.now();
  const cachedData = codeCache.get(cacheKey);
  const cacheTime = cacheExpiry.get(cacheKey);

  // 캐시가 있고 유효한 경우
  if (cachedData && cacheTime && now - cacheTime < CACHE_DURATION) {
    return cachedData;
  }

  // 캐시가 없거나 만료된 경우 새로 가져오기
  try {
    const apiData = await fetchCommonCodes();
    const formattedData = formatCodeData(apiData);
    
    // 캐시에 저장
    codeCache.set(cacheKey, formattedData);
    cacheExpiry.set(cacheKey, now);
    
    return formattedData;
  } catch (error) {
    console.error('공통 코드 로딩 실패:', error);
    
    // 기존 캐시가 있으면 그것을 사용 (만료되었더라도)
    if (cachedData) {
      return cachedData;
    }
    
    // 아무것도 없으면 Mock 데이터로 생성
    return formatCodeData(getMockData());
  }
}

/**
 * 캐시 수동 삭제
 */
export function clearCommonCodeCache(cacheKey?: string): void {
  if (cacheKey) {
    codeCache.delete(cacheKey);
    cacheExpiry.delete(cacheKey);
  } else {
    codeCache.clear();
    cacheExpiry.clear();
  }
}

/**
 * Mock 데이터 생성 (개발/테스트용)
 */
function getMockData(): ApiCodeGroup[] {
  return [
    {
      codeid: 1,
      codeList: [
        { CodeValue: "", Codelabel: "선택하세요" },
        { CodeValue: "Y", Codelabel: "예" },
        { CodeValue: "N", Codelabel: "아니오" }
      ],
      defaultValue: { value: "", label: "선택하세요" }
    },
    {
      codeid: 2,
      codeList: [
        { CodeValue: "0", Codelabel: "매우 불만족" },
        { CodeValue: "1", Codelabel: "불만족" },
        { CodeValue: "2", Codelabel: "보통" },
        { CodeValue: "3", Codelabel: "만족" },
        { CodeValue: "4", Codelabel: "매우 만족" }
      ],
      defaultValue: { value: "2", label: "보통" }
    },
    {
      codeid: 3,
      codeList: [
        { CodeValue: "mobile", Codelabel: "모바일" },
        { CodeValue: "desktop", Codelabel: "데스크톱" },
        { CodeValue: "tablet", Codelabel: "태블릿" }
      ],
      defaultValue: { value: "mobile", label: "모바일" }
    }
  ];
}

/**
 * 공통 코드 Hook
 */
export function useCommonCodes(cacheKey = 'default', useMock = false) {
  const [formattedData, setFormattedData] = useState<FormattedCodeGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 데이터 로딩
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        let data: FormattedCodeGroup[];
        
        if (useMock) {
          // Mock 데이터 사용
          data = formatCodeData(getMockData());
        } else {
          // 실제 API 데이터 사용
          data = await getFormattedCommonCodes(cacheKey);
        }
        
        setFormattedData(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다';
        setError(errorMessage);
        console.error('공통 코드 로딩 에러:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [cacheKey, useMock]);

  // 편의 함수들
  const getCodes = useCallback((id: number) => getCodesById(formattedData, id), [formattedData]);
  
  const getSelectOptionsFunc = useCallback(
    (id: number, includeDefault = true) => getSelectOptions(formattedData, id, includeDefault), 
    [formattedData]
  );
  
  const getRadioOptionsFunc = useCallback(
    (id: number) => getRadioOptions(formattedData, id), 
    [formattedData]
  );
  
  const getDefaultValue = useCallback(
    (id: number) => getDefaultValueById(formattedData, id), 
    [formattedData]
  );

  const getAllGroups = useCallback(() => [...formattedData], [formattedData]);

  const isReady = !loading && !error && formattedData.length > 0;

  return {
    // 데이터 상태
    formattedData,
    loading,
    error,
    isReady,
    
    // 편의 함수들
    getCodes,
    getSelectOptions: getSelectOptionsFunc,
    getRadioOptions: getRadioOptionsFunc,
    getDefaultValue,
    getAllGroups,
    
    // 유틸리티
    utils: createCodeUtils(formattedData),
    clearCache: () => clearCommonCodeCache(cacheKey)
  };
}

// 기존 호환성을 위한 별칭
export { useCommonCodes as useCommonCodesHook };