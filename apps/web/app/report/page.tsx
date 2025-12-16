"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { useRouter } from 'next/navigation';
import { useResultStore } from '../../store/resultStore';

type StatResult = {
  mbtiCode: string;
  scores: Record<string, number>;
  topInterests: string[];
};
type AiReport = {
  title: string;
  comment: string;
};

export default function ReportPage() {
  const router = useRouter();
  const getResult = useResultStore((s) => s.getResult);
  const clearResult = useResultStore((s) => s.clearResult);
  const [statResult, setStatResult] = useState<StatResult | null>(null);
  const [aiReport, setAiReport] = useState<AiReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // 업로드에서 넘어온 분석 결과 가져오기(전역+세션)
  useEffect(() => {
    const res = getResult();
    if (!res) {
      setError('분석 데이터가 없습니다. 처음부터 다시 진행해 주세요.');
      setLoading(false);
      return;
    }
    setStatResult(res);
    setLoading(false);
  }, [getResult]);

  // AI 리포트 생성 API 호출
  useEffect(() => {
    if (!statResult) return;
    setLoading(true);
    fetch('/app/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(statResult),
    })
      .then(res => res.json())
      .then((r: AiReport) => setAiReport(r))
      .catch(() => setError('AI 응답 오류'))
      .finally(() => setLoading(false));
  }, [statResult]);

  // 리셋/다시분석: 상태 전부 초기화 후 홈으로 이동
  const handleReset = () => {
    clearResult();
    router.push('/');
  };


  // 카드 이미지 저장
  const downloadImage = useCallback(async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current);
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ai-report.png';
      a.click();
    } catch {
      alert('이미지 저장 실패');
    }
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center text-lg">리포트 준비 중...</div>;
  if (error) return <div className="h-screen flex flex-col gap-3 items-center justify-center text-red-600">{error}<button className="text-blue-700" onClick={handleReset}>처음으로</button></div>;
  if (!statResult || !aiReport) return null;

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-emerald-100 to-blue-200">
      <div ref={cardRef} className="relative w-[320px] h-[570px] rounded-3xl shadow-xl bg-white flex flex-col justify-between p-7 text-center mx-auto my-6 select-none">
        <div>
          <div className="font-bold text-xl mt-4 mb-1">{aiReport.title}</div>
          <div className="text-gray-600 text-xs mb-4">나의 AI 관심 DNA 카드</div>
          <div className="mb-3 mt-6">
            <span className="inline-block px-3 py-1 rounded-full bg-indigo-200 text-indigo-700 font-semibold text-lg tracking-widest mb-2">{statResult.mbtiCode}</span>
            <div className="text-xs text-gray-400 font-mono">(MBTI 스타일 분석코드)</div>
          </div>
          <div className="my-4 text-base leading-normal font-medium text-gray-800 min-h-[48px]">{aiReport.comment}</div>
          <div className="flex justify-center gap-2 my-2 flex-wrap">
            {statResult.topInterests.map((k, i) => (
              <span key={i} className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">#{k}</span>
            ))}
          </div>
        </div>
        <div className="mt-6 flex flex-row w-full justify-between px-5 text-xs text-gray-500 opacity-70">
          <div>
            따뜻{': ' + statResult.scores.warmth + '점'}<br />
            논리{': ' + statResult.scores.techInterest + '점'}
          </div>
          <div>
            깊이{': ' + statResult.scores.depth + '점'}<br />
            MZ감성{': ' + statResult.scores.mzVibe + '점'}
          </div>
        </div>
      </div>
      <button className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-xl shadow" onClick={downloadImage}>이미지 저장하기</button>
      <div className="py-3" />
    </div>
  );
}

