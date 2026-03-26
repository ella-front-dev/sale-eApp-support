import { createMockHandler } from '@/lib/mocks/createMockHandler';
import type { BizNaviInquiryListResponse, BizNaviInquiryRegisterResponse } from './dto';
import { BIZ_NAVI_INQUIRY_MOCK_LIST } from './mock.data';

const getInquiryListHandler = createMockHandler({
  method: 'get',
  path: '/api/biz-navi/inquiries',
  delayMs: 800,
  response: (req: any) => {
    const url = new URL(req.request.url);
    const customerName = url.searchParams.get('customerName') ?? '';
    const inquiryTitle = url.searchParams.get('inquiryTitle') ?? '';
    const sort = url.searchParams.get('sort') ?? 'recent';

    let list = [...BIZ_NAVI_INQUIRY_MOCK_LIST];

    if (customerName) {
      list = list.filter((item) => item.target.includes(customerName));
    }

    if (inquiryTitle) {
      list = list.filter((item) => item.title.includes(inquiryTitle));
    }

    if (sort === 'answered') {
      list = list.sort((a, b) => (a.status === '답변완료' ? -1 : 1));
    }

    const result: BizNaviInquiryListResponse = { list, total: list.length };

    return { isSuccess: true, data: result };
  },
});

const registerInquiryHandler = createMockHandler({
  method: 'post',
  path: '/api/biz-navi/inquiries',
  delayMs: 1000,
  response: () => {
    const result: BizNaviInquiryRegisterResponse = { id: String(Date.now()) };
    return { isSuccess: true, data: result };
  },
});

export const bizNaviMockHandlers = [getInquiryListHandler, registerInquiryHandler];
