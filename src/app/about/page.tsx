'use client';

import {
  Container,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CodeIcon from '@mui/icons-material/Code';
import BugReportIcon from '@mui/icons-material/BugReport';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';

export default function AboutPage() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        {/* 프로젝트 소개 */}
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
          📚 Project Documentation
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Next.js + Material-UI 기반의 대규모 폼 관리 시스템 개발 히스토리
        </Typography>

        <Divider sx={{ my: 4 }} />

        {/* 기술 스택 */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            🛠️ Tech Stack
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Chip label="Next.js 15" color="primary" />
            <Chip label="React 19" color="primary" />
            <Chip label="TypeScript" color="primary" />
            <Chip label="Material-UI v7" color="secondary" />
            <Chip label="React Hook Form" color="secondary" />
            <Chip label="Virtuoso" color="secondary" />
            <Chip label="Axios" />
            <Chip label="XLSX" />
            <Chip label="Zod" />
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* 개발 타임라인 - 각 기능별 히스토리 */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            📅 Development Timeline
          </Typography>

          {/* Back Office 히스토리 */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                <CheckCircleIcon color="success" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Back Office - 대량 서식 데이터 관리
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  📌 주요 목적
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  복잡한 계층 구조(그룹 → 컴포넌트 → 답변 → 하위답변)의 서식 데이터를 효율적으로 관리하고, 
                  대량 데이터에서의 성능 최적화 기법을 실험합니다.
                </Typography>

                <Typography variant="subtitle2" color="primary" gutterBottom sx={{ mt: 2 }}>
                  🔧 개발 히스토리
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary="1단계: 기본 폼 구조 설계"
                      secondary="React Hook Form + useFieldArray로 중첩 구조 관리"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="2단계: 대량 Mock 데이터 생성 (100개 컴포넌트)"
                      secondary="성능 테스트를 위한 자동 데이터 생성 로직 구현"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="3단계: Virtuoso 가상화 적용"
                      secondary="렌더링 성능 개선 - 실제 DOM 노드 수 감소"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="4단계: 코드 중복 검사 & 실시간 유효성 검증"
                      secondary="useCodeDuplicationCheck 훅으로 데이터 무결성 보장"
                    />
                  </ListItem>
                </List>

                <Typography variant="subtitle2" color="error" gutterBottom sx={{ mt: 2 }}>
                  🐛 주요 이슈 & 해결
                </Typography>
                <Card variant="outlined" sx={{ mt: 1, bgcolor: 'error.50' }}>
                  <CardContent>
                    <Typography variant="body2">
                      <strong>이슈:</strong> 대량 데이터 입력 시 폼 반응 속도 저하
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>해결:</strong> react-virtuoso 도입 + useTransition으로 비동기 렌더링 처리
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Large Form 히스토리 */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CheckCircleIcon color="success" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Large Form - 대규모 폼 성능 최적화
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  📌 주요 목적
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  200개 이상의 컴포넌트와 800개 이상의 입력 필드를 가진 극한의 폼 환경에서 
                  성능 병목 지점을 찾고 최적화 기법을 테스트합니다.
                </Typography>

                <Typography variant="subtitle2" color="primary" gutterBottom sx={{ mt: 2 }}>
                  🔧 개발 히스토리
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary="Performance API 통합"
                      secondary="렌더링 시간, 메모리 사용량 실시간 측정"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="useTransition Hook 활용"
                      secondary="대량 데이터 로딩 시 UI 블로킹 방지"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="메모리 최적화"
                      secondary="불필요한 리렌더링 방지 및 메모이제이션 적용"
                    />
                  </ListItem>
                </List>

                <Typography variant="subtitle2" sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TipsAndUpdatesIcon color="warning" fontSize="small" />
                  주요 인사이트
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  • 800개 필드에서도 React Hook Form의 uncontrolled 방식이 뛰어난 성능 보임<br />
                  • Virtualization 없이도 useTransition만으로 충분한 UX 개선 가능<br />
                  • 초기 렌더링보다 데이터 변경 시 리렌더링 최적화가 더 중요
                </Typography>
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Template Editor 히스토리 */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CheckCircleIcon color="success" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Template Editor - 서식 템플릿 구조 설계
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  📌 주요 목적
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  계층형 트리 구조와 데이터 그리드를 결합하여 복잡한 서식 템플릿을 
                  시각적으로 관리할 수 있는 통합 에디터를 구현합니다.
                </Typography>

                <Typography variant="subtitle2" color="primary" gutterBottom sx={{ mt: 2 }}>
                  🔧 개발 히스토리
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary="1단계: Back Office 내 통합 컴포넌트로 시작"
                      secondary="초기에는 /backoffice/admin에 위치"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="2단계: 중복 페이지 문제 발견 및 정리"
                      secondary="/backoffice/admin 페이지 제거, 컴포넌트만 유지"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="3단계: 독립 페이지로 분리"
                      secondary="/template-editor로 독립, List/New/Edit 구조 구현"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="4단계: SidebarTree + ContentDataGrid 2-panel UI"
                      secondary="트리에서 노드 선택 시 우측 그리드에 상세 내용 표시"
                    />
                  </ListItem>
                </List>

                <Typography variant="subtitle2" color="error" gutterBottom sx={{ mt: 2 }}>
                  🐛 주요 이슈 & 해결
                </Typography>
                <Card variant="outlined" sx={{ mt: 1, bgcolor: 'error.50' }}>
                  <CardContent>
                    <Typography variant="body2">
                      <strong>이슈:</strong> 트리 구조와 그리드 데이터 동기화 문제
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>해결:</strong> selectedNode를 키로 사용, useEffect로 데이터 필터링 및 동기화
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Common Code 히스토리 */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CheckCircleIcon color="success" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Common Code - 공통 코드 시스템
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  📌 주요 목적
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  서버 API에서 받은 공통 코드 데이터를 폼 컴포넌트에 적용하고, 
                  저장된 코드 값을 사용자에게 보여줄 라벨로 변환하는 시스템입니다.
                </Typography>

                <Typography variant="subtitle2" color="primary" gutterBottom sx={{ mt: 2 }}>
                  🔧 개발 히스토리
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary="1단계: 공통 코드 Demo 페이지 생성"
                      secondary="API 원본 vs 포맷팅 결과 비교 UI 구현"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="2단계: Value-to-Label 페이지 생성"
                      secondary="코드 값 → 라벨 변환 데모"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="3단계: 페이지 통합"
                      secondary="유사 기능이라 하나의 /demo 페이지로 합침"
                    />
                  </ListItem>
                </List>

                <Typography variant="subtitle2" color="error" gutterBottom sx={{ mt: 2 }}>
                  🐛 주요 이슈 & 해결
                </Typography>
                <Card variant="outlined" sx={{ mt: 1, bgcolor: 'error.50' }}>
                  <CardContent>
                    <Typography variant="body2" gutterBottom>
                      <strong>이슈 1:</strong> getDefaultValue 함수 미정의 에러
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                      <strong>해결:</strong> getFirstCode로 함수명 변경 및 export 누락 수정
                    </Typography>

                    <Typography variant="body2" gutterBottom>
                      <strong>이슈 2:</strong> Hydration mismatch 에러
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>해결:</strong> useEffect 의존성 배열 수정, 서버/클라이언트 렌더링 일치
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Search 페이지 히스토리 */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CheckCircleIcon color="success" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Search - 검색 & 엑셀 다운로드
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  📌 주요 목적
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  복잡한 검색 조건을 팝업으로 제공하고, 다양한 방식의 엑셀 다운로드 기능을 테스트합니다.
                </Typography>

                <Typography variant="subtitle2" color="primary" gutterBottom sx={{ mt: 2 }}>
                  🔧 구현 기능
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary="검색 팝업 (Dialog)"
                      secondary="복잡한 필터 조건을 모달로 관리"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="API 기반 엑셀 다운로드"
                      secondary="서버에서 생성된 파일 다운로드"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="클라이언트 데이터 → 엑셀 변환"
                      secondary="XLSX 라이브러리로 브라우저에서 파일 생성"
                    />
                  </ListItem>
                </List>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* UI/UX 개선 히스토리 */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            🎨 UI/UX Evolution
          </Typography>
          
          <Paper elevation={1} sx={{ p: 3 }}>
            <Typography variant="subtitle1" color="primary" gutterBottom sx={{ fontWeight: 600 }}>
              초기 페이지 변천사
            </Typography>
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                <strong>v1:</strong> 기본 링크 리스트 형태
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                <strong>v2:</strong> 각 페이지 설명이 포함된 상세 링크
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                <strong>v3:</strong> Card 기반 Grid 레이아웃 (현재)
              </Typography>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" color="error" gutterBottom>
                주요 문제 해결
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="카드 크기 불균일 문제"
                    secondary="CSS Grid + minHeight/maxHeight로 모든 카드 420px 고정"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Hydration 에러"
                    secondary="Typography component='div' 내 ul 태그 문제 → Box component='ul'로 해결"
                  />
                </ListItem>
              </List>
            </Box>
          </Paper>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* 주요 성능 이슈 & 해결 과정 */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            ⚡ Critical Performance Issues
          </Typography>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <BugReportIcon color="error" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  대량 데이터 렌더링 성능 문제
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box>
                <Typography variant="subtitle2" color="error" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BugReportIcon fontSize="small" />
                  이슈: 서식 수정 페이지 로딩 지연
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  서식 수정 페이지로 들어갈 때 데이터 양이 많으면 화면이 띄워지는 데까지 오래 걸림 (총 렌더링: 19,297ms)
                </Typography>

                <Card variant="outlined" sx={{ mb: 3, bgcolor: 'grey.50' }}>
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                      📊 원인 분석
                    </Typography>
                    <Typography variant="body2" color="textSecondary" paragraph>
                      React Profiler와 Performance API를 활용하여 각 구간별 소요 시간 측정:
                    </Typography>
                    <Box component="ul" sx={{ m: 0, pl: 3, '& li': { fontSize: '0.875rem', color: 'text.secondary', mb: 1 } }}>
                      <li><code>console.time{"('"}network{"')"}</code> - API 호출 시간</li>
                      <li><code>console.time{"('"}parse{"')"}</code> - JSON 파싱 시간</li>
                      <li><code>console.time{"('"}reset{"')"}</code> - React Hook Form reset 시간</li>
                      <li><code>Profiler onRender</code> - 컴포넌트 렌더링 시간</li>
                    </Box>
                    <Typography variant="body2" color="error" sx={{ mt: 2, fontWeight: 600 }}>
                      ⚠️ 핵심 문제: 그룹 20개 × 서식 구성 200개 = 대량 데이터로 인한 UI 블로킹
                    </Typography>
                  </CardContent>
                </Card>

                <Typography variant="subtitle2" color="primary" gutterBottom sx={{ mt: 3, mb: 2 }}>
                  🔧 시도한 해결 방법
                </Typography>

                {/* 해결 방법 1 */}
                <Paper elevation={0} sx={{ p: 2, mb: 2, border: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                    해결방법 1: 불필요한 리렌더링 방지
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    <strong>적용:</strong> React.memo, useMemo, useCallback으로 컴포넌트 재활용
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <CheckCircleIcon color="success" fontSize="small" />
                    <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                      결과: 리렌더링 확연히 감소 ✓
                    </Typography>
                  </Box>
                </Paper>

                {/* 해결 방법 2 */}
                <Paper elevation={0} sx={{ p: 2, mb: 2, border: '1px solid', borderColor: 'warning.main', bgcolor: 'warning.50' }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: 'warning.dark' }}>
                    해결방법 2: 무한 스크롤 분할 렌더링
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    <strong>적용:</strong> Group을 10개씩 나눠서 무한 스크롤 형태로 로딩
                  </Typography>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="success.main">
                      ✓ Group이 많은 리스트는 잘 가져옴
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" color="error" sx={{ fontWeight: 600 }}>
                      ✗ 문제: Component 200개 이상 가진 그룹에서 브라우저 동작 멈춤
                    </Typography>
                  </Box>
                </Paper>

                {/* 해결 방법 3 */}
                <Paper elevation={0} sx={{ p: 2, mb: 2, border: '1px solid', borderColor: 'warning.main', bgcolor: 'warning.50' }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: 'warning.dark' }}>
                    해결방법 3: 가상 DOM (react-virtuoso) 전면 적용
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    <strong>적용:</strong> Group과 Components 양쪽에 react-virtuoso 적용
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" color="error" sx={{ fontWeight: 600 }}>
                      ✗ 문제: 중첩 가상화로 인한 높이 계산 오류 → 화이트 스크린 발생
                    </Typography>
                  </Box>
                </Paper>

                {/* 해결 방법 4 */}
                <Paper elevation={0} sx={{ p: 2, mb: 2, border: '1px solid', borderColor: 'warning.main', bgcolor: 'warning.50' }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: 'warning.dark' }}>
                    해결방법 4: Accordion + 무한 스크롤 혼합
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    <strong>적용:</strong> 그룹에 Accordion 적용 + 컴포넌트 10개씩 무한 스크롤
                  </Typography>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="success.main">
                      ✓ 첫 화면 로딩 시간 감소
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" color="error" sx={{ fontWeight: 600 }}>
                      ✗ 문제: 스크롤마다 누적 로딩 → 200개 로드 시 오히려 더 느림
                    </Typography>
                  </Box>
                </Paper>

                {/* 해결 방법 5 - 성공 */}
                <Paper elevation={2} sx={{ p: 2, mb: 2, border: '2px solid', borderColor: 'success.main', bgcolor: 'success.50' }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: 'success.dark', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleIcon color="success" />
                    해결방법 5: Accordion + 가상 DOM 혼합 ✓
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    <strong>적용:</strong> 그룹은 Accordion으로 분할 + 컴포넌트는 react-virtuoso 가상화
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <CheckCircleIcon color="success" fontSize="small" />
                    <Typography variant="body2" color="success.dark" sx={{ fontWeight: 600 }}>
                      결과: 성능 문제 해결 완료 - 대량 데이터에서도 안정적인 렌더링 성공 ✓
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
                    * 그룹 단위 지연 로딩 + 각 그룹 내부는 가상 스크롤로 최적화
                  </Typography>
                </Paper>

                {/* 전략적 결정 */}
                <Paper elevation={3} sx={{ p: 3, mt: 3, mb: 2, border: '3px solid', borderColor: 'info.main', bgcolor: 'info.50' }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 700, color: 'info.dark', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CodeIcon color="info" />
                    전략적 결정: TemplateEditor 형태로 전면 재설계
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body2" color="textSecondary" paragraph>
                    <strong>배경:</strong> 성능 문제는 해결되었으나, 추가 요구사항이 앞으로 더 생길 가능성이 높아 
                    장기적 관점에서 더 나은 구조로 전환하기로 결정
                  </Typography>
                  <Box sx={{ bgcolor: 'white', p: 2, borderRadius: 1, border: '1px solid', borderColor: 'info.main' }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: 'info.dark' }}>
                      새로운 접근 방식
                    </Typography>
                    <Box component="ul" sx={{ m: 0, pl: 3, '& li': { fontSize: '0.875rem', color: 'text.secondary', mb: 1 } }}>
                      <li><strong>SidebarTree + ContentDataGrid 구조:</strong> 계층형 트리에서 노드 선택 시 우측에 상세 내용 표시</li>
                      <li><strong>페이지 분리:</strong> 복잡한 단일 페이지 대신 List/New/Edit 구조로 역할 명확화</li>
                      <li><strong>선택적 렌더링:</strong> 전체 데이터를 한 번에 로드하지 않고 필요한 부분만 표시</li>
                      <li><strong>확장성 우선:</strong> 향후 기능 추가 시 유연하게 대응 가능한 컴포넌트 구조</li>
                    </Box>
                  </Box>
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'info.100', borderRadius: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'info.dark' }}>
                      💡 단기적 최적화보다 장기적 유지보수성과 확장성을 선택
                    </Typography>
                  </Box>
                </Paper>

                {/* Side Effects */}
                <Card variant="outlined" sx={{ mt: 3, bgcolor: 'warning.50', borderColor: 'warning.main' }}>
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: 'warning.dark' }}>
                      🔍 발견된 부작용 (Side Effects)
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>이슈:</strong> 서식 구성 추가 시 {"\"구성추가\""} 버튼이 비정상적으로 표시
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                      <strong>예상 원인:</strong> memo/useMemo 사용으로 마지막 구성요소 감지 로직의 리렌더링이 발생하지 않음
                    </Typography>
                    <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1, fontStyle: 'italic' }}>
                      Note: 그룹 추가 버튼은 정상 작동 → 추가 디버깅 필요
                    </Typography>
                    <Divider sx={{ my: 1.5 }} />
                    <Typography variant="body2" sx={{ color: 'info.dark', fontWeight: 600, mt: 1 }}>
                      → TemplateEditor 구조 전환 시 이러한 부작용도 함께 개선될 예정
                    </Typography>
                  </CardContent>
                </Card>

                {/* 핵심 인사이트 */}
                <Box sx={{ mt: 3, p: 2, bgcolor: 'primary.50', borderRadius: 1 }}>
                  <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, fontWeight: 600 }}>
                    <TipsAndUpdatesIcon color="primary" fontSize="small" />
                    핵심 인사이트
                  </Typography>
                  <Box component="ul" sx={{ m: 0, pl: 3, '& li': { fontSize: '0.875rem', color: 'text.secondary', mb: 0.5 } }}>
                    <li><strong>성능 문제 해결 성공</strong> - Accordion + 가상 DOM으로 목표 달성</li>
                    <li><strong>전략적 전환</strong> - {"\"작동한다\"와 \"장기적으로 유지보수 가능하다\"는 다른 문제"}</li>
                    <li><strong>확장성 우선 사고</strong> - 당장의 해결보다 미래의 변화 대응력이 중요</li>
                    <li>가상 DOM은 중첩 시 높이 계산 이슈 → 한 레벨에만 적용</li>
                    <li>무한 스크롤은 초기 로딩엔 유리하나 누적 로딩 시 역효과</li>
                    <li>Performance API + Profiler 조합으로 병목 지점 정확히 파악 가능</li>
                    <li><strong>근본적 재설계 결정</strong> - 기술 부채 방지를 위한 선제적 투자</li>
                  </Box>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Validation 이슈 */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <BugReportIcon color="error" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  React Hook Form + Zod 검증 오류
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box>
                <Typography variant="subtitle2" color="error" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BugReportIcon fontSize="small" />
                  이슈: Zod Validation이 View에서 감지되지 않음
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  React Hook Form이 Zod validation 에러를 제대로 잡지 못해서 UI에 에러 메시지가 표시되지 않는 현상
                </Typography>

                <Card variant="outlined" sx={{ mb: 3, bgcolor: 'grey.50' }}>
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                      🔍 원인 분석
                    </Typography>
                    <Typography variant="body2" color="textSecondary" paragraph>
                      다양한 원인을 검토했으나 명확한 근본 원인을 찾지 못함
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      <strong>체크 항목:</strong>
                    </Typography>
                    <Box component="ul" sx={{ m: 0, pl: 3, '& li': { fontSize: '0.875rem', color: 'text.secondary', mb: 0.5 } }}>
                      <li>useForm에 <code>resolver: zodResolver(schema)</code> 제대로 연결되었는지 확인</li>
                      <li>RHF Controller의 <code>name</code> prop이 1:1로 적용되었는지 확인</li>
                      <li>RHF Controller name과 Zod schema의 필드명이 일치하는지 확인</li>
                      <li>버전 호환성 문제 가능성 (RHF, Zod, @hookform/resolvers)</li>
                    </Box>
                    <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 2, fontStyle: 'italic' }}>
                      💡 예상: 라이브러리 버전 불일치 가능성이 있으나 확실하지 않음
                    </Typography>
                  </CardContent>
                </Card>

                <Paper elevation={2} sx={{ p: 2, border: '2px solid', borderColor: 'success.main', bgcolor: 'success.50' }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: 'success.dark', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleIcon color="success" fontSize="small" />
                    대안: Custom Validation Hook 사용
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    Zod 대신 <strong>customValidate</strong>를 직접 구현하여 사용하기로 결정
                  </Typography>
                  <Box sx={{ bgcolor: 'white', p: 2, borderRadius: 1, mt: 1 }}>
                    <Typography variant="caption" color="textSecondary" sx={{ fontFamily: 'monospace' }}>
                      useCustomValidation 훅으로 필드별 검증 로직 직접 관리
                    </Typography>
                  </Box>
                </Paper>

                <Box sx={{ mt: 3, p: 2, bgcolor: 'primary.50', borderRadius: 1 }}>
                  <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, fontWeight: 600 }}>
                    <TipsAndUpdatesIcon color="primary" fontSize="small" />
                    교훈
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    라이브러리 간 통합 이슈는 원인 파악이 어려울 수 있음. 
                    이럴 때는 시간을 무한정 투자하기보다 <strong>실용적인 대안</strong>을 빠르게 찾는 것이 효율적
                  </Typography>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* 날짜 이슈 */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <BugReportIcon color="error" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  MUI DatePicker 무한 날짜(9999.12.31) 에러
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box>
                <Typography variant="subtitle2" color="error" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BugReportIcon fontSize="small" />
                  이슈: 9999.12.31을 Infinity 날짜로 사용 시 에러 발생
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  계약 종료일 등에서 {"\"무기한\"을 표현하기 위해 9999.12.31을 사용하면 MUI DatePicker에서 에러 발생"}
                </Typography>

                <Card variant="outlined" sx={{ mb: 3, bgcolor: 'grey.50' }}>
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                      🔍 원인
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      MUI DatePicker는 정상적인 날짜 범위를 벗어난 값을 비정상적인 값으로 판단하여 에러 처리함
                    </Typography>
                    <Typography variant="body2" color="error" sx={{ mt: 1, fontWeight: 600 }}>
                      → 9999.12.31은 유효하지 않은 날짜로 간주됨
                    </Typography>
                  </CardContent>
                </Card>

                <Paper elevation={2} sx={{ p: 2, border: '2px solid', borderColor: 'success.main', bgcolor: 'success.50' }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: 'success.dark', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleIcon color="success" fontSize="small" />
                    해결 방법
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    <strong>1. maxDate 속성 명시적 설정</strong>
                  </Typography>
                  <Box sx={{ bgcolor: 'white', p: 2, borderRadius: 1, mb: 2, fontFamily: 'monospace', fontSize: '0.875rem' }}>
                    <code>maxDate=&#123;new Date(&apos;9999-12-31&apos;)&#125;</code>
                  </Box>
                  
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    <strong>2. 타입 변환 패턴 적용</strong>
                  </Typography>
                  <Box sx={{ bgcolor: 'white', p: 2, borderRadius: 1, fontFamily: 'monospace', fontSize: '0.875rem' }}>
                    <Typography variant="caption" color="textSecondary" component="div" sx={{ mb: 1 }}>
                      • UI에서 가져오는 값: <strong>string 타입</strong>
                    </Typography>
                    <Typography variant="caption" color="textSecondary" component="div">
                      • UI에 넣는 값: <strong>Date 타입</strong>
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="success.dark" sx={{ mt: 2, fontWeight: 600 }}>
                    ✓ value와 onChange에서 타입 변환만 적용하면 복잡하지 않게 해결 가능
                  </Typography>
                </Paper>

                <Box sx={{ mt: 3, p: 2, bgcolor: 'primary.50', borderRadius: 1 }}>
                  <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, fontWeight: 600 }}>
                    <TipsAndUpdatesIcon color="primary" fontSize="small" />
                    교훈
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    UI 라이브러리의 내부 제약사항을 이해하고, 타입 변환 레이어를 적절히 활용하면 
                    간단한 문제도 명확하게 해결할 수 있음
                  </Typography>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Box>
    </Container>
  );
}
