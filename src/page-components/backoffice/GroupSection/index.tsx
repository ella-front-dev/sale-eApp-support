import React from 'react';
import { Control, FieldErrors, useFieldArray, Controller } from 'react-hook-form';
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

  const addComponent = () => {
    appendComponent({
      name: '',
      answers: []
    });
  };

  const groupError = errors?.groups?.[groupIndex];

  return (
    <Accordion sx={{ mb: 2 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box display="flex" alignItems="center" gap={2} width="100%">
          <Chip label="📁 그룹" color="primary" size="small" />
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
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={addComponent}
          sx={{ mb: 2 }}
          size="small"
        >
          구성 추가
        </Button>

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