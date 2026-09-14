'use client';

import { forwardRef } from 'react';

import classNames from 'classnames/bind';

import styles from './valuePropositionSection.module.scss';

const cx = classNames.bind(styles);

const ValuePropositionSection = forwardRef<HTMLElement>((_, ref) => {
  return (
    <section ref={ref} className={cx('value-section')}>
      <div className={cx('value-inner')}>
        <p className={cx('value-text')}>
          끊임 없이 이어지는 업무 흐름<br />
          <strong className={cx('value-highlight')}>영업지원 앱 (예시)</strong>과<br />
         함께라면 영업이 훨씬 더 쉬워질 거에요.
        </p>
      </div>
    </section>
  );
});

ValuePropositionSection.displayName = 'ValuePropositionSection';

export default ValuePropositionSection;
