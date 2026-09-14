import type { Metadata } from 'next';

import 'sales-frontend-design-system/layout/responsive';
import 'sales-frontend-design-system/core-styles';
import { Providers } from '@/components/context/providers';
import { DebugToolDsp } from '@/components/dev/debug-tool';
import { DspGtmIframe } from '@/components/dev/dsp-gtm-iframe';
import { APP_ENV, MSW_ENABLED } from '@/constants/environments';

export const metadata: Metadata = {
  title: '영업지원 앱 (Demo)',
  description: '언제 어디서나 영업지원 앱 데모를 만나보세요.',
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
    url: false
  }
};

export default function DownloadLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={APP_ENV === 'prd' ? '' : 'stg'}>
        <DspGtmIframe />
        <Providers enableMocking={MSW_ENABLED}>{children}</Providers>
        <DebugToolDsp />
      </body>
    </html>
  );
}
