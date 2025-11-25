'use client';

import React from 'react';
import { Button, Box } from '@mui/material';
import { api, BusinessError } from '@/lib/axios';
import { showSuccessToast, showErrorToast, CustomToastContainer } from '@/lib/toast';

export default function ToastTest() {
  const testBusinessError = async () => {
    try {
      // 실제 API 호출 대신 직접 BusinessError 발생
      throw new BusinessError('TEST_ERROR', '테스트 비즈니스 에러입니다');
    } catch (error) {
      if (error instanceof BusinessError) {
        showErrorToast(error.message);
      }
    }
  };

  const testApiError = async () => {
    try {
      // 존재하지 않는 API 호출로 에러 테스트
      await api.get('/test-error-endpoint');
    } catch (error) {
      console.log('API 에러가 발생했습니다:', error);
      showErrorToast();
    }
  };

  

  return (
    <>
      <Box sx={{ p: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button variant="contained" color="success" onClick={() => showSuccessToast()}>
          성공 토스트
        </Button>
        <Button variant="contained" color="error" onClick={() => showErrorToast()}>
          에러 토스트
        </Button>
        <Button variant="contained" color="error" onClick={testBusinessError}>
          BusinessError 테스트
        </Button>
        <Button variant="contained" color="error" onClick={testApiError}>
          API Error 테스트
        </Button>
        <Button variant="contained" color="success" onClick={() => showSuccessToast("사용자 정의 성공 메시지!")}>
          커스텀 성공 메시지
        </Button>
        <Button variant="contained" color="error" onClick={() => showErrorToast("사용자 정의 에러 메시지!")}>
          커스텀 에러 메시지
        </Button>
      </Box>
      
      {/* 커스텀 토스트 컨테이너 */}
      <CustomToastContainer />
    </>
  );
}