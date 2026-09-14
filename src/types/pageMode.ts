export type PageMode = 'register' | 'edit' | 'update';

export interface PagePermissions {
  canAdd: boolean;              // 새 항목 추가 가능
  canDelete: boolean;           // 기존 항목 삭제 가능
  canDeleteExisting: boolean;   // 기존(서버에서 온) 데이터 삭제 가능
  canDeleteNew: boolean;        // 새로 추가한 데이터 삭제 가능
}

export const MODE_PERMISSIONS: Record<PageMode, PagePermissions> = {
  register: {
    canAdd: true,
    canDelete: true,
    canDeleteExisting: true,  // 모든 항목 삭제 가능
    canDeleteNew: true
  },
  edit: {
    canAdd: true,
    canDelete: true,
    canDeleteExisting: true,  // 모든 항목 삭제 가능
    canDeleteNew: true
  },
  update: {
    canAdd: true,
    canDelete: true,          // 전체적으로는 삭제 가능
    canDeleteExisting: false, // 기존 항목은 삭제 불가
    canDeleteNew: true        // 새로 추가한 항목은 삭제 가능
  }
};

// 페이지 모드별 제목
export const MODE_TITLES: Record<PageMode, string> = {
  register: '📝 새 설문 등록',
  edit: '✏️ 설문 전체 수정',
  update: '🔄 설문 부분 업데이트'
};

// 페이지 모드별 버튼 텍스트
export const MODE_BUTTON_TEXTS: Record<PageMode, string> = {
  register: '등록',
  edit: '수정 완료',
  update: '업데이트 완료'
};

// 새로 추가된 항목인지 확인하는 유틸리티 함수들

// 점(.)으로 구분된 경로 문자열을 따라 값을 조회하는 헬퍼 (예: "groups.0.components")
const getAtPath = (obj: unknown, path: string[]): unknown =>
  path.reduce((current: unknown, key) => (current as Record<string, unknown> | undefined)?.[key], obj);

// 방법 1: 초기 데이터와 비교하여 새 항목인지 판단
export const isNewItemByComparison = (
  itemPath: string, // 예: "groups.0.components.1"
  initialData: unknown,
  currentData: unknown
): boolean => {
  try {
    const pathArray = itemPath.split('.');

    const initialItem = getAtPath(initialData, pathArray);
    const currentItem = getAtPath(currentData, pathArray);

    // 초기 데이터에 없었다면 새로 추가된 항목
    return !initialItem && !!currentItem;
  } catch {
    return true; // 에러 발생 시 새 항목으로 간주
  }
};

// 방법 2: 배열 길이 비교 (권장 - 가장 간단하고 효율적)
export const isNewItemByIndex = (
  arrayPath: string, // 예: "groups.0.components"
  itemIndex: number,
  initialData: unknown
): boolean => {
  try {
    const pathArray = arrayPath.split('.');

    const initialArray = getAtPath(initialData, pathArray);
    const initialLength = Array.isArray(initialArray) ? initialArray.length : 0;

    return itemIndex >= initialLength; // 초기 길이보다 큰 인덱스면 새 항목
  } catch {
    return true;
  }
};

// 방법 3: 가장 간단한 방법 - 단순 플래그
export const canDeleteSimple = (permissions: PagePermissions, mode: PageMode): boolean => {
  // update 모드가 아니면 항상 삭제 가능
  if (mode !== 'update') {
return true;
}
  
  // update 모드에서는 canDeleteNew만 확인 (기존 데이터는 삭제 불가로 간주)
  return permissions.canDeleteNew;
};

// 삭제 가능 여부를 판단하는 함수 (방법 2 사용 - 가장 실용적)
export const canDeleteItemByIndex = (
  permissions: PagePermissions, 
  arrayPath: string,
  itemIndex: number,
  initialData: unknown
): boolean => {
  if (permissions.canDeleteExisting && permissions.canDeleteNew) {
    return true; // 모든 항목 삭제 가능
  }
  
  if (!initialData) {
    return permissions.canDeleteNew; // 초기 데이터가 없으면 모든 항목이 새 항목
  }
  
  const isNew = isNewItemByIndex(arrayPath, itemIndex, initialData);
  
  return isNew ? permissions.canDeleteNew : permissions.canDeleteExisting;
};