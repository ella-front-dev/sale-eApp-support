import { getDspApiBasePathFromEnvironment } from 'sales-frontend-utils';

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH;

export const API_BASE_URL = getDspApiBasePathFromEnvironment('dcm');

export const DIS_API_BASE_URL = getDspApiBasePathFromEnvironment('dis');
export const DEA_API_BASE_URL = getDspApiBasePathFromEnvironment('dea');

export const IMG_PREFIX = `${process.env.NEXT_PUBLIC_CDN_URL}/assets/image-resources`;

const CONTRACT_BASE_PATH = {
  GET: `${API_BASE_URL}/v1/get/contracts`,
  POST: `${API_BASE_URL}/v1/post/contracts`
};

const CUSTOMER_BASE_PATH = `${API_BASE_URL}/v1/get/customers`;

const SUPPORT_BASE_PATH = {
  // 신규추가
  POST: `${API_BASE_URL}/v1/post/support`
};

export const CONTRACT_LIST_API = {
  list: `${CONTRACT_BASE_PATH.GET}/list` // 계약목록조회
};

export const CONTRACT_RELATED_PERSON_API = {
  policyholder: `${CONTRACT_BASE_PATH.GET}/list/policyholder-info` // 계약목록조회 - 계약자정보조회
};

export const CONTRACT_DETAIL_API_BASE = {
  baseInfo: `${CONTRACT_BASE_PATH.GET}/detail/base-info`,
  rider: `${CONTRACT_BASE_PATH.GET}/detail/riders`,
  surrenderAndLoan: `${CONTRACT_BASE_PATH.GET}/detail/surrender-loans`,
  midtermWithdrawal: `${CONTRACT_BASE_PATH.GET}/detail/mid-term-withdraw`
} as const;

export const CONTRACT_DETAIL_API = {
  baseInfo: (encryptedPolicyNumber: string) => `${CONTRACT_DETAIL_API_BASE.baseInfo}/${encryptedPolicyNumber}`, // 계약상세조회 - 기본정보조회
  rider: (encryptedPolicyNumber: string) => `${CONTRACT_DETAIL_API_BASE.rider}/${encryptedPolicyNumber}`, // 계약상세조회 - 특약목록조회
  surrenderAndLoan: (encryptedPolicyNumber: string) =>
    `${CONTRACT_DETAIL_API_BASE.surrenderAndLoan}/${encryptedPolicyNumber}`, // 계약상세조회 - 해약/대출 조회
  midtermWithdrawal: (encryptedPolicyNumber: string) =>
    `${CONTRACT_DETAIL_API_BASE.midtermWithdrawal}/${encryptedPolicyNumber}` // 계약상세조회 - 중도인출조회
} as const;

export const CUSTOMER_SEARCH_API = {
  searchByName: `${CUSTOMER_BASE_PATH}/simple-searching` // 고객간편검색
};

export const CUSTOMER_INFORMATION_API = {
  notClaimInsuredAmount: `${CONTRACT_BASE_PATH.GET}/not-claim-insured-amount`, // 미청구보험금정보조회
  familyInfo: `${CUSTOMER_BASE_PATH}/family-info`, // 고객가족정보조회
  detailInfo: `${CUSTOMER_BASE_PATH}/common-info`, // 고객공통사항조회
  accountList: `${CONTRACT_BASE_PATH.GET}/account-information`, // 계좌정보조회
  receivableInsured: `${CUSTOMER_BASE_PATH}/receipt-possibility-insured` // 접수가능 피보험자 조회
};

export const CUSTOMER_CERTIFICATION_API = {
  identifyIssue: `${DIS_API_BASE_URL}/v1/post/certification/identify-issue`,
  identificationCardConfirm: `${API_BASE_URL}/v1/get/certifications/id/verification`, // 채널신분증진위확인결과 조회
  realNameConfirm: `${API_BASE_URL}/v1/post/certifications/real-name` // 개인고객실명인증처리
};

export const TOKEN_API = {
  token: `${API_BASE_URL}/v1/post/token`
};

export const CERTIFICATION_API = {
  certificationId: `${API_BASE_URL}/v1/post/certifications/id`, // 인증 ID 발급 요청
  necessaryInfo: `${API_BASE_URL}/v1/get/certifications/necessary-info`,
  identityInfo: `${API_BASE_URL}/v1/get/certifications/confirmation-id-yn` // 고객신원확인여부조회
};

export const IMAGE_RECEIPT_API = {
  imageReceipt: `${SUPPORT_BASE_PATH.POST}/image-receipt`, // 이미지접수취소등록 조회
  imageReceiptSpa: `${SUPPORT_BASE_PATH.POST}/image-receipt-spa`, // 이미지접수 조회/신청취소
  imageReceiptApplication: `${SUPPORT_BASE_PATH.POST}/image-receipt-application` // 이미지접수 신청서 발행
};

export const SUBSTITUTE_APPLICATION_API = {
  contractList: `${CONTRACT_BASE_PATH.GET}/channel-information`, // 채널공통계약내용조회
  insuranceKindChangeTarget: `${CONTRACT_BASE_PATH.GET}/insurance-kind-change/targets`, // 보험종류변경대상조회
  insuranceKindChangePossibility: `${CONTRACT_BASE_PATH.GET}/insurance-kind-change/possibility`, // 보험종류변경가능여부조회
  insuranceKindChangeSave: `${CONTRACT_BASE_PATH.POST}/insurance-kind-change`, // 보험종류변경가접수저장 (신규추가)
  recipientInfo: `${CONTRACT_BASE_PATH.GET}/recipient-info`, // 수령인 정보조회 (분할/만기보험금)
  substituteDemandantTarget: `${CONTRACT_BASE_PATH.GET}/designated-agent/targets`, // 지정대리청구인신청대상조회
  substituteDemandantPossibility: `${CONTRACT_BASE_PATH.GET}/designated-agent/possibility`, // 지정대리청구인가능여부조회
  substituteDemandantSave: `${CONTRACT_BASE_PATH.POST}/designated-agent` // 지정대리청구인신청가접수저장실행 (신규추가)
};

export const AUTOMATED_PAYMENT_API = {
  saveApplication: `${CONTRACT_BASE_PATH.POST}/automated-payment`, // 자동납입신청정보저장
  cancelApplication: `${CONTRACT_BASE_PATH.POST}/automated-payment/cancel`, // 자동납입신청정보취소
  applicationOrganizationList: `${CONTRACT_BASE_PATH.GET}/automated-payment/organization`, // 자동납입신청기관목록조회
  collectionMethodChange: `${CONTRACT_BASE_PATH.GET}/automated-payment/retrieval-method`, // 자동납입수금방법변경FP조회
  applicationInfo: `${CONTRACT_BASE_PATH.GET}/automated-payment/information` // 자동납입신청정보조회
};
