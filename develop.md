[Spec] AI-Curiosity Service Implementation Guide
Project Name: AI-Curiosity (Interest Profiler) Stack: Monorepo (Turborepo), Next.js 14+, TypeScript, OpenAI API, Client-side Processing Date: 2025.12.16

📂 1. Shared Packages (/packages)
가장 먼저 구현해야 할 핵심 비즈니스 로직과 타입 정의입니다. 프론트엔드와 백엔드가 공통으로 의존합니다.

1.1 packages/types/schema.ts
역할: 데이터 무결성을 위한 Zod 스키마 및 TypeScript 타입 정의.

필수 구현 내용:

StatResultSchema: 프론트엔드(JS)가 분석하여 산출한 통계 데이터 구조.

ReportPayloadSchema: API로 전송할 최종 요청 본문 구조.

코드 로직 (Zod):

TypeScript

import { z } from 'zod';

export const ReportPayloadSchema = z.object({
  mbtiCode: z.string().length(4), // 예: "WDHT"
  scores: z.object({
    warmth: z.number().min(0).max(100),
    depth: z.number(),
    techInterest: z.number(),
    mzVibe: z.number(),
  }),
  topInterests: z.array(z.string()).max(5), // 상위 관심사 키워드
  usageStats: z.object({
    totalConversations: z.number(),
    activeHour: z.number(), // 0~23
  })
});

export type ReportPayload = z.infer<typeof ReportPayloadSchema>;
1.2 packages/logic/regex.ts
역할: 텍스트 분석을 위한 정규표현식 사전 (Dictionary).

구현 포인트: 기획 단계에서 확정한 '관심사 중심' 키워드를 상수로 관리.

필수 변수:

ATTITUDE_PATTERNS (Warm/Cold)

INTEREST_PATTERNS (Tech/Art/Life/Knowledge - 세부 카테고리 포함)

VIBE_PATTERNS (MZ/Old)

주의사항: RegExp 객체 생성 시 gi (global, case-insensitive) 플래그 필수.

1.3 packages/logic/parsers.ts
역할: JSON 데이터를 순회하며 정규식 매칭 카운트를 수행하는 순수 함수.

핵심 로직:

analyzeMessages(jsonString: string) 함수 구현.

JSON.parse() 수행 (Web Worker에서 실행될 것임).

mapping 객체 순회 -> message.author.role === 'user' 필터링.

content.parts[0] 텍스트 추출 -> regex.ts의 패턴과 매칭하여 점수(score) 누적.

최종적으로 mbtiCode 결정 로직 (예: Warmth > 50 ? 'W' : 'C').

🖥️ 2. Web Frontend (/apps/web)
UI 렌더링과 데이터 전처리를 담당합니다. Web Worker 구현이 핵심입니다.

2.1 apps/web/worker/parser.worker.ts
역할: 메인 스레드 차단 방지를 위한 백그라운드 데이터 처리.

필수 구현:

Web Worker API (self.onmessage, self.postMessage) 구현.

packages/logic/parsers.ts의 분석 함수 호출.

에러 핸들링: JSON 파싱 실패 시 명확한 에러 메시지 반환.

워크플로우:

Main: worker.postMessage({ type: 'START', text: jsonStr })

Worker: 분석 로직 수행 (약 1~3초 소요)

Worker: self.postMessage({ type: 'SUCCESS', result: payload })

2.2 apps/web/components/UploadZone.tsx
역할: ZIP 파일 드래그 & 드롭 및 압축 해제 핸들링.

의존성: jszip 라이브러리.

구현 로직:

onDrop 이벤트 핸들러.

JSZip.loadAsync(file) -> 파일 목록 중 conversations.json 탐색.

해당 파일만 async('string')으로 텍스트 추출.

추출된 텍스트를 parser.worker.ts로 전송.

UI 상태: IDLE -> UNZIPPING -> ANALYZING -> COMPLETE 상태에 따른 UI 변화 (Progress Bar).

2.3 apps/web/app/report/page.tsx
역할: 분석 결과 리포트(카드) 렌더링 페이지.

필수 구현:

useSearchParams 혹은 전역 상태(Zustand/Context)에서 분석 결과 데이터 수신.

API 호출: useEffect에서 /api/generate로 데이터 전송 및 AI 멘트 수신.

공유 기능: html2canvas를 사용하여 컴포넌트 영역을 이미지로 캡처 및 다운로드/공유.

디자인 요구사항: 모바일 9:16 비율 준수, 인스타 스토리 친화적 UI.

2.4 apps/web/app/page.tsx (Landing)
역할: 서비스 소개 및 진입점.

필수 구현:

"ChatGPT 데이터 추출 방법" 가이드 (GIF/Video).

데모 데이터로 실행해보기 버튼.

🤖 3. AI Backend (/apps/web/app/api)
Next.js Route Handler를 사용한 Serverless Backend입니다.

3.1 apps/web/app/api/generate/route.ts
역할: 프론트에서 받은 통계를 바탕으로 LLM에게 리포트 작문 요청.

의존성: openai, zod.

필수 로직:

Request Parsing: req.json()으로 데이터 수신.

Validation: ReportPayloadSchema.parse(body)로 데이터 검증 (위조 방지).

Prompt Engineering:

System: "당신은 위트 있는 취향 분석가입니다..."

User: 수신된 통계 데이터 주입.

Output Enforcement: 반드시 JSON 포맷으로 응답하도록 강제 (response_format: { type: "json_object" }).

Error Handling: OpenAI API 오류 시 Fallback(기본 멘트) 반환 처리.

환경 변수: process.env.OPENAI_API_KEY 사용.

⚙️ 4. Configuration Files
4.1 .env.local (in /apps/web)
내용: 보안이 필요한 환경 변수.

Bash

OPENAI_API_KEY=sk-proj-xxxxxxxxxxxx
# NEXT_PUBLIC_... 접두사가 붙은 변수는 사용하지 않음 (키 노출 방지)
4.2 turbo.json (Root)
역할: 모노레포 빌드 파이프라인 설정.

설정:

JSON

{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
📝 개발 체크리스트 (우선순위 순)
[Core] /packages/logic의 정규식 리스트와 파싱 함수 작성 및 단위 테스트. (가장 중요)

[Frontend] UploadZone에서 ZIP 파일 해제 및 conversations.json 텍스트 추출 확인.

[Worker] Web Worker와 메인 스레드 간 데이터 통신(PostMessage) 연결.

[Backend] /api/generate 작성 및 Postman으로 모의 데이터 전송 테스트.

[UI] 리포트 카드 디자인 및 이미지 저장 기능 구현.