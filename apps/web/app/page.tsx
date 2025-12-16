"use client";
import React from "react";
import UploadZone from "../components/UploadZone";

export default function HomePage() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100 px-4">
      <div className="max-w-lg text-center mt-10 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-white drop-shadow">AI 호기심 분석기</h1>
        <p className="text-base font-medium text-gray-300 mb-6">지난 1년간 ChatGPT와 나눈 대화로<br/>당신의 숨겨진 탐구 DNA, 지적 취향, 관심사를<br/><span className="font-semibold text-blue-400">세련된 리포트 카드</span>로 만들어 드립니다.</p>
        <div className="rounded-lg bg-gray-800 py-3 px-5 text-sm text-gray-400 mb-6">
          <b className="text-emerald-300">보안 약속</b>: 데이터는 오직 <u>내 브라우저에서만</u> 분석되고 서버로 저장되지 않습니다.
        </div>
      </div>
      <UploadZone onResult={() => { /* 라우팅은 UploadZone 내에서 구현됨 */ }} />
      <div className="mt-7 flex flex-col items-center">
        <span className="text-xs text-gray-500">ChatGPT &gt; Settings &gt; Data Export로 패키지(.zip) 추출</span>
        {/* 가이드 추가 스텝이나 GIF/이미지는 추후 확장 */}
      </div>
    </main>
  );
}

