'use client';

import React, { useState } from 'react';
import {
  List,
  ListItem,
  Tag,
  Button,
  Modal,
  useModalState,
  FormField,
  DatePickerRangeRenew,
} from 'sales-frontend-design-system';
import { SelectField } from '@/components/ui/select-field';
import classNames from 'classnames/bind';
import type { Dayjs } from 'dayjs';
import styles from './bizNavi.module.scss';

const cx = classNames.bind(styles);

const { TextField } = FormField;

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type SortType = 'recent' | 'answered';

interface InquiryItem {
  id: string;
  title: string;
  status: '답변완료' | '답변미완료';
  inquiryDate: string;
  target: string;
  answerer: string;
  content: string;
}

// ─────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────
const MOCK_DATA: InquiryItem[] = [
  { id: '1',  title: '기타 문의 심사 요청드립니다',         status: '답변완료',  inquiryDate: '26.03.18', target: '김의리', answerer: '이생명', content: '기타 문의에 대한 심사 요청을 드립니다. 확인 부탁드립니다.' },
  { id: '2',  title: '심사 요청',                           status: '답변완료',  inquiryDate: '26.03.18', target: '김의리', answerer: '이생명', content: '청약 심사 요청 드립니다.' },
  { id: '3',  title: '기타 문의 심사 요청드립니다',         status: '답변미완료', inquiryDate: '26.03.18', target: '김의리', answerer: '이생명', content: '기타 문의에 대한 심사 요청을 드립니다. 확인 부탁드립니다.' },
  { id: '4',  title: '인수 요청 거절 사유 확인 부탁드립니다', status: '답변미완료', inquiryDate: '26.03.18', target: '김의리', answerer: '이생명', content: '인수 요청이 거절된 사유를 확인하고 싶습니다.' },
  { id: '5',  title: '심사 요청',                           status: '답변완료',  inquiryDate: '26.03.18', target: '김의리', answerer: '이생명', content: '청약 심사 요청 드립니다.' },
  { id: '6',  title: '인수 요청 거절 사유 확인 부탁드립니다', status: '답변미완료', inquiryDate: '26.03.18', target: '김의리', answerer: '이생명', content: '인수 요청이 거절된 사유를 확인하고 싶습니다.' },
  { id: '7',  title: '심사 요청',                           status: '답변완료',  inquiryDate: '26.03.18', target: '김의리', answerer: '이생명', content: '청약 심사 요청 드립니다.' },
  { id: '8',  title: '보험료 납입 변경 문의',               status: '답변완료',  inquiryDate: '26.03.17', target: '박민준', answerer: '최담당', content: '보험료 납입 방법 변경을 요청합니다.' },
  { id: '9',  title: '계약 서류 재발급 요청',               status: '답변미완료', inquiryDate: '26.03.17', target: '이수현', answerer: '김담당', content: '계약서를 분실하여 재발급을 요청합니다.' },
  { id: '10', title: '앱 로그인 오류 문의',                 status: '답변완료',  inquiryDate: '26.03.16', target: '정유진', answerer: '이담당', content: '앱 로그인 시 오류가 지속 발생합니다.' },
  { id: '11', title: '특약 해지 가능 여부 문의',            status: '답변미완료', inquiryDate: '26.03.16', target: '조현우', answerer: '박담당', content: '일부 특약 해지 가능 여부를 문의합니다.' },
  { id: '12', title: '청약 4단계 화면 오류 보고',           status: '답변완료',  inquiryDate: '26.03.15', target: '강지훈', answerer: '최담당', content: '청약 4단계에서 화면이 멈추는 현상이 발생합니다.' },
  { id: '13', title: '보험증권 이메일 재발송 요청',          status: '답변완료',  inquiryDate: '26.03.15', target: '윤서아', answerer: '김담당', content: '보험증권 이메일 재발송을 요청합니다.' },
  { id: '14', title: '수익자 변경 절차 문의',               status: '답변미완료', inquiryDate: '26.03.14', target: '한예린', answerer: '이담당', content: '수익자 변경 절차를 문의합니다.' },
  { id: '15', title: '환급금 조회 오류 문의',               status: '답변완료',  inquiryDate: '26.03.14', target: '오준혁', answerer: '박담당', content: '환급금 조회 화면에서 오류가 발생합니다.' },
];

// ─────────────────────────────────────────────
// Detail Info Row
// ─────────────────────────────────────────────
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      <span style={{ fontSize: '12px', color: '#888' }}>{label}</span>
      <span style={{ fontSize: '14px', fontWeight: 500 }}>{value}</span>
    </div>
  );
}

// ─────────────────────────────────────────────
// Search Icon SVG
// ─────────────────────────────────────────────
function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: '#999' }}>
      <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 10L13.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
