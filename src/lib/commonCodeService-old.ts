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
  ApiCodeGroup, 
  FormattedCodeGroup, 
  FormattedCodeItem 
} from './codeUtils';
import { commonCodeService, type CommonCodeApiResponse } from './api/formService';

/**
 * 공통 코드 관리 서비스
 */
export class CommonCodeService {
  private static codeCache = new Map<string, CommonCodeFormatter>();
  private static cacheExpiry = new Map<string, number>();
  private static readonly CACHE_DURATION = 10 * 60 * 1000; // 10분

    /**
   * API에서 공통 코드 데이터 가져오기
   */
  static async fetchCommonCodes(endpoint = '/common-codes'): Promise<ApiCodeGroup[]> {
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
   * 캐시된 포매터 가져오기
   */
  static async getCommonCodeFormatter(cacheKey = 'default'): Promise<CommonCodeFormatter> {
    const now = Date.now();
    const cached = this.codeCache.get(cacheKey);
    const expiry = this.cacheExpiry.get(cacheKey);

    // 캐시가 유효한 경우 반환
    if (cached && expiry && now < expiry) {
      return cached;
    }

    try {
      // API에서 새 데이터 가져오기
      const apiData = await this.fetchCommonCodes();
      const formatter = new CommonCodeFormatter(apiData);

      // 캐시 저장
      this.codeCache.set(cacheKey, formatter);
      this.cacheExpiry.set(cacheKey, now + this.CACHE_DURATION);

      return formatter;
    } catch (error) {
      // API 실패 시 기존 캐시라도 반환
      if (cached) {
        console.warn('API 실패로 캐시된 데이터 사용:', error);
        return cached;
      }
      throw error;
    }
  }

  /**
   * 캐시 초기화
   */
  static clearCache(cacheKey?: string) {
    if (cacheKey) {
      this.codeCache.delete(cacheKey);
      this.cacheExpiry.delete(cacheKey);
    } else {
      this.codeCache.clear();
      this.cacheExpiry.clear();
    }
  }

  /**
   * Mock 데이터 (개발/테스트용)
   */
  static getMockData(): ApiCodeGroup[] {
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
          { CodeValue: "", Codelabel: "선택하세요" },
          { CodeValue: "1", Codelabel: "매우 만족" },
          { CodeValue: "2", Codelabel: "만족" },
          { CodeValue: "3", Codelabel: "보통" },
          { CodeValue: "4", Codelabel: "불만족" },
          { CodeValue: "5", Codelabel: "매우 불만족" }
        ],
        defaultValue: { value: "3", label: "보통" }
      },
      {
        codeid: 3,
        codeList: [
          { CodeValue: "", Codelabel: "선택하세요" },
          { CodeValue: "MOBILE", Codelabel: "모바일" },
          { CodeValue: "DESKTOP", Codelabel: "데스크톱" },
          { CodeValue: "TABLET", Codelabel: "태블릿" }
        ],
        defaultValue: { value: "", label: "선택하세요" }
      }
    ];
  }

  /**
   * Mock 포매터 반환 (개발용)
   */
  static getMockFormatter(): CommonCodeFormatter {
    return new CommonCodeFormatter(this.getMockData());
  }
}

/**
 * 공통 코드 사용을 위한 React Hook
 */
export const useCommonCodes = (cacheKey = 'default', useMockData = true) => {
  const [formatter, setFormatter] = useState<CommonCodeFormatter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 초기 데이터 로드
  useEffect(() => {
    const loadCommonCodes = async () => {
      try {
        setLoading(true);
        setError(null);

        if (useMockData || process.env.NODE_ENV === 'development') {
          // 개발 환경에서는 Mock 데이터 사용
          const mockFormatter = CommonCodeService.getMockFormatter();
          setFormatter(mockFormatter);
        } else {
          // 실제 API 호출
          const codeFormatter = await CommonCodeService.getCommonCodeFormatter(cacheKey);
          setFormatter(codeFormatter);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '공통 코드 로드 실패');
        console.error('공통 코드 로드 에러:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCommonCodes();
  }, [cacheKey, useMockData]);

  // 특정 ID의 코드들 반환
  const getCodes = useCallback((id: number): FormattedCodeItem[] => {
    if (!formatter) return [];
    return formatter.getCodesById(id);
  }, [formatter]);

  // Select용 옵션 반환
  const getSelectOptions = useCallback((id: number, includeDefault = true): FormattedCodeItem[] => {
    if (!formatter) return [];
    return formatter.getSelectOptions(id, includeDefault);
  }, [formatter]);

  // Radio용 옵션 반환
  const getRadioOptions = useCallback((id: number): FormattedCodeItem[] => {
    if (!formatter) return [];
    return formatter.getRadioOptions(id);
  }, [formatter]);

  // 기본값 반환
  const getDefaultValue = useCallback((id: number): FormattedCodeItem | undefined => {
    if (!formatter) return undefined;
    return formatter.getDefaultValueById(id);
  }, [formatter]);

  // 모든 포맷팅된 그룹 반환
  const getAllGroups = useCallback((): FormattedCodeGroup[] => {
    if (!formatter) return [];
    return formatter.getAllFormattedGroups();
  }, [formatter]);

  // 기본값 설정
  const setDefaultValue = useCallback((id: number, value: string, label: string) => {
    if (formatter) {
      formatter.setDefaultValue(id, value, label);
    }
  }, [formatter]);

  return {
    formatter,
    loading,
    error,
    getCodes,
    getSelectOptions,
    getRadioOptions,
    getDefaultValue,
    getAllGroups,
    setDefaultValue,
    // 상태 확인 편의성
    isReady: !loading && !error && formatter !== null
  };
};