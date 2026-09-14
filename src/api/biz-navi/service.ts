import { AxiosRequestConfig } from 'axios';
import { HttpClientAxios } from 'sales-frontend-api';

import type {
  BizNaviInquiryListParams,
  BizNaviInquiryListResponse,
  BizNaviInquiryRegisterRequest,
  BizNaviInquiryRegisterResponse
} from './dto';
import type { ResponseDto } from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
const BASE = '/biz-navi/inquiries';

/**
 * 문의 목록 조회
 * R: getInquiryList
 */
export const getInquiryList = async (
  params: BizNaviInquiryListParams,
  axiosConfig: AxiosRequestConfig = {}
): Promise<BizNaviInquiryListResponse> => {
  const httpClient = new HttpClientAxios({ baseURL: API_BASE_URL, ...axiosConfig });
  const res = await httpClient.api.get<ResponseDto<BizNaviInquiryListResponse>>(BASE, { params });

  return res.data.data!;
};

/**
 * 문의 신규 등록
 * C: createInquiry
 */
export const createInquiry = async (
  body: BizNaviInquiryRegisterRequest,
  axiosConfig: AxiosRequestConfig = {}
): Promise<BizNaviInquiryRegisterResponse> => {
  const httpClient = new HttpClientAxios({ baseURL: API_BASE_URL, ...axiosConfig });
  const res = await httpClient.api.post<ResponseDto<BizNaviInquiryRegisterResponse>>(BASE, { ...body });

  return res.data.data!;
};
