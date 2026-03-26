'use client';

import React, { ComponentPropsWithRef } from 'react';

import classNames from 'classnames/bind';
import styles from 'sales-frontend-design-system/layout/tablet-pc';

const cx = classNames.bind(styles);

/**
 * wrap > body-section > 하위에 들어가는 컨텐츠 영역입니다.
 */
export const Contents = ({
  title,
  children,
  className,
  ...props
}: { title?: string } & ComponentPropsWithRef<'main'>) => {
  return (
    <main id="main" className={cx('contents', 'd-flex', 'flex-col', className)} {...props}>
      {title && <h1 className="mb-title-medium text-body typo-title3">{title}</h1>}
      <div className="d-flex flex-col gap-card flex-1" style={{ minHeight: '0' }}>
        {children}
      </div>
    </main>
  );
};
