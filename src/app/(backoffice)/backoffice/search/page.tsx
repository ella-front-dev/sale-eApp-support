'use client';

import React, { useState } from 'react';

import {
  Container,
  Typography,
  Button,
  Box,
  Tabs,
  Tab,
  Paper,
  Alert
} from '@mui/material';

import ApiExcelDownload from '@/components/demo/ApiExcelDownload';
import ExcelDownload from '@/components/demo/ExcelDownload';
import SimpleExcelDownload from '@/components/demo/SimpleExcelDownload';
import SearchPopup from '@/page-components/search/SearchPopup';

/** 탭마다 무엇이 다른지 — 비슷해 보이는 화면이 3개인 이유를 화면에서 바로 알 수 있게 한다 */
const TAB_DESCRIPTIONS = [
  '검색 조건으로 구성항목을 찾아 좌우 리스트로 옮기는 팝업. 드래그로 순서도 바꿀 수 있다.',
  '여러 API 엔드포인트를 골라 한 번에 받아오는 경우. 선택 UI·미리보기가 필요하고, 통합 시트와 API별 시트 두 방식을 비교한다.',
  '이미 화면에 띄운 데이터를 그대로 내보내는 경우. API 호출 없이 필터·검색 결과를 그대로 시트로 만든다.',
  '위 두 화면이 쓰는 excelDownloader 함수들을 최소한의 UI 로 직접 호출해보는 예시.'
];

export default function SearchPage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleSelectItem = (items: unknown[]) => {
    alert(`${items.length}개의 항목이 선택되었습니다.`);
    setIsPopupOpen(false);
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        검색 & 엑셀 다운로드 데모
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        엑셀 다운로드 탭이 3개인 이유: 데이터를 <strong>어디서</strong> 가져오는지에 따라 필요한 UI 와
        호출 방식이 달라져서, 세 경우를 따로 만들어 비교했다. 실제 다운로드 로직은 세 탭 모두
        <code> src/lib/excelDownloader.ts </code> 하나를 공유한다.
      </Typography>

      <Paper sx={{ mt: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="검색 팝업" />
          <Tab label="여러 API 선택" />
          <Tab label="클라이언트 데이터" />
          <Tab label="호출 예시" />
        </Tabs>

        <Box sx={{ px: 3, pt: 2 }}>
          <Alert severity="info" variant="outlined">
            {TAB_DESCRIPTIONS[tabValue]}
          </Alert>
        </Box>

        {tabValue === 0 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              구성항목 검색 팝업
            </Typography>
            <Button 
              variant="contained" 
              onClick={handleOpenPopup}
              size="large"
            >
              구성항목 수정 팝업 열기
            </Button>
          </Box>
        )}

        {tabValue === 1 && <ApiExcelDownload />}
        {tabValue === 2 && <ExcelDownload />}
        {tabValue === 3 && <SimpleExcelDownload />}
      </Paper>

      <SearchPopup
        open={isPopupOpen}
        onClose={handleClosePopup}
        onSelect={handleSelectItem}
      />
    </Container>
  );
}