'use client';

import { useState } from 'react';

import classNames from 'classnames/bind';
import { CustomerSearch } from 'sales-frontend-components';
import { Button, FormField, Modal } from 'sales-frontend-design-system';

import styles from './inquiryRegisterModal.module.scss';

import { useBizNaviRegisterInquiry } from '@/api/biz-navi/use-query';
import { Divider } from '@/components/ui/divider';
import { TextArea } from '@/components/ui/field/text-area';




const cx = classNames.bind(styles);
const { TextField } = FormField;

interface InquiryRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_FORM = {
  customerName: '',
  residentNumberFront: '',
  residentNumberBack: '',
  inquiryTitle: '',
  content: ''
};

export default function InquiryRegisterModal({ isOpen, onClose }: InquiryRegisterModalProps) {
  const [form, setForm] = useState(INITIAL_FORM);
  const { mutate: register, isPending } = useBizNaviRegisterInquiry();

  const handleChange =
    (field: keyof typeof INITIAL_FORM) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  // CustomerSearch 는 입력값을 밖으로 내보내지 않는다. inputProps 의 onChange 를 넘기면 내부 검색 동작을
  // 덮어쓰게 되므로, 내부에서 쓰지 않는 onInput 으로 입력한 이름만 따로 받는다.
  const handleCustomerInput = (e: React.FormEvent<HTMLInputElement>) => {
    const customerName = e.currentTarget.value;
    setForm((prev) => ({ ...prev, customerName }));
  };

  // TODO: 고객 선택 시 주민번호 등 나머지 정보 세팅
  const handleSelectCustomer = (customer: { customerName?: string }) => {
    setForm((prev) => ({ ...prev, customerName: customer.customerName ?? prev.customerName }));
  };

  const handleCustomerClear = () => {
    setForm((prev) => ({ ...prev, customerName: '' }));
  };

  // [필수] 질의 정보가 비어 있으면 등록하지 않는다
  const isRequiredFilled = form.inquiryTitle.trim() !== '' && form.content.trim() !== '';

  const handleSubmit = () => {
    if (!isRequiredFilled) {
      return;
    }

    register(
      {
        customerName: form.customerName,
        inquiryTitle: form.inquiryTitle,
        content: form.content
      },
      {
        onSuccess: () => {
          setForm(INITIAL_FORM);
          onClose();
        }
      }
    );
  };

  const handleClose = () => {
    setForm(INITIAL_FORM);
    onClose();
  };

  return (
    <Modal
      modalId="biz-navi-inquiry-register"
      isOpen={isOpen}
      onClose={handleClose}
      modalSize="full-screen"
      closeOnBackdropClick
      headerProps={{
        headerTitle: 'BIZ-NAVI 신규 질의 등록',
        showCloseButton: true
      }}
      bodyProps={{
        children: (
          <div className={cx('register-body')}>
            {/* ── 고객 정보 섹션 ── */}
            <div className={cx('register-customer-section')}>
              <div className={cx('register-field')}>
                <label className={cx('register-label')}>고객검색</label>
                <CustomerSearch
                  onSelectCustomer={handleSelectCustomer}
                  onSearchClear={handleCustomerClear}
                  inputProps={{
                    placeholder: '이름',
                    size: 'small',
                    onInput: handleCustomerInput
                  }}
                  inputBoxProps={{ clearable: false, className: 'w-full' }}
                />
              </div>

              <div className={cx('register-field')}>
                <label className={cx('register-label')}>주민등록번호</label>
                <div className={cx('register-resident-number')}>
                  <TextField
                    placeholder="앞 6자리"
                    value={form.residentNumberFront}
                    onChange={handleChange('residentNumberFront')}
                    rootProps={{
                      className: 'w-full'
                    }}
                    maxLength={6}
                    readOnly
                    size="small"
                  />
                  <span className={cx('register-resident-dash')}>-</span>
                  <TextField
                    placeholder="뒤 7자리"
                    value={form.residentNumberBack}
                    onChange={handleChange('residentNumberBack')}
                    rootProps={{
                      className: 'w-full'
                    }}
                    maxLength={7}
                    readOnly
                    type="password"
                    size="small"
                  />
                </div>
              </div>
            </div>

            <Divider margin="divider-xlarge" />

            {/* ── [필수] 질의 정보 섹션 ── */}
            <div className={cx('register-inquiry-section')}>
              <div className="typo-title5">
                <span className="text-primary">[필수]</span>
                <span className="text-body_1">질의 정보</span>
              </div>
              <div className={cx('register-content')}>
                <div className={cx('register-field')}>
                  <label className={cx('register-label')}>질의제목</label>
                  <TextField
                    rootProps={{
                      className: 'w-full',
                      clearable: true,
                      onClear: () => setForm((prev) => ({ ...prev, inquiryTitle: '' }))
                    }}
                    placeholder="제목 입력"
                    size="small"
                    value={form.inquiryTitle}
                    onChange={handleChange('inquiryTitle')}
                  />
                </div>

                <div className={cx('register-field')}>
                  <label className={cx('register-label')}>질의내용</label>
                  <TextArea
                    className={cx('register-textarea')}
                    placeholder="내용 입력"
                    value={form.content}
                    onChange={handleChange('content')}
                    rows={10}
                  />
                </div>
              </div>
            </div>
          </div>
        )
      }}
      footerProps={{
        align: 'horizontal',
        children: (
          <Button
            variant="primary"
            appearance="filled"
            size="large"
            onClick={handleSubmit}
            disabled={isPending || !isRequiredFilled}
            className="w-full"
          >
            {isPending ? '등록 중...' : '질의 등록'}
          </Button>
        )
      }}
    />
  );
}
