import React from 'react';
import { Control, FieldErrors, useFieldArray, Controller } from 'react-hook-form';
import {
  Box,
  IconButton,
  TextField,
  Button,
  Paper,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
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
  getValues?: any; // 임시로 any 타입 사용
  setValue?: any;  // 임시로 any 타입 사용
}

export default function ComponentSection({ 
  control,
  groupIndex, 
  componentIndex, 
  onRemove,
  errors,
  permissions,
  initialData
}: ComponentSectionProps) {
  const { fields: answers, append: appendAnswer } = useFieldArray({
    control,
    name: `groups.${groupIndex}.components.${componentIndex}.answers`
  });

  // 답변 추가
  const addAnswer = () => {
    appendAnswer({
      content: `답변 ${answers.length + 1}`,
      subAnswers: []
    });
  };

  const componentError = errors?.groups?.[groupIndex]?.components?.[componentIndex];

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
      </Box>

      {/* 간단한 답변 표시 (성능 테스트용) */}
      <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
        <Chip 
          label={`답변 ${answers.length}개`} 
          color="info" 
          size="small" 
          sx={{ mb: 1 }} 
        />
        {answers.length > 0 && (
          <Box sx={{ fontSize: '14px', color: 'text.secondary' }}>
            첫 번째 답변: {answers[0]?.content || '내용 없음'}
            {answers.length > 1 && ` (외 ${answers.length - 1}개)`}
          </Box>
        )}
      </Box>
    </Paper>
  );
}
