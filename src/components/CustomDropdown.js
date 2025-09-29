import React, { useState, useRef, useEffect } from "react";

function CustomDropdown({ options = [], value, onChange, placeholder = "선택" }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 외부 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find(o => o.value === value);

  return React.createElement("div", { className: "relative w-full", ref: dropdownRef },
    // 버튼
    React.createElement("button", {
      type: "button",
      onClick: () => setOpen(prev => !prev),
      className: `
        w-full text-left px-3 py-2
        border border-gray-300 rounded-lg
        bg-white text-gray-700 font-medium
        hover:border-[#D1343A] focus:outline-none focus:ring-1 focus:ring-[#D1343A]
        transition
      `
    }, selected ? selected.label : placeholder),

    // 옵션 리스트
    open && React.createElement("ul", {
      className: `
        absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg
        shadow-md max-h-52 overflow-auto
      `
    },
      options.map(o =>
        React.createElement("li", {
          key: o.value,
          className: `
            px-3 py-2 cursor-pointer select-none
            ${o.value === value ? "bg-[#FFECEC] text-[#D1343A] font-semibold" : "text-gray-700"}
            hover:bg-[#FFF2F2] hover:text-[#D1343A] transition
          `,
          onClick: () => { onChange(o.value); setOpen(false); }
        }, o.label)
      )
    )
  );
}

export default CustomDropdown;
