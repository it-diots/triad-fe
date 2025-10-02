/**
 * 공통 Zod 스키마 정의
 * API 응답의 기본 구조와 재사용 가능한 스키마들
 */

import { z } from "zod";

/**
 * 에러 응답 스키마 (실제 API 스펙에 맞게 수정)
 */
export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  error: z.object({
    code: z.string(),
    details: z.unknown().optional(),
  }),
});

/**
 * API 에러 데이터 스키마 (외부 API 응답용)
 */
export const ApiErrorDataSchema = z.object({
  message: z.string().optional(),
  error: z
    .object({
      code: z.string().optional(),
    })
    .optional(),
});

/**
 * 타임스탬프 스키마
 */
export const TimestampsSchema = z.object({
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  deletedAt: z.iso.datetime().nullable(),
  emailVerifiedAt: z.iso.datetime().nullable(),
  lastLoginAt: z.iso.datetime().nullable(),
});

/**
 * 이메일 스키마
 */
export const EmailSchema = z
  .email({
    message: "올바른 이메일 주소 형식을 입력해주세요 (예: user@example.com)",
  })
  .min(1, "이메일 주소를 입력해주세요")
  .max(255, "이메일 주소는 255자를 초과할 수 없습니다")
  .toLowerCase()
  .trim();

/**
 * 비밀번호 스키마
 */
export const PasswordSchema = z
  .string({
    message: "비밀번호를 입력해주세요",
  })
  .min(8, "비밀번호는 최소 8자 이상이어야 합니다")
  .max(128, "비밀번호는 128자를 초과할 수 없습니다")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
    "비밀번호는 대문자, 소문자, 숫자, 특수문자(@$!%*?&)를 각각 최소 1개씩 포함해야 합니다"
  );

/**
 * 사용자명 스키마
 */
export const UsernameSchema = z
  .string({
    message: "사용자명을 입력해주세요",
  })
  .min(3, "사용자명은 최소 3자 이상이어야 합니다")
  .max(20, "사용자명은 20자를 초과할 수 없습니다")
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    "사용자명은 영문, 숫자, 언더스코어(_), 하이픈(-)만 사용할 수 있습니다"
  )
  .toLowerCase()
  .trim();

// 타입 추출
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
export type ApiErrorData = z.infer<typeof ApiErrorDataSchema>;
