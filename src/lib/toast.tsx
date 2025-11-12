import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// 성공 토스트
export const showSuccessToast = (message: string = "요청이 정상적으로 완료되었습니다") => {
  toast.success(message, {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    style: {
      backgroundColor: '#e8f5e8',
      border: '1px solid #c8e6c9',
      borderRadius: '8px',
      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
      color: '#2e7d32',
      padding: '16px 20px',
      minHeight: 'auto',
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontSize: '14px',
      fontWeight: 500,
    }
  });
};

// 에러 토스트
export const showErrorToast = (message: string = "처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.") => {
  toast.error(message, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    style: {
      backgroundColor: '#ffeaea',
      border: '1px solid #ffcdd2',
      borderRadius: '8px',
      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
      color: '#d32f2f',
      padding: '16px 20px',
      minHeight: 'auto',
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontSize: '14px',
      fontWeight: 500,
    }
  });
};

// 토스트 컨테이너 컴포넌트 (재사용 가능)
export const CustomToastContainer = () => (
  <ToastContainer
    position="top-center"
    autoClose={3000}
    hideProgressBar
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="light"
    toastStyle={{
      top: '80px',
    }}
    style={{
      width: 'auto',
      maxWidth: '600px',
      margin: '0 auto',
    }}
    closeButton={({ closeToast }) => (
      <button
        onClick={closeToast}
        style={{
          background: 'none',
          border: 'none',
          color: '#757575',
          fontSize: '18px',
          cursor: 'pointer',
          padding: '0 8px',
          lineHeight: 1,
          alignSelf: 'flex-start',
          marginTop: '2px',
          fontWeight: 'bold',
          opacity: 0.7,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '1';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '0.7';
        }}
      >
        ×
      </button>
    )}
  />
);