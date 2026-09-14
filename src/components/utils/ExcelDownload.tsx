'use client';

import React, { useState } from 'react';

import {
  Download,
  TableView,
  FilterList,
  FileDownload
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
  Divider
} from '@mui/material';
import * as XLSX from 'xlsx';

// 엑셀 데이터 타입 정의
interface ExcelRowData {
  순서: number;
  '서식 코드': string;
  '카테고리 코드': string;
  '서식 파일명': string;
  서식명: string;
  '통합서식 여부': 'Y' | 'N';
  '사전조회 여부': 'Y' | 'N';
  '그룹 순서': number;
  '그룹 코드': string;
  그룹명: string;
  '메뉴 코드': string;
  '구성 순서': number;
  '구성 코드': string;
  '행 순서': number;
  '서식 답변명': string;
  '계약 관계자 코드': string;
  '중복입력 가능여부': 'Y' | 'N';
  '데이터 구분': string;
}

// Mock API 데이터 (실제로는 API에서 가져올 데이터)
const generateMockApiData = (count: number): ExcelRowData[] => {
  const groups = ['기본정보', '신원정보', '계약정보', '추가정보'];
  const dataTypes = ['MASTER', 'DETAIL', 'CONTRACT', 'REFERENCE'];

  return Array.from({ length: count }, (_, index) => ({
    순서: index + 1,
    '서식 코드': `FORM${String(index + 1).padStart(3, '0')}`,
    '카테고리 코드': `CAT${String(index % 4 + 1).padStart(3, '0')}`,
    '서식 파일명': `form_${index + 1}.pdf`,
    서식명: `서식명_${index + 1}`,
    '통합서식 여부': index % 2 === 0 ? 'Y' : 'N' as 'Y' | 'N',
    '사전조회 여부': index % 3 === 0 ? 'Y' : 'N' as 'Y' | 'N',
    '그룹 순서': (index % 4) + 1,
    '그룹 코드': `GRP${String(index % 4 + 1).padStart(3, '0')}`,
    그룹명: groups[index % 4],
    '메뉴 코드': `MENU${String(index % 5 + 1).padStart(3, '0')}`,
    '구성 순서': (index % 10) + 1,
    '구성 코드': `COMP${String(index + 1).padStart(3, '0')}`,
    '행 순서': (index % 5) + 1,
    '서식 답변명': `답변_${index + 1}`,
    '계약 관계자 코드': `REL${String(index % 3 + 1).padStart(3, '0')}`,
    '중복입력 가능여부': index % 4 === 0 ? 'Y' : 'N' as 'Y' | 'N',
    '데이터 구분': dataTypes[index % 4]
  }));
};

