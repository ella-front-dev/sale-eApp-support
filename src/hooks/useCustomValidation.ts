import { useCallback } from 'react';
import { UseFormSetError, FieldPath, FieldValues } from 'react-hook-form';

// 커스텀 검증 훅 (RHF rules 활용)
export function useCustomValidation<T extends FieldValues>() {

  // 단순 빈값 체크 함수 (RHF rules에서 사용)
  const validateRequired = useCallback((value: unknown, message = '필수 입력 항목입니다') => {
    if (!value || (typeof value === 'string' && value.trim().length === 0)) {
      return message;
    }
    return true;
  }, []);

  // 코드 패턴 검증 함수 (RHF rules에서 사용)
  const validateCodePattern = useCallback((value: string) => {
    if (!value) return true; // 빈값은 required에서 처리
    if (!/^[A-Z0-9_]+$/.test(value)) {
      return '대문자, 숫자, 언더스코어만 사용 가능합니다';
    }
    return true;
  }, []);

  // 날짜 범위 검증 함수
  const validateDateRange = useCallback((startDate: Date | string, endDate: Date | string) => {
    if (!startDate || !endDate) return true; // 빈값은 required에서 처리
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) {
      return '종료일은 시작일보다 늦어야 합니다';
    }
    return true;
  }, []);

  // 간단한 필수값 검증 함수
  const validateNestedFields = useCallback((
    data: Record<string, unknown>,
    setError: UseFormSetError<T>
  ): boolean => {
    let hasErrors = false;
    
    // 빈값 체크 헬퍼
    const checkRequired = (value: unknown, fieldPath: string, fieldName: string) => {
      if (!value || (typeof value === 'string' && value.trim().length === 0)) {
        setError(fieldPath as FieldPath<T>, {
          type: 'required',
          message: `${fieldName}을(를) 입력해주세요`
        });
        hasErrors = true;
      }
    };
    
    // 기본 필드 체크
    if (data.title !== undefined) {
      checkRequired(data.title, 'title', '제목');
    }
    
    return !hasErrors;
  }, []);



  return {
    validateRequired,
    validateCodePattern,
    validateDateRange,
    validateNestedFields
  };
}

// RHF rules 템플릿 (간략화된 버전)
export const rhfRules = {
  // 기본 필수값
  required: {
    required: '필수 입력 항목입니다'
  },

  // 제목 (상세 검증)
  title: {
    required: '제목을 입력해주세요',
    minLength: { value: 3, message: '최소 3글자 이상 입력해주세요' },
    maxLength: { value: 100, message: '최대 100글자까지 입력 가능합니다' },
    pattern: { 
      value: /^[가-힣a-zA-Z0-9\s]+$/, 
      message: '한글, 영문, 숫자만 입력 가능합니다' 
    }
  },

  // 코드 패턴 (대문자, 숫자, 언더스코어)
  code: {
    required: '코드를 입력해주세요',
    pattern: { 
      value: /^[A-Z0-9_]+$/, 
      message: '대문자, 숫자, 언더스코어만 사용 가능합니다' 
    }
  },

  // 날짜 필수값
  date: {
    required: '날짜를 선택해주세요'
  },

  // 이름/내용 필드
  name: {
    required: '이름을 입력해주세요',
    minLength: { value: 2, message: '최소 2글자 이상 입력해주세요' },
    maxLength: { value: 50, message: '최대 50글자까지 입력 가능합니다' }
  },

  // 내용 필드
  content: {
    required: '내용을 입력해주세요',
    maxLength: { value: 200, message: '최대 200글자까지 입력 가능합니다' }
  }
};

// 동적 규칙 생성기
export const createCustomRules = () => ({
  // 필수값만 체크
  requiredOnly: (message?: string) => ({
    required: message || '필수 입력 항목입니다'
  }),

  // 코드 중복 체크 포함
  codeWithDuplication: (duplicateCheckFn: (value: string) => string | true) => ({
    required: '코드를 입력해주세요',
    pattern: { 
      value: /^[A-Z0-9_]+$/, 
      message: '대문자, 숫자, 언더스코어만 사용 가능합니다' 
    },
    validate: duplicateCheckFn
  }),

  // 커스텀 검증 포함
  withCustomValidate: (customFn: (value: unknown) => string | true, otherRules?: Record<string, unknown>) => ({
    ...otherRules,
    validate: customFn
  })
});

// 사용 예시:
/*
// 1. 기본 사용법 (control 필수)
const form = useForm<FormData>();
const { validateNestedFields } = useCustomValidation(form.control);

// 2. Controller에서 RHF rules 직접 사용
<Controller
  name="title"
  control={control}
  rules={rhfRules.title}
  render={({ field, fieldState }) => (
    <TextField
      {...field}
      error={!!fieldState.error}
      helperText={fieldState.error?.message}
    />
  )}
/>

// 3. 기존 useCodeDuplicationCheck 함수들도 사용 가능
const { checkSubAnswerCodeDuplication } = useCodeDuplicationCheck(control);

<Controller
  name="code"
  rules={{
    required: '코드를 입력해주세요',
    pattern: { value: /^[A-Z0-9_]+$/, message: '패턴 에러' },
    validate: (value) => checkSubAnswerCodeDuplication(value, groupIndex, componentIndex, answerIndex, subAnswerIndex) || true
  }}
  render={({ field, fieldState }) => (
    <TextField
      {...field}
      error={!!fieldState.error}
      helperText={fieldState.error?.message}
    />
  )}
/>

// 4. 제출시 전체 필수값 + 중복 체크 (useCodeDuplicationCheck 활용)
const onSubmit = (data: FormData) => {
  const isValid = validateNestedFields(data, form.setError); // 필수값 + 중복 체크 모두 수행
  if (isValid) {
    console.log('검증 성공!', data);
  }
};

// 5. 중복 체크만 따로 수행하려면 (useCodeDuplicationCheck 직접 사용)
const { getDuplicationReport } = useCodeDuplicationCheck(control);
const checkDuplicatesOnly = () => {
  const report = getDuplicationReport();
  return !report.hasDuplicates;
};
*/