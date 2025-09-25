import { z } from 'zod';

// Zod 스키마 정의 (React Hook Form용 - id 선택적)
const subAnswerSchema = z.object({
  id: z.string().optional(), // React Hook Form이 자동 생성
  content: z.string().min(1, '하위답변 내용을 입력해주세요')
});

const answerSchema = z.object({
  id: z.string().optional(), // React Hook Form이 자동 생성
  content: z.string().min(1, '답변 내용을 입력해주세요'),
  subAnswers: z.array(subAnswerSchema)
});

const componentSchema = z.object({
  id: z.string().optional(), // React Hook Form이 자동 생성
  name: z.string().min(1, '구성명을 입력해주세요'),
  answers: z.array(answerSchema)
});

const groupSchema = z.object({
  id: z.string().optional(), // React Hook Form이 자동 생성
  name: z.string().min(1, '그룹명을 입력해주세요'),
  components: z.array(componentSchema)
});

export const formSchema = z.object({
  title: z.string().min(1, '서식 제목을 입력해주세요'),
  groups: z.array(groupSchema)
});

// ID를 포함한 완전한 폼 스키마 (DB 저장용)
export const fullFormSchema = z.object({
  id: z.string(),
  title: z.string().min(1, '서식 제목을 입력해주세요'),
  groups: z.array(groupSchema)
});

export type FormData = z.infer<typeof formSchema>;
export type FullFormData = z.infer<typeof fullFormSchema>;
export type GroupData = z.infer<typeof groupSchema>;
export type ComponentData = z.infer<typeof componentSchema>;
export type AnswerData = z.infer<typeof answerSchema>;
export type SubAnswerData = z.infer<typeof subAnswerSchema>;