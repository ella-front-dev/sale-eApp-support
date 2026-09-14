"use client";
import React, { Suspense, useEffect, useState, startTransition, useTransition } from 'react';

import { Box, Button, Card, CardContent, CircularProgress, Divider, Typography, TextField, Select, MenuItem, Chip } from '@mui/material';
import { useForm, FormProvider, useFieldArray, useFormContext, Controller, type FieldValues, type UseFormReturn } from 'react-hook-form';
// NOTE: react-virtuoso or react-window can be conditionally imported. Left as comment for optional virtualization.
// import { Virtuoso } from 'react-virtuoso';

/**
 * High-level FormData shape optimized for partial loading & large lists.
 */
export interface SubAnswer { id: string; code: string; content: string; }
export interface Answer { id: string; code: string; content: string; type?: string; serviceCode?: string; valueType?: string; subAnswers?: SubAnswer[]; }
export interface ComponentItem { id: string; seq: number; code: string; name: string; answers?: Answer[]; }
export interface GroupItem { id: string; seq: number; code: string; name: string; startDate?: string; endDate?: string; components?: ComponentItem[]; }
export interface FormData { title: string; groups: GroupItem[]; meta?: { formId?: string; mode: 'create' | 'edit' }; }

const EMPTY_FORM: FormData = { title: '', groups: [], meta: { mode: 'create' } };

/**
 * Performance notes:
 * - Each level isolated in RHF via nested FormProvider or controlled boundary to avoid cascading re-renders.
 * - Virtualization optional once counts exceed threshold.
 * - Lazy registration: only register visible items (accordion open or within viewport) for extremely large data.
 */
