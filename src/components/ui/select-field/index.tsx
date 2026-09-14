import { useEffect, useState } from 'react';

import classNames from 'classnames/bind';
import { FormField, useDropDown } from 'sales-frontend-design-system';

import styles from './select-field.module.scss';

const cx = classNames.bind(styles);

export interface SelectOption {
  label: string;
  value: string;
  /** 옵션별 인라인 스타일 (휴일 하이라이트 등) */
  style?: React.CSSProperties;
  originalData?: Record<string, unknown>;
}

export interface ChoiceFieldProps extends Omit<FormField.ComboBoxItemProps, 'defaultValue'> {
  rootProps?: FormField.ComboBoxBoxProps;
  onValueChange?: (value: string) => void;
  options?: SelectOption[];
  defaultValue?: string;
  dropdownWidth?: number;
  /** 'table-header': 테이블 헤더 내 드롭다운 스타일 적용 */
  variant?: 'default' | 'table-header';
}

export const SelectField = ({
  rootProps,
  disabled,
  error,
  readOnly,
  size,
  onValueChange,
  defaultValue,
  options,
  dropdownWidth,
  variant = 'default',
  ...props
}: ChoiceFieldProps) => {
  const [isSelectedOption, setIsSelectedOption] = useState<SelectOption | undefined>(undefined);
  const isInteractive = !readOnly && !disabled;
  const isTableHeader = variant === 'table-header';

  const { triggerRef, setIsOpen, isOpen, DropDown } = useDropDown<HTMLInputElement>({
    spacing: 4,
    width: dropdownWidth,
  });

  const handleClickItem = (option: SelectOption) => {
    if (!isInteractive) {
return;
}
    setIsOpen(false);
    setIsSelectedOption(option);
    onValueChange?.(option.value);
  };

  useEffect(() => {
    if (!defaultValue) {
      setIsSelectedOption(undefined);

      return;
    }
    if (options) {
      setIsSelectedOption(options.find((item) => item.value === defaultValue));
    }
  }, [defaultValue, options]);

  useEffect(() => {
    const mainElement = document.querySelector('#main') as HTMLElement;
    if (!mainElement) {
return;
}
    mainElement.style.overflow = isOpen ? 'hidden' : 'auto';
  }, [isOpen]);

  return (
    <>
      <FormField.FieldControl size={size} readOnly={readOnly} disabled={disabled} error={error}>
        <FormField.ComboBox
          rootProps={{
            role: 'combobox',
            'aria-expanded': isOpen,
            'aria-haspopup': 'listbox',
            onClick: () => {
              if (!isInteractive) {
return;
}
              setIsOpen((prev) => !prev);
            },
            ...rootProps
          }}
          ref={triggerRef}
          value={isSelectedOption?.label ?? ''}
          icon="arrow"
          placeholder={isTableHeader ? undefined : '선택하세요.'}
          isSelected={isOpen}
          error={error}
          {...props}
        />
      </FormField.FieldControl>
      <DropDown tabIndex={-1}>
        <FormField.ComboList.Root hover size="medium">
          <FormField.ComboList.List className={isTableHeader ? cx('table-header-list') : ''}>
            {options?.map((item, idx) => (
              <FormField.ComboList.Item
                key={`${item.value}-${idx}`}
                value={item.value}
                isSelected={item.value === isSelectedOption?.value}
                onClick={() => handleClickItem(item)}
                className={isTableHeader ? cx('table-header-list-item') : ''}
                style={item.style}
              >
                {item.label}
              </FormField.ComboList.Item>
            ))}
          </FormField.ComboList.List>
        </FormField.ComboList.Root>
      </DropDown>
    </>
  );
};