import { AxiosRequestConfig } from 'axios';
import { HttpClientAxios } from 'sales-frontend-api';

import type {
  BizNaviInquiryListParams,
  BizNaviInquiryListResponse,
  BizNaviInquiryRegisterRequest,
  BizNaviInquiryRegisterResponse
} from './dto';

import { type ResponseDto } from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
const BASE = '/biz-navi/inquiries';

/**
 * 공통 응답 래퍼에서 data 를 꺼낸다.
 * data 는 optional 이므로, 실패했거나 비어있으면 undefined 를 흘려보내지 않고 에러로 끊는다.
 */
const unwrap = <T>(res: { data: ResponseDto<T> }): T => {
  const { isSuccess, data, message, code } = res.data;

  if (!isSuccess || data === undefined) {
    throw new Error(message ?? `요청에 실패했습니다${code ? ` (${code})` : ''}`);
  }

  return data;
};

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

  return unwrap(res);
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

  return unwrap(res);
};
