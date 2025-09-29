import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

function Login() {
  const navigate = useNavigate();

  // ✅ 이미 로그인 상태라면 로그인 페이지 접근 → 바로 /scores로 리다이렉트
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      navigate("/scores", { replace: true });
    }
  }, [navigate]);

  const handleKakaoLoginClick = () => {
    const forceLogin = localStorage.getItem("forceKakaoLogin") === "true";
    if (forceLogin) {
      localStorage.removeItem("forceKakaoLogin"); // 한 번 쓰고 제거
      handleKakaoLogin(true); // ✅ 계정선택 강제
    } else {
      handleKakaoLogin(false); // ✅ 자동 로그인
    }
  };  

  const handleKakaoLogin = (forceLogin = false) => {
    window.Kakao.Auth.authorize({
      redirectUri: "http://1.234.53.169:3000/oauth/kakao",
      ...(forceLogin && { prompt: "login" }) // ✅ forceLogin true면 계정선택 강제
    });
  };  

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-sm flex flex-col items-center px-6">
        <img src={logo} alt="MAX Logo" className="w-[100px] mb-6" />

        <h1 className="text-xl font-bold text-brand-primary mb-1">
          MAX 입시분석시스템
        </h1>
        <p className="text-xs text-brand-neutral mb-16 font-thin">
          체대입시 정보는 더 쉽게, 합격 예측은 더 명확하게
        </p>

        <button
          onClick={handleKakaoLoginClick}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-[#FEE500] text-gray-900 font-medium text-sm shadow-sm hover:brightness-95 active:scale-95 transition"
        >
          카카오톡으로 계속하기
        </button>
      </div>
    </div>
  );
}

export default Login;
