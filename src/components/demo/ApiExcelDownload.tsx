'use client';

import React, { useState } from 'react';

import {
  Download,
  Api,
  TableView
} from '@mui/icons-material';
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

import { demoDataSets } from '@/components/demo/excelDemoData';
import { downloadDataAsExcel, downloadDataAsMultiSheetExcel } from '@/lib/excelDownloader';

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

export default function ApiExcelDownload() {
  const [selectedApis, setSelectedApis] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [previewData, setPreviewData] = useState<Record<string, Record<string, unknown>[]>>({});

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
      const preview: Record<string, Record<string, unknown>[]> = {};
      
      // 실제로는 여기서 API를 호출하지만, 지금은 Mock 데이터 사용
      selectedApis.forEach(apiId => {
        if (apiId in demoDataSets) {
          preview[apiId] = demoDataSets[apiId as keyof typeof demoDataSets]().slice(0, 5); // 미리보기용으로 5개만
        }
      });

      setPreviewData(preview);
      alert('데이터 미리보기가 준비되었습니다.');
    } catch {
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
        if (apiId in demoDataSets) {
          const data = demoDataSets[apiId as keyof typeof demoDataSets]();
          const apiInfo = availableApis.find(api => api.id === apiId);
          
          // 각 데이터에 API 구분자 추가
          const dataWithSource = data.map(item => ({
            API_소스: apiInfo?.name || apiId,
            ...item
          }));
          
          allData = [...allData, ...dataWithSource];
        }
      });

      await downloadDataAsExcel(allData, {
        filename: 'API_통합데이터',
        sheetName: '통합데이터',
        includeTimestamp: true,
        autoWidth: true
      });

      alert(`${selectedApis.length}개 API의 통합 데이터가 다운로드되었습니다.`);
    } catch {
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
      // 각 API별로 시트 생성
      const sheets = selectedApis
        .filter(apiId => apiId in demoDataSets)
        .map(apiId => {
          const apiInfo = availableApis.find(api => api.id === apiId);

          return {
            name: apiInfo?.name || apiId,
            data: demoDataSets[apiId as keyof typeof demoDataSets]()
          };
        });

      downloadDataAsMultiSheetExcel(sheets, {
        filename: 'API_다중시트',
        includeTimestamp: true,
        autoWidth: true
      });

      alert(`${selectedApis.length}개 API의 다중 시트 데이터가 다운로드되었습니다.`);
    } catch {
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
                          {data.length > 0 && Object.keys(data[0]).map((key) => (
                            <TableCell key={key} sx={{ fontWeight: 'bold' }}>
                              {key}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.map((row, index) => (
                          <TableRow key={index}>
                            {Object.values(row).map((value, cellIndex) => (
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