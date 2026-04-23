'use client';

import classNames from 'classnames/bind';

import { IMG_PREFIX } from '@/constants/path';
import styles from './footerSection.module.scss';

const cx = classNames.bind(styles);

export default function FooterSection() {
  return (
    <footer className={cx('footer')}>
      <div className={cx('footer-inner')}>
        <div className={cx('footer-top')}>
          <img
            src={`${IMG_PREFIX}/logo/company_logo_pc.svg`}
            alt="영업지원 앱(예시)"
            className={cx('footer-logo')}
          />
          <p className={cx('footer-tagline')}>
            영업의 또 다른 시작, 지금 바로 경험해보세요.
          </p>
        </div>

        <div className={cx('footer-info')}>
          <div className={cx('footer-meta')}>
            <span>[예시] 샘플 주식회사</span>
            <span>대표이사 : 홍길동</span>
            <span>대표전화 1588-0000</span>
            <span>IT 헬프데스크 1588-0000</span>
          </div>
          <p >© Sample Corp. (Demo) All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
