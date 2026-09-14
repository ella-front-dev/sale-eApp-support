export type Environment = 'local' | 'dev' | 'stg' | 'prd';

/** 실행환경 변수 */
export const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV as Environment;

// 별도 백엔드가 없는 데모 저장소라 기본값은 활성화, 명시적으로 'false'일 때만 끔
export const MSW_ENABLED = process.env.NEXT_PUBLIC_MSW_ENABLED !== 'false';

/**
 * @todo 임시...
 * redirectToLoginPage() 함수 작성시 필요한 데이터. 확인부탁드립니다.
 */
export const HOST = process.env.NEXT_PUBLIC_HOST;
