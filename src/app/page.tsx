'use client';

import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Card, 
  CardContent 
} from '@mui/material';
import { useRouter } from 'next/navigation';
import ToastTest from '@/components/ToastTest';

export default function Home() {
  const router = useRouter();

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to Next.js with Material-UI
        </Typography>
        
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              MUI Components Example
            </Typography>
            <Typography variant="body1">
              이제 Material-UI가 성공적으로 설정되었습니다. 
              다양한 MUI 컴포넌트를 사용할 수 있습니다.

            </Typography>
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" color="primary" sx={{ mr: 2 }} onClick={()=> router.push('/backoffice')}>
                Back Office
              </Button>
              <Button variant="outlined" color="secondary" sx={{ mr: 2 }} onClick={()=> router.push('/eapp-support')}>
                eApp Support
              </Button>
              <Button variant="contained" color="success" onClick={()=> router.push('/search')}>
                검색 팝업 데모
              </Button>
            </Box>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Toast 알림 테스트
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              BusinessError 발생 시 자동으로 토스트가 표시됩니다.
            </Typography>
            <ToastTest />
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
