'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { CommandModalProvider } from 'sales-frontend-design-system';
import { ClientSessionProvider } from 'sales-frontend-features';

import { MswInitializer } from '@/components/dev/msw-initializer';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      enabled: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false
    }
  }
});

interface IProvidersProps {
  /** 자식 */
  children: React.ReactNode;

  /** MSW 활성화 여부(기본 false) */
  enableMocking?: boolean;
}

export const Providers = ({ children, enableMocking = false }: IProvidersProps) => {
  return (
    <MswInitializer isActive={enableMocking}>
      <QueryClientProvider client={queryClient}>
        <ClientSessionProvider>
          <CommandModalProvider />
          {children}
          <div id="ds-portal" />
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </ClientSessionProvider>
      </QueryClientProvider>
    </MswInitializer>
  );
};
