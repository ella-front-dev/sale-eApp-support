import { ReactNode } from 'react';

import { isAxiosError } from 'axios';

interface ErrorInfoProps {
  error: unknown;
  className?: string;
  body: ReactNode;
}

export const ErrorInfo = ({ error, body, className }: ErrorInfoProps) => {
  // if (APP_ENV !== 'local' || process.env.STORYBOOK === 'true') {
  //   return body;
  // }

  if (!isAxiosError(error)) {
    // Axios 에러가 아닌 경우
    return (
      <>
        {body}
        <div
          className={`${className} mt-20`}
          style={{ border: '1px solid #ccc', padding: '1rem', wordBreak: 'break-all' }}
        >
          <strong>[QA용] 로그</strong>
          <p className="pt-10">
            <strong>에러 타입:</strong> {error instanceof Error ? 'Error' : 'Unknown'}
          </p>
          <p>
            <strong>에러 메시지:</strong> {error instanceof Error ? error.message : String(error)}
          </p>
        </div>
      </>
    );
  }

  // Axios 에러인 경우
  const statusCode = error.response?.status;
  const customErrorCode = error.response?.data?.code;
  const customErrorExceptionId = error.response?.data?.exceptionId;
  const customErrorMsg = error.response?.data?.message;
  const requestUrl = error.config?.url;
  const requestMethod = error.config?.method?.toUpperCase();

  return (
    <>
      {body}
      <div
        className={`${className}  mt-20`}
        style={{ border: '1px solid #ccc', padding: '1rem', wordBreak: 'break-all' }}
      >
        <strong> [QA용] 로그</strong>
        <p className="pt-10">
          <strong>HTTP 상태 코드:</strong> {statusCode || 'N/A'}
        </p>
        {customErrorCode && (
          <p>
            <strong>code:</strong> {customErrorCode}
          </p>
        )}
        {customErrorExceptionId && (
          <p>
            <strong>exceptionId:</strong> {customErrorExceptionId}
          </p>
        )}
        <p>
          <strong>message:</strong> {customErrorMsg || error.message}
        </p>
        {requestUrl && (
          <p>
            <strong>요청 URL:</strong> {requestMethod} {requestUrl}
          </p>
        )}
      </div>
    </>
  );
};
