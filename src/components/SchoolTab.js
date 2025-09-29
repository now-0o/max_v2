import React, { useState, useEffect } from "react";
import api from "../api/axiosInstance";
import CustomSearchDropdown from "../components/CustomSearchDropdown";

function SchoolTab() {
  const [departmentId, setDepartmentId] = useState("");
  const [departments, setDepartments] = useState([]);
  const [selections, setSelections] = useState([]);
  const userId = localStorage.getItem("userId"); // 카카오 로그인 성공 시 저장되어 있어야 함

  // 학과 전체 목록
  useEffect(() => {
    api.get("/api/schools/departments")
      .then((res) => setDepartments(res.data))
      .catch((err) => console.error("학과 목록 불러오기 실패", err));
  }, []);

  // 내 선택 목록
  useEffect(() => {
    if (!userId) return;
    api.get(`/api/schools/choices/${userId}`)
      .then((res) => setSelections(res.data))
      .catch((err) => console.error("선택 목록 불러오기 실패", err));
  }, [userId]);

  // 선택 추가 (최대 3개 클라이언트 가드)
  const addSelection = () => {
    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (!departmentId) return;
    if (selections.length >= 3) {
      alert("최대 3개까지만 선택할 수 있습니다.");
      return;
    }

    api.post("/api/schools/choices", { userId, departmentId })
      .then((res) => {
        setSelections((prev) => [...prev, res.data]); // 서버에서 포맷팅된 데이터 반환
        setDepartmentId("");
      })
      .catch((err) =>
        alert(err.response?.data?.error || "선택 추가 실패")
      );
  };

  // 선택 삭제
  const removeSelection = (choiceId) => {
    api.delete(`/api/schools/choices/${choiceId}`)
      .then(() => setSelections((prev) => prev.filter((s) => s.id !== choiceId)))
      .catch(() => alert("선택 삭제 실패"));
  };

  return (
    <div className="py-2">
      {/* 안내 문구 */}
      <div className="mb-4 text-sm text-gray-500 leading-relaxed">
        <p>
          실제 지원하실 학교를{" "}
          <span className="font-medium text-[#D1343A]">3개</span>까지 선택할 수 있어요
        </p>
        <p>입시분석 시 선택하신 학교로 결과를 받아보실 수 있어요</p>
      </div>

      {/* 선택 영역 */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <CustomSearchDropdown
            options={departments}
            value={departmentId}
            onChange={setDepartmentId}
            placeholder="학교/학과 선택"
          />
        </div>
        <button
          onClick={addSelection}
          className="w-full sm:w-auto px-4 py-2 bg-[#4D5562] text-white rounded-lg text-sm hover:bg-[#394150] transition"
        >
          추가
        </button>
      </div>

      {/* 제목 */}
      <h3 className="text-sm sm:text-base font-semibold text-gray-700 mb-2">
        {localStorage.getItem("username")} 님이 선택하신 학교 및 학과
      </h3>

      {/* 선택 리스트 / 노데이터 */}
      {selections.length > 0 ? (
        <ul className="divide-y divide-gray-200 bg-white rounded-lg border border-gray-200">
          {selections.map((item) => (
            <li
              key={item.id}
              className="flex justify-between items-center px-4 py-3 text-sm text-gray-700"
            >
              <span>
                <strong>{item.schoolName}</strong> - {item.departmentName} (
                {item.region}, {item.type}, {item.division},{" "}
                {item.teacherCertification})
              </span>
              <button
                onClick={() => removeSelection(item.id)}
                className="text-red-500 hover:text-red-700 text-xs"
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center text-gray-400 text-sm py-6 border border-dashed border-gray-300 rounded-lg bg-gray-50">
          아직 선택한 학교 및 학과가 없습니다.
        </div>
      )}
    </div>
  );
}

export default SchoolTab;
