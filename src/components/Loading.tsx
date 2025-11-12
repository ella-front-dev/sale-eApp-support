import { CircularProgress, Box, Typography } from '@mui/material';

// 전역 로딩 컴포넌트
export function GlobalLoading() {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999
      }}
    >
      <CircularProgress size={60} />
      <Typography variant="h6" sx={{ mt: 2, color: 'primary.main' }}>
        데이터를 불러오는 중...
      </Typography>
    </Box>
  );
}

// 페이지 내 로딩 컴포넌트
export function PageLoading() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        gap: 2
      }}
    >
      <CircularProgress />
      <Typography>로딩 중...</Typography>
    </Box>
  );
}

// 카드/섹션 내 로딩 컴포넌트  
export function SectionLoading() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4
      }}
    >
      <CircularProgress size={30} />
      <Typography variant="body2" sx={{ ml: 2 }}>
        처리 중...
      </Typography>
    </Box>
  );
}