'use client';

import React, { ReactNode } from 'react';

import classNames from 'classnames/bind';
import { BottomBar } from 'sales-frontend-design-system';

import styles from './tablet-pc-layout.module.scss';

const cx = classNames.bind(styles);

interface AppChannelBottomBarProps {
  /** 좌측 버튼 영역 */
  leftContent?: ReactNode;
  /** 우측 버튼 영역 */
  rightContent?: ReactNode;
}

export const AppChannelBottomBar = ({ leftContent, rightContent }: AppChannelBottomBarProps) => {
  return (
    <BottomBar.Desktop
      sticky
      leftContent={
        leftContent ? (
          <div className={cx('button-wrapper')}>{leftContent}</div>
        ) : undefined
      }
      rightContent={
        rightContent ? (
          <div className={cx('button-wrapper')}>{rightContent}</div>
        ) : undefined
      }
    />
  );
};
