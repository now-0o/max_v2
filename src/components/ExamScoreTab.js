import React, { useState, useEffect } from "react";
import api from "../api/axiosInstance";
import CustomDropdown from "../components/CustomDropdown";

function ExamScoreTab() {
  const [subjects, setSubjects] = useState([]);
  const [options, setOptions] = useState({});
  const [scores, setScores] = useState({});
  const [mode, setMode] = useState("before");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ 과목 / 선택과목 목록
        const subRes = await api.get("/api/exam-scores/subjects");
        setSubjects(subRes.data);

        const optRes = await api.get("/api/exam-scores/subject-options");
        const grouped = optRes.data.reduce((acc, cur) => {
          if (!acc[cur.subjectId]) acc[cur.subjectId] = [];
          acc[cur.subjectId].push(cur);
          return acc;
        }, {});
        setOptions(grouped);

        // ✅ 기존 성적 불러오기
        if (userId) {
          const saved = await api.get(`/api/exam-scores/${userId}/before`);
          if (saved.data) {
            // 소수점 제거 후 세팅
            const cleaned = {};
            const rawScores = saved.data.scores || {};
            for (const subjectId of Object.keys(rawScores)) {
              cleaned[subjectId] = {};
              for (const slotKey of Object.keys(rawScores[subjectId])) {
                const data = rawScores[subjectId][slotKey];
                cleaned[subjectId][slotKey] = {
                  optionId: data.optionId || "",
                  rawScore: data.rawScore ? parseInt(data.rawScore, 10) : "",
                  standardScore: data.standardScore ? parseInt(data.standardScore, 10) : "",
                  percentile: data.percentile ? parseInt(data.percentile, 10) : "",
                  grade: data.grade ? parseInt(data.grade, 10) : "",
                };
              }
            }
            setScores(cleaned);
            setMode(saved.data.mode || "before");
          }
        }
      } catch (err) {
        console.error("데이터 불러오기 실패", err);
      }
    };
    fetchData();
  }, [userId]);

  const handleChange = (subjectId, field, value, optionId = null, slot = "default") => {
    setScores((prev) => {
      const nextSlot = slot || "default";
      const prevSubject = prev[subjectId] || {};
      const prevSlot = prevSubject[nextSlot] || {};

      const resolvedOptionId =
        optionId !== null && optionId !== undefined
          ? optionId
          : (typeof prevSlot.optionId !== "undefined" ? prevSlot.optionId : "");

      return {
        ...prev,
        [subjectId]: {
          ...prevSubject,
          [nextSlot]: {
            ...prevSlot,
            [field]: value,
            optionId: resolvedOptionId,
          },
        },
      };
    });
  };

  const validateScore = (subjectName, field, value) => {
    if (value === "") return true;
    const num = Number(value);
    if (isNaN(num)) return false;

    if (field === "rawScore") {
      if (subjectName === "탐구") return num >= 0 && num <= 50;
      return num >= 0 && num <= 100;
    }
    if (field === "standardScore") {
      if (subjectName === "탐구") return num >= 0 && num <= 100;
      return num >= 0 && num <= 200;
    }
    if (field === "percentile") return num >= 0 && num <= 100;
    if (field === "grade") return num >= 1 && num <= 9;

    return true;
  };

  const handleNumericChange = (subjectId, subjectName, field, value, optionId = null, slot = "default") => {
    if (!/^\d*$/.test(value)) return;
    if (!validateScore(subjectName, field, value)) return;
    handleChange(subjectId, field, value, optionId, slot);
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);

    if (newMode === "before") {
      setScores((prev) => {
        const cleared = {};
        for (const subjectId of Object.keys(prev)) {
          cleared[subjectId] = {};
          for (const slotKey of Object.keys(prev[subjectId])) {
            const data = prev[subjectId][slotKey];
            cleared[subjectId][slotKey] = {
              optionId: data.optionId || "",
              rawScore: data.rawScore || "",
              standardScore: "",
              percentile: "",
              grade: "",
            };
          }
        }
        return cleared;
      });
    }
  };

  const handleSubmit = async () => {
    try {
      await api.post("/api/exam-scores", { userId, scores, mode });
      alert("성적이 저장되었습니다!");
    } catch (err) {
      console.error("저장 실패", err);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  const isFormValid = () => {
    if (mode === "before") {
      // ✅ 시험 결과 이전 → 입력한 과목만 체크
      return subjects.every((sub) => {
        const slots = scores[sub.id] || {};
        return Object.keys(slots).every((slotKey) => {
          const slotData = slots[slotKey] || {};
          if (options[sub.id] && options[sub.id].length > 0) {
            // 선택과목 있는 경우 → optionId + rawScore 필요
            return slotData.optionId && slotData.rawScore;
          }
          // 선택과목 없는 경우 → rawScore 필요
          return slotData.rawScore;
        });
      });
    } else {
      // ✅ 시험 결과 이후 → 전체 입력
      return subjects.every((sub) => {
        const slots = scores[sub.id] || {};
        const isAbsolute = sub.name === "영어" || sub.name === "한국사"; // 절대평가 과목

        return Object.keys(slots).every((slotKey) => {
          const slotData = slots[slotKey] || {};

          if (isAbsolute) {
            // 영어/한국사 → 원점수만
            return slotData.rawScore;
          }

          if (options[sub.id] && options[sub.id].length > 0) {
            return (
              slotData.optionId &&
              slotData.rawScore &&
              slotData.standardScore &&
              slotData.percentile &&
              slotData.grade
            );
          }
          return (
            slotData.rawScore &&
            slotData.standardScore &&
            slotData.percentile &&
            slotData.grade
          );
        });
      });
    }
  };


  return (
    <div>
      <div className="flex mb-6 rounded-lg overflow-hidden border border-gray-300 w-fit">
        <button
          className={`px-4 py-2 text-sm font-medium ${mode === "before" ? "bg-[#D1343A] text-white" : "bg-gray-100 text-gray-600"}`}
          onClick={() => handleModeChange("before")}
        >
          시험 결과 이전
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${mode === "after" ? "bg-[#D1343A] text-white" : "bg-gray-100 text-gray-600"}`}
          onClick={() => handleModeChange("after")}
        >
          시험 결과 이후
        </button>
      </div>

      <h2 className="text-lg font-bold mb-4">수능 성적 관리</h2>
      <p className="text-gray-600 mb-6">
        {mode === "before" ? "채점 결과가 나오기 이전 원점수를 환산하여 계산합니다." : "채점 결과가 나온 이후 실 점수로 계산합니다"}
      </p>

      {subjects.map((sub) => {
        if (sub.name === "탐구") {
          return ["탐구1", "탐구2"].map((label, idx) => (
            <div key={`${sub.id}-${idx}`} className="mb-6 border-b pb-4">
              <h3 className="text-base font-semibold mb-2">{label}</h3>

              {options[sub.id] && (
                <CustomDropdown
                  options={options[sub.id].map((opt) => ({
                    value: opt.id,
                    label: opt.name,
                  }))}
                  value={scores[sub.id]?.[label]?.optionId || ""}
                  onChange={(value) => handleChange(sub.id, "optionId", value, value, label)}
                  placeholder="선택과목 선택"
                />
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                <input
                  type="text"
                  placeholder="원점수"
                  className="border p-2 rounded focus:outline-none focus:ring-0"
                  value={scores[sub.id]?.[label]?.rawScore || ""}
                  onChange={(e) =>
                    handleNumericChange(sub.id, sub.name, "rawScore", e.target.value, null, label)
                  }
                />
                <input
                  type="text"
                  placeholder="표준점수"
                  className="border p-2 rounded focus:outline-none focus:ring-0"
                  readOnly={mode === "before"}
                  value={scores[sub.id]?.[label]?.standardScore || ""}
                  onChange={(e) =>
                    handleNumericChange(sub.id, sub.name, "standardScore", e.target.value, null, label)
                  }
                />
                <input
                  type="text"
                  placeholder="백분위"
                  className="border p-2 rounded focus:outline-none focus:ring-0"
                  readOnly={mode === "before"}
                  value={scores[sub.id]?.[label]?.percentile || ""}
                  onChange={(e) =>
                    handleNumericChange(sub.id, sub.name, "percentile", e.target.value, null, label)
                  }
                />
                <input
                  type="text"
                  placeholder="등급"
                  className="border p-2 rounded focus:outline-none focus:ring-0"
                  readOnly={mode === "before"}
                  value={scores[sub.id]?.[label]?.grade || ""}
                  onChange={(e) =>
                    handleNumericChange(sub.id, sub.name, "grade", e.target.value, null, label)
                  }
                />
              </div>
            </div>
          ));
        }

        const isAbsolute = sub.name === "영어" || sub.name === "한국사"; // 절대평가 과목

        return (
          <div key={sub.id} className="mb-6 border-b pb-4">
            <h3 className="text-base font-semibold mb-2">{sub.name}</h3>

            {options[sub.id] && options[sub.id].length > 0 && (
              <CustomDropdown
                options={options[sub.id].map((opt) => ({
                  value: opt.id,
                  label: opt.name,
                }))}
                value={scores[sub.id]?.default?.optionId || ""}
                onChange={(value) => handleChange(sub.id, "optionId", value, value, "default")}
                placeholder="선택과목 선택"
              />
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
              <input
                type="text"
                placeholder="원점수"
                className="border p-2 rounded focus:outline-none focus:ring-0"
                value={scores[sub.id]?.default?.rawScore || ""}
                onChange={(e) =>
                  handleNumericChange(sub.id, sub.name, "rawScore", e.target.value, null, "default")
                }
              />
              {!isAbsolute && (
                <>
                  <input
                    type="text"
                    placeholder="표준점수"
                    className="border p-2 rounded focus:outline-none focus:ring-0"
                    readOnly={mode === "before"}
                    value={scores[sub.id]?.default?.standardScore || ""}
                    onChange={(e) =>
                      handleNumericChange(sub.id, sub.name, "standardScore", e.target.value, null, "default")
                    }
                  />
                  <input
                    type="text"
                    placeholder="백분위"
                    className="border p-2 rounded focus:outline-none focus:ring-0"
                    readOnly={mode === "before"}
                    value={scores[sub.id]?.default?.percentile || ""}
                    onChange={(e) =>
                      handleNumericChange(sub.id, sub.name, "percentile", e.target.value, null, "default")
                    }
                  />
                  <input
                    type="text"
                    placeholder="등급"
                    className="border p-2 rounded focus:outline-none focus:ring-0"
                    readOnly={mode === "before"}
                    value={scores[sub.id]?.default?.grade || ""}
                    onChange={(e) =>
                      handleNumericChange(sub.id, sub.name, "grade", e.target.value, null, "default")
                    }
                  />
                </>
              )}
            </div>
          </div>
        );
      })}

      <button
        className={`p-2 rounded mt-4 w-full ${
          isFormValid() ? "bg-[#D1343A] text-white" : "bg-gray-300 text-gray-500"
        }`}
        onClick={handleSubmit}
        disabled={!isFormValid()}
      >
        성적 저장하기
      </button>
    </div>
  );
}

export default ExamScoreTab;
