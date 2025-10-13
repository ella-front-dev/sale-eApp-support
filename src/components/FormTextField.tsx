import React from 'react';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { TextField, TextFieldProps } from '@mui/material';
import { FormData } from '@/types/form';

interface FormTextFieldProps {
  name: string;
  control: Control<FormData>;
  errors?: FieldErrors<FormData>;
  label: string;
  placeholder?: string;
  textFieldProps?: Partial<TextFieldProps>;
}

export default function FormTextField({
  name,
  control,
  errors,
  label,
  placeholder,
  textFieldProps = {}
}: FormTextFieldProps) {
  return (
    <Controller
      name={name as any} // 타입 단언 (실제로는 더 정확한 타입 지정 필요)
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          label={label}
          placeholder={placeholder}
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
          {...textFieldProps}
        />
      )}
    />
  );
}