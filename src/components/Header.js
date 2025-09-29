import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Header() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:4000/auth/logout", {}, { withCredentials: true });
      localStorage.removeItem("accessToken");
  
      // ✅ 로그아웃 후 로그인 시 계정 선택을 강제하도록 플래그 저장
      localStorage.setItem("forceKakaoLogin", "true");
  
      navigate("/", { replace: true });
    } catch (err) {
      console.error("로그아웃 실패:", err);
    }
  };
  

  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
        <a href="/scores">
          <img src={logo} alt="MAX Logo" className="h-6" />
        </a>

        <nav className="flex gap-4 text-sm text-gray-600">
          <a href="/scores" className="hover:text-brand-primary">성적관리</a>
          <button
            onClick={handleLogout}
            className="hover:text-brand-primary"
          >
            로그아웃
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
