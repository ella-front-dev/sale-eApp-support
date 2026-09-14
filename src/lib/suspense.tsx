import { Suspense } from 'react';

import { PageLoading } from '@/components/Loading';
import { api } from '@/lib/axios';
import { FormData } from '@/types/form';

// Suspense용 데이터 fetcher 생성
function createSuspenseResource<T>(promise: Promise<T>) {
  let status = 'pending';
  let result: T;
  
  const suspender = promise.then(
    (res) => {
      status = 'success';
      result = res;
    },
    (err) => {
      status = 'error';
      result = err;
    }
  );
  
  return {
    read() {
      if (status === 'pending') {
        throw suspender; // Suspense가 catch
      } else if (status === 'error') {
        throw result; // Error Boundary가 catch
      }

      return result;
    }
  };
}

// 폼 데이터를 위한 Suspense 리소스
export function createFormResource(id: string) {
  return createSuspenseResource(api.get<FormData>(`/forms/${id}`));
}

// 폼 목록을 위한 Suspense 리소스
export function createFormListResource() {
  return createSuspenseResource(api.get('/forms'));
}

// Suspense와 함께 사용할 컴포넌트 예시
export function FormDataComponent({ formId }: { formId: string }) {
  const formResource = createFormResource(formId);
  const formData = formResource.read(); // Suspense 트리거
  
  return (
    <div>
      <h2>{formData.title}</h2>
      <p>그룹 수: {formData.groups?.length || 0}</p>
    </div>
  );
}

// 사용 예시
export function FormPageWithSuspense({ formId }: { formId: string }) {
  return (
    <div>
      <h1>폼 관리</h1>
      <Suspense fallback={<PageLoading />}>
        <FormDataComponent formId={formId} />
      </Suspense>
    </div>
  );
}