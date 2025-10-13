import React, { useEffect } from 'react';
import { Control, FieldErrors, useFieldArray, Controller, useWatch, useFormContext } from 'react-hook-form';
import {
  Box,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
  Chip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import { FormData } from '@/types/form';
import ComponentSection from '../ComponentSection';

interface GroupSectionProps {
  control: Control<FormData>;
  groupIndex: number;
  onRemove: () => void;
  errors: FieldErrors<FormData>;
}

export default function GroupSection({ 
  control, 
  groupIndex, 
  onRemove,
  errors 
}: GroupSectionProps) {
  const { fields: components, append: appendComponent, remove: removeComponent } = useFieldArray({
    control,
    name: `groups.${groupIndex}.components`
  });

  // getValues() 사용하여 현재 폼 데이터 가져오기
  const { getValues, setValue } = useFormContext<FormData>();

  // 현재 그룹의 구성요소들 감시
  const currentComponents = useWatch({
    control,
    name: `groups.${groupIndex}.components`
  }) || [];

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

  // 무제한 날짜 감지 유틸
  const isInfiniteDate = (value: Date | string): boolean => {
    const date = normalizeDate(value);
    return date.getFullYear() >= 2999;
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
      setValue(`groups.${groupIndex}.endDate`, '2999-12-31T23:59:59'); // 무제한은 최대 날짜로 설정
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

  const addComponent = () => {
    const nextSeq = currentComponents.length > 0 
      ? Math.max(...currentComponents.map(c => c.seq || 0)) + 1 
      : 1;
    
    // 자동 코드 생성: COMP_001, COMP_002 형태
    const nextCode = `COMP_${String(nextSeq).padStart(3, '0')}`;
    
    appendComponent({
      seq: nextSeq,
      code: nextCode,
      name: '',
      answers: []
    });
    
    console.log(`🔢 새 구성 추가 - 그룹 ${groupIndex + 1}, 구성 순번: ${nextSeq}, 코드: ${nextCode}`);
  };

  const groupError = errors?.groups?.[groupIndex];

  return (
    <Accordion sx={{ mb: 2 }}>
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
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            color="error"
            size="small"
          >
            <DeleteIcon />
          </IconButton>
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
                minDate={dayjs('1900-01-01')}
                maxDate={dayjs('2999-12-31')}
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
                value={field.value ? dayjs(normalizeDate(field.value)) : dayjs('2999-12-31')}
                onChange={(newValue) => {
                  field.onChange(newValue?.toDate() || new Date('2999-12-31'));
                }}
                format="YYYY-MM-DD"
                minDate={dayjs('1900-01-01')}
                maxDate={dayjs('2999-12-31')}
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

        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={addComponent}
            size="small"
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
        </Box>

        {components.map((component, componentIndex) => (
          <ComponentSection
            key={component.id}
            control={control}
            groupIndex={groupIndex}
            componentIndex={componentIndex}
            onRemove={() => removeComponent(componentIndex)}
            errors={errors}
          />
        ))}
      </AccordionDetails>
    </Accordion>
  );
}