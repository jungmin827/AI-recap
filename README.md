# [Project] AI-Wrapped: My 2025 AI Persona Report
> **Project Code:** AI-DNA
> **Version:** 1.0.0
> **Target:** SNS Viral Service (Spotify Wrapped Style)

---

## 1. 서비스 개요 (Service Overview)

### 1.1 기획 의도
사용자가 1년간 AI(ChatGPT, Gemini)와 나눈 대화 기록을 분석하여, **"AI가 바라보는 나의 본성"**을 재치 있게 알려주는 웹 서비스입니다.
단순한 통계 나열이 아니라, **사용자의 숨겨진 욕망, 성격 유형(New MBTI), 2026년 예측**을 블랙 유머 코드(Sarcasm & Wit)로 풀어내어 자발적인 SNS 바이럴을 유도합니다.

### 1.2 핵심 가치 (Core Value)
1.  **Fun & Insight:** 스포티파이 Wrapped의 '음악 나이'처럼, 나의 'AI 정신 연령'과 '숨겨진 욕망'을 발견하는 재미.
2.  **Zero Privacy Risk:** 민감한 대화 내용을 서버로 전송하지 않고, **브라우저에서 처리(Local Processing)**하여 보안 우려를 원천 차단.
3.  **Super Easy UX:** 압축 파일(ZIP)을 풀지 않고 그대로 드래그 앤 드롭하는 **"3초 컷"** 진입 장벽.

---

## 2. 사용자 경험 (UX Workflow)

### Step 1. 랜딩 페이지 (Hook)
* **메인 카피:** "AI는 네가 지난 여름에 검색한 것을 알고 있다."
* **기능:** '데모 결과 보기' 버튼을 통해 흥미 유발.
* **CTA:** [내 데이터로 분석하기]

### Step 2. 데이터 추출 가이드 (Education)
* **구성:** 텍스트 설명 대신 **3초 반복 움짤(GIF)** 사용.
* **내용:** ChatGPT 설정 -> Data Export -> 이메일 확인 -> 다운로드.

### Step 3. 파일 업로드 (Action)
* **방식:** 이메일로 받은 **`package.zip` 파일을 압축 해제 없이 그대로 드래그 & 드롭.**
* **UX 장치:**
    * 진행률 표시줄 (Progress Bar).
    * **보안 문구 강조:** "🔒 당신의 데이터는 이 브라우저를 떠나지 않고 0.1초 만에 휘발됩니다."

### Step 4. 결과 리포트 (Reward)
* **형태:** 모바일 세로형(9:16) 이미지 카드 (인스타 스토리 공유 최적화).
* **주요 콘텐츠:**
    1.  **My AI Persona (4글자 코드):** 새로운 MBTI 유형.
    2.  **타이틀 & 한 줄 평:** 예) "조선시대 호조판서", "AI랑 썸 타는 금사빠".
    3.  **욕망 레이더:** 게으름, 물욕, 허영심 등.
    4.  **2026 예언:** 팩트 폭격 예언.

---

## 3. 핵심 콘텐츠 로직 (Core Logic)

### 3.1 New AI-MBTI (4 Axis)
사용자의 성향을 4가지 축으로 분석하여 16가지 유형의 페르소나를 부여합니다.

| 축 (Dimension) | A유형 (Left) | B유형 (Right) | 분석 기준 (JS Logic) |
| :--- | :--- | :--- | :--- |
| **태도 (Attitude)** | **W (Warm/따뜻)** | **C (Cold/냉철)** | 공손한 인사말 vs 명령조/단답형 빈도 |
| **탐구 (Depth)** | **D (Deep/깊음)** | **S (Surf/얕음)** | 대화 턴(Turn) 길이, 한 주제 지속성 |
| **분야 (Focus)** | **E (Emotion/문과)** | **L (Logic/이과)** | 감성/인문학 키워드 vs 코딩/수학/데이터 키워드 |
| **세대 (Vibe)** | **Y (Young/MZ)** | **O (Old/Teul)** | 밈/신조어 사용 vs 건강/부동산/옛날 말투 |

### 3.2 욕망 키워드 (Desire Keywords for Recap)
리포트의 '재미'를 담당하는 특수 카테고리입니다.
* **한탕주의:** 코인, 로또, 주식, 떡상
* **다이어트:** 칼로리, 제로, 헬스 (질문만 하고 실천 안 함)
* **날로 먹기:** 요약해, 써줘, 레포트, 과제

---

## 4. 기술 아키텍처 (Technical Architecture)

### 4.1 하이브리드 워크플로우 (Hybrid Workflow)
**"Client-side Parsing + Server-side Generation"** 구조를 채택하여 비용과 보안을 동시에 해결합니다.

1.  **Client (Browser):** 대용량 JSON 파싱, 정규식(Regex) 기반 통계 추출, 개인정보 필터링.
2.  **API Payload:** 추출된 '숫자(Score)'와 '대표 키워드'만 서버로 전송.
3.  **Server (AI):** 통계 데이터를 바탕으로 재치 있는 멘트(Creative Writing) 생성.

### 4.2 Tech Stack Recommendation
* **Frontend:** React (or Next.js), TypeScript, TailwindCSS
    * `JSZip`: ZIP 파일 클라이언트 사이드 해제.
    * `Web Worker`: 대용량 JSON 파싱 시 UI 블로킹 방지.
* **Backend:** Node.js (Serverless Functions 권장 - Vercel/AWS Lambda)
* **AI Model:** OpenAI `GPT-4o-mini` 또는 Anthropic `Claude-3-Haiku` (속도 빠르고 저렴한 모델 필수).

---

## 5. 데이터 처리 및 개발 명세 (Developer Guide)

### 5.1 Client-side Logic (keyword_dictionary.js)
프론트엔드에서 정규식(Regex)으로 카운팅해야 할 핵심 키워드 리스트입니다.

```javascript
export const PATTERNS = {
  // 1. 태도 (Attitude)
  warm: /고마워|감사|사랑|덕분에|천재|똑똑|thanks|thx/gi,
  cold: /요약|번역|수정|내놔|빨리|다시|틀렸어|summary|translate/gi,

  // 2. 관심 (Interest)
  tech: /error|bug|deploy|api|sql|docker|python|java|react|함수|변수|배포|```/gi,
  art: /소설|시나리오|제목|마케팅|카피|블로그|essay|writing|철학|심리/gi,

  // 3. 세대 (Vibe)
  mz: /ㅋㅋ|ㅎㅎ|존맛|꿀팁|가성비|드립|mbti|넷플릭스|알빠/gi,
  old: /효능|부작용|부동산|청약|주식|운세|꿈해몽|읍니다|하오/gi,

  // 4. 욕망 (Desire - Special)
  money: /로또|비트코인|코인|떡상|주가|대박/gi,
  diet: /칼로리|다이어트|살|식단|운동|헬스/gi,
  lazy: /요약|대신|써줘|report|숙제/gi
};