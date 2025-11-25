import React from 'react';
import { Control, FieldErrors, useFieldArray, Controller } from 'react-hook-form';
import { useCodeDuplicationCheck } from '@/hooks/useCodeDuplicationCheck';
import { rhfRules } from '@/hooks/useCustomValidation';
import {
  Box,
  IconButton,
  TextField,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
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

function AnswerSection({ 
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

  // addSubAnswer 함수는 Select를 통한 개수 제어 방식으로 대체되었습니다.

  // 초기 하위답변 개수 가져오기 (권한 체크용)
  const getInitialSubAnswerCount = (): number => {
    // 기존 데이터 삭제가 불가능한 모드(update)에서만 초기 데이터 개수 체크
    if (permissions.canDeleteExisting) {
      return 0; // register/edit 모드에서는 항상 0부터 선택 가능
    }
    
    // update 모드에서만 initialData 확인
    if (!initialData) return 0;
    
    try {
      const initialAnswer = initialData.groups?.[groupIndex]?.components?.[componentIndex]?.answers?.[answerIndex];
      return Array.isArray(initialAnswer?.subAnswers) ? initialAnswer.subAnswers.length : 0;
    } catch {
      return 0;
    }
  };

  // 하위답변 개수 조정 함수 (권한 체크 포함)
  const adjustSubAnswersCount = (targetCount: number) => {
    const currentCount = subAnswers.length;
    const initialCount = getInitialSubAnswerCount();
    
    if (targetCount > currentCount) {
      // 개수 증가: 새로운 하위답변 추가 (항상 허용)
      for (let i = currentCount; i < targetCount; i++) {
        const nextCode = `SUB_${String(i + 1).padStart(3, '0')}`;
        appendSubAnswer({
          code: nextCode,
          content: ''
        });
      }
    } else if (targetCount < currentCount) {
      // 개수 감소: 권한에 따라 제거
      for (let i = currentCount - 1; i >= targetCount; i--) {
        // 기존 항목인지 새 항목인지 확인
        const canDelete = i >= initialCount ? permissions.canDeleteNew : permissions.canDeleteExisting;
        
        if (canDelete) {
          removeSubAnswer(i);
        } else {
          alert(`${i + 1}번째 하위답변은 기존 데이터로 삭제할 수 없습니다.`);
          break; // 삭제할 수 없는 항목을 만나면 중단
        }
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
          rules={rhfRules.content}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="답변 내용"
              variant="outlined"
              size="small"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              sx={{ flexGrow: 1 }}
              placeholder="예: 매우 만족"
            />
          )}
        />
        <FormControl 
          size="small" 
          sx={{ minWidth: 120 }}
          error={!!answerError?.content} // 답변 자체의 에러 상태 사용
        >
          <InputLabel>하위답변 개수</InputLabel>
          <Select
            value={subAnswers.length}
            label="하위답변 개수"
            onChange={(e) => adjustSubAnswersCount(Number(e.target.value))}
            title={
              !permissions.canDeleteExisting 
                ? `업데이트 모드: 기존 ${getInitialSubAnswerCount()}개는 삭제 불가, 추가만 가능`
                : "하위답변 개수 조정"
            }
          >
            {(() => {
              const initialCount = getInitialSubAnswerCount();
              const minAllowed = permissions.canDeleteExisting ? 0 : initialCount; // 기존 삭제 불가시 초기 개수가 최소값
              const maxAllowed = 10; // 최대 10개
              
              const options = [];
              // minAllowed부터 maxAllowed까지만 표시 (권한에 따라 자동 필터링)
              for (let count = minAllowed; count <= maxAllowed; count++) {
                options.push(
                  <MenuItem key={count} value={count}>
                    {count}개
                  </MenuItem>
                );
              }
              return options;
            })()}
          </Select>
          {/* Helper Text 예시 - 실제 에러나 안내 텍스트 표시 */}
          <FormHelperText>
            {answerError?.content ? "답변 내용을 입력해주세요" : "하위답변 개수를 선택하세요"}
          </FormHelperText>
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
                required: '코드를 입력해주세요',
                pattern: { 
                  value: /^[A-Z0-9_]+$/, 
                  message: '대문자, 숫자, 언더스코어만 사용 가능합니다' 
                },
                validate: (value) => {
                  // 코드 중복 체크만 커스텀으로 처리
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
              rules={rhfRules.content}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="하위답변 내용"
                  variant="outlined"
                  size="small"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
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

// React.memo로 메모이제이션 적용 (성능 최적화)
export default React.memo(AnswerSection);