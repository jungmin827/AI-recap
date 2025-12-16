import { ATTITUDE_PATTERNS, INTEREST_PATTERNS, VIBE_PATTERNS } from '../regex';
import { StatResult, StatResultSchema } from '@types/schema';

// jsonString: conversations.json 파일의 순수 텍스트(JSON array)
// 반환값: StatResult 타입의 분석(카운팅 및 MBTI 코드 + Top 관심사)
export function analyzeMessages(jsonString: string): StatResult {
  let data;
  try {
    data = JSON.parse(jsonString);
  } catch (e) {
    throw new Error('JSON 파싱 실패: ' + (e as Error).message);
  }
  if (!Array.isArray(data)) throw new Error('데이터 형식 오류: 배열 아님');
  // 사용자 메시지만 필터
  const userMessages = data.filter(
    (d) => d.author?.role === 'user' && d.content?.parts?.[0]
  );
  if (userMessages.length === 0) throw new Error('분석 대상 메시지 없음');

  // 패턴별 카운트
  function countMatches(pattern: RegExp, txt: string) {
    return (txt.match(pattern) ?? []).length;
  }
  // 누적 스코어
  let warm = 0, cold = 0;
  let dev = 0, tool = 0, content = 0, creation = 0, food = 0, travel = 0, health = 0, humanities = 0, science = 0;
  let mz = 0, old = 0;
  // 관심사 전체 키워드 빈도 집계
  const keywordMap: Record<string, number> = {};
  // 메시지 loop
  for (const msg of userMessages) {
    const text = String(msg.content.parts[0]);
    // 태도
    warm += countMatches(ATTITUDE_PATTERNS.warm, text);
    cold += countMatches(ATTITUDE_PATTERNS.cold, text);
    // 관심사
    dev += countMatches(INTEREST_PATTERNS.dev, text);
    tool += countMatches(INTEREST_PATTERNS.tool, text);
    content += countMatches(INTEREST_PATTERNS.content, text);
    creation += countMatches(INTEREST_PATTERNS.creation, text);
    food += countMatches(INTEREST_PATTERNS.food, text);
    travel += countMatches(INTEREST_PATTERNS.travel, text);
    health += countMatches(INTEREST_PATTERNS.health, text);
    humanities += countMatches(INTEREST_PATTERNS.humanities, text);
    science += countMatches(INTEREST_PATTERNS.science, text);
    // 세대
    mz += countMatches(VIBE_PATTERNS.mz, text);
    old += countMatches(VIBE_PATTERNS.old, text);
    // 키워드 등장 수(정확 매치 기반)
    for (const [cat, pattern] of Object.entries(INTEREST_PATTERNS)) {
      const matches = text.match(pattern) ?? [];
      for (const m of matches) {
        const k = m.trim().toLowerCase();
        keywordMap[k] = (keywordMap[k] || 0) + 1;
      }
    }
  }
  // 점수 정규화 (최대값=100)
  function normalize(val: number, total: number) {
    return total === 0 ? 0 : Math.round(100 * val / total);
  }
  const msgCnt = userMessages.length;
  // Depth(대화 길이) 임시 간단히 메시지 개수 기반 → 추후 내용 Based로 확장 가능
  const warmth = normalize(warm, warm + cold);
  const depth = normalize(msgCnt, 100); // 100개 이상이면 max
  const techInterest = normalize(dev + tool, dev + tool + content + creation + food + travel + health + humanities + science);
  const mzVibe = normalize(mz, mz + old);

  // MBTI 결정: 각 임계값 기준 (실전선 더 다듬음 가능)
  const mbtiCode =
    (warmth >= 50 ? 'W' : 'C') +
    (depth >= 50 ? 'D' : 'S') +
    (techInterest >= 50 ? 'L' : 'E') +
    (mzVibe >= 50 ? 'Y' : 'O');

  // 상위 관심사: 빈도 기준 내림차순 TOP5
  const topInterests = Object.entries(keywordMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([k]) => k);

  // 데이터 스키마 등 일치 검증 후 반환
  const result: StatResult = {
    mbtiCode,
    scores: { warmth, depth, techInterest, mzVibe },
    topInterests,
    usageStats: {
      totalConversations: msgCnt,
      activeHour: 0, // 주사용시간대 미포함(0으로)
    },
  };
  // 런타임 shape 체크 (오타/누락 방지)
  StatResultSchema.parse(result);
  return result;
}

