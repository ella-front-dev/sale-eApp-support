'use client';

import { useState, useEffect } from 'react';

import { BASE_PATH } from '@/constants/path';

interface IMswInitializerProps {
  children: React.ReactNode;
  isActive?: boolean;
  onUnhandledRequest?: 'bypass' | 'warn' | 'error';
}

/**
 * MSW 설정을 초기화 해줍니다.
 */
export const MswInitializer = ({ children, isActive = true, onUnhandledRequest = 'bypass' }: IMswInitializerProps) => {
  const [isMswInitialized, setIsMswInitialized] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setIsMswInitialized(true);

      return;
    }

    const initMswMocking = async () => {
      const { worker } = await import('@/lib/mocks/browser');

      // start
      await worker.start({
        onUnhandledRequest,
        serviceWorker: {
          url: `${BASE_PATH}/mockServiceWorker.js` // 명시적 경로 지정
        }
      });

      setIsMswInitialized(true);
      console.log('[MSW] Mock Service Worker initialized successfully');
    };

    // 오류가 발생해도 앱이 계속 작동하도록 catch 처리
    initMswMocking().catch((error) => {
      console.error('[MSW] Failed to initialize Mock Service Worker:', error);
      setIsMswInitialized(true);
    });
  }, [isActive, onUnhandledRequest]);

  // 초기화되지 않은 경우에만 null 또는 로딩 컴포넌트 반환
  if (!isMswInitialized) {
    return null;
  }

  return <>{children}</>;
};
