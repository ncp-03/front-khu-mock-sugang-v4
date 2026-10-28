import axios from 'axios';

// 백엔드 API 기본 설정 (Spring Boot 서버 포트 8080)
const api = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL || 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: localStorage에 저장된 studentId를 X-Student-Id 헤더로 자동 첨부
api.interceptors.request.use(
  (config) => {
    const studentId = localStorage.getItem('selectedStudentId');
    if (studentId) {
      config.headers['X-Student-Id'] = studentId;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 공통 에러 처리
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.data) {
      const { code, message } = error.response.data;
      if (code === 'MISSING_STUDENT_ID') {
        alert('로그인(학생 선택)이 필요합니다.');
        localStorage.removeItem('selectedStudentId');
        window.location.reload();
      } else {
        alert(message || '서버 통신 중 오류가 발생했습니다.');
      }
    } else {
      alert('서버에 연결할 수 없습니다. 백엔드 서버 가동 상태를 확인해주세요.');
    }
    return Promise.reject(error);
  }
);

export default api;
