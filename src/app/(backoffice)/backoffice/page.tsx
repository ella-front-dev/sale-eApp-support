'use client';

import React, { useCallback, useEffect } from 'react';

import {
  Add as AddIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Box,
  Alert
} from '@mui/material';
import { useForm, useFieldArray, Controller } from 'react-hook-form';

import FormTextField from '@/components/FormTextField';
import { useCodeDuplicationCheck } from '@/hooks/useCodeDuplicationCheck';
import { usePagePermissions } from '@/hooks/usePagePermissions';
import GroupSection from '@/page-components/backoffice/GroupSection';
import { FormData } from '@/types/form';
import { PageMode, MODE_TITLES, MODE_BUTTON_TEXTS } from '@/types/pageMode';

// 🎯 Virtuoso 가상화 테스트용 대량 데이터 생성
// 그룹 10개, 컴포넌트 100개, 답변 3개 (Virtuoso 성능 확인용)
const generateMockData = (): FormData => {
  const groups = [];
  let componentIdCounter = 1;
  let answerIdCounter = 1;

  // 그룹 카테고리들
  const groupCategories = [
    "고객 서비스", "제품 품질", "가격 만족도", "배송 서비스", "웹사이트 사용성",
    "브랜드 이미지", "기술 지원", "결제 시스템", "상품 다양성", "추천 의향"
  ];

  // 컴포넌트 타입들
  const componentTypes = [
    "만족도 평가", "중요도 평가", "선호도 조사", "사용 빈도", "개선점 파악"
  ];

  // 답변 옵션들 (성능을 위해 3개로 제한)
  const answerOptions = [
    "매우 만족", "보통", "불만족"
  ];

  for (let groupIndex = 0; groupIndex < 10; groupIndex++) {
    const componentsPerGroup = 10; // 그룹당 10개 컴포넌트 (총 100개)
    const components = [];

    for (let compIndex = 0; compIndex < componentsPerGroup; compIndex++) {
      const answers = [];
      const answersPerComponent = 3; // 각 컴포넌트마다 3개 답변 (성능 최적화)

      for (let answerIndex = 0; answerIndex < answersPerComponent; answerIndex++) {
        // 하위답변은 없음 (성능 최적화)
        answers.push({
          id: String(answerIdCounter++),
          content: answerOptions[answerIndex % answerOptions.length],
          subAnswers: [] // 빈 배열로 성능 최적화
        });
      }

      components.push({
        id: String(componentIdCounter++),
        seq: compIndex + 1,
        code: `COMP_${String(componentIdCounter - 1).padStart(3, '0')}`,
        name: `${componentTypes[compIndex % componentTypes.length]} ${compIndex + 1}`,
        answers
      });
    }

    groups.push({
      id: String(groupIndex + 1),
      seq: groupIndex + 1,
      code: `GROUP_${String(groupIndex + 1).padStart(3, '0')}`,
      name: `${groupCategories[groupIndex]} 평가`,
      startDate: new Date('2024-01-01'),
      endDate: '2099-12-31T23:59:59',
      components
    });
  }

  return {
    title: "🚀 Virtuoso 성능 테스트 데이터 (그룹 10개, 컴포넌트 100개) - 가상화 활성화!",
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    groups
  };
};

// 생성된 대량 데이터
const mockEditData: FormData = generateMockData();

interface BackofficePageProps {
  mode?: PageMode;
  formId?: string;
}

