'use client';

import classNames from 'classnames/bind';

import styles from './featureSection.module.scss';

const cx = classNames.bind(styles);

interface FeatureSectionProps {
  tag: string;
  headline: string;
  description: string;
  reverse?: boolean;
  lightBackground?: boolean;
}

export default function FeatureSection({
  tag,
  headline,
  description,
  reverse = false,
  lightBackground = true
}: FeatureSectionProps) {
  const lines = headline.split('\n');

  return (
    <section className={cx('feature', { 'feature--reverse': reverse, 'feature--white': !lightBackground })}>
      <div className={cx('feature-inner')}>
        <div className={cx('feature-content')}>
          <span className={cx('feature-tag')}>{tag}</span>
          <span className={cx('feature-headline')}>
            {lines.map((line, i) => (
              <span key={i}>
                {line}
                {i < lines.length - 1 && <br />}
              </span>
            ))}
          </span>
          <p className={cx('feature-description')}>{description}</p>
        </div>

        <div className={cx('feature-image-wrap')}>
          <div className={cx('feature-image-placeholder')} />
        </div>
      </div>
    </section>
  );
}
