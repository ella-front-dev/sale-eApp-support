'use client';

import { useRef } from 'react';

import classNames from 'classnames/bind';

import styles from './download.module.scss';
import FeatureSection from './FeatureSection';
import FooterSection from './FooterSection';
import HeroSection from './HeroSection';
import InstallGuideSection from './InstallGuideSection';
import ValuePropositionSection from './ValuePropositionSection';

const cx = classNames.bind(styles);

export default function DownloadPage() {
  const valuePropositionRef = useRef<HTMLElement>(null);

  const handleScrollToNext = () => {
    valuePropositionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={cx('download-page')}>
      <HeroSection onScrollDown={handleScrollToNext} />
      <ValuePropositionSection ref={valuePropositionRef} />
      <FeatureSection
        tag="고객조회"
        headline={'검색 한 번으로\n고객의 모든 정보까지'}
        description="고객명, 증권번호, 주민번호 하나로 계약부터 청약까지 모든 정보를 한눈에 조회할 수 있어요. 불필요한 화면 이동 없이 필요한 정보를 바로 확인해 보세요."
        reverse={false}
        lightBackground
      />
      <FeatureSection
        tag="가입설계"
        headline={'AI로 만드는\n나만의 맞춤 플랜'}
        description="원하는 보험료 수준과 고객 특성에 맞는 맞춤형 플랜부터 나의 설계 패턴을 분석해서 만든 플랜까지! AI와의 대화로 나만의 설계를 만들어보세요."
        reverse
        lightBackground={false}
      />
      <FeatureSection
        tag="전자청약"
        headline={'디바이스 구분없는\n전자청약 이어하기'}
        description="업계 최초로 PC·스마트폰·태블릿 어디서든 접속할 수 있어 청약을 끊김 없이 진행하고 관리할 수 있어요."
        reverse={false}
        lightBackground
      />
      <InstallGuideSection />
      <FooterSection />
    </div>
  );
}
