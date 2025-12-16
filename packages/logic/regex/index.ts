// 관심사·성향·세대별 텍스트 카테고리 정규식 패턴 사전
// 반드시 gi 플래그(대소문자 구분X, 전체 매칭)

export const ATTITUDE_PATTERNS = {
  warm: /고마워|대박이다|해줄래|덕분에|줄수있어\?|부탁해|thanks|thx/gi,
  cold: /만들어봐|바꿔봐|뒤질래|내놔|빨리|그거말고|장난해|해봐|translate/gi,
};

export const INTEREST_PATTERNS = {
  // Tech
  dev: /error|bug|deploy|api|sql|python|java|react|vue|node|함수|변수|배포|코드|알고리즘/gi,
  tool: /엑셀|ppt|매크로|단축키|notion|slack|장비|맥북|모니터/gi,
  // Culture
  content: /넷플릭스|영화|드라마|애니|웹툰|줄거리|결말|추천|리뷰|캐릭터|시즌/gi,
  creation: /글쓰기|제목|소설|시나리오|블로그|유튜브|편집|디자인|포토샵|카피/gi,
  // Life
  food: /맛집|레시피|요리|메뉴|식당|고기|카페|음식|재료/gi,
  travel: /여행|숙소|비행기|코스|예약|환율|날씨|지도|관광/gi,
  health: /운동|헬스|요가|영양제|증상|효능|다이어트|근육/gi,
  // Knowledge
  humanities: /역사|철학|심리|의미|유래|영어|번역|뜻|어원/gi,
  science: /수학|과학|물리|우주|이론|공식|증명|원리/gi,
};

export const VIBE_PATTERNS = {
  mz: /ㅋㅋ|ㅎㅎ|존맛|꿀팁|가성비|드립|mbti|넷플릭스|알빠/gi,
  old: /효능|부작용|부동산|청약|주식|운세|꿈해몽|읍니다|하오/gi,
};

