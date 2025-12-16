import { z } from "zod";

// 분석 통계 산출값(MBTI, 점수, 관심사, 사용 통계)
export const StatResultSchema = z.object({
  mbtiCode: z.string().length(4).regex(/^[A-Z]{4}$/), // 4자리 영문 대문자
  scores: z.object({
    warmth: z.number().min(0).max(100),
    depth: z.number().min(0).max(100),
    techInterest: z.number().min(0).max(100),
    mzVibe: z.number().min(0).max(100),
  }),
  topInterests: z.array(z.string()).max(5),
  usageStats: z.object({
    totalConversations: z.number().int().min(0),
    activeHour: z.number().int().min(0).max(23),
  })
});

// API 요청 전문
export const ReportPayloadSchema = StatResultSchema;

export type StatResult = z.infer<typeof StatResultSchema>;
export type ReportPayload = z.infer<typeof ReportPayloadSchema>;