export default function LargeFormPage() {
  const methods = useForm<FormData>({
    defaultValues: EMPTY_FORM,
    mode: 'onSubmit', // 대량 입력 성능 최적화
    shouldUnregister: true, // 접힌/미표시 영역은 레지스트리에서 제거
  });

  const { control, handleSubmit, register, formState, setValue } = methods;
  const { fields: groupFields, append: appendGroup, replace: replaceGroups } = useFieldArray({ control, name: 'groups' });
  const [isPending, startUITransition] = useTransition();

  // 대량 샘플 데이터 생성기
  const buildSampleGroups = (componentCount = 200, answersPer = 4, subPer = 2): GroupItem[] => {
    const mkId = () => crypto.randomUUID();
    const sub = (ai: number) => Array.from({ length: subPer }).map((_, si) => ({ id: mkId(), code: `SUB_${ai + 1}_${si + 1}`, content: `하위 ${ai + 1}-${si + 1}` }));
    const ans = () => Array.from({ length: answersPer }).map((_, ai) => ({ id: mkId(), code: `ANS_${ai + 1}`, content: `답변 ${ai + 1}`, type: 'FP', valueType: 'TEXT', serviceCode: 'Group1', subAnswers: sub(ai) }));
    const comps = Array.from({ length: componentCount }).map((_, ci) => ({ id: mkId(), seq: ci + 1, code: `CMP_${String(ci + 1).padStart(3, '0')}`, name: `컴포넌트 ${ci + 1}`, answers: ans() }));

    return [{ id: mkId(), seq: 1, code: 'GRP_001', name: '샘플 그룹', startDate: '', endDate: '', components: comps }];
  };

  // 샘플 주입: 즉시 또는 transition으로 분할 스케줄
  const loadLargeSample = (useTransitionMode: boolean) => {
    performance.mark('sample-load-start');
    setValue('title', '샘플 서식');
    const groups = buildSampleGroups(200, 4, 2);
    const exec = () => replaceGroups(groups);
    if (useTransitionMode) {
      startUITransition(exec);
    } else {
      exec();
    }
    performance.mark('sample-load-end');
    performance.measure('sample-load', 'sample-load-start', 'sample-load-end');
  };

  // 그룹을 추가할 때 성능 마킹
  const addGroup = () => {
    performance.mark('add-group-start');
    appendGroup({ id: crypto.randomUUID(), seq: groupFields.length + 1, code: '', name: '', components: [] });
    performance.mark('add-group-end');
    performance.measure('add-group', 'add-group-start', 'add-group-end');
  };

  const onSubmit = (_data: FormData) => {
    performance.mark('submit-start');
    // Simulate async save
    setTimeout(() => {
      performance.mark('submit-end');
      performance.measure('form-submit', 'submit-start', 'submit-end');
      // Inspect measure in Performance panel
    }, 300);
  };

  return (
    <FormProvider {...methods}>
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h5">대용량 서식 편집 (Prototype)</Typography>
        {/* 폼 헤더: 대부분 Uncontrolled */}
        <Card variant="outlined" sx={{ p: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <TextField label="서식 제목" size="small" sx={{ minWidth: 240 }} {...register('title', { required: '서식 제목 필수' })} error={!!formState.errors.title} helperText={formState.errors.title?.message} />
          {/* Controlled Select 예시 */}
          <Controller
            name="meta.mode"
            control={control}
            defaultValue="create"
            render={({ field }) => (
              <Select {...field} size="small" displayEmpty sx={{ minWidth: 160 }}>
                <MenuItem value="create">생성 모드</MenuItem>
                <MenuItem value="edit">수정 모드</MenuItem>
              </Select>
            )}
          />
          <Button variant="contained" onClick={addGroup}>그룹 추가</Button>
          <Button variant="outlined" onClick={() => loadLargeSample(false)}>샘플(200) 즉시</Button>
          <Button variant="outlined" onClick={() => loadLargeSample(true)}>샘플(200) transition</Button>
          {isPending && <Chip size="small" color="warning" label="Transition pending…" />}
          <Typography variant="caption" sx={{ ml: 'auto' }}>총 그룹: {groupFields.length}</Typography>
        </Card>
        <Divider />
        <Suspense fallback={<CircularProgress />}> {/* Placeholder for future streaming */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {groupFields.map((g, gi) => (
              <GroupCard key={g.id} groupIndex={gi} groupField={g as GroupField} />
            ))}
          </Box>
        </Suspense>
        <Divider />
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Button type="submit" variant="contained">Submit</Button>
        </Box>
      </Box>
    </FormProvider>
  );
}

/** GroupCard: isolates re-renders per group via local fieldArray hooks. */
type GroupField = GroupItem & { id: string };

function GroupCard({ groupIndex, groupField }: { groupIndex: number; groupField: GroupField }) {
  const { control, register } = useFormContextSafe<FormData>();
  const { fields: componentFields, append: appendComponent } = useFieldArray({ control, name: `groups.${groupIndex}.components` });

  const addComponent = () => {
    performance.mark('add-component-start');
    appendComponent({ id: crypto.randomUUID(), seq: componentFields.length + 1, code: '', name: '', answers: [] });
    performance.mark('add-component-end');
    performance.measure('add-component', 'add-component-start', 'add-component-end');
  };

  // Chunking: 자동 순차 노출(버튼 없이도 차례대로 표시)
  const CHUNK_SIZE = 5;
  const [visibleCount, setVisibleCount] = useState(CHUNK_SIZE);
  const [autoReveal, setAutoReveal] = useState(true);

  // 필드 수가 변하면 자동으로 일정 간격으로 가시 개수 증가
  useEffect(() => {
    if (!autoReveal) {
return;
}
    if (visibleCount >= componentFields.length) {
return;
}
    const handle = setTimeout(() => {
      startTransition(() => setVisibleCount((c) => Math.min(c + CHUNK_SIZE, componentFields.length)));
    }, 32); // 약 2프레임 텀

    return () => clearTimeout(handle);
  }, [autoReveal, visibleCount, componentFields.length]);

  const showMore = () => {
    setAutoReveal(false); // 수동으로 전환
    startTransition(() => setVisibleCount(c => Math.min(c + CHUNK_SIZE, componentFields.length)));
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Chip label={`그룹 ${groupIndex + 1}`} color="primary" size="small" />
          <TextField size="small" label="그룹 코드" sx={{ width: 140 }} defaultValue={groupField.code} {...register(`groups.${groupIndex}.code`)} />
          <TextField size="small" label="그룹명" sx={{ width: 200 }} defaultValue={groupField.name} {...register(`groups.${groupIndex}.name`)} />
          <Button size="small" onClick={addComponent}>컴포넌트 추가</Button>
          {componentFields.length > visibleCount && (
            <>
              <Button size="small" variant="outlined" onClick={showMore}>더 보기 (+{CHUNK_SIZE})</Button>
              {autoReveal && <Chip size="small" color="info" label="자동 로드 중" />}
            </>
          )}
          <Typography variant="caption" sx={{ ml: 'auto' }}>총 컴포넌트: {componentFields.length}</Typography>
        </Box>
        <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {componentFields.map((c, idx) => (
            idx < visibleCount ? (
              <ComponentCard key={c.id} groupIndex={groupIndex} componentIndex={idx} componentField={c as ComponentField} />
            ) : null
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}

type ComponentField = ComponentItem & { id: string };

function ComponentCard({ groupIndex, componentIndex, componentField }: { groupIndex: number; componentIndex: number; componentField: ComponentField }) {
  const { control, register } = useFormContextSafe<FormData>();
  const { fields: answerFields, append: appendAnswer } = useFieldArray({ control, name: `groups.${groupIndex}.components.${componentIndex}.answers` });

  const addAnswer = () => {
    performance.mark('add-answer-start');
    appendAnswer({ id: crypto.randomUUID(), code: '', content: '', type: '', serviceCode: '', valueType: '', subAnswers: [] });
    performance.mark('add-answer-end');
    performance.measure('add-answer', 'add-answer-start', 'add-answer-end');
  };

  return (
    <Box sx={{ border: '1px dashed #ddd', p: 1, borderRadius: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
  <Chip label={`컴포넌트 ${componentIndex + 1}`} size="small" />
  <TextField size="small" label="코드" sx={{ width: 120 }} defaultValue={componentField.code} {...register(`groups.${groupIndex}.components.${componentIndex}.code`)} />
  <TextField size="small" label="명" sx={{ width: 160 }} defaultValue={componentField.name} {...register(`groups.${groupIndex}.components.${componentIndex}.name`)} />
        <Button size="small" onClick={addAnswer}>답변 추가</Button>
        <Typography variant="caption" sx={{ ml: 'auto' }}>답변 수: {answerFields.length}</Typography>
      </Box>
      <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {answerFields.map((a, ai) => (
            <AnswerBlock key={a.id} groupIndex={groupIndex} componentIndex={componentIndex} answerIndex={ai} answerField={a as AnswerField} />
          ))}
      </Box>
    </Box>
  );
}

type AnswerField = Answer & { id: string };

function AnswerBlock({ groupIndex, componentIndex, answerIndex, answerField }: { groupIndex: number; componentIndex: number; answerIndex: number; answerField: AnswerField }) {
  const { control, register } = useFormContextSafe<FormData>();
  const { fields: subAnswerFields, append: appendSub } = useFieldArray({ control, name: `groups.${groupIndex}.components.${componentIndex}.answers.${answerIndex}.subAnswers` });
  const addSub = () => appendSub({ id: crypto.randomUUID(), code: '', content: '' });

  return (
    <Box sx={{ border: '1px solid #efefef', p: 0.5, borderRadius: 0.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
        <Chip label={`답변 ${answerIndex + 1}`} color="success" size="small" />
        {/* Uncontrolled 필드 */}
  <TextField size="small" label="답변 코드" sx={{ width: 130 }} defaultValue={answerField.code} {...register(`groups.${groupIndex}.components.${componentIndex}.answers.${answerIndex}.code`)} />
  <TextField size="small" label="답변 내용" sx={{ width: 200 }} defaultValue={answerField.content} {...register(`groups.${groupIndex}.components.${componentIndex}.answers.${answerIndex}.content`)} />
        {/* Controlled Select 예시들 */}
        <Controller
          name={`groups.${groupIndex}.components.${componentIndex}.answers.${answerIndex}.type`}
          control={control}
          defaultValue={answerField.type ?? ""}
          render={({ field }) => (
            <Select {...field} size="small" displayEmpty sx={{ width: 110 }}>
              <MenuItem value="">타입</MenuItem>
              <MenuItem value="FP">FP</MenuItem>
              <MenuItem value="BP">BP</MenuItem>
            </Select>
          )}
        />
        <Controller
          name={`groups.${groupIndex}.components.${componentIndex}.answers.${answerIndex}.valueType`}
          control={control}
          defaultValue={answerField.valueType ?? ""}
          render={({ field }) => (
            <Select {...field} size="small" displayEmpty sx={{ width: 120 }}>
              <MenuItem value="">VALUE</MenuItem>
              <MenuItem value="TEXT">TEXT</MenuItem>
              <MenuItem value="NUM">NUM</MenuItem>
            </Select>
          )}
        />
        <Controller
          name={`groups.${groupIndex}.components.${componentIndex}.answers.${answerIndex}.serviceCode`}
          control={control}
          defaultValue={answerField.serviceCode ?? ""}
          render={({ field }) => (
            <Select {...field} size="small" displayEmpty sx={{ width: 130 }}>
              <MenuItem value="">서비스</MenuItem>
              <MenuItem value="Group1">Group1</MenuItem>
              <MenuItem value="Group2">Group2</MenuItem>
            </Select>
          )}
        />
        <Button size="small" onClick={addSub}>하위 추가</Button>
        <Typography variant="caption">하위:{subAnswerFields.length}</Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
        {subAnswerFields.map((s, si) => (
          <Box key={s.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TextField size="small" label="하위 코드" sx={{ width: 120 }} defaultValue={(s as unknown as SubAnswer).code} {...register(`groups.${groupIndex}.components.${componentIndex}.answers.${answerIndex}.subAnswers.${si}.code`)} />
            <TextField size="small" label="하위 내용" sx={{ width: 160 }} defaultValue={(s as unknown as SubAnswer).content} {...register(`groups.${groupIndex}.components.${componentIndex}.answers.${answerIndex}.subAnswers.${si}.content`)} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

// Safe context hook (helps with potential optional nested providers later)
function useFormContextSafe<T extends FieldValues = FieldValues>(): UseFormReturn<T> {
  // If FormProvider is missing above, useFormContext will throw – which is desirable.
  return useFormContext<T>();
}
