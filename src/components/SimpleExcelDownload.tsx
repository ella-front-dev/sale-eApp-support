'use client';

import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Stack,
  Alert,
  Divider
} from '@mui/material';
import {
  Download,
  TableView,
  Api
} from '@mui/icons-material';
import {
  downloadApiData,
  downloadMultiApiData,
  downloadMultiSheetData,
  downloadMultipleApis,
  testSingleDownload,
  testMultiSheetDownload,
  type ApiEndpoint
} from '@/lib/excelDownloader';

export default function SimpleExcelDownload() {
  
  // 실제 API 엔드포인트 예시
  const apiEndpoints: ApiEndpoint[] = [
    {
      id: 'users',
      name: '사용자 데이터',
      url: '/api/users',
      description: '전체 사용자 정보'
    },
    {
      id: 'products',
      name: '상품 데이터',
      url: '/api/products',
      description: '상품 목록 및 정보'
    },
    {
      id: 'orders',
      name: '주문 데이터',
      url: '/api/orders',
      description: '주문 내역 정보'
    }
  ];

  // 1. 단일 API 데이터 다운로드
  const handleSingleApiDownload = async () => {
    try {
      await downloadApiData('/api/users', 'users_data');
      alert('사용자 데이터가 다운로드되었습니다.');
    } catch (error) {
      alert('다운로드 실패: ' + error);
    }
  };

  // 2. 여러 API 데이터 통합 다운로드
  const handleMultiApiDownload = async () => {
    try {
      await downloadMultiApiData(apiEndpoints, 'integrated_data');
      alert('통합 데이터가 다운로드되었습니다.');
    } catch (error) {
      alert('다운로드 실패: ' + error);
    }
  };

  // 3. 여러 API 데이터 다중 시트 다운로드
  const handleMultiSheetDownload = async () => {
    try {
      await downloadMultiSheetData(apiEndpoints, 'multi_sheet_data');
      alert('다중 시트 데이터가 다운로드되었습니다.');
    } catch (error) {
      alert('다운로드 실패: ' + error);
    }
  };

  // 4. 고급 옵션으로 다운로드
  const handleAdvancedDownload = async () => {
    try {
      await downloadMultipleApis(apiEndpoints, {
        filename: 'custom_report',
        sheetName: '월간리포트',
        includeTimestamp: true,
        autoWidth: true
      });
      alert('커스텀 리포트가 다운로드되었습니다.');
    } catch (error) {
      alert('다운로드 실패: ' + error);
    }
  };

  // Mock 데이터 테스트
  const handleTestSingleDownload = async () => {
    try {
      await testSingleDownload('users');
      alert('Mock 사용자 데이터가 다운로드되었습니다.');
    } catch (error) {
      alert('테스트 다운로드 실패: ' + error);
    }
  };

  const handleTestMultiSheetDownload = async () => {
    try {
      await testMultiSheetDownload();
      alert('Mock 다중 시트 데이터가 다운로드되었습니다.');
    } catch (error) {
      alert('테스트 다운로드 실패: ' + error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        🚀 간편 엑셀 다운로드
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        TypeScript 유틸리티를 사용한 간단한 API 데이터 엑셀 다운로드
      </Typography>

      {/* 실제 API 사용 예시 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📡 실제 API 데이터 다운로드
          </Typography>
          
          <Stack spacing={2} direction="row" flexWrap="wrap">
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={handleSingleApiDownload}
            >
              단일 API 다운로드
            </Button>
            
            <Button
              variant="contained"
              color="secondary"
              startIcon={<Api />}
              onClick={handleMultiApiDownload}
            >
              통합 API 다운로드
            </Button>
            
            <Button
              variant="contained"
              color="success"
              startIcon={<TableView />}
              onClick={handleMultiSheetDownload}
            >
              다중 시트 다운로드
            </Button>
            
            <Button
              variant="outlined"
              onClick={handleAdvancedDownload}
            >
              고급 옵션 다운로드
            </Button>
          </Stack>

          <Alert severity="info" sx={{ mt: 2 }}>
            실제 환경에서는 /api/* 엔드포인트에서 데이터를 가져와 다운로드합니다.
          </Alert>
        </CardContent>
      </Card>

      <Divider sx={{ my: 3 }} />

      {/* Mock 데이터 테스트 */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🧪 Mock 데이터 테스트
          </Typography>
          
          <Stack spacing={2} direction="row" flexWrap="wrap">
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={handleTestSingleDownload}
            >
              Mock 단일 다운로드
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<TableView />}
              onClick={handleTestMultiSheetDownload}
            >
              Mock 다중 시트 다운로드
            </Button>
          </Stack>

          <Alert severity="success" sx={{ mt: 2 }}>
            Mock 데이터를 사용하여 실제 API 없이도 테스트할 수 있습니다.
          </Alert>
        </CardContent>
      </Card>

      {/* 사용법 안내 */}
      <Card sx={{ mt: 3 }} variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            💡 컴포넌트에서 사용법
          </Typography>
          
          <Box sx={{ '& pre': { fontSize: '12px', overflow: 'auto', p: 2, bgcolor: 'grey.100', borderRadius: 1, mb: 2 } }}>
            <Typography variant="subtitle2" gutterBottom>1. 간단한 사용:</Typography>
            <pre>{`import { downloadApiData, downloadMultiApiData } from '@/lib/excelDownloader';

// 단일 API 다운로드
await downloadApiData('/api/users', 'users_report');

// 여러 API 통합 다운로드
const apis = [
  { id: 'users', name: '사용자', url: '/api/users' },
  { id: 'orders', name: '주문', url: '/api/orders' }
];
await downloadMultiApiData(apis, 'integrated_report');`}</pre>

            <Typography variant="subtitle2" gutterBottom>2. 고급 옵션 사용:</Typography>
            <pre>{`import { downloadMultipleApis } from '@/lib/excelDownloader';

// 상세 옵션 설정
await downloadMultipleApis(apiEndpoints, {
  filename: 'monthly_report',
  sheetName: '월간데이터',
  includeTimestamp: true,
  autoWidth: true
});`}</pre>

            <Typography variant="subtitle2" gutterBottom>3. 에러 처리:</Typography>
            <pre>{`try {
  await downloadApiData('/api/users');
  alert('다운로드 완료!');
} catch (error) {
  console.error('다운로드 실패:', error);
  alert('다운로드 중 오류가 발생했습니다.');
}`}</pre>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}