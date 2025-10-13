'use client';

import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import theme from '../style/theme';

// dayjs 플러그인 확장 (극단적 날짜 처리 개선)
dayjs.extend(utc);
dayjs.extend(timezone);

interface MuiThemeProviderProps {
  children: React.ReactNode;
}

export default function MuiThemeProvider({ children }: MuiThemeProviderProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider 
        dateAdapter={AdapterDayjs}
        adapterLocale="ko"
        dateFormats={{
          keyboardDate: 'YYYY-MM-DD',
          year: 'YYYY',
          month: 'MM',
          monthShort: 'MMM',
          dayOfMonth: 'DD',
          fullDate: 'YYYY-MM-DD'
        }}
      >
        {children}
      </LocalizationProvider>
    </ThemeProvider>
  );
}