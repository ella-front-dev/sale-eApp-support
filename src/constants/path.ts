export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

// CDN 주소가 없으면 public/assets 의 로컬 이미지를 쓴다 (외부 CDN 없이도 화면이 깨지지 않도록)
export const IMG_PREFIX = `${process.env.NEXT_PUBLIC_CDN_URL ?? BASE_PATH}/assets/image-resources`;
