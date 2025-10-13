import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://developark.duckdns.org/api_wonderland',
  withCredentials: true, // ✅ 모든 요청에 쿠키 포함
});

export default axiosInstance;
