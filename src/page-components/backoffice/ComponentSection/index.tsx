import React from 'react';

import {
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import {
  Box,
  IconButton,
  TextField,
  Button,
  Paper,
  Chip
} from '@mui/material';
import { Control, FieldErrors, useFieldArray, Controller } from 'react-hook-form';
import { UseFormGetValues, UseFormSetValue } from 'react-hook-form';

import AnswerSection from '../AnswerSection';

import { FormData } from '@/types/form';
import { PagePermissions, canDeleteItemByIndex } from '@/types/pageMode';

interface ComponentSectionProps {
  control: Control<FormData>;
  groupIndex: number;
  componentIndex: number;
  onRemove: () => void;
  errors: FieldErrors<FormData>;
  permissions: PagePermissions;
  initialData?: FormData;
  getValues?: UseFormGetValues<FormData>;
  setValue?: UseFormSetValue<FormData>;
}

function ComponentSection({ 
  control,
  groupIndex, 
  componentIndex, 
  onRemove,
  errors,
  permissions,
  initialData
}: ComponentSectionProps) {
  const { fields: answers, append: appendAnswer, remove: removeAnswerFromArray } = useFieldArray({
    control,
    name: `groups.${groupIndex}.components.${componentIndex}.answers`
  });



  // 답변 추가
  const addAnswer = () => {
    try {
      appendAnswer({
        content: `답변 ${answers.length + 1}`,
        subAnswers: []
      });
      console.log(`➕ 답변 추가 성공: 그룹 ${groupIndex}, 컴포넌트 ${componentIndex}`);
    } catch (error) {
      console.error(`❌ 답변 추가 실패:`, error);
    }
  };

  const componentError = errors?.groups?.[groupIndex]?.components?.[componentIndex];

  // 렌더링 오류 처리
  try {

  // 답변 제거
  const removeAnswer = (answerIndex: number) => {
    if (canDeleteItemByIndex(permissions, `groups.${groupIndex}.components.${componentIndex}.answers`, answerIndex, initialData)) {
      removeAnswerFromArray(answerIndex);
    }
  };

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 2, bgcolor: '#fafafa' }}>
      <Box display="flex" alignItems="center" gap={2} sx={{ mb: 2 }}>
        <Chip label="🔧 구성" color="secondary" size="small" />
        
        {/* 컴포넌트 순번 */}
        <Controller
          name={`groups.${groupIndex}.components.${componentIndex}.seq`}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type="number"
              label="순번"
              variant="outlined"
              size="small"
              error={!!componentError?.seq}
              helperText={componentError?.seq?.message}
              sx={{ width: 80 }}
            />
          )}
        />
        
        {/* 컴포넌트 이름 */}
        <Controller
          name={`groups.${groupIndex}.components.${componentIndex}.name`}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="구성명"
              variant="outlined"
              size="small"
              error={!!componentError?.name}
              helperText={componentError?.name?.message}
              sx={{ flexGrow: 1 }}
              placeholder="예: 만족도 평가"
            />
          )}
        />

        {/* 답변 추가 버튼 */}
        <Button
          variant="outlined"
          size="small"
          onClick={addAnswer}
          startIcon={<AddIcon />}
          title="답변 추가"
        >
          답변 추가
        </Button>

        {/* 컴포넌트 삭제 버튼 */}
        {canDeleteItemByIndex(permissions, `groups.${groupIndex}.components`, componentIndex, initialData) && (
          <IconButton
            onClick={onRemove}
            color="error"
            size="small"
            title={permissions.canDeleteExisting ? "컴포넌트 삭제" : "새로 추가한 컴포넌트만 삭제 가능"}
          >
            <DeleteIcon />
          </IconButton>
        )}
      </Box>

      {/* 실제 답변들을 모두 렌더링 */}
      {answers.map((answer, answerIndex) => {
        try {
          console.log(`💬 답변 ${answerIndex} 렌더링: ID ${answer.id}, 내용 "${answer.content}"`);

          return (
            <AnswerSection
              key={answer.id}
              control={control}
              groupIndex={groupIndex}
              componentIndex={componentIndex}
              answerIndex={answerIndex}
              onRemove={() => removeAnswer(answerIndex)}
              errors={errors}
              permissions={permissions}
              initialData={initialData}
            />
          );
        } catch (error) {
          console.error(`❌ 답변 ${answerIndex} 렌더링 실패:`, error);

          return (
            <Box key={`error-${answerIndex}`} sx={{ p: 2, bgcolor: 'error.light', color: 'error.contrastText', borderRadius: 1 }}>
              답변 렌더링 오류: {error instanceof Error ? error.message : '알 수 없는 오류'}
            </Box>
          );
        }
      })}

      {/* 답변이 없을 때 안내 메시지 */}
      {answers.length === 0 && (
        <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, textAlign: 'center' }}>
          <Chip label="📝 답변이 없습니다" color="default" size="small" sx={{ mb: 1 }} />
          <Box sx={{ fontSize: '14px', color: 'text.secondary' }}>
            답변 추가 버튼을 클릭하여 답변을 추가해보세요
          </Box>
        </Box>
      )}
    </Paper>
  );
  } catch (error) {
    console.error(`❌ ComponentSection 렌더링 오류 (그룹 ${groupIndex}, 컴포넌트 ${componentIndex}):`, error);

    return (
      <Paper elevation={1} sx={{ p: 2, mb: 2, bgcolor: 'error.light' }}>
        <Box sx={{ color: 'error.contrastText' }}>
          컴포넌트 렌더링 오류가 발생했습니다.
          <br />
          그룹: {groupIndex}, 컴포넌트: {componentIndex}
          <br />
          오류: {error instanceof Error ? error.message : '알 수 없는 오류'}
        </Box>
      </Paper>
    );
  }
}

// React.memo로 메모이제이션 적용 (성능 최적화)
export default React.memo(ComponentSection);
