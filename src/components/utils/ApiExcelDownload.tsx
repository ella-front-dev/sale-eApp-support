'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Stack,
  Alert,
  Chip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import {
  Download,
  Api,
  TableView
} from '@mui/icons-material';
import * as XLSX from 'xlsx';

// API 데이터 타입 정의
interface ApiDataType {
  id: string;
  name: string;
  endpoint: string;
  description: string;
}

// 사용 가능한 API 목록
const availableApis: ApiDataType[] = [
  {
    id: 'users',
    name: '사용자 데이터',
    endpoint: '/api/users',
    description: '전체 사용자 목록 및 상세 정보'
  },
  {
    id: 'products',
    name: '상품 데이터',
    endpoint: '/api/products',
    description: '상품 목록 및 가격 정보'
  },
  {
    id: 'orders',
    name: '주문 데이터',
    endpoint: '/api/orders',
    description: '주문 내역 및 상태 정보'
  },
  {
    id: 'forms',
    name: '서식 데이터',
    endpoint: '/api/forms',
    description: '서식 정보 및 구성 요소'
  },
  {
    id: 'analytics',
    name: '분석 데이터',
    endpoint: '/api/analytics',
    description: '사용량 및 통계 정보'
  }
];

// Mock API 데이터 생성 함수들
const generateMockData = {
  users: () => Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `사용자${i + 1}`,
    email: `user${i + 1}@example.com`,
    phone: `010-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
    department: ['개발팀', '디자인팀', '기획팀', '마케팅팀'][i % 4],
    position: ['팀장', '대리', '사원', '주임'][i % 4],
    joinDate: new Date(2020 + (i % 4), (i % 12), (i % 28) + 1).toISOString().split('T')[0],
    status: ['활성', '비활성', '대기'][i % 3]
  })),

  products: () => Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `상품${i + 1}`,
    category: ['전자제품', '의류', '도서', '식품', '가구'][i % 5],
    price: (i + 1) * 1000 + Math.floor(Math.random() * 5000),
    stock: Math.floor(Math.random() * 100),
    brand: ['브랜드A', '브랜드B', '브랜드C'][i % 3],
    rating: (Math.random() * 2 + 3).toFixed(1),
    createdAt: new Date(2023, (i % 12), (i % 28) + 1).toISOString().split('T')[0]
  })),

  orders: () => Array.from({ length: 200 }, (_, i) => ({
    id: i + 1,
    orderNumber: `ORD${String(i + 1).padStart(6, '0')}`,
    customerName: `고객${i + 1}`,
    productName: `상품${(i % 100) + 1}`,
    quantity: Math.floor(Math.random() * 5) + 1,
    totalAmount: (i + 1) * 500 + Math.floor(Math.random() * 10000),
    status: ['주문완료', '배송중', '배송완료', '취소'][i % 4],
    orderDate: new Date(2024, (i % 12), (i % 28) + 1).toISOString().split('T')[0],
    deliveryDate: new Date(2024, (i % 12), (i % 28) + 3).toISOString().split('T')[0]
  })),

  forms: () => Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    formCode: `FORM${String(i + 1).padStart(3, '0')}`,
    title: `서식${i + 1}`,
    category: ['개인정보', '계약서', '신청서', '확인서'][i % 4],
    version: `v${Math.floor(i / 10) + 1}.${i % 10}`,
    status: ['사용중', '검토중', '폐기'][i % 3],
    createdBy: `작성자${(i % 10) + 1}`,
    createdAt: new Date(2024, (i % 12), (i % 28) + 1).toISOString().split('T')[0],
    lastModified: new Date(2024, (i % 12), (i % 28) + 5).toISOString().split('T')[0]
  })),

  analytics: () => Array.from({ length: 365 }, (_, i) => ({
    date: new Date(2024, 0, i + 1).toISOString().split('T')[0],
    pageViews: Math.floor(Math.random() * 1000) + 100,
    users: Math.floor(Math.random() * 200) + 50,
    sessions: Math.floor(Math.random() * 300) + 80,
    bounceRate: (Math.random() * 30 + 20).toFixed(2),
    avgSessionDuration: `${Math.floor(Math.random() * 5) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
    conversions: Math.floor(Math.random() * 20),
    revenue: Math.floor(Math.random() * 100000) + 10000
  }))
};

