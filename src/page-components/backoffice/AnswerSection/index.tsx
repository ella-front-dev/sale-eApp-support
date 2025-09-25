import React from 'react';
import { Control, FieldErrors, useFieldArray, Controller } from 'react-hook-form';
import {
  Box,
  IconButton,
  TextField,
  Button,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { FormData } from '@/types/form';

interface AnswerSectionProps {
  control: Control<FormData>;
  groupIndex: number;
  componentIndex: number;
  answerIndex: number;
  onRemove: () => void;
  errors: FieldErrors<FormData>;
}

export default function AnswerSection({ 
  control,
  groupIndex, 
  componentIndex, 
  answerIndex, 
  onRemove,
  errors
}: AnswerSectionProps) {
  const { fields: subAnswers, append: appendSubAnswer, remove: removeSubAnswer } = useFieldArray({
    control,
    name: `groups.${groupIndex}.components.${componentIndex}.answers.${answerIndex}.subAnswers`
  });

  const addSubAnswer = () => {
    appendSubAnswer({
      content: ''
    });
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
        <Button
          variant="text"
          startIcon={<AddIcon />}
          onClick={addSubAnswer}
          size="small"
        >
          하위답변
        </Button>
        <IconButton onClick={onRemove} color="error" size="small">
          <DeleteIcon />
        </IconButton>
      </Box>

      {subAnswers.map((subAnswer, subAnswerIndex) => (
        <Box key={subAnswer.id} sx={{ ml: 4, mb: 1 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Chip label="↳ 하위답변" color="info" size="small" />
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
            <IconButton
              onClick={() => removeSubAnswer(subAnswerIndex)}
              color="error"
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      ))}
    </Box>
  );
}