'use client';

import { useRouter } from 'next/navigation';

import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CardActions,
  Chip,
  Container, 
  Typography
} from '@mui/material';

export default function Home() {
  const router = useRouter();

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 700 }}>
          Welcome to Next.js with Material-UI
        </Typography>

        {/* 백오피스 프로젝트 Header */}
        <Card 
          sx={{ 
            mb: 4,
            border: '2px solid',
            borderColor: 'primary.main',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': { transform: 'translateY(-2px)', boxShadow: 8 },
            cursor: 'pointer'
          }}
          onClick={() => router.push('/backoffice/about')}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'flex-start', md: 'center' },
              justifyContent: 'space-between',
              gap: 3
            }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
                  📋 백오피스 프로젝트
                </Typography>
                <Typography variant="h6" sx={{ mb: 2, color: 'rgba(255,255,255,0.9)' }}>
                  대량 서식 데이터 관리 시스템
                </Typography>
                <Typography variant="body1" sx={{ mb: 2, color: 'rgba(255,255,255,0.8)' }}>
                  복잡한 계층 구조의 서식 데이터를 효율적으로 관리하고, 대량 데이터에서의 성능 최적화를 실험하는 프로젝트입니다.
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap',
                  gap: 1,
                  mt: 2
                }}>
                  <Chip label="개발 히스토리" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }} />
                  <Chip label="성능 최적화" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }} />
                  <Chip label="기술 문서" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }} />
                  <Chip label="이슈 해결" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }} />
                </Box>
              </Box>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                minWidth: { xs: '100%', md: 'auto' }
              }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{ 
                    bgcolor: 'white',
                    color: 'primary.main',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    px: 4,
                    py: 1.5,
                    width: { xs: '100%', md: 'auto' },
                    '&:hover': { 
                      bgcolor: 'rgba(255,255,255,0.9)',
                      transform: 'scale(1.05)'
                    }
                  }}
                >
                  문서 보기 →
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Feature Cards Grid */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          gap: 3 
        }}>
          {/* Back Office */}
          <Card sx={{ 
              width: '100%',
              height: '100%', 
              minHeight: '420px', 
              maxHeight: '420px',
              display: 'flex', 
              flexDirection: 'column', 
              transition: 'transform 0.2s, box-shadow 0.2s', 
              '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 } 
            }}>
              <CardContent sx={{ flexGrow: 1, overflow: 'auto' }}>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                  Back Office
                </Typography>
                <Typography variant="subtitle1" color="textPrimary" sx={{ fontWeight: 600, mb: 1.5 }}>
                  대량 서식 데이터 관리 및 성능 테스트
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  복잡한 계층 구조(그룹 → 컴포넌트 → 답변 → 하위답변)의 서식 데이터를 생성하고 관리합니다.
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                  제공 기능:
                </Typography>
                <Box component="ul" sx={{ m: 0, pl: 2.5, '& li': { fontSize: '0.875rem', color: 'text.secondary' } }}>
                  <li>대량 Mock 데이터 자동 생성</li>
                  <li>React.memo 기반 리렌더링 최소화</li>
                  <li>React Hook Form 폼 관리</li>
                  <li>코드 중복 검사 및 유효성 검증</li>
                </Box>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button 
                  variant="contained" 
                  size="large" 
                  fullWidth
                  onClick={() => router.push('/backoffice')}
                >
                  페이지 이동
                </Button>
              </CardActions>
            </Card>

          {/* Large Form */}
          <Card sx={{ 
              width: '100%',
              height: '100%', 
              minHeight: '420px', 
              maxHeight: '420px',
              display: 'flex', 
              flexDirection: 'column', 
              transition: 'transform 0.2s, box-shadow 0.2s', 
              '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 } 
            }}>
              <CardContent sx={{ flexGrow: 1, overflow: 'auto' }}>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                  Large Form
                </Typography>
                <Typography variant="subtitle1" color="textPrimary" sx={{ fontWeight: 600, mb: 1.5 }}>
                  대규모 폼 성능 최적화 실험
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  200개 이상의 컴포넌트와 800개 이상의 입력 필드를 가진 대규모 폼에서 성능을 최적화하는 기법을 테스트합니다.
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                  제공 기능:
                </Typography>
                <Box component="ul" sx={{ m: 0, pl: 2.5, '& li': { fontSize: '0.875rem', color: 'text.secondary' } }}>
                  <li>React Hook Form + useFieldArray</li>
                  <li>useTransition 비동기 렌더링</li>
                  <li>Performance API 성능 측정</li>
                  <li>메모리 최적화</li>
                </Box>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button 
                  variant="contained" 
                  size="large" 
                  fullWidth
                  onClick={() => router.push('/backoffice/large-form')}
                >
                  페이지 이동
                </Button>
              </CardActions>
            </Card>

          {/* Template Editor */}
          <Card sx={{ 
              width: '100%',
              height: '100%', 
              minHeight: '420px', 
              maxHeight: '420px',
              display: 'flex', 
              flexDirection: 'column', 
              transition: 'transform 0.2s, box-shadow 0.2s', 
              '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 } 
            }}>
              <CardContent sx={{ flexGrow: 1, overflow: 'auto' }}>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                  Template Editor
                </Typography>
                <Typography variant="subtitle1" color="textPrimary" sx={{ fontWeight: 600, mb: 1.5 }}>
                  서식 템플릿 구조 설계 도구
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  복잡한 계층 구조의 서식 템플릿을 생성, 수정, 관리하는 통합 시스템입니다. 트리 구조와 데이터 그리드를 활용합니다.
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                  제공 기능:
                </Typography>
                <Box component="ul" sx={{ m: 0, pl: 2.5, '& li': { fontSize: '0.875rem', color: 'text.secondary' } }}>
                  <li>템플릿 리스트 관리</li>
                  <li>계층형 트리 구조 시각화</li>
                  <li>SidebarTree & ContentDataGrid</li>
                  <li>실시간 데이터 동기화</li>
                </Box>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button 
                  variant="contained" 
                  size="large" 
                  fullWidth
                  onClick={() => router.push('/backoffice/template-editor')}
                >
                  페이지 이동
                </Button>
              </CardActions>
            </Card>

          {/* Common Code */}
          <Card sx={{ 
              width: '100%',
              height: '100%', 
              minHeight: '420px', 
              maxHeight: '420px',
              display: 'flex', 
              flexDirection: 'column', 
              transition: 'transform 0.2s, box-shadow 0.2s', 
              '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 } 
            }}>
              <CardContent sx={{ flexGrow: 1, overflow: 'auto' }}>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                  Common Code
                </Typography>
                <Typography variant="subtitle1" color="textPrimary" sx={{ fontWeight: 600, mb: 1.5 }}>
                  공통 코드 시스템 & 값-라벨 변환
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  서버에서 받은 공통 코드 데이터를 Select, Radio 등 폼 컴포넌트에 적용하고, 코드 값을 라벨로 변환합니다.
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                  제공 기능:
                </Typography>
                <Box component="ul" sx={{ m: 0, pl: 2.5, '& li': { fontSize: '0.875rem', color: 'text.secondary' } }}>
                  <li>API 원본 vs 포맷팅 결과 비교</li>
                  <li>Select/Radio 자동 적용</li>
                  <li>코드 값 → 라벨 변환</li>
                  <li>Mock 데이터 모드</li>
                </Box>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button 
                  variant="contained" 
                  size="large" 
                  fullWidth
                  onClick={() => router.push('/backoffice/demo')}
                >
                  페이지 이동
                </Button>
              </CardActions>
            </Card>

          {/* Search */}
          <Card sx={{ 
              width: '100%',
              height: '100%', 
              minHeight: '420px', 
              maxHeight: '420px',
              display: 'flex', 
              flexDirection: 'column', 
              transition: 'transform 0.2s, box-shadow 0.2s', 
              '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 } 
            }}>
              <CardContent sx={{ flexGrow: 1, overflow: 'auto' }}>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                  Search
                </Typography>
                <Typography variant="subtitle1" color="textPrimary" sx={{ fontWeight: 600, mb: 1.5 }}>
                  검색 팝업 & 엑셀 다운로드
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  검색 기능과 다양한 방식의 엑셀 다운로드 기능을 제공합니다.
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                  제공 기능:
                </Typography>
                <Box component="ul" sx={{ m: 0, pl: 2.5, '& li': { fontSize: '0.875rem', color: 'text.secondary' } }}>
                  <li>구성항목 검색 팝업</li>
                  <li>API 기반 엑셀 다운로드</li>
                  <li>클라이언트 데이터 엑셀 변환</li>
                  <li>탭 기반 UI</li>
                </Box>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button 
                  variant="contained" 
                  size="large" 
                  fullWidth
                  onClick={() => router.push('/backoffice/search')}
                >
                  페이지 이동
                </Button>
              </CardActions>
            </Card>
        </Box>

        {/* DSP 공통 프로젝트 Header */}
        <Card 
          sx={{ 
            mt: 6,
            mb: 4,
            border: '2px solid',
            borderColor: 'secondary.main',
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': { transform: 'translateY(-2px)', boxShadow: 8 },
            cursor: 'pointer'
          }}
          onClick={() => router.push('/dsp')}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'flex-start', md: 'center' },
              justifyContent: 'space-between',
              gap: 3
            }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
                  🔧 DSP 공통 프로젝트 <Chip label="구상 단계" size="small" sx={{ bgcolor: 'rgba(0,0,0,0.25)', color: 'white', fontWeight: 600 }} />
                </Typography>
                <Typography variant="h6" sx={{ mb: 2, color: 'rgba(255,255,255,0.9)' }}>
                  공통 컴포넌트 & 유틸리티 라이브러리
                </Typography>
                <Typography variant="body1" sx={{ mb: 2, color: 'rgba(255,255,255,0.8)' }}>
                  재사용 가능한 공통 컴포넌트와 유틸리티 함수들을 모아놓을 라이브러리 프로젝트입니다.
                  아직 구현물 없이 방향만 정리해둔 단계입니다.
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap',
                  gap: 1,
                  mt: 2
                }}>
                  <Chip label="공통 컴포넌트" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }} />
                  <Chip label="재사용성" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }} />
                  <Chip label="표준화" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }} />
                  <Chip label="문서화" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }} />
                </Box>
              </Box>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                minWidth: { xs: '100%', md: 'auto' }
              }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{ 
                    bgcolor: 'white',
                    color: 'secondary.main',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    px: 4,
                    py: 1.5,
                    width: { xs: '100%', md: 'auto' },
                    '&:hover': { 
                      bgcolor: 'rgba(255,255,255,0.9)',
                      transform: 'scale(1.05)'
                    }
                  }}
                >
                  페이지 이동 →
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* 앱체널 프로젝트 Header */}
        <Card
          sx={{
            mt: 6,
            mb: 4,
            border: '2px solid',
            borderColor: 'success.main',
            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            color: 'white',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': { transform: 'translateY(-2px)', boxShadow: 8 },
            cursor: 'pointer'
          }}
          onClick={() => router.push('/app-channel')}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'flex-start', md: 'center' },
              justifyContent: 'space-between',
              gap: 3
            }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
                  📱 앱체널
                </Typography>
                <Typography variant="h6" sx={{ mb: 2, color: 'rgba(255,255,255,0.9)' }}>
                  앱 채널 공통 컴포넌트 & 네비게이션
                </Typography>
                <Typography variant="body1" sx={{ mb: 2, color: 'rgba(255,255,255,0.8)' }}>
                  앱 채널에서 사용하는 공통 컴포넌트와 네비게이션 구조를 관리하는 프로젝트입니다.
                </Typography>
                <Box sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1,
                  mt: 2
                }}>
                  <Chip label="앱 채널" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }} />
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* 앱체널 Feature Cards */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          gap: 3,
          mb: 4
        }}>
          {/* Biz-Navi */}
          <Card sx={{
              width: '100%',
              height: '100%',
              minHeight: '420px',
              maxHeight: '420px',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }
            }}>
              <CardContent sx={{ flexGrow: 1, overflow: 'auto' }}>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                  Biz-Navi
                </Typography>
                <Typography variant="subtitle1" color="textPrimary" sx={{ fontWeight: 600, mb: 1.5 }}>
                  헤더 네비게이션 컴포넌트
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  앱 채널 상단 헤더 네비게이션을 구성하는 공통 컴포넌트입니다. 다양한 페이지에서 일관된 네비게이션 UX를 제공합니다.
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                  제공 기능:
                </Typography>
                <Box component="ul" sx={{ m: 0, pl: 2.5, '& li': { fontSize: '0.875rem', color: 'text.secondary' } }}>
                  <li>헤더 네비게이션 UI</li>
                  <li>라우팅 연동</li>
                  <li>반응형 레이아웃</li>
                  <li>공통 스타일 적용</li>
                </Box>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={() => router.push('/app-channel/biz-navi')}
                >
                  페이지 이동
                </Button>
              </CardActions>
            </Card>

          {/* Download */}
          <Card sx={{
              width: '100%',
              height: '100%',
              minHeight: '420px',
              maxHeight: '420px',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }
            }}>
              <CardContent sx={{ flexGrow: 1, overflow: 'auto' }}>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                  Download
                </Typography>
                <Typography variant="subtitle1" color="textPrimary" sx={{ fontWeight: 600, mb: 1.5 }}>
                  앱 다운로드 랜딩 페이지
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  [예시] 영업지원 앱 소개 및 다운로드를 위한 반응형 원페이지 랜딩입니다.
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                  제공 기능:
                </Typography>
                <Box component="ul" sx={{ m: 0, pl: 2.5, '& li': { fontSize: '0.875rem', color: 'text.secondary' } }}>
                  <li>앱 소개 히어로 섹션</li>
                  <li>주요 기능 소개</li>
                  <li>앱 설치 안내</li>
                  <li>Android 다운로드 연동</li>
                </Box>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={() => router.push('/app-channel/download')}
                >
                  페이지 이동
                </Button>
              </CardActions>
            </Card>
        </Box>

        {/* DSP 공통 프로젝트 Feature Cards (필요시 추가) */}
        {/* 
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          gap: 3
        }}>
          DSP 프로젝트의 기능 카드들...
        </Box>
        */}

        {/* 
        ============================================
        다른 프로젝트 추가 템플릿 (필요시 주석 해제)
        ============================================
        */}

        {/* 예시: 추가 프로젝트 Header
        <Card 
          sx={{ 
            mt: 6,
            mb: 4,
            border: '2px solid',
            borderColor: 'success.main',
            background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            color: 'white',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': { transform: 'translateY(-2px)', boxShadow: 8 },
            cursor: 'pointer'
          }}
          onClick={() => router.push('/other-project')}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'flex-start', md: 'center' },
              justifyContent: 'space-between',
              gap: 3
            }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
                  🚀 새 프로젝트명
                </Typography>
                <Typography variant="h6" sx={{ mb: 2, color: 'rgba(255,255,255,0.9)' }}>
                  프로젝트 부제목
                </Typography>
                <Typography variant="body1" sx={{ mb: 2, color: 'rgba(255,255,255,0.8)' }}>
                  프로젝트 설명을 여기에 작성합니다.
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap',
                  gap: 1,
                  mt: 2
                }}>
                  <Chip label="태그1" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }} />
                  <Chip label="태그2" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }} />
                </Box>
              </Box>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                minWidth: { xs: '100%', md: 'auto' }
              }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{ 
                    bgcolor: 'white',
                    color: 'success.main',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    px: 4,
                    py: 1.5,
                    width: { xs: '100%', md: 'auto' },
                    '&:hover': { 
                      bgcolor: 'rgba(255,255,255,0.9)',
                      transform: 'scale(1.05)'
                    }
                  }}
                >
                  페이지 이동 →
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
        */}

        {/* 다른 프로젝트의 Feature Cards 
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          gap: 3
        }}>
          기능 카드들...
        </Box>
        */}

      </Box>
    </Container>
  );
}
