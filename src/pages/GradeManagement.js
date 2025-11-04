import { useState } from "react";
import Header from "../components/Header";
import SchoolTab from "../components/SchoolTab"; // 추가한 컴포넌트
import ExamScoreTab from "../components/ExamScoreTab";
import PracticeScoreTab from "../components/PracticeScoreTab";

function GradeManagement() {
  const [activeTab, setActiveTab] = useState("school");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 헤더 */}
      <Header />

      {/* 페이지 타이틀 */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900">성적 관리</h1>
      </div>

      {/* 탭 네비게이션 */}
      <div className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 flex gap-6">
          <button
            onClick={() => setActiveTab("school")}
            className={`py-3 text-sm font-medium ${
              activeTab === "school"
                ? "border-b-2 border-[#D1343A] text-[#D1343A]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            학교 관리
          </button>
          <button
            onClick={() => setActiveTab("exam")}
            className={`py-3 text-sm font-medium ${
              activeTab === "exam"
                ? "border-b-2 border-[#D1343A] text-[#D1343A]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            수능 성적 관리
          </button>
          <button
            onClick={() => setActiveTab("practice")}
            className={`py-3 text-sm font-medium ${
              activeTab === "practice"
                ? "border-b-2 border-[#D1343A] text-[#D1343A]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            실기 성적 관리
          </button>
        </div>
      </div>

      {/* 탭별 컨텐츠 */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {activeTab === "school" && <SchoolTab />}
        {activeTab === "exam" && <ExamScoreTab />}
        {activeTab === "practice" && (
          <div>
            <h2 className="text-lg font-bold mb-4">실기 성적 관리</h2>
            <p className="text-gray-600">실기 종목을 선택하고 점수를 입력하세요.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default GradeManagement;
