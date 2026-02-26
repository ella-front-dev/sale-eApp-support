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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip
} from '@mui/material';
import { useCommonCodes } from '@/lib/commonCodeService';

export default function CommonCodeDemo() {
  // 공통 코드 Hook 사용 (Mock 데이터 사용)
  const { 
    loading, 
    error, 
    getCodes, 
    getSelectOptions, 
    getRadioOptions, 
    getFirstCode,
    getAllGroups,
    isReady 
  } = useCommonCodes('demo', true);

  // 폼 상태
  const [formData, setFormData] = useState({
    answer: '',
    satisfaction: '',
    device: ''
  });

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
        에러 발생: {error}
      </Alert>
    );
  }

  if (!isReady) {
    return (
      <Alert severity="warning" sx={{ mb: 2 }}>
        공통 코드를 사용할 수 없습니다.
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        🔧 공통 코드 포맷팅 & 사용 예시
      </Typography>

      {/* API 원본 vs 포맷팅된 결과 비교 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📊 API 원본 데이터 vs 포맷팅된 결과
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
            {/* 원본 API 형태 */}
            <Box>
              <Typography variant="subtitle2" gutterBottom color="primary">
                API 원본 형태:
              </Typography>
              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                <pre style={{ fontSize: '11px', margin: 0, overflow: 'auto' }}>
{`[
  {
    codeid: 1,
    codeList: [
      { CodeValue: "", Codelabel: "선택하세요" },
      { CodeValue: "Y", Codelabel: "예" },
      { CodeValue: "N", Codelabel: "아니오" }
    ],
    defaultValue: { value: "", label: "선택하세요" }
  }
]`}
                </pre>
              </Paper>
            </Box>

            {/* 포맷팅된 형태 */}
            <Box>
              <Typography variant="subtitle2" gutterBottom color="secondary">
                포맷팅된 형태:
              </Typography>
              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                <pre style={{ fontSize: '11px', margin: 0, overflow: 'auto' }}>
{`[
  {
    id: 1,
    codes: [
      { value: "", label: "선택하세요" },
      { value: "Y", label: "예" },
      { value: "N", label: "아니오" }
    ],
    defaultValue: { value: "", label: "선택하세요" }
  }
]`}
                </pre>
              </Paper>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* 실제 포맷팅된 데이터 표시 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📋 실제 포맷팅된 공통 코드 데이터
          </Typography>
          
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><strong>ID</strong></TableCell>
                  <TableCell><strong>Codes</strong></TableCell>
                  <TableCell><strong>Default Value</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getAllGroups().map((group) => (
                  <TableRow key={group.id}>
                    <TableCell>{group.id}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {group.codes.map((code, index) => (
                          <Chip 
                            key={index} 
                            label={`${code.value || '""'}: ${code.label}`} 
                            size="small" 
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {group.defaultValue ? (
                        <Chip 
                          label={`${group.defaultValue.value || '""'}: ${group.defaultValue.label}`}
                          size="small"
                          color="primary"
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary">없음</Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Select 컴포넌트 사용 예시 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            1. Select 컴포넌트 사용 (ID: 1 - 예/아니오)
          </Typography>
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>답변을 선택하세요</InputLabel>
            <Select
              value={formData.answer}
              label="답변을 선택하세요"
              onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
            >
              {getSelectOptions(1, true).map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Typography variant="body2" color="text.secondary">
            선택된 값: {formData.answer || '없음'} 
            {formData.answer && ` (${getCodes(1).find(c => c.value === formData.answer)?.label})`}
          </Typography>
        </CardContent>
      </Card>

      {/* Radio 컴포넌트 사용 예시 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            2. Radio 컴포넌트 사용 (ID: 2 - 만족도, 기본값: 보통)
          </Typography>
          
          <FormControl>
            <RadioGroup
              value={formData.satisfaction}
              onChange={(e) => setFormData(prev => ({ ...prev, satisfaction: e.target.value }))}
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
          </FormControl>
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            선택된 값: {formData.satisfaction || '없음'}
            {formData.satisfaction && ` (${getCodes(2).find(c => c.value === formData.satisfaction)?.label})`}
          </Typography>
        </CardContent>
      </Card>

      {/* 기본값 제외 Select 예시 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            3. 기본값 제외 Select (ID: 3 - 디바이스)
          </Typography>
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>디바이스 선택 (기본값 제외)</InputLabel>
            <Select
              value={formData.device}
              label="디바이스 선택 (기본값 제외)"
              onChange={(e) => setFormData(prev => ({ ...prev, device: e.target.value }))}
            >
              {getSelectOptions(3, false).map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Typography variant="body2" color="text.secondary">
            선택된 값: {formData.device || '없음'}
            {formData.device && ` (${getCodes(3).find(c => c.value === formData.device)?.label})`}
          </Typography>
        </CardContent>
      </Card>

      {/* 기능 테스트 버튼들 */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            4. 기능 테스트
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              onClick={() => {
                setFormData({
                  answer: getFirstCode(1)?.value || '',
                  satisfaction: getFirstCode(2)?.value || '',
                  device: getFirstCode(3)?.value || ''
                });
              }}
            >
              기본값으로 초기화
            </Button>

            <Button
              variant="outlined"
              onClick={() => {
                console.log('=== 공통 코드 정보 ===');
                console.log('모든 그룹:', getAllGroups());
                console.log('ID 1 코드들:', getCodes(1));
                console.log('ID 2 첫번째 코드:', getFirstCode(2));
                console.log('ID 3 Radio 옵션:', getRadioOptions(3));
              }}
            >
              콘솔에서 데이터 확인
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                const result = {
                  answer: formData.answer,
                  satisfaction: formData.satisfaction,
                  device: formData.device
                };
                alert(`폼 데이터 제출:\n${JSON.stringify(result, null, 2)}`);
              }}
            >
              데이터 제출
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* 사용법 가이드 */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            💡 실제 사용법
          </Typography>
          <Box sx={{ '& pre': { fontSize: '12px', overflow: 'auto', p: 2, bgcolor: 'grey.100', borderRadius: 1 } }}>
            <Typography variant="subtitle2" gutterBottom>1. Hook 사용:</Typography>
            <pre>{`const { getCodes, getSelectOptions, getRadioOptions, getFirstCode } = useCommonCodes();

// Select 컴포넌트
{getSelectOptions(1).map(option => (
  <MenuItem key={option.value} value={option.value}>
    {option.label}
  </MenuItem>
))}

// Radio 컴포넌트  
{getRadioOptions(2).map(option => (
  <FormControlLabel
    key={option.value}
    value={option.value}
    control={<Radio />}
    label={option.label}
  />
))}`}</pre>

            <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>2. 데이터 직접 사용:</Typography>
            <pre>{`const apiData = await api.get('/common-codes');
const formattedData = formatCodeData(apiData);

const codes = getCodesById(formattedData, 1);
const firstCode = getFirstCodeById(formattedData, 1);`}</pre>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}