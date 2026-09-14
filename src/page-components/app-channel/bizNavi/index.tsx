'use client';

import { useState } from 'react';

import classNames from 'classnames/bind';
import { CustomerSearch } from 'sales-frontend-components';
import {
  List,
  ListItem,
  Tag,
  Button,
  FormField,
  DatePickerRangeRenew,
  useModalState
} from 'sales-frontend-design-system';


import styles from './bizNavi.module.scss';
import InquiryDetailModal from './InquiryDetailModal';
import InquiryRegisterModal from './InquiryRegisterModal';

import type { BizNaviInquiryItem, SortType } from '@/api/biz-navi/dto';
import type { Dayjs } from 'dayjs';

import { useBizNaviInquiryList } from '@/api/biz-navi/use-query';
import { SelectField } from '@/components/ui/select-field';


const cx = classNames.bind(styles);
const { TextField } = FormField;

interface BizNaviProps {
  isRegisterOpen?: boolean;
  onRegisterClose?: () => void;
}

export default function BizNavi({ isRegisterOpen = false, onRegisterClose }: BizNaviProps) {
  const [sort, setSort] = useState<SortType>('recent');
  const [customerSearch, setCustomerSearch] = useState('');
  const [inquiryTitle, setInquiryTitle] = useState('');
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [selectedItem, setSelectedItem] = useState<BizNaviInquiryItem | null>(null);
  const [queryEnabled, setQueryEnabled] = useState(true);

  const [customerSearchKey, setCustomerSearchKey] = useState(0);

  const { isOpen: isDetailOpen, openModal: openDetailModal, closeModal: closeDetailModal } = useModalState();

  const { data, isFetching, refetch } = useBizNaviInquiryList(
    {
      customerName: customerSearch,
      inquiryTitle,
      startDate: startDate?.format('YYYY.MM.DD'),
      endDate: endDate?.format('YYYY.MM.DD'),
      sort
    },
    queryEnabled
  );

  const list = data?.list ?? [];

  const handleSearch = () => {
    setQueryEnabled(true);
    refetch();
  };

  const handleReset = () => {
    setCustomerSearch('');
    setInquiryTitle('');
    setStartDate(null);
    setEndDate(null);
  };

  const handleItemClick = (item: BizNaviInquiryItem) => {
    setSelectedItem(item);
    openDetailModal();
  };

  const handleDetailClose = () => {
    closeDetailModal();
    setSelectedItem(null);
  };

  //   const handleSelectCustomer = (cust: CustomerDto) => {
  //   setSelectedCustomer(cust);
  //   setFoundCustomerId(cust.customerId ?? null);
  // };

  const handleSelectCustomer = () => {
    // setSelectedCustomer(cust);
    // setFoundCustomerId(cust.customerId ?? null);
  };

  return (
    <div className={cx('biznavi-wrapper')}>
      {/* ── 조회 조건 섹션 ── */}
      <div className={cx('search-section')}>
        <div className={cx('search-row')}>
          {/* 고객검색 */}
          <FormField.FieldControl>
            <div className={cx('field-group')}>
              <FormField.Label className={cx('field-group-label')}>고객검색</FormField.Label>
              <CustomerSearch
                key={customerSearchKey}
                onSelectCustomer={handleSelectCustomer}
                // onSearchClear={handleCustomerSearchClear}
                inputProps={{
                  // disabled: isSearchDisabledByPolicyNumber,
                  placeholder: '이름',
                  size: 'small',
                  className: cx('customer-search-tablet-width')
                }}
                dropDownClassName={cx('search-dropdown-wrapper')}
                inputBoxProps={{
                  className: cx('customer-search-input-box-tablet-width'),
                  clearable: false
                }}
              />
            </div>
          </FormField.FieldControl>
          {/* 문의일자 */}
          <FormField.FieldControl>
            <div className={cx('field-group')}>
              <FormField.Label className={cx('field-group-label')}>문의일자</FormField.Label>
              <DatePickerRangeRenew
                startDateProps={{
                  inputProps: {
                    comboBoxItemProps: {
                      size: 'small'
                    }
                  },
                  onValueChange: (v: Dayjs) => setStartDate(v),
                  inputFormat: 'YYYY.MM.DD'
                }}
                endDateProps={{
                  inputProps: {
                    comboBoxItemProps: {
                      size: 'small'
                    }
                  },
                  onValueChange: (v: Dayjs) => setEndDate(v),
                  inputFormat: 'YYYY.MM.DD'
                }}
              />
            </div>
          </FormField.FieldControl>

          {/* 문의제목 */}
          <FormField.FieldControl>
            <div className={cx('field-group')}>
              <FormField.Label className={cx('field-group-label')}>문의제목</FormField.Label>
              <TextField
                placeholder="문의제목"
                size="small"
                value={inquiryTitle}
                onChange={(e) => setInquiryTitle(e.target.value)}
              />
            </div>
          </FormField.FieldControl>
          <div className={cx('button-group')}>
            {/* 버튼 */}
            <Button variant="neutral" appearance="outline" size="medium" onClick={handleReset}>
              초기화
            </Button>
            <Button variant="primary" appearance="filled" size="medium" onClick={handleSearch}>
              조회
            </Button>
          </div>
        </div>
      </div>

      {/* ── 리스트 섹션 ── */}
      <div className={cx('list-section')}>
        {/* 리스트 헤더 */}
        <div className={cx('list-header')}>
          <span className={cx('list-total')}>
            총 <strong className={cx('list-total-count')}>{data?.total ?? 0}</strong>건
          </span>

          <SelectField
            defaultValue={sort}
            onValueChange={(v) => setSort(v as SortType)}
            size="small"
            variant="table-header"
            className={cx('dropdown-button')}
            options={[
              { label: '최근등록순', value: 'recent' },
              { label: '답변완료순', value: 'answered' }
            ]}
          />
        </div>

        {/* List */}
        <div className={cx('list-scroll-area')}>
          {isFetching ? (
            <div className={cx('list-empty')}>조회 중...</div>
          ) : list.length === 0 ? (
            <div className={cx('list-empty')}>조회된 문의 내역이 없습니다.</div>
          ) : (
            <List arrow className={cx('list-content')}>
              {list.map((item) => (
                <ListItem key={item.id} arrow onClick={() => handleItemClick(item)} className={cx('list-item-content')}>
                  {/* 상태 태그 */}
                  <Tag variant={item.status === '답변완료' ? 'positive' : 'negative'} shape="rounded">
                    {item.status}
                  </Tag>

                  {/* 제목 */}
                  <span className={cx('item-title')}>{item.title}</span>

                  {/* 메타 정보 */}
                  <div className={cx('item-meta')}>
                    <span className={cx('item-meta-text')}>
                      <span className={cx('item-meta-label')}>문의일자</span>
                      <span className={cx('item-meta-value')}>{item.inquiryDate}</span>
                    </span>
                    <span className={cx('item-meta-text')}>
                      <span className={cx('item-meta-label')}>대상자/답변자</span>
                      <span className={cx('item-meta-value')}>
                        {item.target}/{item.answerer}
                      </span>
                    </span>
                  </div>
                </ListItem>
              ))}
            </List>
          )}
        </div>
      </div>

      {/* ── 상세 팝업 ── */}
      <InquiryDetailModal item={selectedItem} isOpen={isDetailOpen} onClose={handleDetailClose} />

      {/* ── 신규 질의 등록 팝업 ── */}
      <InquiryRegisterModal isOpen={isRegisterOpen} onClose={onRegisterClose ?? (() => {})} />
    </div>
  );
}
