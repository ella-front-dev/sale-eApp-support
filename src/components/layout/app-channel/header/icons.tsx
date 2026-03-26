import { Icon } from 'sales-frontend-design-system';

import { IMG_PREFIX } from '@/constants/path';

export const ICON_PATHS = {
  HOME: `${IMG_PREFIX}/icons/main-ui/home.svg`,
  BACK: `${IMG_PREFIX}/icons/main-ui/back.svg`,
  MENU: `${IMG_PREFIX}/icons/main-ui/menu-line.svg`,
} as const;

export const ICON_SIZE = {
  SMALL: 20,
  MEDIUM: 28,
} as const;

type NavigationIconType = 'home' | 'back';
type IconConfig = {
  src: string;
  alt: string;
};

interface NavigationIconProps {
  type: NavigationIconType;
  onClick: () => void;
}

export const NavigationIcon = ({ type, onClick }: NavigationIconProps) => {
  const iconConfig: Record<NavigationIconType, IconConfig> = {
    home: { src: ICON_PATHS.HOME, alt: '홈으로 이동' },
    back: { src: ICON_PATHS.BACK, alt: '뒤로 이동' },
  };

  const config = iconConfig[type];

  return (
    <Icon
      name={type}
      category="icons"
      src={config.src}
      alt={config.alt}
      width={ICON_SIZE.MEDIUM}
      height={ICON_SIZE.MEDIUM}
      onClick={onClick}
    />
  );
};
