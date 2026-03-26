'use client';

import React from 'react';

import { Bridge } from 'sales-frontend-bridge';
import { Button, Header, Icon } from 'sales-frontend-design-system';

import { ICON_PATHS, ICON_SIZE, NavigationIcon } from './icons';

const MenuButton = () => (
  <Button
    appearance="outline"
    size="xsmall"
    variant="neutral"
    aria-label="전체메뉴"
    key="menu"
    onClick={async () => await Bridge.native.showMenu()}
    icon={<Icon name="menu" src={ICON_PATHS.MENU} alt="메뉴" width={ICON_SIZE.SMALL} height={ICON_SIZE.SMALL} />}
  >
    전체메뉴
  </Button>
);

interface AppChannelHeaderProps {
  title?: string;
}

export const AppChannelHeader = ({ title = '' }: AppChannelHeaderProps) => {
  const leftIcons = [<NavigationIcon key="home" type="home" onClick={async () => await Bridge.native.goHome()} />];
  const rightIcons = [<MenuButton key="menu" />];

  return <Header sticky leftContent={leftIcons} rightContent={rightIcons} title={title} />;
};
