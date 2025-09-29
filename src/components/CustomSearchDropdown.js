import React, { useState } from "react";
import { Search } from "lucide-react"; // 🔍 아이콘

function CustomSearchDropdown({ options, value, onChange, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const toggle = () => setIsOpen(!isOpen);

  const filtered = options.filter((opt) =>
    `${opt.schoolName} ${opt.departmentName} ${opt.region} ${opt.type} ${opt.division} ${opt.teacherCertification}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleSelect = (opt) => {
    onChange(opt.id);
    setIsOpen(false);
    setSearch("");
  };

  const selectedLabel = options.find((opt) => opt.id === value);

  return (
    <div className="relative w-full">
      {/* 선택된 값 */}
      <button
        onClick={toggle}
        className={`w-full px-4 py-3 border rounded-lg bg-white shadow-sm text-left flex justify-between items-center ${
          isOpen ? "border-[#D1343A]" : "border-gray-300"
        }`}
      >
        <span className="text-sm text-gray-700">
          {selectedLabel
            ? `${selectedLabel.schoolName} - ${selectedLabel.departmentName}`
            : placeholder}
        </span>
        <span className={`ml-2 text-xs ${isOpen ? "rotate-180" : ""}`}>▾</span>
      </button>

      {/* 드롭다운 */}
      {isOpen && (
        <div className="absolute mt-2 w-full bg-white border rounded-xl shadow-xl max-h-80 overflow-y-auto z-10">
          {/* 검색창 (sticky 고정) */}
          <div className="sticky top-0 flex items-center px-3 py-2 border-b bg-gray-50 z-20">
            <Search size={16} className="text-gray-400 mr-2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="학교, 학과 검색..."
              className="w-full text-sm bg-transparent focus:outline-none"
            />
          </div>

          {/* 옵션 리스트 */}
          {filtered.length > 0 ? (
            filtered.map((opt) => (
              <div
                key={opt.id}
                onClick={() => handleSelect(opt)}
                className="px-4 py-3 text-sm cursor-pointer hover:bg-gray-100 flex justify-between items-center"
              >
                {/* 왼쪽: 학교 + 학과 */}
                <div>
                  <div className="font-semibold text-gray-800">{opt.schoolName}</div>
                  <div className="text-gray-600 text-xs font-light">{opt.departmentName}</div>
                </div>

                {/* 오른쪽: 지역, 형태, 학군, 교직 */}
                <div className="text-gray-500 text-right" style={{ fontSize: "0.65rem" }}>
                  {opt.region} · {opt.type} · 학군 {opt.division} <br/>
                  교직{" "} {opt.teacherCertification}
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-gray-400">검색 결과 없음</div>
          )}
        </div>
      )}
    </div>
  );
}

export default CustomSearchDropdown;
