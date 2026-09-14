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

import type { BizNaviInquiryItem, BizNaviInquiryListParams, SortType } from '@/api/biz-navi/dto';
import type { Dayjs } from 'dayjs';

import { useBizNaviInquiryList } from '@/api/biz-navi/use-query';
import { SelectField } from '@/components/ui/select-field';


const cx = classNames.bind(styles);
const { TextField } = FormField;

interface BizNaviProps {
  isRegisterOpen?: boolean;
  onRegisterClose?: () => void;
}

type SearchConditions = Omit<BizNaviInquiryListParams, 'sort'>;

const EMPTY_CONDITIONS: SearchConditions = { customerName: '', inquiryTitle: '' };

export default function BizNavi({ isRegisterOpen = false, onRegisterClose }: BizNaviProps) {
  const [sort, setSort] = useState<SortType>('recent');

  // 입력 중인 조회 조건. 조회 버튼을 눌러야 searchConditions 로 반영되어 요청이 나간다
  const [customerSearch, setCustomerSearch] = useState('');
  const [inquiryTitle, setInquiryTitle] = useState('');
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [searchConditions, setSearchConditions] = useState<SearchConditions>(EMPTY_CONDITIONS);

  const [selectedItem, setSelectedItem] = useState<BizNaviInquiryItem | null>(null);

  // 고객검색·기간 입력은 값을 내부 상태로 들고 있어, 초기화할 때 key 를 바꿔 다시 마운트한다
  const [conditionInputKey, setConditionInputKey] = useState(0);

  const { isOpen: isDetailOpen, openModal: openDetailModal, closeModal: closeDetailModal } = useModalState();

  const { data, isFetching, refetch } = useBizNaviInquiryList({ ...searchConditions, sort });

  const list = data?.list ?? [];

  const handleSearch = () => {
    const nextConditions: SearchConditions = {
      customerName: customerSearch.trim(),
      inquiryTitle: inquiryTitle.trim(),
      startDate: startDate?.format('YYYY.MM.DD'),
      endDate: endDate?.format('YYYY.MM.DD')
    };

    // 조건이 그대로면 쿼리 키도 그대로라 자동으로 다시 불리지 않으므로 직접 다시 조회한다
    if (JSON.stringify(nextConditions) === JSON.stringify(searchConditions)) {
      refetch();

      return;
    }

    setSearchConditions(nextConditions);
  };

  // 입력한 조건만 비운다. 목록은 다음 조회 전까지 그대로 둔다
  const handleReset = () => {
    setCustomerSearch('');
    setInquiryTitle('');
    setStartDate(null);
    setEndDate(null);
    setConditionInputKey((key) => key + 1);
  };

  const handleItemClick = (item: BizNaviInquiryItem) => {
    setSelectedItem(item);
    openDetailModal();
  };

  const handleDetailClose = () => {
    closeDetailModal();
    setSelectedItem(null);
  };

  // CustomerSearch 는 입력값을 밖으로 내보내지 않는다. inputProps 의 onChange 를 넘기면 내부 검색 동작을
  // 덮어쓰게 되므로, 내부에서 쓰지 않는 onInput 으로 입력한 이름만 따로 받는다.
  const handleCustomerInput = (e: React.FormEvent<HTMLInputElement>) => {
    setCustomerSearch(e.currentTarget.value);
  };

  const handleSelectCustomer = (customer: { customerName?: string }) => {
    setCustomerSearch(customer.customerName ?? '');
  };

  const handleCustomerClear = () => {
    setCustomerSearch('');
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      handleSearch();
    }
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
                key={conditionInputKey}
                onSelectCustomer={handleSelectCustomer}
                onSearchClear={handleCustomerClear}
                inputProps={{
                  // disabled: isSearchDisabledByPolicyNumber,
                  placeholder: '이름',
                  size: 'small',
                  className: cx('customer-search-tablet-width'),
                  onInput: handleCustomerInput
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
                key={conditionInputKey}
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
                onKeyDown={handleTitleKeyDown}
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
