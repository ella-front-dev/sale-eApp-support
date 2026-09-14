'use client';

import React, { useState } from 'react';

import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Alert,
  Chip,
  Stack
} from '@mui/material';

import { useCommonCodes } from '@/lib/commonCodeService';

// 예시 API 응답 데이터 (실제로는 서버에서 받는 데이터)
const mockApiListData = [
  { id: 1, name: '홍길동', status: 'Y', satisfaction: '5', device: 'mobile' },
  { id: 2, name: '김철수', status: 'N', satisfaction: '3', device: 'desktop' },
  { id: 3, name: '이영희', status: 'Y', satisfaction: '4', device: 'tablet' },
  { id: 4, name: '박민수', status: 'N', satisfaction: '2', device: 'mobile' },
];

export default function ValueToLabelDemo() {
  const { 
    getCodeLabel, 
    getCodeLabels, 
    addCodeLabel, 
    loading, 
    error, 
    isReady 
  } = useCommonCodes('demo', true); // Mock 데이터 사용

  const [selectedValue, setSelectedValue] = useState('');
  const [codeId, setCodeId] = useState(1);

  if (loading) {
return <div>로딩 중...</div>;
}
  if (error) {
return <Alert severity="error">에러: {error}</Alert>;
}
  if (!isReady) {
return <Alert severity="warning">공통 코드를 사용할 수 없습니다.</Alert>;
}

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        🔄 Value → Label 치환 예시
      </Typography>

      {/* 1. 기본 사용법 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            1. 단일 Value → Label 치환
          </Typography>
          
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                label="Code ID"
                type="number"
                value={codeId}
                onChange={(e) => setCodeId(Number(e.target.value))}
                size="small"
                sx={{ width: 100 }}
              />
              <TextField
                label="Value"
                value={selectedValue}
                onChange={(e) => setSelectedValue(e.target.value)}
                size="small"
                placeholder="예: Y, N, 1, 2, mobile..."
              />
              <Button
                variant="outlined"
                onClick={() => {
                  const label = getCodeLabel(codeId, selectedValue);
                  alert(`Value "${selectedValue}" → Label "${label}"`);
                }}
              >
                치환하기
              </Button>
            </Box>

            <Typography variant="body2" color="text.secondary">
              예시: ID=1, Value=&quot;Y&quot; → Label=&quot;예&quot; / ID=2, Value=&quot;5&quot; → Label=&quot;매우 만족&quot;
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      {/* 2. API 리스트 데이터 치환 예시 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            2. API 리스트 데이터 Value → Label 치환
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            서버에서 받은 데이터의 코드 값들을 사용자가 읽기 쉬운 라벨로 변환
          </Typography>

          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><strong>이름</strong></TableCell>
                  <TableCell><strong>상태 (원본)</strong></TableCell>
                  <TableCell><strong>상태 (라벨)</strong></TableCell>
                  <TableCell><strong>만족도 (원본)</strong></TableCell>
                  <TableCell><strong>만족도 (라벨)</strong></TableCell>
                  <TableCell><strong>디바이스 (원본)</strong></TableCell>
                  <TableCell><strong>디바이스 (라벨)</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockApiListData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>
                      <Chip label={item.status} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={getCodeLabel(1, item.status)} 
                        size="small" 
                        color={item.status === 'Y' ? 'success' : 'default'}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip label={item.satisfaction} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={getCodeLabel(2, item.satisfaction)} 
                        size="small" 
                        color="primary"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip label={item.device} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={getCodeLabel(3, item.device)} 
                        size="small" 
                        color="secondary"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* 3. 여러 값 한번에 치환 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            3. 여러 Value들 한번에 치환
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              만족도 값들: [&apos;1&apos;, &apos;3&apos;, &apos;5&apos;] → 라벨들
            </Typography>
            <Box sx={{ mt: 1 }}>
              {getCodeLabels(2, ['1', '3', '5']).map((label, index) => (
                <Chip key={index} label={label} sx={{ mr: 1 }} />
              ))}
            </Box>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              디바이스 값들: [&apos;mobile&apos;, &apos;desktop&apos;, &apos;tablet&apos;] → 라벨들
            </Typography>
            <Box sx={{ mt: 1 }}>
              {getCodeLabels(3, ['mobile', 'desktop', 'tablet']).map((label, index) => (
                <Chip key={index} label={label} color="secondary" sx={{ mr: 1 }} />
              ))}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* 4. 객체 필드 라벨 추가 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            4. 객체에 라벨 필드 자동 추가
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            원본 객체: {`{ status: 'Y' }`} → 라벨 추가: {`{ status: 'Y', statusLabel: '예' }`}
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {mockApiListData.map((item) => {
              const withStatusLabel = addCodeLabel(1, item, 'status');
              const withSatisfactionLabel = addCodeLabel(2, withStatusLabel, 'satisfaction');
              const withDeviceLabel = addCodeLabel(3, withSatisfactionLabel, 'device');
              
              return (
                <Card key={item.id} variant="outlined" sx={{ minWidth: 250 }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" component="div" sx={{ fontSize: '11px' }}>
                      <strong>Status:</strong> {withDeviceLabel.status} → {withDeviceLabel.statusLabel}<br/>
                      <strong>Satisfaction:</strong> {withDeviceLabel.satisfaction} → {withDeviceLabel.satisfactionLabel}<br/>
                      <strong>Device:</strong> {withDeviceLabel.device} → {withDeviceLabel.deviceLabel}
                    </Typography>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        </CardContent>
      </Card>

      {/* 5. 사용법 코드 예시 */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            💡 사용법 코드 예시
          </Typography>
          
          <Box sx={{ '& pre': { fontSize: '12px', overflow: 'auto', p: 2, bgcolor: 'grey.100', borderRadius: 1 } }}>
            <Typography variant="subtitle2" gutterBottom>1. 단일 값 치환:</Typography>
            <pre>{`const { getCodeLabel } = useCommonCodes();

// 'Y' → '예'로 치환
const label = getCodeLabel(1, 'Y');
console.log(label); // "예"`}</pre>

            <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>2. 배열 값들 치환:</Typography>
            <pre>{`const { getCodeLabels } = useCommonCodes();

// ['1', '3', '5'] → ['매우 불만족', '보통', '매우 만족']
const labels = getCodeLabels(2, ['1', '3', '5']);
console.log(labels); // ["매우 불만족", "보통", "매우 만족"]`}</pre>

            <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>3. 객체에 라벨 필드 추가:</Typography>
            <pre>{`const { addCodeLabel } = useCommonCodes();

const user = { name: '홍길동', status: 'Y' };
const userWithLabel = addCodeLabel(1, user, 'status');
console.log(userWithLabel); 
// { name: '홍길동', status: 'Y', statusLabel: '예' }`}</pre>

            <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>4. API 리스트 데이터 처리:</Typography>
            <pre>{`// 서버에서 받은 데이터를 화면에 표시할 때
apiData.map(item => (
  <TableRow key={item.id}>
    <TableCell>{item.name}</TableCell>
    <TableCell>{getCodeLabel(1, item.status)}</TableCell>
    <TableCell>{getCodeLabel(2, item.satisfaction)}</TableCell>
  </TableRow>
))`}</pre>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}