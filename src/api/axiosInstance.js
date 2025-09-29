import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000", // ✅ 나중에 서버 주소 바뀌면 여기만 수정
  withCredentials: true, // 쿠키/세션 필요할 경우
});

export default api;
