'use client';

import { useState } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CommandModalProvider } from 'sales-frontend-design-system';
import { ClientSessionProvider } from 'sales-frontend-features';

import { MswInitializer } from '@/components/dev/msw-initializer';

interface IProvidersProps {
  /** 자식 */
  children: React.ReactNode;

  /** MSW 활성화 여부(기본 false) */
  enableMocking?: boolean;
}

export const Providers = ({ children, enableMocking = false }: IProvidersProps) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: false
          }
        }
      })
  );

  return (
    <MswInitializer isActive={enableMocking}>
      <QueryClientProvider client={queryClient}>
        <ClientSessionProvider>
          <CommandModalProvider />
          {children}
          <div id="ds-portal" />
        </ClientSessionProvider>
      </QueryClientProvider>
    </MswInitializer>
  );
};
