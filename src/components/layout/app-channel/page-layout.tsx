import React, { ReactNode } from 'react';

import { AppChannelBottomBar } from './bottom-bar';
import { BodySection } from './body-section';
import { Contents } from './contents';

interface AppChannelPageLayoutProps {
  /** 페이지 타이틀 */
  pageTitle?: string;
  /** BottomBar 표시 여부 (기본값: true) */
  isBottomBar?: boolean;
  /** 커스텀 BottomBar (기본값: <AppChannelBottomBar />) */
  bottomBar?: ReactNode;
  children: ReactNode;
}

export const AppChannelPageLayout = ({
  pageTitle = '',
  isBottomBar = true,
  bottomBar = <AppChannelBottomBar />,
  children,
}: AppChannelPageLayoutProps) => {
  return (
    <>
      <BodySection>
        <Contents title={pageTitle}>{children}</Contents>
      </BodySection>
      {isBottomBar && bottomBar}
    </>
  );
};
