'use client';

import { Button, useModalState } from 'sales-frontend-design-system';

import { AppChannelBottomBar } from '@/components/layout/app-channel/bottom-bar';
import { AppChannelPageLayout } from '@/components/layout/app-channel/page-layout';
import BizNavi from '@/page-components/app-channel/biz-navi';

export default function BizNaviPage() {
  const { isOpen: isRegisterOpen, openModal: openRegisterModal, closeModal: closeRegisterModal } = useModalState();

  return (
    <AppChannelPageLayout
      pageTitle="BIZ-NAVI 기관 조회 및 입력"
      bottomBar={
        <AppChannelBottomBar
          rightContent={
            <Button variant="primary" appearance="filled" size="medium" width="full" onClick={openRegisterModal}>
              신규질의 등록
            </Button>
          }
        />
      }
    >
      <BizNavi isRegisterOpen={isRegisterOpen} onRegisterClose={closeRegisterModal} />
    </AppChannelPageLayout>
  );
}
