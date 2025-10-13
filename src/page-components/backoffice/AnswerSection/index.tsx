import React, { useEffect } from 'react';
import { Control, FieldErrors, useFieldArray, Controller, useWatch } from 'react-hook-form';
import { useCodeDuplicationCheck } from '@/hooks/useCodeDuplicationCheck';
import {
  Box,
  IconButton,
  TextField,
  Button,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { FormData } from '@/types/form';
import { PagePermissions, canDeleteItemByIndex } from '@/types/pageMode';

interface AnswerSectionProps {
  control: Control<FormData>;
  groupIndex: number;
  componentIndex: number;
  answerIndex: number;
  onRemove: () => void;
  errors: FieldErrors<FormData>;
  permissions: PagePermissions;
  initialData?: FormData;
}

export default function AnswerSection({ 
  control,
  groupIndex, 
  componentIndex, 
  answerIndex, 
  onRemove,
  errors,
  permissions,
  initialData
}: AnswerSectionProps) {
  const { fields: subAnswers, append: appendSubAnswer, remove: removeSubAnswer } = useFieldArray({
    control,
    name: `groups.${groupIndex}.components.${componentIndex}.answers.${answerIndex}.subAnswers`
  });

  // 중복 체크 훅
  const { checkSubAnswerCodeDuplication } = useCodeDuplicationCheck(control);

  // 현재 답변 정보 가져오기
  const currentAnswer = useWatch({
    control,
    name: `groups.${groupIndex}.components.${componentIndex}.answers.${answerIndex}`
  });

  const addSubAnswer = () => {
    const nextCode = `SUB_${String(subAnswers.length + 1).padStart(3, '0')}`;
    appendSubAnswer({
      code: nextCode,
      content: ''
    });
  };

  // 하위답변 개수 조정 함수
  const adjustSubAnswersCount = (targetCount: number) => {
    const currentCount = subAnswers.length;
    
    if (targetCount > currentCount) {
      // 개수 증가: 새로운 하위답변 추가
      for (let i = currentCount; i < targetCount; i++) {
        const nextCode = `SUB_${String(i + 1).padStart(3, '0')}`;
        appendSubAnswer({
          code: nextCode,
          content: ''
        });
      }
    } else if (targetCount < currentCount) {
      // 개수 감소: 뒤쪽 하위답변들 제거
      for (let i = currentCount - 1; i >= targetCount; i--) {
        removeSubAnswer(i);
      }
    }
  };

  const answerError = errors?.groups?.[groupIndex]?.components?.[componentIndex]?.answers?.[answerIndex];

  return (
    <Box sx={{ ml: 2, mb: 2 }}>
      <Box display="flex" alignItems="center" gap={2} mb={1}>
        <Chip label="💬 답변" color="success" size="small" />
        <Controller
          name={`groups.${groupIndex}.components.${componentIndex}.answers.${answerIndex}.content`}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="답변 내용"
              variant="outlined"
              size="small"
              error={!!answerError?.content}
              helperText={answerError?.content?.message}
              sx={{ flexGrow: 1 }}
              placeholder="예: 매우 만족"
            />
          )}
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>하위답변 개수</InputLabel>
          <Select
            value={subAnswers.length}
            label="하위답변 개수"
            onChange={(e) => adjustSubAnswersCount(Number(e.target.value))}
          >
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((count) => (
              <MenuItem key={count} value={count}>
                {count}개
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {canDeleteItemByIndex(permissions, `groups.${groupIndex}.components.${componentIndex}.answers`, answerIndex, initialData) && (
          <IconButton 
            onClick={onRemove} 
            color="error" 
            size="small"
            title={permissions.canDeleteExisting ? "답변 삭제" : "새로 추가한 답변만 삭제 가능"}
          >
            <DeleteIcon />
          </IconButton>
        )}
      </Box>

      {subAnswers.map((subAnswer, subAnswerIndex) => (
        <Box key={subAnswer.id} sx={{ ml: 4, mb: 1 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Chip label="↳ 하위답변" color="info" size="small" />
            
            {/* 하위답변 코드 필드 (중복 체크 포함) */}
            <Controller
              name={`groups.${groupIndex}.components.${componentIndex}.answers.${answerIndex}.subAnswers.${subAnswerIndex}.code`}
              control={control}
              rules={{
                validate: (value) => {
                  if (!value) return '코드를 입력해주세요';
                  const duplicateError = checkSubAnswerCodeDuplication(value, groupIndex, componentIndex, answerIndex, subAnswerIndex);
                  return duplicateError || true;
                }
              }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="하위답변 코드"
                  variant="outlined"
                  size="small"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  sx={{ width: 120 }}
                  placeholder="예: SUB_001"
                  onChange={(e) => {
                    // 대문자로 변환
                    const upperValue = e.target.value.toUpperCase();
                    field.onChange(upperValue);
                  }}
                />
              )}
            />
            
            <Controller
              name={`groups.${groupIndex}.components.${componentIndex}.answers.${answerIndex}.subAnswers.${subAnswerIndex}.content`}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="하위답변 내용"
                  variant="outlined"
                  size="small"
                  error={!!(answerError?.subAnswers?.[subAnswerIndex]?.content)}
                  helperText={answerError?.subAnswers?.[subAnswerIndex]?.content?.message}
                  sx={{ flexGrow: 1 }}
                  placeholder="예: 추가 설명"
                />
              )}
            />
            {canDeleteItemByIndex(permissions, `groups.${groupIndex}.components.${componentIndex}.answers.${answerIndex}.subAnswers`, subAnswerIndex, initialData) && (
              <IconButton
                onClick={() => removeSubAnswer(subAnswerIndex)}
                color="error"
                size="small"
                title={permissions.canDeleteExisting ? "하위답변 삭제" : "새로 추가한 하위답변만 삭제 가능"}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
        </Box>
      ))}
    </Box>
  );
}