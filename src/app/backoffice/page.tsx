'use client';

import React from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema, FormData } from '@/types/form';
import GroupSection from '@/page-components/backoffice/GroupSection';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Box,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Save as SaveIcon
} from '@mui/icons-material';


export default function BackofficePage() {
  const { control, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      groups: []
    }
  });
  
  const { fields: groups, append: appendGroup, remove: removeGroup } = useFieldArray({
    control,
    name: 'groups'
  });

  // 그룹 추가
  const addGroup = () => {
    appendGroup({
      name: '',
      components: []
    });
  };

  // 폼 제출
  const onSubmit = (data: FormData) => {
    console.log('✅ Form Validation Passed!');
    console.log('📋 Form Data:', data);
    
    // 데이터 통계
    const stats = {
      groups: data.groups.length,
      components: data.groups.reduce((acc, group) => acc + group.components.length, 0),
      answers: data.groups.reduce((acc, group) => 
        acc + group.components.reduce((acc2, comp) => acc2 + comp.answers.length, 0), 0),
      subAnswers: data.groups.reduce((acc, group) => 
        acc + group.components.reduce((acc2, comp) => 
          acc2 + comp.answers.reduce((acc3, answer) => acc3 + answer.subAnswers.length, 0), 0), 0)
    };
    
    alert(`
    폼이 성공적으로 저장되었습니다! 🎉
    
    📊 통계:
    - 그룹: ${stats.groups}개
    - 구성: ${stats.components}개  
    - 답변: ${stats.answers}개
    - 하위답변: ${stats.subAnswers}개
    `);
  };

  const watchedData = watch();

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        백오피스 - 설문 폼 관리 (React Hook Form + Zod) ⚡
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* 서식 제목 */}
        <Card sx={{ mb: 3 }}>
          <CardHeader title="📝 서식 정보" />
          <CardContent>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="서식 제목"
                  fullWidth
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  sx={{ mb: 2 }}
                  placeholder="예: 고객 만족도 설문"
                />
              )}
            />
            
            <Box display="flex" gap={2} flexWrap="wrap">
              <Button
                type="button"
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addGroup}
              >
                그룹 추가
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                color="primary"
              >
                저장 및 검증
              </Button>
            </Box>

            {/* 전체 폼 에러 */}
            {Object.keys(errors).length > 0 && (
              <Alert severity="error" sx={{ mt: 2 }}>
                ❌ 폼에 오류가 있습니다. 모든 필수 항목을 확인해주세요.
                <Box component="ul" sx={{ mt: 1, pl: 2 }}>
                  {errors.title && <li>서식 제목이 필요합니다</li>}
                  {errors.groups && <li>그룹 정보에 오류가 있습니다</li>}
                </Box>
              </Alert>
            )}

            {/* 성공 표시 */}
            {Object.keys(errors).length === 0 && watchedData.title && (
              <Alert severity="success" sx={{ mt: 2 }}>
                ✅ 모든 필드가 올바르게 입력되었습니다!
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* 그룹 목록 */}
        {groups.map((group, groupIndex) => (
          <GroupSection
            key={group.id}
            control={control}
            groupIndex={groupIndex}
            onRemove={() => removeGroup(groupIndex)}
            errors={errors}
          />
        ))}

        {groups.length === 0 && (
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                📋 아직 그룹이 없습니다
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addGroup}
              >
                첫 번째 그룹 추가하기
              </Button>
            </CardContent>
          </Card>
        )}
      </form>

      {/* JSON 미리보기 */}
      <Card sx={{ mt: 4 }}>
        <CardHeader title="🔍 실시간 데이터 미리보기" />
        <CardContent>
          <pre style={{ 
            fontSize: '12px', 
            overflow: 'auto', 
            maxHeight: '300px',
            backgroundColor: '#f5f5f5',
            padding: '16px',
            borderRadius: '4px'
          }}>
            {JSON.stringify(watchedData, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </Container>
  );
}