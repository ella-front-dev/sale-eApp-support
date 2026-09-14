'use client';

import {
  Container,
  Typography,
  Box,
  Paper,
  Chip,
  Card,
  CardContent,
} from '@mui/material';

export default function DSPPage() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 2 }}>
            🔧 DSP 공통 프로젝트
          </Typography>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            공통 컴포넌트 & 유틸리티 라이브러리
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
            <Chip label="공통 컴포넌트" color="primary" />
            <Chip label="재사용성" color="primary" />
            <Chip label="표준화" color="secondary" />
            <Chip label="문서화" color="secondary" />
          </Box>
        </Box>

        {/* 프로젝트 소개 */}
        <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            📖 프로젝트 개요
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            DSP 공통 프로젝트는 여러 프로젝트에서 재사용 가능한 컴포넌트와 유틸리티 함수들을 
            모아놓은 라이브러리입니다. 일관된 UI/UX와 코드 표준화를 목표로 합니다.
          </Typography>
        </Paper>

        {/* 주요 기능 */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            🎯 주요 기능
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                  공통 컴포넌트
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  재사용 가능한 UI 컴포넌트 라이브러리
                </Typography>
                <Box component="ul" sx={{ mt: 2, pl: 2, '& li': { fontSize: '0.875rem', mb: 0.5 } }}>
                  <li>Form 컴포넌트</li>
                  <li>Table & DataGrid</li>
                  <li>Modal & Dialog</li>
                  <li>Layout 컴포넌트</li>
                </Box>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                  유틸리티 함수
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  공통으로 사용되는 헬퍼 함수들
                </Typography>
                <Box component="ul" sx={{ mt: 2, pl: 2, '& li': { fontSize: '0.875rem', mb: 0.5 } }}>
                  <li>날짜/시간 처리</li>
                  <li>데이터 포맷팅</li>
                  <li>유효성 검사</li>
                  <li>API 헬퍼</li>
                </Box>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                  Hooks
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  커스텀 React Hooks 모음
                </Typography>
                <Box component="ul" sx={{ mt: 2, pl: 2, '& li': { fontSize: '0.875rem', mb: 0.5 } }}>
                  <li>useCommonCodes</li>
                  <li>useCodeDuplicationCheck</li>
                  <li>useCustomValidation</li>
                  <li>usePagePermissions</li>
                </Box>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                  스타일 시스템
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  통일된 디자인 시스템
                </Typography>
                <Box component="ul" sx={{ mt: 2, pl: 2, '& li': { fontSize: '0.875rem', mb: 0.5 } }}>
                  <li>테마 정의</li>
                  <li>색상 팔레트</li>
                  <li>타이포그래피</li>
                  <li>공통 스타일</li>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* 기술 스택 */}
        <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            🛠️ 기술 스택
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
            <Chip label="React" variant="outlined" />
            <Chip label="TypeScript" variant="outlined" />
            <Chip label="Material-UI" variant="outlined" />
            <Chip label="React Hook Form" variant="outlined" />
            <Chip label="Axios" variant="outlined" />
            <Chip label="Day.js" variant="outlined" />
          </Box>
        </Paper>

        {/* Coming Soon */}
        <Box sx={{ textAlign: 'center', py: 6, bgcolor: 'grey.50', borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            🚧 Coming Soon
          </Typography>
          <Typography variant="body1" color="textSecondary">
            상세 페이지와 컴포넌트 데모는 곧 추가될 예정입니다.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
