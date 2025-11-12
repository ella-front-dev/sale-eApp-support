import axios from 'axios';
import toast from 'react-hot-toast';

// 간단한 비즈니스 에러 클래스
export class BusinessError extends Error {
  public readonly isSuccess = false;
  
  constructor(
    public code: string,
    message: string
  ) {
    super(message);
    this.name = 'BusinessError';
  }
}

// baseURL 설정
const BASE_URLS = {
  main: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
  auth: process.env.NEXT_PUBLIC_AUTH_API_BASE_URL || '/auth-api',
  file: process.env.NEXT_PUBLIC_FILE_API_BASE_URL || '/file-api',
};

// 공통 axios 인스턴스 생성 함수
const createInstance = (baseURL: string, timeout = 10000) => {
  const instance = axios.create({ baseURL, timeout });
  
  // 공통 인터셉터 적용
  instance.interceptors.response.use(
    (response) => {
      if (!response.data?.isSuccess) {
        const businessError = new BusinessError(
          response.data?.code || 'UNKNOWN', 
          response.data?.message || '에러가 발생했습니다'
        );
        
        // BusinessError 발생 시 토스트 표시
        toast.error(businessError.message);
        
        throw businessError;
      }
      return response;
    },
    (error) => {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;
      let businessError: BusinessError;
      
      if (status === 401) {
        businessError = new BusinessError('UNAUTHORIZED', '인증이 필요합니다');
      } else if (status === 403) {
        businessError = new BusinessError('FORBIDDEN', '권한이 없습니다');
      } else if (status === 404) {
        businessError = new BusinessError('NOT_FOUND', '리소스를 찾을 수 없습니다');
      } else if (status >= 500) {
        businessError = new BusinessError('SERVER_ERROR', '서버 오류가 발생했습니다');
      } else {
        businessError = new BusinessError('UNKNOWN', message);
      }
      
      // HTTP 에러도 토스트 표시
      toast.error(businessError.message);
      
      throw businessError;
    }
  );
  
  return instance;
};

// 각 인스턴스 생성
const instances = {
  main: createInstance(BASE_URLS.main),
  auth: createInstance(BASE_URLS.auth),
  file: createInstance(BASE_URLS.file, 30000), // 파일은 더 긴 타임아웃
};

// 심플한 API 객체
export const api = {
  // 메인 API
  main: {
    get: (url: string, params?: unknown) => 
      instances.main.get(url, { params }).then((res: any) => res.data.data),
    post: (url: string, data?: unknown) => 
      instances.main.post(url, data).then((res: any) => res.data.data),
    put: (url: string, data?: unknown) => 
      instances.main.put(url, data).then((res: any) => res.data.data),
    delete: (url: string) => 
      instances.main.delete(url).then((res: any) => res.data.data),
  },
  
  // 인증 API
  auth: {
    get: (url: string, params?: unknown) => 
      instances.auth.get(url, { params }).then((res: any) => res.data.data),
    post: (url: string, data?: unknown) => 
      instances.auth.post(url, data).then((res: any) => res.data.data),
    put: (url: string, data?: unknown) => 
      instances.auth.put(url, data).then((res: any) => res.data.data),
    delete: (url: string) => 
      instances.auth.delete(url).then((res: any) => res.data.data),
  },
  
  // 파일 API
  file: {
    get: (url: string, params?: unknown) => 
      instances.file.get(url, { params }).then((res: any) => res.data.data),
    post: (url: string, data?: unknown) => 
      instances.file.post(url, data).then((res: any) => res.data.data),
    put: (url: string, data?: unknown) => 
      instances.file.put(url, data).then((res: any) => res.data.data),
    delete: (url: string) => 
      instances.file.delete(url).then((res: any) => res.data.data),
  },
  
  // 기본 API (하위 호환성을 위해 main과 동일)
  get: (url: string, params?: unknown) => 
    instances.main.get(url, { params }).then((res: any) => res.data.data),
  post: (url: string, data?: unknown) => 
    instances.main.post(url, data).then((res: any) => res.data.data),
  put: (url: string, data?: unknown) => 
    instances.main.put(url, data).then((res: any) => res.data.data),
  delete: (url: string) => 
    instances.main.delete(url).then((res: any) => res.data.data),
};

export default instances.main;