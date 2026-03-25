'use client';

import { postLoginMethod } from 'sales-frontend-api/method';
import { DebugTool } from 'sales-frontend-debug';
import { setCookie } from 'sales-frontend-utils';

import { APP_ENV } from '@/constants/environments';

export function DebugToolDsp() {
  return (
    <DebugTool
      envOverride={APP_ENV}
      serviceCode="dsp"
      onLogin={(_, formData) => {
        const res = postLoginMethod(Number(formData.employeeId));
        res
          .then((res) => {
            const { accessToken, refreshToken } = res.data;
            setCookie('accessToken', accessToken);
            setCookie('refreshToken', refreshToken);
          })
          .catch((err) => {
            console.log('error', err);
          });
      }}
    />
  );
}