export default function BizNavi() {
  const [sort, setSort] = useState<SortType>('recent');
  const [customerSearch, setCustomerSearch] = useState('');
  const [inquiryTitle, setInquiryTitle] = useState('');
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [selectedItem, setSelectedItem] = useState<InquiryItem | null>(null);

  const { isOpen, openModal, closeModal } = useModalState();

  const handleItemClick = (item: InquiryItem) => {
    setSelectedItem(item);
    openModal();
  };

  const handleCloseModal = () => {
    closeModal();
    setSelectedItem(null);
  };

  const handleReset = () => {
    setCustomerSearch('');
    setInquiryTitle('');
    setStartDate(null);
    setEndDate(null);
  };

  const sortedList = [...MOCK_DATA].sort((a, b) => {
    if (sort === 'answered') {
      return a.status === '답변완료' ? -1 : 1;
    }
    return 0;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', paddingBottom: '72px' }}>

      {/* ── 페이지 타이틀 ── */}
      <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: '#1a1a1a' }}>
        BIZ-NAVI 기관 조회 및 입력
      </h2>

      {/* ── 조회 조건 섹션 ── */}
      <div
        style={{
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          padding: '20px',
          backgroundColor: '#fff',
        }}
      >
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' }}>

          {/* 고객검색 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '12px', color: '#666', fontWeight: 500 }}>고객검색</label>
            <TextField
              placeholder="이름"
              value={customerSearch}
              onChange={(e) => setCustomerSearch(e.target.value)}
              rootProps={{ endElement: <SearchIcon /> }}
            />
          </div>

          {/* 문의일자 (날짜 범위) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '12px', color: '#666', fontWeight: 500 }}>문의일자</label>
            <DatePickerRangeRenew
              startDateProps={{
                onValueChange: (v: Dayjs) => setStartDate(v),
                inputFormat: 'YYYY.MM.DD',
              }}
              endDateProps={{
                onValueChange: (v: Dayjs) => setEndDate(v),
                inputFormat: 'YYYY.MM.DD',
              }}
            />
          </div>

          {/* 문의제목 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '12px', color: '#666', fontWeight: 500 }}>문의제목</label>
            <TextField
              placeholder="문의제목"
              value={inquiryTitle}
              onChange={(e) => setInquiryTitle(e.target.value)}
            />
          </div>

          {/* 버튼 */}
          <Button variant="neutral" appearance="outline" size="medium" onClick={handleReset}>
            초기화
          </Button>
          <Button variant="primary" appearance="filled" size="medium">
            조회
          </Button>
        </div>
      </div>

      {/* ── 리스트 섹션 ── */}
      <div
        style={{
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: '#fff',
        }}
      >
        {/* 리스트 헤더 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderBottom: '1px solid #e0e0e0',
          }}
        >
          <span style={{ fontSize: '13px', color: '#666' }}>
            총{' '}
            <strong style={{ color: '#1976d2' }}>{sortedList.length}</strong>건
          </span>

          <SelectField
            defaultValue={sort}
            onValueChange={(v) => setSort(v as SortType)}
            size="small"
            variant="table-header"
            className={cx('dropdown-button')}
            options={[
              { label: '최근등록순', value: 'recent' },
              { label: '답변완료순', value: 'answered' },
            ]}
          />
        </div>

        {/* List */}
        {sortedList.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#aaa', fontSize: '14px' }}>
            조회된 문의 내역이 없습니다.
          </div>
        ) : (
          <List arrow>
            {sortedList.map((item) => (
              <ListItem
                key={item.id}
                arrow
                onClick={() => handleItemClick(item)}
                style={{ cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', minWidth: 0 }}>
                  {/* 상태 태그 */}
                  <Tag
                    variant={item.status === '답변완료' ? 'positive' : 'negative'}
                    shape="rounded"
                  >
                    {item.status}
                  </Tag>

                  {/* 제목 */}
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      flex: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      color: '#1a1a1a',
                    }}
                  >
                    {item.title}
                  </span>

                  {/* 메타 정보 */}
                  <div style={{ display: 'flex', gap: '20px', flexShrink: 0, alignItems: 'center' }}>
                    <span style={{ fontSize: '12px' }}>
                      <span style={{ color: '#888' }}>문의일자</span>
                      {' '}
                      <span style={{ color: '#333', fontWeight: 500 }}>{item.inquiryDate}</span>
                    </span>
                    <span style={{ fontSize: '12px' }}>
                      <span style={{ color: '#888' }}>대상자/답변자</span>
                      {' '}
                      <span style={{ color: '#333', fontWeight: 500 }}>{item.target}/{item.answerer}</span>
                    </span>
                  </div>
                </div>
              </ListItem>
            ))}
          </List>
        )}
      </div>

      {/* ── 신규 질의 등록 FAB ── */}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 100 }}>
        <Button variant="neutral" appearance="filled" size="medium">
          신규 질의 등록
        </Button>
      </div>

      {/* ── 상세 팝업 ── */}
      {selectedItem && (
        <Modal
          modalId="biz-navi-inquiry-detail"
          isOpen={isOpen}
          onClose={handleCloseModal}
          modalSize="medium"
          closeOnBackdropClick
          headerProps={{
            headerTitle: '문의 상세',
            showCloseButton: true,
          }}
          bodyProps={{
            children: (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* 상태 + 제목 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Tag
                    variant={selectedItem.status === '답변완료' ? 'positive' : 'negative'}
                    shape="rounded"
                  >
                    {selectedItem.status}
                  </Tag>
                  <span style={{ fontSize: '16px', fontWeight: 700 }}>
                    {selectedItem.title}
                  </span>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #e0e0e0', margin: 0 }} />

                {/* 메타 정보 그리드 */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <DetailRow label="문의일자" value={selectedItem.inquiryDate} />
                  <DetailRow label="대상자" value={selectedItem.target} />
                  <DetailRow label="답변자" value={selectedItem.answerer} />
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #e0e0e0', margin: 0 }} />

                {/* 문의 내용 */}
                <div>
                  <p style={{ fontSize: '12px', color: '#888', marginBottom: '6px' }}>문의 내용</p>
                  <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#333' }}>
                    {selectedItem.content}
                  </p>
                </div>
              </div>
            ),
          }}
          footerProps={{
            align: 'horizontal',
            children: (
              <Button
                variant="neutral"
                appearance="outline"
                size="medium"
                onClick={handleCloseModal}
              >
                닫기
              </Button>
            ),
          }}
        />
      )}
    </div>
  );
}
