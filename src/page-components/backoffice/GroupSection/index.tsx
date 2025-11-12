import React, { useEffect } from 'react';
import { Control, FieldErrors, useFieldArray, Controller, useWatch, UseFormGetValues, UseFormSetValue } from 'react-hook-form';
import { Virtuoso } from 'react-virtuoso';
import {
  Box,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
  Chip,
  Typography
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import { FormData } from '@/types/form';
import { PageMode, PagePermissions, canDeleteItemByIndex } from '@/types/pageMode';
import ComponentSection from '../ComponentSection';

interface GroupSectionProps {
  control: Control<FormData>;
  groupIndex: number;
  onRemove: () => void;
  errors: FieldErrors<FormData>;
  permissions: PagePermissions;
  initialData?: FormData;
  getValues: UseFormGetValues<FormData>; // React Hook Form의 getValues 함수
  setValue: UseFormSetValue<FormData>;  // React Hook Form의 setValue 함수
}

export default function GroupSection({ 
  control, 
  groupIndex, 
  onRemove, 
  errors,
  permissions,
  initialData,
  getValues,
  setValue
}: GroupSectionProps) {
  const { fields: components, append: appendComponent, remove: removeComponent } = useFieldArray({
    control,
    name: `groups.${groupIndex}.components`
  });

  // props로 받은 getValues, setValue 사용

  // 현재 그룹의 구성요소들 감시
  const currentComponents = useWatch({
    control,
    name: `groups.${groupIndex}.components`
  });

  // 🚀 성능 최적화: Component 가상화 임계값 설정 (테스트를 위해 낮게 설정)
  const COMPONENT_VIRTUALIZATION_THRESHOLD = 5; // 5개 이상부터 가상화 적용 (테스트용)
  const shouldUseComponentVirtualization = currentComponents.length >= COMPONENT_VIRTUALIZATION_THRESHOLD;

  // Union 타입 날짜 정규화 유틸 (필수값)
  const normalizeDate = (value: Date | string): Date => {
    if (value instanceof Date) return value;
    if (typeof value === 'string') {
      // API 포맷 처리: "2024.12.25 00:00:00"
      const isoString = value.replace(/\./g, '-').replace(' ', 'T');
      const parsed = new Date(isoString);
      return isNaN(parsed.getTime()) ? new Date() : parsed;
    }
    return new Date();
  };

  // 무제한 날짜 감지 유틸 (9999년 기준)
  const isInfiniteDate = (value: Date | string): boolean => {
    const date = normalizeDate(value);
    return date.getFullYear() >= 9999;
  };

  // 그룹 생성시 기본 날짜 설정
  useEffect(() => {
    const currentGroup = getValues(`groups.${groupIndex}`);
    
    // 날짜가 설정되지 않은 경우 기본값 설정
    if (!currentGroup?.startDate) {
      const today = new Date();
      setValue(`groups.${groupIndex}.startDate`, today);
    }
    
    if (!currentGroup?.endDate) {
      setValue(`groups.${groupIndex}.endDate`, '9999-12-31T23:59:59'); // 무제한은 최대 날짜로 설정
    }
  }, [groupIndex, getValues, setValue]);

  // getValues() 사용 예시 - 날짜 값 가져오기
  const handleGetDateValues = () => {
    const formValues = getValues(); // 전체 폼 데이터
    const { startDate, endDate } = formValues;
    
    console.log('Current date range:', { 
      startDate: startDate instanceof Date ? startDate.toISOString() : startDate, 
      endDate: endDate instanceof Date ? endDate.toISOString() : endDate
    });
    
    // 특정 그룹의 컴포넌트들만 가져오기
    const groupComponents = getValues(`groups.${groupIndex}.components`);
    console.log('Group components:', groupComponents);
  };

  // 9999년 날짜 테스트 함수
  const test9999Date = () => {
    const test9999 = new Date('9999-12-31T23:59:59');
    const dayjs9999 = dayjs('9999-12-31');
    
    console.log('=== 9999년 날짜 테스트 ===');
    console.log('JavaScript Date:', test9999);
    console.log('Date valid:', !isNaN(test9999.getTime()));
    console.log('dayjs object:', dayjs9999);
    console.log('dayjs valid:', dayjs9999.isValid());
    console.log('dayjs format:', dayjs9999.format('YYYY-MM-DD'));
    
    // 그룹 종료일을 9999년으로 설정
    setValue(`groups.${groupIndex}.endDate`, '9999-12-31T23:59:59');
    console.log('그룹 종료일을 9999년으로 설정완료');
  };

  const addComponent = () => {
    const nextSeq = currentComponents.length > 0 
      ? Math.max(...currentComponents.map(c => c.seq || 0)) + 1 
      : 1;
    
    // 자동 코드 생성: COMP_001, COMP_002 형태
    const nextCode = `COMP_${String(nextSeq).padStart(3, '0')}`;
    
    // 기본 답변을 포함한 컴포넌트 생성
    appendComponent({
      seq: nextSeq,
      code: nextCode,
      name: '',
      answers: [
        {
          content: '만족',
          subAnswers: []
        },
        {
          content: '보통',
          subAnswers: []
        },
        {
          content: '불만족',
          subAnswers: []
        }
      ]
    });
    
    console.log(`🔢 새 구성 추가 - 그룹 ${groupIndex + 1}, 구성 순번: ${nextSeq}, 코드: ${nextCode}`);
    console.log(`💬 기본 답변 3개 추가 - 만족/보통/불만족`);
  };

  const groupError = errors?.groups?.[groupIndex];

  return (
    <Accordion sx={{ mb: 2 }} defaultExpanded={true}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box display="flex" alignItems="center" gap={2} width="100%">
          <Chip label="📁 그룹" color="primary" size="small" />
          
          {/* 그룹 순번 표시 및 수정 */}
          <Controller
            name={`groups.${groupIndex}.seq`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="순번"
                variant="outlined"
                size="small"
                onClick={(e) => e.stopPropagation()}
                error={!!groupError?.seq}
                helperText={groupError?.seq?.message}
                sx={{ width: 80 }}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            )}
          />
          
          {/* 그룹 코드 입력 */}
          <Controller
            name={`groups.${groupIndex}.code`}
            control={control}
            render={({ field, fieldState }) => {
              const fieldError = fieldState.error;
              const groupCodeError = groupError?.code;
              const hasError = !!fieldError || !!groupCodeError;
              const errorMessage = fieldError?.message || groupCodeError?.message;
              
              return (
                <TextField
                  {...field}
                  label="그룹 코드"
                  variant="outlined"
                  size="small"
                  onClick={(e) => e.stopPropagation()}
                  error={hasError}
                  helperText={errorMessage || '대문자, 숫자, 언더스코어만 입력'}
                  sx={{ width: 120 }}
                  placeholder="GROUP_001"
                  inputProps={{ style: { textTransform: 'uppercase' } }}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(e.target.value.toUpperCase())}
                />
              );
            }}
          />
          
          <Controller
            name={`groups.${groupIndex}.name`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="그룹명"
                variant="outlined"
                size="small"
                onClick={(e) => e.stopPropagation()}
                error={!!groupError?.name}
                helperText={groupError?.name?.message}
                sx={{ flexGrow: 1 }}
                placeholder="예: 기본 정보"
              />
            )}
          />
          {canDeleteItemByIndex(permissions, "groups", groupIndex, initialData) && (
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              color="error"
              size="small"
              title={permissions.canDeleteExisting ? "그룹 삭제" : "새로 추가한 그룹만 삭제 가능"}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        {/* 그룹별 날짜 설정 */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
          <Controller
            name={`groups.${groupIndex}.startDate`}
            control={control}
            render={({ field }) => (
              <DatePicker
                label="시작일"
                value={field.value ? dayjs(normalizeDate(field.value)) : dayjs()}
                onChange={(newValue) => {
                  field.onChange(newValue?.toDate() || new Date());
                }}
                format="YYYY-MM-DD"
                minDate={dayjs('1000-01-01')}
                maxDate={dayjs('9999-12-31')}
                slotProps={{
                  textField: {
                    size: 'small',
                    error: !!groupError?.startDate,
                    helperText: groupError?.startDate?.message
                  }
                }}
              />
            )}
          />
          
          <Controller
            name={`groups.${groupIndex}.endDate`}
            control={control}
            render={({ field }) => (
              <DatePicker
                label="종료일"
                value={field.value ? dayjs(normalizeDate(field.value)) : dayjs('9999-12-31')}
                onChange={(newValue) => {
                  field.onChange(newValue?.toDate() || new Date('9999-12-31'));
                }}
                format="YYYY-MM-DD"
                minDate={dayjs('1000-01-01')}
                maxDate={dayjs('9999-12-31')}
                slotProps={{
                  textField: {
                    size: 'small',
                    error: !!groupError?.endDate,
                    helperText: groupError?.endDate?.message || (
                      isInfiniteDate(field.value) ? '무제한으로 설정됨' : undefined
                    )
                  }
                }}
              />
            )}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={addComponent}
            size="small"
            disabled={!permissions.canAdd}
          >
            구성 추가
          </Button>
          
          {/* Component 가상화 상태 표시 */}
          {components.length > 0 && (
            <Chip
              label={shouldUseComponentVirtualization 
                ? `🚀 가상화 모드 (${components.length}개)` 
                : `일반 모드 (${components.length}개)`
              }
              color={shouldUseComponentVirtualization ? "success" : "default"}
              size="small"
            />
          )}
          
          {/* getValues() 사용 예시 버튼 */}
          <Button
            variant="text"
            onClick={handleGetDateValues}
            color="info"
            size="small"
          >
            날짜 정보 확인
          </Button>
          
          {/* 9999년 테스트 버튼 */}
          <Button
            variant="text"
            onClick={test9999Date}
            color="warning"
            size="small"
          >
            9999년 테스트
          </Button>
        </Box>

        {/* 🚀 성능 최적화: Component 가상화 또는 일반 렌더링 */}
        {components.length === 0 ? (
          // 빈 상태 처리
          <Box sx={{ textAlign: 'center', py: 3, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              🔧 아직 구성요소가 없습니다
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddIcon />}
              onClick={addComponent}
            >
              첫 번째 구성요소 추가하기
            </Button>
          </Box>
        ) : shouldUseComponentVirtualization ? (
          // 가상화 렌더링 (10개 이상) - 높이 자동 계산으로 개선
          <Box sx={{ height: '600px', border: '1px solid #e0e0e0', borderRadius: 1, overflow: 'hidden' }}>
            <Virtuoso
              data={components}
              itemContent={(index, component) => (
                <Box sx={{ p: 2, mb: 1 }}>
                  <ComponentSection
                    key={component.id}
                    control={control}
                    groupIndex={groupIndex}
                    componentIndex={index}
                    onRemove={() => removeComponent(index)}
                    errors={errors}
                    permissions={permissions}
                    initialData={initialData}
                    getValues={getValues}
                    setValue={setValue}
                  />
                </Box>
              )}
              // 🚀 높이 자동 계산 개선
              defaultItemHeight={200}  // 기본 아이템 높이 설정
              overscan={5}             // 화면 밖 렌더링 개수 증가
              increaseViewportBy={{ top: 100, bottom: 100 }} // 뷰포트 확장
              style={{
                height: '100%',
                width: '100%'
              }}
            />
          </Box>
        ) : (
          // 일반 렌더링 (10개 미만)
          <>
            {components.map((component, componentIndex) => (
              <ComponentSection
                key={component.id}
                control={control}
                groupIndex={groupIndex}
                componentIndex={componentIndex}
                onRemove={() => removeComponent(componentIndex)}
                errors={errors}
                permissions={permissions}
                initialData={initialData}
                getValues={getValues}
                setValue={setValue}
              />
            ))}
          </>
        )}
      </AccordionDetails>
    </Accordion>
  );
}