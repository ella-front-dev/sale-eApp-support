'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    error: {
      main: '#d32f2f',
      light: '#ef5350',
      dark: '#c62828',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    // TextField 에러 스타일 커스터마이징
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiFormHelperText-root.Mui-error': {
            color: '#d32f2f',
            fontWeight: 500,
            fontSize: '0.75rem',
            marginTop: '4px',
            lineHeight: 1.2,
          },
          '& .MuiOutlinedInput-root.Mui-error': {
            '& fieldset': {
              borderColor: '#d32f2f',
              borderWidth: '2px',
            },
            '&:hover fieldset': {
              borderColor: '#b71c1c',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#d32f2f',
              borderWidth: '2px',
            },
          },
          '& .MuiInputLabel-root.Mui-error': {
            color: '#d32f2f',
            fontWeight: 500,
          },
        },
      },
    },
    // FormControl 에러 스타일
    MuiFormControl: {
      styleOverrides: {
        root: {
          '& .MuiFormHelperText-root.Mui-error': {
            backgroundColor: 'rgba(211, 47, 47, 0.04)',
            padding: '4px 8px',
            borderRadius: '4px',
            margin: '4px 0 0 0',
          },
        },
      },
    },
    // Alert 컴포넌트 스타일 (현재 페이지에서 사용 중)
    MuiAlert: {
      styleOverrides: {
        standardError: {
          backgroundColor: '#fdeded',
          color: '#5f2120',
          '& .MuiAlert-icon': {
            color: '#d32f2f',
          },
        },
        standardWarning: {
          backgroundColor: '#fff4e5',
          color: '#663c00',
          '& .MuiAlert-icon': {
            color: '#ed6c02',
          },
        },
      },
    },
  },
});

export default theme;