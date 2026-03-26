import { ComponentProps } from 'react';

import styles from './divider.module.scss';

interface IDividerProps extends ComponentProps<'div'> {
  margin: string;
}

export const Divider = ({ margin, className }: IDividerProps) => {
  return <div className={`${styles.divider} mt-${margin} mb-${margin}  ${className}`} />;
};
