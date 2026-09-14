import { http, delay, HttpResponse } from 'msw';

type Method = 'get' | 'post' | 'put' | 'delete';

const methodMap = {
  get: http.get,
  post: http.post,
  put: http.put,
  delete: http.delete
};

interface IMockHandlerOptions {
  method?: Method;
  path: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  response: any | ((req: any) => any | Promise<any>);
  status?: number;
  delayMs?: number;
  log?: boolean;
  resolver?: (body: any, req: Request) => any;
}

/**
 * MSW 요청 랩퍼(Mock 핸들러 사용시 이 함수로 래핑해주세요.)
 * @param param0
 * @returns
 */
export const createMockHandler = ({
  method = 'post',
  path,
  response,
  status = 200,
  delayMs = 1500,
}: IMockHandlerOptions) => {
  const handler = methodMap[method];

  return handler(path, async (req) => {
    // Infinity 처리
    if (delayMs === Infinity) {
      // 무한 대기 Promise
      await new Promise(() => {});
    } else {
      await delay(delayMs);
    }

    // Request body 파싱
    let body: any | null = null;
    if (method === 'post') {
      try {
        body = await req.request.json();
      } catch {
        body = undefined;
      }
    }
    const parsedReq = { ...req, body };

    const result = typeof response === 'function' ? await response(parsedReq) : response;

    return HttpResponse.json(result, { status });
  });
};