export default function ExcelDownload() {
  const [dataCount, setDataCount] = useState(100);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterGroup, setFilterGroup] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentData, setCurrentData] = useState<ExcelRowData[]>([]);

  // 데이터 생성 및 필터링
  const generateAndFilterData = () => {
    let data = generateMockApiData(dataCount);

    // 필터 적용
    if (filterCategory) {
      data = data.filter(item => item['카테고리 코드'].includes(filterCategory));
    }
    
    if (filterGroup) {
      data = data.filter(item => item.그룹명.includes(filterGroup));
    }

    if (searchKeyword) {
      data = data.filter(item => 
        item.서식명.includes(searchKeyword) || 
        item['서식 코드'].includes(searchKeyword)
      );
    }

    setCurrentData(data);

    return data;
  };

  // 기본 엑셀 다운로드
  const handleBasicDownload = () => {
    try {
      const data = generateAndFilterData();
      
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(data);
      
      // 컬럼 너비 자동 조정
      const columnWidths = Object.keys(data[0] || {}).map(key => ({
        wch: Math.max(key.length, 15)
      }));
      worksheet['!cols'] = columnWidths;

      XLSX.utils.book_append_sheet(workbook, worksheet, '서식 데이터');
      
      const fileName = `서식_데이터_${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}_${new Date().getTime()}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      
      alert(`${data.length}개의 데이터가 엑셀로 다운로드되었습니다.`);
    } catch {
      alert('엑셀 파일 다운로드 중 오류가 발생했습니다.');
    }
  };

  // 다중 시트 다운로드
  const handleMultiSheetDownload = () => {
    try {
      const allData = generateMockApiData(dataCount);
      
      const workbook = XLSX.utils.book_new();

      // 카테고리별 시트 생성
      const categories = ['CAT001', 'CAT002', 'CAT003', 'CAT004'];
      const categoryNames = ['개인정보', '사업정보', '계약정보', '신원정보'];

      categories.forEach((cat, index) => {
        const categoryData = allData.filter(item => item['카테고리 코드'] === cat);
        if (categoryData.length > 0) {
          const worksheet = XLSX.utils.json_to_sheet(categoryData);
          
          // 컬럼 너비 설정
          const columnWidths = Object.keys(categoryData[0]).map(key => ({
            wch: Math.max(key.length, 15)
          }));
          worksheet['!cols'] = columnWidths;

          XLSX.utils.book_append_sheet(workbook, worksheet, categoryNames[index]);
        }
      });

      // 전체 데이터 시트
      const allWorksheet = XLSX.utils.json_to_sheet(allData);
      const columnWidths = Object.keys(allData[0] || {}).map(key => ({
        wch: Math.max(key.length, 15)
      }));
      allWorksheet['!cols'] = columnWidths;
      XLSX.utils.book_append_sheet(workbook, allWorksheet, '전체데이터');

      const fileName = `서식_다중시트_${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}_${new Date().getTime()}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      
      alert('다중 시트 엑셀 파일이 다운로드되었습니다.');
    } catch {
      alert('다중 시트 엑셀 파일 다운로드 중 오류가 발생했습니다.');
    }
  };

  // 템플릿 다운로드
  const handleTemplateDownload = () => {
    try {
      const templateHeaders = [
        '순서', '서식 코드', '카테고리 코드', '서식 파일명', '서식명',
        '통합서식 여부', '사전조회 여부', '그룹 순서', '그룹 코드', '그룹명',
        '메뉴 코드', '구성 순서', '구성 코드', '행 순서', '서식 답변명',
        '계약 관계자 코드', '중복입력 가능여부', '데이터 구분'
      ];

      // 샘플 데이터 1행 추가
      const sampleData = [{
        순서: 1,
        '서식 코드': 'FORM001',
        '카테고리 코드': 'CAT001',
        '서식 파일명': 'sample.pdf',
        서식명: '샘플 서식',
        '통합서식 여부': 'Y',
        '사전조회 여부': 'N',
        '그룹 순서': 1,
        '그룹 코드': 'GRP001',
        그룹명: '기본정보',
        '메뉴 코드': 'MENU001',
        '구성 순서': 1,
        '구성 코드': 'COMP001',
        '행 순서': 1,
        '서식 답변명': '샘플 답변',
        '계약 관계자 코드': 'REL001',
        '중복입력 가능여부': 'N',
        '데이터 구분': 'MASTER'
      }];

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(sampleData);
      
      // 컬럼 너비 설정
      const columnWidths = templateHeaders.map(header => ({
        wch: Math.max(header.length, 15)
      }));
      worksheet['!cols'] = columnWidths;

      XLSX.utils.book_append_sheet(workbook, worksheet, '업로드_템플릿');
      XLSX.writeFile(workbook, '서식_업로드_템플릿.xlsx');
      
      alert('업로드 템플릿이 다운로드되었습니다.');
    } catch {
      alert('템플릿 다운로드 중 오류가 발생했습니다.');
    }
  };

  // 커스텀 필터 적용된 다운로드
  const handleFilteredDownload = () => {
    try {
      const data = generateAndFilterData();
      
      if (data.length === 0) {
        alert('필터 조건에 맞는 데이터가 없습니다.');

        return;
      }

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(data);
      
      // 컬럼 너비 설정
      const columnWidths = Object.keys(data[0]).map(key => ({
        wch: Math.max(key.length, 15)
      }));
      worksheet['!cols'] = columnWidths;

      XLSX.utils.book_append_sheet(workbook, worksheet, '필터링된_데이터');
      
      const fileName = `필터링_서식_데이터_${new Date().getTime()}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      
      alert(`필터 조건에 맞는 ${data.length}개의 데이터가 다운로드되었습니다.`);
    } catch {
      alert('필터링된 엑셀 다운로드 중 오류가 발생했습니다.');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        📊 엑셀 다운로드 센터
      </Typography>

      {/* 데이터 설정 영역 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📋 데이터 설정
          </Typography>
          
          <Stack spacing={3} direction={{ xs: 'column', md: 'row' }}>
            <Box sx={{ flex: 1 }}>
              <TextField
                label="데이터 개수"
                type="number"
                value={dataCount}
                onChange={(e) => setDataCount(Number(e.target.value))}
                inputProps={{ min: 1, max: 10000 }}
                fullWidth
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <FormControl fullWidth>
                <InputLabel>카테고리 필터</InputLabel>
                <Select
                  value={filterCategory}
                  label="카테고리 필터"
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <MenuItem value="">전체</MenuItem>
                  <MenuItem value="CAT001">개인정보 (CAT001)</MenuItem>
                  <MenuItem value="CAT002">사업정보 (CAT002)</MenuItem>
                  <MenuItem value="CAT003">계약정보 (CAT003)</MenuItem>
                  <MenuItem value="CAT004">신원정보 (CAT004)</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: 1 }}>
              <FormControl fullWidth>
                <InputLabel>그룹 필터</InputLabel>
                <Select
                  value={filterGroup}
                  label="그룹 필터"
                  onChange={(e) => setFilterGroup(e.target.value)}
                >
                  <MenuItem value="">전체</MenuItem>
                  <MenuItem value="기본정보">기본정보</MenuItem>
                  <MenuItem value="신원정보">신원정보</MenuItem>
                  <MenuItem value="계약정보">계약정보</MenuItem>
                  <MenuItem value="추가정보">추가정보</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: 1 }}>
              <TextField
                label="검색 키워드"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="서식명 또는 서식 코드"
                fullWidth
              />
            </Box>
          </Stack>

          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => {
                const data = generateAndFilterData();
                alert(`필터 조건에 맞는 데이터: ${data.length}개`);
              }}
            >
              필터 미리보기
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* 다운로드 옵션들 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📥 다운로드 옵션
          </Typography>
          
          <Stack spacing={2}>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <Button
                variant="contained"
                startIcon={<Download />}
                onClick={handleBasicDownload}
                size="large"
              >
                기본 다운로드
              </Button>
              
              <Button
                variant="contained"
                color="secondary"
                startIcon={<TableView />}
                onClick={handleMultiSheetDownload}
                size="large"
              >
                다중 시트 다운로드
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<FileDownload />}
                onClick={handleTemplateDownload}
              >
                템플릿 다운로드
              </Button>
              
              <Button
                variant="outlined"
                color="warning"
                startIcon={<FilterList />}
                onClick={handleFilteredDownload}
              >
                필터링된 다운로드
              </Button>
            </Stack>

            <Alert severity="info">
              <Typography variant="body2">
                • <strong>기본 다운로드</strong>: 설정한 개수만큼의 데이터를 단일 시트로 다운로드<br/>
                • <strong>다중 시트 다운로드</strong>: 카테고리별로 시트를 나누어 다운로드<br/>
                • <strong>템플릿 다운로드</strong>: 업로드용 빈 템플릿 (샘플 데이터 1행 포함)<br/>
                • <strong>필터링된 다운로드</strong>: 위에서 설정한 필터 조건에 맞는 데이터만 다운로드
              </Typography>
            </Alert>
          </Stack>
        </CardContent>
      </Card>

      {/* 현재 데이터 미리보기 */}
      {currentData.length > 0 && (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">
                현재 필터링된 데이터 ({currentData.length}개)
              </Typography>
              <Chip 
                label={`총 ${currentData.length}개 데이터`} 
                color="primary" 
                variant="outlined"
              />
            </Box>

            <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 400 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>순서</TableCell>
                    <TableCell>서식 코드</TableCell>
                    <TableCell>카테고리 코드</TableCell>
                    <TableCell>서식명</TableCell>
                    <TableCell>통합서식 여부</TableCell>
                    <TableCell>그룹명</TableCell>
                    <TableCell>서식 답변명</TableCell>
                    <TableCell>데이터 구분</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentData.slice(0, 50).map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.순서}</TableCell>
                      <TableCell>{row['서식 코드']}</TableCell>
                      <TableCell>{row['카테고리 코드']}</TableCell>
                      <TableCell>{row.서식명}</TableCell>
                      <TableCell>
                        <Chip
                          label={row['통합서식 여부']}
                          color={row['통합서식 여부'] === 'Y' ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{row.그룹명}</TableCell>
                      <TableCell>{row['서식 답변명']}</TableCell>
                      <TableCell>
                        <Chip
                          label={row['데이터 구분']}
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            {currentData.length > 50 && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                처음 50개만 미리보기로 표시됩니다. 전체 데이터는 엑셀 다운로드를 통해 확인하세요.
              </Typography>
            )}
          </CardContent>
        </Card>
      )}

      <Divider sx={{ my: 3 }} />

      {/* 사용 안내 */}
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            💡 사용 안내
          </Typography>
          
          <Typography variant="body2" color="text.secondary">
            <strong>1. 데이터 개수 설정</strong><br/>
            1개부터 10,000개까지 원하는 개수의 데이터를 생성할 수 있습니다.<br/><br/>
            
            <strong>2. 필터링 옵션</strong><br/>
            카테고리, 그룹, 검색 키워드를 통해 원하는 데이터만 선별하여 다운로드할 수 있습니다.<br/><br/>
            
            <strong>3. 다운로드 형식</strong><br/>
            • 기본: 단일 시트 엑셀 파일<br/>
            • 다중 시트: 카테고리별로 분리된 여러 시트<br/>
            • 템플릿: 업로드용 빈 양식<br/>
            • 필터링: 설정한 조건에 맞는 데이터만<br/><br/>
            
            <strong>4. 파일명 규칙</strong><br/>
            파일명에는 생성 날짜와 시간이 포함되어 중복을 방지합니다.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}