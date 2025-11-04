import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import KakaoRedirect from "./pages/KakaoRedirect";
import GradeManagement from "./pages/GradeManagement";   // 성적관리 페이지
import AnalysisResult from "./pages/AnalysisResult";   // 성적관리 페이지
import PrivateRoute from "./routes/PrivateRoute"; // 방금 만든 가드

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/oauth/kakao" element={<KakaoRedirect />} />
        <Route
          path="/scores"
          element={
            <PrivateRoute>
              <GradeManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/analysis"
          element={
            <PrivateRoute>
              <AnalysisResult />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
