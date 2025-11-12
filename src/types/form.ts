// 순수 TypeScript 인터페이스 (Zod 완전 제거)

export interface SubAnswerData {
  id?: string; // React Hook Form이 자동 생성
  code: string;
  content: string;
}

export interface AnswerData {
  id?: string; // React Hook Form이 자동 생성
  content: string;
  subAnswers: SubAnswerData[];
}

export interface ComponentData {
  id?: string; // React Hook Form이 자동 생성
  seq: number; // 채번 필드
  code: string;
  name: string;
  answers: AnswerData[];
}

export interface GroupData {
  id?: string; // React Hook Form이 자동 생성
  seq: number; // 채번 필드
  code: string; // 그룹 코드
  name: string;
  startDate: Date | string;
  endDate: Date | string;
  components: ComponentData[];
}

export interface FormData {
  title: string;
  startDate?: Date | string; // 전체 폼 기간은 선택적
  endDate?: Date | string; // 전체 폼 기간은 선택적
  groups: GroupData[];
}

// ID를 포함한 완전한 폼 인터페이스 (DB 저장용)
export interface FullFormData {
  id: string;
  title: string;
  groups: GroupData[];
}