export default function BackofficePage({ 
  mode: initialMode = 'register', 
  formId 
}: BackofficePageProps = {}) {
  // 테스트용 모드 상태 (실제로는 URL 파라미터로 관리)
  const [mode, setMode] = React.useState<PageMode>(initialMode);
  // URL 파라미터로 모드 결정 (실제 구현시)
  // const searchParams = useSearchParams();
  // const mode = (searchParams.get('mode') as PageMode) || 'register';
  // const formId = searchParams.get('id');

  // 초기 데이터 저장 (기존 데이터 판별용)
  const [initialData, setInitialData] = React.useState<FormData | null>(null);

  const permissions = usePagePermissions(mode);
  const pageTitle = MODE_TITLES[mode];
  const buttonText = MODE_BUTTON_TEXTS[mode];
  
  const { control, handleSubmit, formState: { errors, isValid }, watch, reset, trigger, getValues, setValue } = useForm<FormData>({
    // resolver: zodResolver(formSchema), // 성능 테스트를 위해 일시 비활성화
    defaultValues: {
      title: '',
      startDate: undefined,
      endDate: undefined,
      groups: []
    }
  });

  // API에서 데이터 로드 (수정/업데이트 모드일 때)
  useEffect(() => {
    if ((mode === 'edit' || mode === 'update') && formId) {
      // 🎯 전체 데이터 한번에 로드 방식
      // 실제로는 API 호출: fetchFormData(formId).then(data => reset(data))
      // 시뮬레이션: 1초 후에 전체 데이터 로드
      const timer = setTimeout(() => {
        console.log(`📡 ${mode} 모드 - API에서 전체 데이터 로드 중...`);
        reset(mockEditData); // 전체 데이터를 React Hook Form에 한번에 로드
        console.log(`✅ ${mode} 모드 - 전체 데이터 로드 완료! (총 ${mockEditData.groups.length}개 그룹)`);
        console.log(`💡 UI 청킹: 처음 5개 그룹만 표시, 스크롤 시 점진적 렌더링`);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [mode, formId, reset]);

  // 🚀 성능 최적화: React Hook Form - useFieldArray로 동적 필드 관리
  const { fields: groups, append: appendGroup, remove: removeGroup } = useFieldArray({
    control,
    name: 'groups'
  });

  // 가상화 제거됨 - 동적 높이 계산 함수 주석 처리
  /*
  const calculateGroupHeight = React.useCallback((index: number) => {
    // 전체 함수 내용 주석 처리
  }, [groups]);
  */

  // 🚀 성능 최적화: 그룹 관리 콜백 메모이제이션
  const handleRemoveGroup = useCallback((groupIndex: number) => {
    removeGroup(groupIndex);
  }, [removeGroup]);

  // reset이 호출될 때 로깅만 수행
  useEffect(() => {
    if (groups.length > 0) {
      console.log(`🔄 reset 감지, 전체 그룹 로드: ${groups.length}개 그룹`);
    }
  }, [groups.length]);

  // 중복 체크 훅
  const { getDuplicationReport } = useCodeDuplicationCheck(control);

  // 그룹 추가 (자동 채번)
  const addGroup = () => {
    const currentGroups = watch('groups') || [];
    const nextSeq = currentGroups.length > 0 
      ? Math.max(...currentGroups.map(g => g.seq || 0)) + 1 
      : 1;
    
    // 기본 날짜 설정: 현재 날짜 ~ 무제한(null)
    const today = new Date();
    
    appendGroup({
      seq: nextSeq,
      code: `GROUP_${nextSeq.toString().padStart(3, '0')}`,
      name: '',
      startDate: today,
      endDate: '9999-12-31T23:59:59', // 무제한을 안전한 최대 날짜로 처리
      components: []
    });
    
    console.log(`🔢 새 그룹 추가 - 순번: ${nextSeq}, 기간: ${today.toLocaleDateString()} ~ 2099-12-31`);
  };

  // 폼 초기화 (테스트용)
  const handleResetForm = () => {
    reset({
      title: '',
      startDate: undefined,
      endDate: undefined,
      groups: []
    });
    console.log('🔄 폼이 초기화되었습니다');
  };

  // 샘플 데이터 로드 (테스트용)
  const loadSampleData = () => {
    console.log('� Virtuoso 성능 테스트 시작 - 가상화 활성화!');
    console.log('📊 생성할 데이터: 그룹 10개, 컴포넌트 100개, 답변 300개');
    console.log('⚡ Group 가상화: 5개 이상 → 활성화 예정');
    console.log('⚡ Component 가상화: 5개 이상 → 활성화 예정');
    reset(mockEditData); // 전체 데이터를 한번에 React Hook Form에 로드
    setInitialData(JSON.parse(JSON.stringify(mockEditData))); // 깊은 복사로 초기 데이터 저장
    console.log(`✅ 대량 데이터 로드 완료!`);
    console.log(`📈 통계: 그룹 ${mockEditData.groups.length}개, 컴포넌트 ${mockEditData.groups.reduce((acc, g) => acc + g.components.length, 0)}개`);
    console.log('🎯 Virtuoso 가상화로 성능 최적화 시작!');
  };

  // 실제 구현에서는 useEffect로 API 데이터 로드 시 초기 데이터 설정
  React.useEffect(() => {
    if (mode === 'edit' || mode === 'update') {
      // API에서 기존 데이터 로드
      // const data = await fetchFormData(formId);
      // reset(data);
      // setInitialData(JSON.parse(JSON.stringify(data)));
    }
  }, [mode, formId]);

  // 수동 전체 검증 (저장 버튼 외에 다른 곳에서 검증할 때)
  const validateAllFields = async () => {
    console.log('🔍 수동 전체 검증 시작...');
    
    // 모든 필드 검증 트리거
    const isFormValid = await trigger();
    
    if (isFormValid) {
      const currentData = getValues();
      console.log('✅ 전체 검증 성공!', currentData);
      alert('✅ 모든 필드가 유효합니다!');
    } else {
      console.log('❌ 검증 실패:', errors);
      alert('❌ 일부 필드에 오류가 있습니다. 확인해주세요.');
    }
    
    return isFormValid;
  };

  // 채번 순서로 정렬
  const sortBySequence = () => {
    const currentData = getValues();
    
    // 그룹을 seq 순으로 정렬
    const sortedGroups = [...(currentData.groups || [])].sort((a, b) => (a.seq || 0) - (b.seq || 0));
    
    // 각 그룹의 구성요소도 seq 순으로 정렬
    sortedGroups.forEach(group => {
      group.components = [...group.components].sort((a, b) => (a.seq || 0) - (b.seq || 0));
    });
    
    reset({
      ...currentData,
      groups: sortedGroups
    });
    
    console.log('🔄 채번 순서로 정렬 완료');
    alert('🔄 채번 순서로 정렬되었습니다!');
  };

  // 코드 중복 체크 리포트
  const checkDuplicationReport = () => {
    const report = getDuplicationReport();
    
    console.log('📊 코드 중복 체크 리포트:', report);
    
    if (report.hasDuplicates) {
      alert(`❌ 코드 중복 발견!\n\n중복된 코드: ${report.duplicateCodes.join(', ')}\n전체 코드: ${report.totalCodes}개\n고유 코드: ${report.uniqueCodes}개`);
    } else {
      alert(`✅ 코드 중복 없음!\n\n전체 코드: ${report.totalCodes}개\n모든 코드가 고유합니다.`);
    }
  };

  // 폼 제출 (Zod 검증 통과 후에만 실행됨)
  const onSubmit = (data: FormData) => {
    console.log('🎯 Zod 전체 검증 통과!');
    
    // 날짜 값 활용 예시
    if (data.startDate && data.endDate) {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      console.log('� 선택된 기간 정보:');
      console.log(`   시작일: ${startDate.toLocaleDateString('ko-KR')}`);
      console.log(`   종료일: ${endDate.toLocaleDateString('ko-KR')}`);
      console.log(`   총 기간: ${diffDays}일`);
    }
    
    console.log('📝 검증된 데이터:', data);
    console.log(`📋 ${mode} Form Data:`, data);
    
    // 데이터 통계
    const stats = {
      groups: data.groups.length,
      components: data.groups.reduce((acc, group) => acc + group.components.length, 0),
      answers: data.groups.reduce((acc, group) => 
        acc + group.components.reduce((acc2, comp) => acc2 + comp.answers.length, 0), 0),
      subAnswers: data.groups.reduce((acc, group) => 
        acc + group.components.reduce((acc2, comp) => 
          acc2 + comp.answers.reduce((acc3, answer) => acc3 + answer.subAnswers.length, 0), 0), 0)
    };
    
    alert(`
    폼이 성공적으로 저장되었습니다! 🎉
    
    📊 통계:
    - 그룹: ${stats.groups}개
    - 구성: ${stats.components}개  
    - 답변: ${stats.answers}개
    - 하위답변: ${stats.subAnswers}개
    `);
  };

  const watchedData = watch();

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* 🚀 MUI 애니메이션 CSS (펄스 효과만 유지) */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
      
      <Typography variant="h4" gutterBottom>
        {pageTitle} - 설문 폼 관리 ⚡
      </Typography>

      {/* 모드 표시 및 전환 */}
      <Box sx={{ mb: 2, p: 2, backgroundColor: 'info.light', borderRadius: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="info.contrastText">
            <strong>현재 모드:</strong> {pageTitle} 
            {mode === 'update' && ' (기존 항목 삭제 불가, 일부 필드만 수정 가능)'}
          </Typography>
          
          {/* 테스트용 모드 전환 버튼 */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              size="small" 
              variant={mode === 'register' ? 'contained' : 'outlined'}
              onClick={() => setMode('register')}
            >
              등록
            </Button>
            <Button 
              size="small" 
              variant={mode === 'edit' ? 'contained' : 'outlined'}
              onClick={() => setMode('edit')}
            >
              수정
            </Button>
            <Button 
              size="small" 
              variant={mode === 'update' ? 'contained' : 'outlined'}
              onClick={() => setMode('update')}
            >
              업데이트
            </Button>
          </Box>
        </Box>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* 서식 제목 */}
        <Card sx={{ mb: 3 }}>
          <CardHeader title="📝 서식 정보" />
          <CardContent>
            {/* 1. 기본 Controller 패턴 */}
            <Controller
              name="title"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="서식 제목"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  sx={{ mb: 2 }}
                  placeholder="예: 고객 만족도 설문"
                />
              )}
            />

            {/* 커스텀 컴포넌트 사용 예시 */}
            <FormTextField
              name="title"
              control={control}
              label="서식 제목 (커스텀 컴포넌트)"
              placeholder="커스텀 컴포넌트로 간소화"
              textFieldProps={{ 
                fullWidth: true, 
                sx: { mb: 2 } 
              }}
            />

            {/* 2. 추가 검증 규칙과 함께 */}
            <Controller
              name="title"
              control={control}
              rules={{
                required: "제목은 필수입니다",
                minLength: { value: 3, message: "최소 3글자 이상" },
                maxLength: { value: 100, message: "최대 100글자까지" },
                pattern: {
                  value: /^[가-힣a-zA-Z0-9\s]+$/,
                  message: "한글, 영문, 숫자만 입력 가능합니다"
                }
              }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="서식 제목 (추가 검증)"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  sx={{ mb: 2 }}
                  placeholder="추가 검증 규칙 적용"
                  // 실시간 검증 상태 표시
                  color={fieldState.isDirty && !fieldState.error ? "success" : "primary"}
                />
              )}
            />

            {/* Controller 다양한 패턴 예시 (실제 FormData 필드 사용) */}
            <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                🎯 Controller 사용 패턴 가이드
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                현재 FormData의 실제 필드들을 사용한 Controller 패턴들:
              </Typography>

              {/* 1. 기본 필드 - 이벤트 핸들러 추가 */}
              <Controller
                name="title"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="제목 (이벤트 핸들러 포함)"
                    fullWidth
                    sx={{ mb: 2 }}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    onFocus={() => console.log('제목 필드 포커스')}
                    onBlur={() => console.log('제목 필드 블러')}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      field.onChange(e); // 기본 onChange
                      console.log('제목 변경:', e.target.value);
                    }}
                  />
                )}
              />

              {/* 2. 조건부 렌더링 */}
              <Controller
                name="title"
                control={control}
                render={({ field, fieldState, formState }) => (
                  <Box>
                    <TextField
                      {...field}
                      label="제목 (상태 표시)"
                      fullWidth
                      sx={{ mb: 1 }}
                      color={fieldState.isDirty ? "warning" : "primary"}
                    />
                    <Typography variant="caption" color="text.secondary">
                      상태: {fieldState.isDirty ? '수정됨' : '원본'} | 
                      검증: {fieldState.invalid ? '실패' : '성공'} |
                      전체폼: {formState.isValid ? '유효' : '무효'}
                    </Typography>
                  </Box>
                )}
              />
            </Box>
            
            <Box display="flex" gap={2} flexWrap="wrap">
              <Button
                type="button"
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addGroup}
                disabled={!permissions.canAdd}
              >
                그룹 추가
              </Button>
              <Button
                type="button"
                variant="outlined"
                color="secondary"
                onClick={loadSampleData}
              >
                � Virtuoso 테스트 (그룹 10개)
              </Button>
              <Button
                type="button"
                variant="outlined"
                color="warning"
                onClick={handleResetForm}
              >
                🔄 폼 초기화
              </Button>
              <Button
                type="button"
                variant="outlined"
                color="info"
                onClick={validateAllFields}
              >
                🔍 전체 검증 테스트
              </Button>
              <Button
                type="button"
                variant="outlined"
                color="success"
                onClick={sortBySequence}
              >
                🔢 채번 순서 정렬
              </Button>
              <Button
                type="button"
                variant="outlined"
                color="error"
                onClick={checkDuplicationReport}
              >
                🔍 코드 중복 체크
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                color="primary"
                disabled={!isValid && Object.keys(errors).length > 0}
              >
{buttonText}
              </Button>
            </Box>

            {/* 검증 상태 표시 */}
            <Box sx={{ mt: 2, mb: 2 }}>
              <Alert 
                severity={isValid ? "success" : "warning"} 
                sx={{ mb: 1 }}
              >
                {isValid 
                  ? "✅ 모든 필드가 유효합니다!" 
                  : `⚠️ ${Object.keys(errors).length}개 필드에 오류가 있습니다.`
                }
              </Alert>
              
              {/* 상세 에러 표시 */}
              {Object.keys(errors).length > 0 && (
                <Alert severity="error">
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>오류 상세:</strong>
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    {Object.entries(errors).map(([key, error]) => (
                      <li key={key}>
                        <code>{key}</code>: {error?.message || '알 수 없는 오류'}
                      </li>
                    ))}
                  </ul>
                </Alert>
              )}
            </Box>

            {/* 기존 전체 폼 에러 (호환성 유지) */}
            {Object.keys(errors).length > 0 && (
              <Alert severity="error" sx={{ mt: 2, display: 'none' }}>
                ❌ 폼에 오류가 있습니다. 모든 필수 항목을 확인해주세요.
                <Box component="ul" sx={{ mt: 1, pl: 2 }}>
                  {errors.title && <li>서식 제목이 필요합니다</li>}
                  {errors.groups && <li>그룹 정보에 오류가 있습니다</li>}
                </Box>
              </Alert>
            )}

            {/* 성공 표시 */}
            {Object.keys(errors).length === 0 && watchedData.title && (
              <Alert severity="success" sx={{ mt: 2 }}>
                ✅ 모든 필드가 올바르게 입력되었습니다!
              </Alert>
            )}
          </CardContent>
        </Card>



        {/* 🚀 성능 최적화: 가상화 또는 일반 렌더링 */}
        {groups.length === 0 ? (
          // 빈 상태 처리
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                📋 아직 그룹이 없습니다
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addGroup}
              >
                첫 번째 그룹 추가하기
              </Button>
            </CardContent>
          </Card>
        ) : (
          // 일반 렌더링 (15개 미만)
          <>
            {groups.map((group, groupIndex) => (
              <GroupSection
                key={group.id}
                control={control}
                groupIndex={groupIndex}
                onRemove={() => handleRemoveGroup(groupIndex)}
                errors={errors}
                permissions={permissions}
                initialData={initialData || undefined}
                getValues={getValues}
                setValue={setValue}
              />
            ))}
          </>
        )}
      </form>

      {/* JSON 미리보기 */}
      <Card sx={{ mt: 4 }}>
        <CardHeader title="🔍 실시간 데이터 미리보기" />
        <CardContent>
          <pre style={{ 
            fontSize: '12px', 
            overflow: 'auto', 
            maxHeight: '300px',
            backgroundColor: '#f5f5f5',
            padding: '16px',
            borderRadius: '4px'
          }}>
            {JSON.stringify(watchedData, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </Container>
  );
}