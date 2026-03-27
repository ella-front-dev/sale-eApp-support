// components/common/TextArea/TextArea.tsx
import { ComponentPropsWithRef, useEffect, useRef } from 'react';

import classNames from 'classnames/bind';

import styles from './text-area.module.scss';

const cx = classNames.bind(styles);

export interface TextAreaProps extends ComponentPropsWithRef<'textarea'> {
  error?: boolean;
  maxLength?: number;
  showCount?: boolean;
  autoResize?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export const TextArea = ({
  error,
  maxLength,
  autoResize,
  resize = 'vertical',
  showCount = false,
  className,
  disabled,
  readOnly,
  value,
  ref,
  ...props
}: TextAreaProps) => {
  const internalRef = useRef<HTMLTextAreaElement>(null);
  const currentLength = typeof value === 'string' ? value.length : 0;

  const adjustHeight = () => {
    const textarea = internalRef.current;
    if (autoResize && textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  // value가 변경될 때마다 높이 조정
  useEffect(() => {
    adjustHeight();
  }, [value, autoResize]);

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    if (autoResize) {
      e.currentTarget.style.height = 'auto';
      e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
    }
  };

  return (
    <div className={styles.wrapper}>
      <textarea
        ref={(node) => {
          // react-hook-form의 ref 연결
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
          // 내부 ref도 연결
          internalRef.current = node;
        }}
        onInput={(e) => {
          handleInput(e);
          props.onInput?.(e);
        }}
        className={cx(
          'textarea',
          {
            'textarea-error': error,
            'textarea-readonly': readOnly,
            'textarea-disabled': disabled,
            'textarea-auto-resize': autoResize,
            [`textarea-resize-${resize}`]: !autoResize
          },
          className
        )}
        readOnly={readOnly}
        disabled={disabled}
        maxLength={maxLength}
        value={value}
        aria-invalid={error}
        rows={1}
        {...props}
      />

      {showCount && maxLength && (
        <div className={styles.counter}>
          <span className={cx({ 'counter-error': currentLength > maxLength })}>{currentLength}</span>
          <span className={cx('counter-max')}>/{maxLength}</span>
        </div>
      )}
    </div>
  );
};
