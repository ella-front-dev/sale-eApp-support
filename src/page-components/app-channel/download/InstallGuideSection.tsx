'use client';

import classNames from 'classnames/bind';

import styles from './installGuideSection.module.scss';
import { Button } from 'sales-frontend-design-system';
import { IconFileDownload, IconSavefolder, IconPhoneVerification } from '../../../assets/icons';

const cx = classNames.bind(styles);

const INSTALL_STEPS = [
  {
    step: 'STEP 1',
    title: 'MDM 앱 설치',
    bullets: [
      { idx: '1', text: '영업지원 앱 소개 페이지에서 MDM 앱을 먼저 다운로드해 주세요.' },
      {
        idx: '2',
        text: (
          <>
            다운로드 완료 후 나타나는 설치 안내 순서에 따라 <b>MDM 앱</b>을 설치해 주세요.
          </>
        )
      }
    ],
    warning: '※개인정보보호 및 보안사고 예방을 위해 반드시 MDM 앱을 설치해 주세요.',
    image: <IconSavefolder />, // TODO: add actual image URL
    download: {
      url: '', // TODO: add actual MDM app download URL
      filename: 'MDM 앱부터 설치',
      className: ''
    }
  },
  {
    step: 'STEP 2',
    title: '영업지원 앱 설치',
    bullets: [
      { idx: '3', text: 'MDM 앱을 설치하여 인증을 완료하고 최신 버전의 영업지원 앱을 설치해 주세요.' },
      { idx: '4', text: '영업지원 앱 실행 후 인증 완료하고 간편 비밀번호 6자리 등록 후 로그인하세요.' }
    ],
    warning: '※ 간편비밀번호 등록 후 생체인증(지문 또는 Face ID)도 추가로 설정할 수 있어요',
    image: <IconPhoneVerification />, // TODO: add actual image URL
    download: {
      url: '', // TODO: add actual MDM app download URL
      filename: '영업지원 앱만 설치',
      className: ''
    }
  }
];

export default function InstallGuideSection() {
  return (
    <section className={cx('install')}>
      <div className={cx('install-inner')}>
        <div className={cx('install-header')}>
          <span className={cx('install-title')}>영업지원 앱 설치 방법</span>
          {/* TODO: replace href with actual manual download URL */}
          <Button
            variant="secondary"
            appearance="filled"
            size="medium"
            width="fit-content"
            onClick={() => {}}
            className={cx('install-manual-btn')}
          >
            영업지원 앱 설치 매뉴얼
            <span className={cx('install-manual-icon')}>
              <IconFileDownload />
            </span>
          </Button>
        </div>

        <div className={cx('install-steps')}>
          {INSTALL_STEPS.map(({ step, title, bullets, warning, download, image }) => (
            <div key={step} className={cx('install-step')}>
              <div className={cx('step-header')}>
                <div className={cx('step-icon-wrap')}>
                  <div className={cx('step-icon-placeholder')}>{image}</div>
                </div>
                <div>
                  <span className={cx('step-label')}>{step}</span>
                  <span className={cx('step-title')}>{title}</span>
                </div>
              </div>
              <div>
                <ul className={cx('step-bullets')}>
                  {bullets.map((bullet, idx) => (
                    <li key={idx} className={cx('step-bullet')}>
                      {bullet.idx === '' ? '' : <span className={cx('bullet-number')}>{bullet.idx}</span>}
                      <span>{bullet.text}</span>
                    </li>
                  ))}
                </ul>
                <p className={cx('step-warning')}>{warning}</p>
              </div>
              <Button
                variant="neutral"
                appearance="filled"
                size="small"
                width="fit-content"
                onClick={() => window.open(download.url, '_blank')}
                className={cx('step-download-btn', download.className)}
              >
                <span>{download.filename}</span>
                <span className={cx('step-download-icon')}>
                  <IconFileDownload />
                </span>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
