'use client';

import React, { ComponentPropsWithRef } from 'react';

import classNames from 'classnames/bind';
import styles from 'sales-frontend-design-system/layout/tablet-pc';

const cx = classNames.bind(styles);

/**
 * wrap > 하위에 들어가는 바디 섹션 영역입니다.
 */
export const BodySection = ({ children, className, ...props }: ComponentPropsWithRef<'div'>) => {
  return (
    <div className={cx('body-section', className)} {...props} style={{ backgroundColor: '#f5f5f5' }}>
      <>{children}</>
    </div>
  );
};
