import { ComponentProps } from 'react';

import classNames from 'classnames/bind';

import styles from './divider.module.scss';

const cx = classNames.bind(styles);

interface DividerProps extends ComponentProps<'div'> {
  margin: string;
}

export const Divider = ({ margin, className }: DividerProps) => {
  return <div role="none" className={cx('divider', `mt-${margin}`, `mb-${margin}`, className)} />;
};
