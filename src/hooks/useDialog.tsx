import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Alert,
  Snackbar
} from '@mui/material';
import {
  CheckCircle,
  Warning,
  Error,
  Info
} from '@mui/icons-material';

interface DialogState {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'confirm' | 'alert';
  variant?: 'success' | 'warning' | 'error' | 'info';
  resolve?: (value: any) => void;
  onConfirm?: () => void | Promise<void>;
  confirmText?: string;
  cancelText?: string;
  customContent?: React.ReactNode;
  customActions?: React.ReactNode;
}

// MUI Dialog 기반 confirm/alert 훅
export const useDialog = () => {
  const [dialog, setDialog] = React.useState<DialogState>({
    isOpen: false,
    title: '',
    message: '',
    type: 'alert'
  });

  const confirm = React.useCallback((
    message: string, 
    options?: {
      title?: string;
      variant?: 'success' | 'warning' | 'error' | 'info';
      onConfirm?: () => void | Promise<void>;
      confirmText?: string;
      cancelText?: string;
      customContent?: React.ReactNode;
      customActions?: React.ReactNode;
    }
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      setDialog({
        isOpen: true,
        title: options?.title || '확인',
        message,
        type: 'confirm',
        variant: options?.variant || 'warning',
        resolve,
        onConfirm: options?.onConfirm,
        confirmText: options?.confirmText || '확인',
        cancelText: options?.cancelText || '취소',
        customContent: options?.customContent,
        customActions: options?.customActions
      });
    });
  }, []);

  const alert = React.useCallback((
    message: string, 
    options?: {
      title?: string;
      variant?: 'success' | 'warning' | 'error' | 'info';
      closeText?: string;
      customContent?: React.ReactNode;
      customActions?: React.ReactNode;
    }
  ): Promise<void> => {
    return new Promise((resolve) => {
      setDialog({
        isOpen: true,
        title: options?.title || '알림',
        message,
        type: 'alert',
        variant: options?.variant || 'info',
        resolve,
        confirmText: options?.closeText || '닫기',
        customContent: options?.customContent,
        customActions: options?.customActions
      });
    });
  }, []);

  const handleConfirm = React.useCallback(async () => {
    // 사용자 정의 액션 실행
    if (dialog.onConfirm) {
      try {
        await dialog.onConfirm();
      } catch (error) {
        console.error('확인 액션 실행 중 오류:', error);
      }
    }
    
    // Promise resolve
    if (dialog.resolve) {
      dialog.resolve(true);
    }
    
    // 다이얼로그 닫기
    setDialog(prev => ({ ...prev, isOpen: false }));
  }, [dialog]);

  const handleCancel = React.useCallback(() => {
    if (dialog.resolve) {
      dialog.resolve(dialog.type === 'confirm' ? false : undefined);
    }
    setDialog(prev => ({ ...prev, isOpen: false }));
  }, [dialog]);

  const getIcon = () => {
    switch (dialog.variant) {
      case 'success': 
        return <CheckCircle color="success" />;
      case 'warning': 
        return <Warning color="warning" />;
      case 'error': 
        return <Error color="error" />;
      case 'info': 
        return <Info color="info" />;
      default: 
        return <Info color="info" />;
    }
  };

  const DialogComponent = (
    <Dialog
      open={dialog.isOpen}
      onClose={dialog.type === 'confirm' ? handleCancel : handleConfirm}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {getIcon()}
        {dialog.title}
      </DialogTitle>
      
      <DialogContent>
        {/* 커스텀 콘텐츠가 있으면 사용, 없으면 기본 메시지 사용 */}
        {dialog.customContent || (
          <DialogContentText>
            {dialog.message}
          </DialogContentText>
        )}
      </DialogContent>
      
      <DialogActions>
        {/* 커스텀 액션이 있으면 사용, 없으면 기본 버튼 사용 */}
        {dialog.customActions || (
          <>
            {dialog.type === 'confirm' && (
              <Button
                onClick={handleCancel}
                color="inherit"
              >
                {dialog.cancelText || '취소'}
              </Button>
            )}
            
            <Button
              onClick={handleConfirm}
              color={dialog.variant === 'error' ? 'error' : 'primary'}
              variant="contained"
            >
              {dialog.confirmText || (dialog.type === 'confirm' ? '확인' : '닫기')}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );

  return { 
    confirm, 
    alert,
    DialogComponent,
    isOpen: dialog.isOpen,
    // 다이얼로그 상태와 핸들러들도 노출 (고급 사용자용)
    dialog,
    handleConfirm,
    handleCancel,
    setDialog
  };
};

// 간단한 Snackbar Alert 훅
export const useSnackbar = () => {
  const [snackbar, setSnackbar] = React.useState({
    isOpen: false,
    message: '',
    severity: 'info' as 'success' | 'warning' | 'error' | 'info'
  });

  const showAlert = React.useCallback((
    message: string,
    severity: 'success' | 'warning' | 'error' | 'info' = 'info'
  ) => {
    setSnackbar({
      isOpen: true,
      message,
      severity
    });
  }, []);

  const handleClose = React.useCallback(() => {
    setSnackbar(prev => ({ ...prev, isOpen: false }));
  }, []);

  const SnackbarComponent = (
    <Snackbar
      open={snackbar.isOpen}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert 
        onClose={handleClose} 
        severity={snackbar.severity}
        sx={{ width: '100%' }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );

  return {
    showAlert,
    SnackbarComponent,
    isOpen: snackbar.isOpen
  };
};

// 기본 window confirm/alert (백업용)
export const useBasicDialog = () => {
  const confirm = React.useCallback((message: string) => {
    return window.confirm(message);
  }, []);

  const alert = React.useCallback((message: string) => {
    window.alert(message);
  }, []);

  return { confirm, alert };
};