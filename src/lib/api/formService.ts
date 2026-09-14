import { api, BusinessError } from '@/lib/axios';
import { FormData } from '@/types/form';

// 공통코드 API 타입
export interface CommonCodeApiResponse {
  codeid: number;
  codeList: Array<{
    CodeValue: string;
    Codelabel: string;
  }>;
  defaultValue?: {
    value: string;
    label: string;
  };
}

// 공통코드 API 서비스
export const commonCodeService = {
  // 공통코드 목록 조회
  async getCommonCodes(): Promise<CommonCodeApiResponse[]> {
    return api.get<CommonCodeApiResponse[]>('/common-codes');
  },

  // 특정 공통코드 그룹 조회
  async getCommonCodeGroup(codeId: number): Promise<CommonCodeApiResponse> {
    return api.get<CommonCodeApiResponse>(`/common-codes/${codeId}`);
  }
};

// 간단한 폼 API 서비스
export const formService = {
  // 폼 조회
  async getForm(id: string): Promise<FormData> {
    return api.get<FormData>(`/forms/${id}`);
  },

  // 폼 저장
  async saveForm(formData: FormData): Promise<{ id: string }> {
    return api.post<{ id: string }>('/forms', formData);
  },

  // 폼 수정
  async updateForm(id: string, formData: Partial<FormData>): Promise<void> {
    return api.put<void>(`/forms/${id}`, formData);
  },

  // 폼 삭제
  async deleteForm(id: string): Promise<void> {
    return api.delete<void>(`/forms/${id}`);
  }
};

// 간단한 사용 예시
export const useFormApi = () => {
  const handleApiCall = async () => {
    try {
      await formService.getForm('123');
    } catch (error) {
      if (error instanceof BusinessError) {
        alert(`에러: ${error.message}`);
      } else {
        alert('알 수 없는 오류가 발생했습니다.');
      }
    }
  };
  
  return { handleApiCall };
};