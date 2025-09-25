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
import AnswerSection from '../AnswerSection';

interface ComponentSectionProps {
  control: Control<FormData>;
  groupIndex: number;
  componentIndex: number;
  onRemove: () => void;
  errors: FieldErrors<FormData>;
}

export default function ComponentSection({ 
  control,
  groupIndex, 
  componentIndex, 
  onRemove,
  errors
}: ComponentSectionProps) {
  const { fields: answers, append: appendAnswer, remove: removeAnswer } = useFieldArray({
    control,
    name: `groups.${groupIndex}.components.${componentIndex}.answers`
  });

  const addAnswer = () => {
    appendAnswer({
      content: '',
      subAnswers: []
    });
  };

  const componentError = errors?.groups?.[groupIndex]?.components?.[componentIndex];

  return (
    <Paper sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <Chip label="🔧 구성" color="secondary" size="small" />
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
              placeholder="예: 개인정보 입력"
            />
          )}
        />
        <IconButton onClick={onRemove} color="error" size="small">
          <DeleteIcon />
        </IconButton>
      </Box>

      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={addAnswer}
        sx={{ mb: 2 }}
        size="small"
      >
        답변 추가
      </Button>

      {answers.map((answer, answerIndex) => (
        <AnswerSection
          key={answer.id}
          control={control}
          groupIndex={groupIndex}
          componentIndex={componentIndex}
          answerIndex={answerIndex}
          onRemove={() => removeAnswer(answerIndex)}
          errors={errors}
        />
      ))}
    </Paper>
  );
}