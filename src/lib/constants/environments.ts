export type Environment = 'local' | 'dev' | 'stg' | 'prd';

export const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV as Environment;

export const MSW_ENABLED = process.env.NEXT_PUBLIC_MSW_ENABLED === 'true';