export default function ApiExcelDownload() {
  const [selectedApis, setSelectedApis] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [previewData, setPreviewData] = useState<Record<string, unknown[]>>({});

  // API 선택 핸들러
  const handleApiSelection = (apiId: string) => {
    setSelectedApis(prev => 
      prev.includes(apiId) 
        ? prev.filter(id => id !== apiId)
        : [...prev, apiId]
    );
  };

  // 전체 선택/해제
  const handleSelectAll = () => {
    if (selectedApis.length === availableApis.length) {
      setSelectedApis([]);
    } else {
      setSelectedApis(availableApis.map(api => api.id));
    }
  };

  // API 데이터 미리보기
  const handlePreview = async () => {
    if (selectedApis.length === 0) {
      alert('다운로드할 API를 선택해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const preview: Record<string, unknown[]> = {};
      
      // 실제로는 여기서 API를 호출하지만, 지금은 Mock 데이터 사용
      selectedApis.forEach(apiId => {
        if (apiId in generateMockData) {
          preview[apiId] = generateMockData[apiId as keyof typeof generateMockData]().slice(0, 5); // 미리보기용으로 5개만
        }
      });

      setPreviewData(preview);
      alert('데이터 미리보기가 준비되었습니다.');
    } catch (error) {
      console.error('데이터 미리보기 오류:', error);
      alert('데이터 미리보기 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 단일 시트 엑셀 다운로드
  const handleSingleSheetDownload = async () => {
    if (selectedApis.length === 0) {
      alert('다운로드할 API를 선택해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      let allData: unknown[] = [];

      // 모든 선택된 API 데이터를 하나로 합치기
      selectedApis.forEach(apiId => {
        if (apiId in generateMockData) {
          const data = generateMockData[apiId as keyof typeof generateMockData]();
          const apiInfo = availableApis.find(api => api.id === apiId);
          
          // 각 데이터에 API 구분자 추가
          const dataWithSource = data.map(item => ({
            API_소스: apiInfo?.name || apiId,
            ...item
          }));
          
          allData = [...allData, ...dataWithSource];
        }
      });

      // 엑셀 파일 생성
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(allData);
      
      // 컬럼 너비 자동 조정
      const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:A1');
      const columnWidths = [];
      for (let c = range.s.c; c <= range.e.c; c++) {
        let maxWidth = 10;
        for (let r = range.s.r; r <= Math.min(range.e.r, 100); r++) {
          const cellAddress = XLSX.utils.encode_cell({ r, c });
          const cell = worksheet[cellAddress];
          if (cell && cell.v) {
            maxWidth = Math.max(maxWidth, String(cell.v).length);
          }
        }
        columnWidths.push({ wch: Math.min(maxWidth + 2, 50) });
      }
      worksheet['!cols'] = columnWidths;

      XLSX.utils.book_append_sheet(workbook, worksheet, '통합데이터');
      
      const fileName = `API_통합데이터_${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}_${new Date().getTime()}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      
      alert(`${selectedApis.length}개 API의 통합 데이터가 다운로드되었습니다.`);
    } catch (error) {
      console.error('엑셀 다운로드 오류:', error);
      alert('엑셀 다운로드 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 다중 시트 엑셀 다운로드
  const handleMultiSheetDownload = async () => {
    if (selectedApis.length === 0) {
      alert('다운로드할 API를 선택해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const workbook = XLSX.utils.book_new();

      // 각 API별로 시트 생성
      selectedApis.forEach(apiId => {
        if (apiId in generateMockData) {
          const data = generateMockData[apiId as keyof typeof generateMockData]();
          const apiInfo = availableApis.find(api => api.id === apiId);
          
          const worksheet = XLSX.utils.json_to_sheet(data);
          
          // 컬럼 너비 자동 조정
          if (data.length > 0) {
            const columnWidths = Object.keys(data[0]).map(key => ({
              wch: Math.max(key.length, 15)
            }));
            worksheet['!cols'] = columnWidths;
          }

          XLSX.utils.book_append_sheet(workbook, worksheet, apiInfo?.name || apiId);
        }
      });

      const fileName = `API_다중시트_${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}_${new Date().getTime()}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      
      alert(`${selectedApis.length}개 API의 다중 시트 데이터가 다운로드되었습니다.`);
    } catch (error) {
      console.error('다중 시트 다운로드 오류:', error);
      alert('다중 시트 다운로드 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        🔗 API 데이터 엑셀 다운로드
      </Typography>

      {/* API 선택 영역 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              📋 API 선택 ({selectedApis.length}/{availableApis.length})
            </Typography>
            <Button
              variant="outlined"
              onClick={handleSelectAll}
              size="small"
            >
              {selectedApis.length === availableApis.length ? '전체 해제' : '전체 선택'}
            </Button>
          </Box>
          
          <Stack spacing={2}>
            {availableApis.map((api) => (
              <Card
                key={api.id}
                variant="outlined"
                sx={{
                  cursor: 'pointer',
                  border: selectedApis.includes(api.id) ? 2 : 1,
                  borderColor: selectedApis.includes(api.id) ? 'primary.main' : 'divider',
                  '&:hover': { borderColor: 'primary.main' }
                }}
                onClick={() => handleApiSelection(api.id)}
              >
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {api.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {api.endpoint} - {api.description}
                      </Typography>
                    </Box>
                    {selectedApis.includes(api.id) && (
                      <Chip label="선택됨" color="primary" size="small" />
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* 다운로드 옵션 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📥 다운로드 옵션
          </Typography>
          
          <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mb: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Api />}
              onClick={handlePreview}
              disabled={isLoading || selectedApis.length === 0}
            >
              {isLoading ? <CircularProgress size={20} /> : '데이터 미리보기'}
            </Button>
            
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={handleSingleSheetDownload}
              disabled={isLoading || selectedApis.length === 0}
            >
              {isLoading ? <CircularProgress size={20} /> : '통합 시트 다운로드'}
            </Button>
            
            <Button
              variant="contained"
              color="secondary"
              startIcon={<TableView />}
              onClick={handleMultiSheetDownload}
              disabled={isLoading || selectedApis.length === 0}
            >
              {isLoading ? <CircularProgress size={20} /> : '다중 시트 다운로드'}
            </Button>
          </Stack>

          <Alert severity="info">
            <Typography variant="body2">
              • <strong>데이터 미리보기</strong>: 선택한 API의 데이터 샘플을 확인합니다<br/>
              • <strong>통합 시트 다운로드</strong>: 모든 선택된 API 데이터를 하나의 시트에 통합<br/>
              • <strong>다중 시트 다운로드</strong>: 각 API별로 별도 시트를 생성하여 다운로드
            </Typography>
          </Alert>
        </CardContent>
      </Card>

      {/* 데이터 미리보기 */}
      {Object.keys(previewData).length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              👁️ 데이터 미리보기
            </Typography>
            
            {Object.entries(previewData).map(([apiId, data]) => {
              const apiInfo = availableApis.find(api => api.id === apiId);
              return (
                <Box key={apiId} sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                    {apiInfo?.name} ({data.length}개 샘플)
                  </Typography>
                  
                  <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 300 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          {data.length > 0 && Object.keys(data[0] as Record<string, unknown>).map((key) => (
                            <TableCell key={key} sx={{ fontWeight: 'bold' }}>
                              {key}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.map((row, index) => (
                          <TableRow key={index}>
                            {Object.values(row as Record<string, unknown>).map((value, cellIndex) => (
                              <TableCell key={cellIndex}>
                                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              );
            })}
          </CardContent>
        </Card>
      )}
    </Box>
  );
}