import { NextRequest, NextResponse } from 'next/server';
import { ReportPayloadSchema } from '@types/schema';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  // 1. body 검증
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid body' }, { status: 400 });
  }
  let parsed;
  try {
    parsed = ReportPayloadSchema.parse(body);
  } catch (e: any) {
    return NextResponse.json({ error: 'invalid payload', detail: e?.message }, { status: 422 });
  }
  // 2. 프롬프트 엔지니어링(예시)
  const userPrompt = `아래는 나의 AI 분석 데이터야. 이 통계치 기반 유쾌한 자기소개 문장을 한 줄로 만들어 줘.\n데이터: ${JSON.stringify(parsed)}`;
  const systemPrompt = `너는 위트 있는 지적 취향 분석가야. 결과는 반드시 한국어로, 1문장 JSON {\"title\": string, \"comment\": string} 형식만!`;
  // 3. OpenAI 호출
  let aiResTxt = '';
  let aiObj: any = null;
  try {
    const aiRes = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 300,
    });
    aiResTxt = aiRes.choices[0]?.message.content || '';
    aiObj = JSON.parse(aiResTxt);
  } catch {
    return NextResponse.json({
      title: '분석가의 기본 타이틀',
      comment: 'AI 서버에 잠시 문제가 있어요! 입력된 통계치로 직접 더 멋진 소개 해볼까요?'
    }, { status: 500 });
  }
  // 4. return
  return NextResponse.json(aiObj, { status: 200 });
}

