import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance"; // ✅ axios 인스턴스 import

function KakaoRedirect() {
  const navigate = useNavigate();
  const handled = useRef(false); // 실행 여부 체크

  useEffect(() => {
    if (handled.current) return; // 두 번째 실행 막기
    handled.current = true;

    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");

    if (code) {
      api.post("/auth/kakao", { code }, { withCredentials: true }) // ✅ baseURL 반영
        .then((res) => {
          localStorage.setItem("accessToken", res.data.accessToken);
          localStorage.setItem("username", res.data.user.name);
          localStorage.setItem("userId", res.data.user.id);
          navigate("/scores", { replace: true });
        })
        .catch((err) => {
          console.error("로그인 실패:", err.response?.data || err.message);
          navigate("/", { replace: true });
        });
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen text-gray-700">
      로그인 처리 중...
    </div>
  );
}

export default KakaoRedirect;
