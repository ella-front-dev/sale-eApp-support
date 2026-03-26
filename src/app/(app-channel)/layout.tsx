import type { Metadata } from 'next';
import classNames from 'classnames/bind';
import styles from 'sales-frontend-design-system/layout/tablet-pc';
import { Providers } from '@/components/context/providers';
import 'sales-frontend-design-system/core-styles';
import { DebugToolDsp } from '@/components/dev/debug-tool';
import { DspGtmIframe } from '@/components/dev/dsp-gtm-iframe';
import { APP_ENV, MSW_ENABLED } from '@/constants/environments';
import { AppChannelHeader } from '@/components/layout/app-channel/header';

const cx = classNames.bind(styles);

export const metadata: Metadata = {
  title: '영업지원 앱(예시)',
  description: '설명',
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
    url: false
  }
};

export default function AppChannelLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={APP_ENV === 'prd' ? '' : 'stg'}>
        <DspGtmIframe />
        <Providers enableMocking={MSW_ENABLED}>
          <div className={cx('wrap', 'tablet-pc')} id="wrap" style={{ transition: 'transform 0.25s ease-out' }}>
            <AppChannelHeader />
            {children}
          </div>
        </Providers>
        <DebugToolDsp />
      </body>
    </html>
  );
}
