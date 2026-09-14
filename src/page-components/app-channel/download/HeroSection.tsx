'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';

import classNames from 'classnames/bind';
import { Button, IconButton } from 'sales-frontend-design-system';

import styles from './heroSection.module.scss';

import { IconAndroid, IconIOS, IconDownArrow } from '@/assets/icons';
import mainBg from '@/assets/img/download_main_bg.png';
import mainImgPhone from '@/assets/img/download_main_img_phone.png';
import mainImgTablet from '@/assets/img/download_main_img_tablet.png';
import qrImg from '@/assets/img/download_qr.png';

const cx = classNames.bind(styles);

const DOWNLOAD_OS = {
  android: {
    link: '#',
    label: 'Android 용'
  },
  ios: {
    link: '#',
    label: 'iOS 용'
  }
};

type OsType = 'android' | 'ios' | 'other';

interface HeroSectionProps {
  onScrollDown: () => void;
}

export default function HeroSection({ onScrollDown }: HeroSectionProps) {
  const [os, setOs] = useState<OsType>('other');

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    if (/android/.test(ua)) {
setOs('android');
} else if (/iphone|ipad|ipod/.test(ua)) {
setOs('ios');
}
  }, []);

  return (
    <section className={cx('hero')}>
      <Image src={mainBg} alt="" className={cx('hero-bg')} fill priority aria-hidden="true" />

      <div className={cx('hero-inner')}>
        <div className={cx('hero-text')}>
          <span className={cx('hero-headline')}>
            언제 어디서나
            <br />
            영업지원 앱 (예시)
          </span>
          <p className={cx('hero-subtext')}>
            더 쉽고 새로워진
            <br />
            영업지원 앱 데모를 만나보세요.
          </p>

          {os !== 'other' && (
            <div className={cx('hero-download-btns')}>
              <Button
                variant="primary"
                appearance="filled"
                size="medium"
                onClick={() => (window.location.href = DOWNLOAD_OS[os].link)}
                aria-label={`${DOWNLOAD_OS[os].label} 앱 다운로드`}
                className={cx('hero-download-btn')}
              >
                {os === 'android' ? <IconAndroid /> : <IconIOS />}
                <span className="ml-xsmall">{DOWNLOAD_OS[os].label}</span>
              </Button>
            </div>
          )}

          <div className={cx('hero-qr-area')}>
            <div className={cx('hero-qr-box')}>
              <Image src={qrImg} alt="앱 다운로드 QR 코드" className={cx('hero-qr-img')} width={80} height={80} />
            </div>
            <p className={cx('hero-qr-label')}>
              스마트폰 또는 태블릿
              <br />
              카메라로 QR인식
            </p>
          </div>
        </div>

        <div className={cx('hero-mockup')}>
          <div className={cx('hero-mockup-stack')}>
            <Image src={mainImgTablet} alt="" className={cx('hero-mockup-tablet')} aria-hidden="true" priority />
            <Image src={mainImgPhone} alt="영업지원 앱 화면" className={cx('hero-mockup-phone')} priority />
          </div>
        </div>
      </div>

      <div className={cx('hero-button-area')}>
        <button className={cx('hero-scroll-arrow')} onClick={onScrollDown} aria-label="다음 섹션으로 이동">
          <IconDownArrow />
        </button>
      </div>
    </section>
  );
}
