'use client';

import { useState } from 'react';
import { Button, FormField, Modal } from 'sales-frontend-design-system';
import { Divider } from '@/components/ui/divider';
import classNames from 'classnames/bind';
import type { BizNaviInquiryItem } from '@/api/biz-navi/dto';
import styles from './inquiryDetailModal.module.scss';

const cx = classNames.bind(styles);
const { TextField } = FormField;

interface InquiryDetailModalProps {
  item: BizNaviInquiryItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function InquiryDetailModal({ item, isOpen, onClose }: InquiryDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [reviewer, setReviewer] = useState('');
  const [answerContent, setAnswerContent] = useState('');

  if (!item) return null;

  const handleEditStart = () => {
    setEditTitle(item.title);
    setEditContent(item.content);
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  const handleDelete = () => {
    // TODO: 질의 삭제 처리
    onClose();
  };

  const handleReRegister = () => {
    // TODO: 질의 재등록 처리
    onClose();
  };

  return (
    <Modal
      modalId="biz-navi-inquiry-detail"
      isOpen={isOpen}
      onClose={onClose}
      modalSize="full-screen"
      closeOnBackdropClick
      headerProps={{
        headerTitle: 'BIZ-NAVI 심사 결과',
        showCloseButton: true
      }}
      bodyProps={{
        children: (
          <div>
            {/* ── 고객 정보 ── */}
            <div className={cx('detail-customer-section')}>
              <div className={cx('detail-field-row')}>
                <label className={cx('detail-label')}>고객명</label>
                <TextField value={item.customerName} readOnly size="small" />
              </div>

              <div className={cx('detail-field-row')}>
                <label className={cx('detail-label')}>주민등록번호</label>
                <div className={cx('detail-resident-number')}>
                  <TextField value={item.residentNumberFront} readOnly size="small" />
                  <span className={cx('detail-resident-dash')}>-</span>
                  <TextField value={item.residentNumberBack} readOnly type="password" size="small" />
                </div>
              </div>
            </div>

            <Divider margin="divider-xlarge" />

            {/* ── [필수] 질의 정보 ── */}
            <div className={cx('detail-section')}>
              <div className={cx('detail-section-header')}>
                <div className={cx('detail-section-header-left')}>
                  <span className={cx('detail-required-badge')}>[필수]</span>
                  <span className={cx('detail-section-title')}>질의 정보</span>
                </div>
                {!isEditing ? (
                  <Button variant="neutral" appearance="outline" size="small" onClick={handleEditStart}>
                    질의 수정
                  </Button>
                ) : (
                  <Button variant="neutral" appearance="outline" size="small" onClick={handleEditCancel}>
                    수정 취소
                  </Button>
                )}
              </div>

              <div className={cx('detail-field-row')}>
                <label className={cx('detail-label')}>질의제목</label>
                <TextField
                  value={isEditing ? editTitle : item.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditTitle(e.target.value)}
                  readOnly={!isEditing}
                  placeholder="제목 입력"
                />
              </div>

              <div className={cx('detail-field-row')}>
                <label className={cx('detail-label')}>질의내용</label>
                <textarea
                  className={cx('detail-textarea')}
                  value={isEditing ? editContent : item.content}
                  onChange={(e) => setEditContent(e.target.value)}
                  readOnly={!isEditing}
                  placeholder="내용 입력"
                  rows={6}
                />
              </div>
            </div>

            <Divider margin="divider-xlarge" />

            {/* ── 답변 정보 ── */}
            <div className={cx('detail-section')}>
              <div className={cx('detail-section-header')}>
                <span className={cx('detail-section-title')}>답변 정보</span>
              </div>

              <div className={cx('detail-field-row')}>
                <label className={cx('detail-label')}>심사자</label>
                <TextField
                  value={reviewer || item.reviewer}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReviewer(e.target.value)}
                  placeholder="이름"
                  size="small"
                />
              </div>

              <div className={cx('detail-field-row')}>
                <label className={cx('detail-label')}>답변내용</label>
                <textarea
                  className={cx('detail-textarea')}
                  value={answerContent || item.answerContent}
                  onChange={(e) => setAnswerContent(e.target.value)}
                  placeholder="답변 내용"
                  rows={6}
                />
              </div>
            </div>
          </div>
        )
      }}
      footerProps={{
        align: 'horizontal',
        children: (
          <div className={cx('detail-footer')}>
            <Button
              variant="neutral"
              appearance="filled"
              size="large"
              onClick={handleDelete}
              className={cx('detail-footer-button')}
            >
              질의 삭제
            </Button>
            <Button
              variant="secondary"
              appearance="filled"
              size="large"
              onClick={handleReRegister}
              className={cx('detail-footer-button', 'detail-reregister-button')}
            >
              질의 재등록
            </Button>
          </div>
        )
      }}
    />
  );
}
