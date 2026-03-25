/** 실행환경 변수 */
export const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV as 'local' | 'dev' | 'stg' | 'prd';

export const MSW_ENABLED = process.env.NEXT_PUBLIC_MSW_ENABLED === 'true';

/**
 * @todo 임시...
 * redirectToLoginPage() 함수 작성시 필요한 데이터. 확인부탁드립니다.
 */
export const HOST = process.env.NEXT_PUBLIC_HOST;
