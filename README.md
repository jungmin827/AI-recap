# [Project] AI-Curiosity: My 2025 AI Interest Profile
> **Project Code:** AI-DNA-Interest
> **Version:** 2.0.0 (Refined: Focus on Interests & Taste)
> **Target:** SNS Viral Service (Spotify Wrapped for Intellectual Curiosity)

---

## 1. 서비스 개요 (Service Overview)

### 1.1 기획 의도
"내가 지난 1년 동안 AI와 무슨 대화를 가장 많이 했을까?"
사용자의 채팅 기록을 통해 **숨겨진 관심사(Hidden Interests)**와 **지적 취향(Intellectual Taste)**을 분석해 주는 서비스입니다.
자극적인 '욕망' 분석보다는, **개인의 탐구 생활과 취향**을 세련되게 시각화하여 "나는 이런 것에 관심 있는 사람이야"라는 **자기표현(Self-Expression)의 수단**으로 SNS에 공유하게 만듭니다.

### 1.2 핵심 가치 (Core Value)
1.  **Define Your Taste:** 내가 몰랐던 나의 '관심사 DNA'를 발견 (예: "너 사실 역사 덕후였어").
2.  **Intellectual Vibe:** 나의 질문 수준과 분야를 분석해 'AI 대화 나이'나 '지적 성향'을 매력적으로 포장.
3.  **Safe & Fast:** 서버 전송 없이 브라우저에서 100% 처리하여 프라이버시 걱정 없는 쾌속 분석.

---

## 2. 사용자 경험 (UX Workflow)


### Step 1. 데이터 추출 가이드 (Education)
* **구성:** 텍스트 설명 사용.
* **내용:** ChatGPT 설정 -> Data Export -> 이메일 확인 -> 다운로드.

### Step 2. 파일 업로드 (Action)
* **방식:** 이메일로 받은 **`package.zip` 파일을 압축 해제 없이 그대로 드래그 & 드롭.**
* **UX 장치:**
    * 진행률 표시줄 (Progress Bar).
    * **보안 문구 강조:** "🔒 당신의 데이터는 이 브라우저를 떠나지 않고 0.1초 만에 휘발됩니다."

### Step 3. 결과 리포트 (Reward)
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

### 3.2 Interest Tag Cloud (관심사 추출 로직)
'욕망'이 아닌 **'순수 관심사'**를 카테고리별로 카운팅하여 **최다 빈도 관심사**를 찾아냅니다.

* **💻 Tech & Dev:** 코딩, 에러, AI, 데이터, 엑셀, 장비
* **🎨 Culture & Art:** 영화, 드라마, 웹툰, 음악, 글쓰기, 디자인
* **✈️ Life & Hobby:** 여행, 맛집, 요리, 운동, 패션, 인테리어
* **📚 Study & Knowledge:** 역사, 철학, 과학, 어학, 시사

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
  warm: /고마워|대박이다|해줄래|덕분에|줄수있어?|부탁해|thanks|thx/gi,
  cold: /만들어봐|바꿔봐|뒤질래|내놔|빨리|그거말고|장난해|해봐|translate/gi,

// 2. Interest Categories (관심사 파악용 - 여기가 핵심)
  // [Tech]
  dev: /error|bug|deploy|api|sql|python|java|react|vue|node|함수|변수|배포|코드|알고리즘/gi,
  tool: /엑셀|ppt|매크로|단축키|notion|slack|장비|맥북|모니터/gi,

  // [Culture]
  content: /넷플릭스|영화|드라마|애니|웹툰|줄거리|결말|추천|리뷰|캐릭터|시즌/gi,
  creation: /글쓰기|제목|소설|시나리오|블로그|유튜브|편집|디자인|포토샵|카피/gi,

  // [Life]
  food: /맛집|레시피|요리|메뉴|식당|고기|카페|음식|재료/gi,
  travel: /여행|숙소|비행기|코스|예약|환율|날씨|지도|관광/gi,
  health: /운동|헬스|요가|영양제|증상|효능|다이어트|근육/gi,

  // [Knowledge]
  humanities: /역사|철학|심리|의미|유래|영어|번역|뜻|어원/gi,
  science: /수학|과학|물리|우주|이론|공식|증명|원리/gi

  // 3. 세대 (Vibe)
  mz: /ㅋㅋ|ㅎㅎ|존맛|꿀팁|가성비|드립|mbti|넷플릭스|알빠/gi,
  old: /효능|부작용|부동산|청약|주식|운세|꿈해몽|읍니다|하오/gi,


};


---

Phase 1 (Data Parsing):

conversations.json 파싱 로직 구현.

위 INTEREST_PATTERNS를 활용한 카테고리별 카운팅 기능 개발.

검증: 개발자 본인의 데이터로 테스트하여 관심사 비율이 맞게 나오는지 확인.

Phase 2 (Report Logic):

4축(Attitude, Depth, Domain, Vibe) 점수 산출 알고리즘 확정.

AI API 연동하여 리포트 문구 생성 테스트.

Phase 3 (UI/UX):

데이터 드래그 & 드롭 UI 구현.

결과 카드 디자인 (공유하고 싶게 만드는 타이포그래피 & 컬러).