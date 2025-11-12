'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Alert,
  CircularProgress,
  TextField,
  Stack
} from '@mui/material';
import { useCommonCodes } from '@/lib/commonCodeService';

// 실제 사용 예시 컴포넌트 (실제 API 사용)
export default function RealFormExample() {
  // 실제 API 사용 (Mock 비활성화)
  const { 
    getSelectOptions, 
    getRadioOptions, 
    getDefaultValue, 
    loading, 
    error, 
    isReady 
  } = useCommonCodes('form', false); // Mock 비활성화

  // 폼 데이터
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '', // 카테고리 (공통코드)
    priority: '', // 우선순위 (공통코드)
    status: '',   // 상태 (공통코드)
    description: ''
  });

  // 폼 검증 에러
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 컴포넌트 마운트 시 기본값 설정
  React.useEffect(() => {
    if (isReady) {
      setFormData(prev => ({
        ...prev,
        category: getDefaultValue(1)?.value || '',
        priority: getDefaultValue(2)?.value || '',
        status: getDefaultValue(3)?.value || ''
      }));
    }
  }, [isReady, getDefaultValue]);

  // 폼 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 간단한 유효성 검사
    const newErrors: Record<string, string> = {};
    
    if (!formData.name) newErrors.name = '이름을 입력하세요';
    if (!formData.email) newErrors.email = '이메일을 입력하세요';
    if (!formData.category) newErrors.category = '카테고리를 선택하세요';
    if (!formData.priority) newErrors.priority = '우선순위를 선택하세요';
    if (!formData.status) newErrors.status = '상태를 선택하세요';
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      // 제출 처리
      console.log('Form submitted:', formData);
      alert('폼이 성공적으로 제출되었습니다!');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>공통 코드 로딩 중...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        공통 코드 로딩 실패: {error}
        <br />
        <Typography variant="body2" sx={{ mt: 1 }}>
          실제 API 연동이 필요합니다. Mock 데이터를 사용하려면 useCommonCodes(&apos;form&apos;, true)로 변경하세요.
        </Typography>
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        📝 실제 폼 예시 (공통코드 활용)
      </Typography>

      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {/* 기본 입력 필드들 */}
              <TextField
                label="이름"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                error={!!errors.name}
                helperText={errors.name}
                fullWidth
                required
              />

              <TextField
                label="이메일"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                error={!!errors.email}
                helperText={errors.email}
                fullWidth
                required
              />

              {/* 공통코드 Select 필드들 */}
              {isReady && (
                <>
                  <FormControl fullWidth error={!!errors.category} required>
                    <InputLabel>카테고리</InputLabel>
                    <Select
                      value={formData.category}
                      label="카테고리"
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    >
                      {getSelectOptions(1, true).map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.category && (
                      <Typography variant="caption" color="error">
                        {errors.category}
                      </Typography>
                    )}
                  </FormControl>

                  <FormControl error={!!errors.priority} required>
                    <Typography variant="subtitle2" gutterBottom>
                      우선순위 *
                    </Typography>
                    <RadioGroup
                      value={formData.priority}
                      onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                      row
                    >
                      {getRadioOptions(2).map((option) => (
                        <FormControlLabel
                          key={option.value}
                          value={option.value}
                          control={<Radio />}
                          label={option.label}
                        />
                      ))}
                    </RadioGroup>
                    {errors.priority && (
                      <Typography variant="caption" color="error">
                        {errors.priority}
                      </Typography>
                    )}
                  </FormControl>

                  <FormControl fullWidth error={!!errors.status} required>
                    <InputLabel>상태</InputLabel>
                    <Select
                      value={formData.status}
                      label="상태"
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    >
                      {getSelectOptions(3, false).map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.status && (
                      <Typography variant="caption" color="error">
                        {errors.status}
                      </Typography>
                    )}
                  </FormControl>
                </>
              )}

              <TextField
                label="설명"
                multiline
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                fullWidth
              />

              {/* 제출 버튼들 */}
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => {
                    setFormData({
                      name: '',
                      email: '',
                      category: getDefaultValue(1)?.value || '',
                      priority: getDefaultValue(2)?.value || '',
                      status: getDefaultValue(3)?.value || '',
                      description: ''
                    });
                    setErrors({});
                  }}
                >
                  초기화
                </Button>
                
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!isReady}
                >
                  제출
                </Button>
              </Box>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      {/* 현재 폼 상태 표시 */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            현재 폼 데이터
          </Typography>
          <pre style={{ 
            background: '#f5f5f5', 
            padding: '16px', 
            borderRadius: '4px',
            fontSize: '12px',
            overflow: 'auto'
          }}>
            {JSON.stringify(formData, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </Box>
  );
}