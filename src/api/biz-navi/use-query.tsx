import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { BizNaviInquiryListParams, BizNaviInquiryRegisterRequest } from './dto';
import { getInquiryList, createInquiry } from './service';

export const BIZ_NAVI_QUERY_KEYS = {
  all: ['biz-navi'] as const,
  inquiryList: (params: BizNaviInquiryListParams) => ['biz-navi', 'inquiries', params] as const
};

export function useBizNaviInquiryList(params: BizNaviInquiryListParams, enabled = true) {
  return useQuery({
    queryKey: BIZ_NAVI_QUERY_KEYS.inquiryList(params),
    queryFn: () => getInquiryList(params),
    enabled
  });
}

export function useBizNaviRegisterInquiry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: BizNaviInquiryRegisterRequest) => createInquiry(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BIZ_NAVI_QUERY_KEYS.all });
    }
  });
}
