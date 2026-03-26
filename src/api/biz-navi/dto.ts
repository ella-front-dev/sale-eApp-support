// ─────────────────────────────────────────────
// 공통 타입
// ─────────────────────────────────────────────
export type InquiryStatus = '답변완료' | '답변미완료';
export type SortType = 'recent' | 'answered';

// ─────────────────────────────────────────────
// 목록 조회
// ─────────────────────────────────────────────
export interface BizNaviInquiryListParams {
  customerName?: string;
  inquiryTitle?: string;
  startDate?: string;
  endDate?: string;
  sort?: SortType;
}

export interface BizNaviInquiryItem {
  id: string;
  title: string;
  status: InquiryStatus;
  inquiryDate: string;
  target: string;
  answerer: string;
  content: string;
  customerName: string;
  residentNumberFront: string;
  residentNumberBack: string;
  reviewer: string;
  answerContent: string;
}

export interface BizNaviInquiryListResponse {
  list: BizNaviInquiryItem[];
  total: number;
}

// ─────────────────────────────────────────────
// 신규 등록
// ─────────────────────────────────────────────
export interface BizNaviInquiryRegisterRequest {
  customerName: string;
  inquiryTitle: string;
  content: string;
}

export interface BizNaviInquiryRegisterResponse {
  id: string;
}
