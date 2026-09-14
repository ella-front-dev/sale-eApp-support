// 이미지 import 타입. next-env.d.ts 에도 같은 참조가 있지만 그 파일은 빌드 시
// 자동 생성되고 gitignore 되므로, 빌드 전에 돌리는 tsc 에서도 해석되도록 여기에 둔다.
/// <reference types="next/image-types/global" />

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module 'sales-frontend-design-system/layout/*' {
  const classes: { [key: string]: string };
  export default classes;
}
