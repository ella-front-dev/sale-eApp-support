import React, { useEffect, useState } from 'react';

import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import {
  Box,
  IconButton,
  Card,
  CardContent,
  TextField,
  Button,
  Chip,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { Control, FieldErrors, useFieldArray, Controller, useWatch, UseFormGetValues, UseFormSetValue } from 'react-hook-form';

import ComponentSection from './ComponentSection';

import { FormData } from '@/types/form';
import { PagePermissions, canDeleteItemByIndex } from '@/types/pageMode';

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

function GroupSection({ 
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

  // 아코디언 상태 관리 (기본적으로 펼쳐진 상태)
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(true);

  // 아코디언 토글
  const toggleDetails = () => {
    setIsDetailsExpanded(!isDetailsExpanded);
    console.log(`🔄 그룹 ${groupIndex} 상세 정보 ${!isDetailsExpanded ? '펼침' : '접힘'}`);
  };





  // Union 타입 날짜 정규화 유틸 (필수값)
  const normalizeDate = (value: Date | string): Date => {
    if (value instanceof Date) {
return value;
}
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
    <Card sx={{ mb: 2 }} elevation={2}>
      <CardContent>
        {/* 그룹 헤더 섹션 */}
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
        
        {/* 그룹 컨텐츠 영역 */}
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

        {/* 아코디언으로 상세 정보 감싸기 */}
        <Accordion expanded={isDetailsExpanded} onChange={toggleDetails} sx={{ mb: 2, boxShadow: 1 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`group-${groupIndex}-details`}
            id={`group-${groupIndex}-summary`}
            sx={{ bgcolor: 'grey.50', '&:hover': { bgcolor: 'grey.100' } }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
              <Chip label="📋 상세 정보" color="primary" size="small" />
              <Typography variant="body2" color="text.secondary">
                구성요소 {components.length}개
                {components.length > 0 && ` • 총 답변 ${components.reduce((sum, comp) => sum + (comp.answers?.length || 0), 0)}개`}
              </Typography>
            </Box>
          </AccordionSummary>
          
          <AccordionDetails sx={{ p: 2 }}>
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

        {/* Component 렌더링 */}
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
        ) : (
          // 일반 렌더링 (가상화 없음)
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
      </CardContent>
    </Card>
  );
}

// React.memo로 메모이제이션 적용 (성능 최적화)
export default React.memo(GroupSection);