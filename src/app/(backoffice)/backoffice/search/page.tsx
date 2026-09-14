'use client';

import React, { useState } from 'react';

import {
  Container,
  Typography,
  Button,
  Box,
  Tabs,
  Tab,
  Paper
} from '@mui/material';

import SimpleExcelDownload from '@/components/SimpleExcelDownload';
import ApiExcelDownload from '@/components/utils/ApiExcelDownload';
import ExcelDownload from '@/components/utils/ExcelDownload';
import SearchPopup from '@/page-components/search/SearchPopup';

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
        검색 & API 엑셀 다운로드 데모
      </Typography>
      
      <Paper sx={{ mt: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="검색 팝업" />
          <Tab label="API 엑셀 다운로드" />
          <Tab label="엑셀 다운로드" />
          <Tab label="간편 다운로드" />
        </Tabs>

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