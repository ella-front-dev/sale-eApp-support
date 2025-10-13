'use client';

import React, { useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema, FormData } from '@/types/form';
import { PageMode, MODE_TITLES, MODE_BUTTON_TEXTS } from '@/types/pageMode';
import { usePagePermissions } from '@/hooks/usePagePermissions';
import GroupSection from '@/page-components/backoffice/GroupSection';
import FormTextField from '@/components/FormTextField';
import { useCodeDuplicationCheck } from '@/hooks/useCodeDuplicationCheck';
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
import {
  Add as AddIcon,
  Save as SaveIcon
} from '@mui/icons-material';

// 임시 수정용 데이터 (실제로는 API에서 가져올 데이터)
// 기존 서버 데이터는 숫자 ID를 가지고 있어서 삭제 불가, 새로 추가한 항목은 UUID 형태라서 삭제 가능
const mockEditData: FormData = {
  title: "기존 고객 만족도 조사",
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-12-31'),
  groups: [
    {
      id: "1", // 서버에서 온 기존 데이터 (숫자 ID)
      seq: 1, // 그룹 채번
      name: "서비스 품질 평가",
      startDate: new Date('2024-01-01'),
      endDate: '2099-12-31T23:59:59',
      components: [
        {
          id: "1", // 서버에서 온 기존 데이터 (숫자 ID)
          seq: 1, // 구성 채번
          code: "COMP_001", // 구성 코드
          name: "응답 속도 평가",
          answers: [
            {
              id: "1", // 서버에서 온 기존 데이터 (숫자 ID)
              content: "매우 만족",
              subAnswers: [
                { 
                  id: "1", // 서버에서 온 기존 데이터 (숫자 ID)
                  code: "SUB_001", // 하위답변 코드
                  content: "빠른 응답이 좋았습니다" 
                }
              ]
            },
            {
              id: "2", // 서버에서 온 기존 데이터 (숫자 ID)
              content: "보통",
              subAnswers: []
            }
          ]
        }
      ]
    }
  ]
};

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
  
  const { control, handleSubmit, formState: { errors, isValid }, watch, reset, trigger, getValues } = useForm<FormData>({
    resolver: zodResolver(formSchema),
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
      // 실제로는 API 호출: fetchFormData(formId).then(data => reset(data))
      // 시뮬레이션: 2초 후에 데이터 로드
      const timer = setTimeout(() => {
        console.log(`📡 ${mode} 모드 - API에서 기존 데이터 로드 중...`);
        reset(mockEditData);
        console.log(`✅ ${mode} 모드 - 기존 데이터 로드 완료!`);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [mode, formId, reset]);

  const { fields: groups, append: appendGroup, remove: removeGroup } = useFieldArray({
    control,
    name: 'groups'
  });

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
    reset(mockEditData);
    setInitialData(JSON.parse(JSON.stringify(mockEditData))); // 깊은 복사로 초기 데이터 저장
    console.log('📋 샘플 데이터가 로드되었습니다');
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
              render={({ field, fieldState, formState }) => (
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
                    onChange={(e) => {
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
                📋 샘플 데이터 로드
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

        {/* 그룹 목록 */}
        {groups.map((group, groupIndex) => (
          <GroupSection
            key={group.id}
            control={control}
            groupIndex={groupIndex}
            onRemove={() => removeGroup(groupIndex)}
            errors={errors}
            permissions={permissions}
            initialData={initialData || undefined}
          />
        ))}

        {groups.length === 0 && (
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