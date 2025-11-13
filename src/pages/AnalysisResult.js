import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import api from "../api/axiosInstance";

function AnalysisResult() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("before");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    const fetchData = async () => {
      try {
        const analysisRes = await api.post("/api/analyze", {
          userId: userId,
          mode: 'after'
        });
        if (!cancelled) {
          console.log(analysisRes);
          if (!analysisRes.data.success) {
            alert(analysisRes.data.message);
            setLoading(false);
            return;
          }

          // success가 true일 때만 데이터 처리
          setResults(analysisRes.data.results);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("분석 결과 불러오기 실패", err);
          setLoading(false);
        }
      }
    };
    fetchData();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const getStatusBadge = (status) => {
    if (status === true) {
      return "bg-green-100 text-green-700";
    } else if (status === false) {
      return "bg-red-100 text-red-700";
    }
    return "bg-gray-100 text-gray-700";
  };

  const getScoreDiff = (convertedScore, cutlineScore) => {
    const diff = convertedScore - cutlineScore;
    if (diff >= 0) {
      return {
        text: (
            <>
              현재 점수로 <span className="text-lime-500 font-bold">합격 가능</span>해요!
            </>
          ),
          bgColor: "bg-green-50",
      };
    } else {
      return {
        text: (
            <>
              컷오프 점수보다 <span className="text-red-600 font-bold">{Math.abs(diff).toFixed(2)}점</span> 낮아요
            </>
            ),
        bgColor: "bg-red-50",
      };
    }
  };

  const passCount = results.filter((r) => r.isPassed === true).length;
  const failCount = results.filter((r) => r.isPassed === false).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">분석 결과를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 헤더 */}
      <Header />

      {/* 페이지 타이틀 */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900">입시 분석 결과</h1>
        <p className="text-gray-600 mt-2">
          내 성적을 기반으로 한 대학별 합격 가능성입니다.
        </p>
      </div>

      {/* 통계 요약 */}
      <div className="max-w-4xl mx-auto px-4 pb-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border">
            <p className="text-sm text-gray-600">전체</p>
            <p className="text-2xl font-bold text-gray-900">{results.length}개</p>
          </div>
          <div className="bg-white rounded-lg p-4 border">
            <p className="text-sm text-gray-600">합격 가능</p>
            <p className="text-2xl font-bold text-green-600">{passCount}개</p>
          </div>
          <div className="bg-white rounded-lg p-4 border">
            <p className="text-sm text-gray-600">불합격</p>
            <p className="text-2xl font-bold text-red-600">{failCount}개</p>
          </div>
        </div>
      </div>

      {/* 결과 리스트 */}
      <main className="max-w-4xl mx-auto px-4 pb-8">
          <div className="space-y-4">
            {results.map((result) => {
              const scoreDiff = getScoreDiff(result.convertedScore, result.cutlineScore);
              return (
                <div
                  key={result.id}
                  className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  {/* 상단: 대학명 + 지역/합격여부 */}
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-base font-bold">{result.schoolName}</h3>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(
                        result.isPassed
                      )}`}
                    >
                      {result.isPassed === true ? "합격" : "불합격"}
                    </span>
                  </div>

                  {/* 학과명 */}
                  <p className="text-sm text-gray-700 mb-1">{result.departmentName}</p>

                  {/* 모집 구분 */}
                  {/* <p className="text-xs text-gray-500 mb-1">{result.division}</p> */}

                  {/* 반영과목 */}
                  {/* <p className="text-xs text-gray-500 mb-3">{result.subjects}</p> */}

                  {/* 점수 정보 */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm">
                      <span className="text-gray-600">내 점수: </span>
                      <span className="font-semibold">
                        {result.convertedScore}
                      </span>
                      <span className="text-gray-400 mx-2">/</span>
                      <span className="text-gray-600">컷오프: </span>
                      <span className="font-semibold">
                        {result.cutlineScore}
                      </span>
                    </div>
                  </div>

                  {/* 프로그레스바 */}
                  <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full ${
                        result.convertedScore >= result.cutlineScore
                          ? "bg-gradient-to-r from-lime-100 to-lime-500"
                          : "bg-gradient-to-r from-red-100 to-red-500"
                      }`}
                      style={{
                        width: `${Math.min((result.convertedScore / result.cutlineScore) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>

                  {/* 점수차 표시 */}
                  <div
                    className={`${scoreDiff.bgColor} font-medium px-3 py-2 rounded text-center mb-2`} style={{ fontSize: '14px' }}
                  >
                    {scoreDiff.text}
                  </div>
                </div>
              );
            })}
          </div>
      </main>
    </div>
  );
}

export default AnalysisResult;