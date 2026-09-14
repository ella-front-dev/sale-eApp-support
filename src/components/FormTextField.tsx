import React from 'react';

import { TextField, TextFieldProps } from '@mui/material';
import { Controller, Control, Path } from 'react-hook-form';

import { FormData } from '@/types/form';

interface FormTextFieldProps {
  name: Path<FormData>;
  control: Control<FormData>;
  label: string;
  placeholder?: string;
  textFieldProps?: Partial<TextFieldProps>;
}

export default function FormTextField({
  name,
  control,
  label,
  placeholder,
  textFieldProps = {}
}: FormTextFieldProps) {
  return (
    <Controller
      name={name}
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