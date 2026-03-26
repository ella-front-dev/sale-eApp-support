interface PaginationResponse {
  pageNum: number;
  pageSize: number;
  totalElements: number;
  pageNumbersToShow: number;
  totalPages: number;
  startPage: number;
  endPage: number;
  prevPage: number;
  nextPage: number;
  prev: boolean;
  next: boolean;
}

export interface ResponseDto<T> {
  isSuccess: boolean;
  data?: T;
  code?: string;
  message?: string;
  exceptionId?: string;
  pagination?: PaginationResponse;
}
