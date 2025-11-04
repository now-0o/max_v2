import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";

function Header() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      localStorage.removeItem("accessToken");
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
          <a href="/analysis" className="hover:text-brand-primary">입시분석</a>
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
