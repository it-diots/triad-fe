/**
 * 공통 Zod 스키마 정의
 * API 응답의 기본 구조와 재사용 가능한 스키마들
 */

import { z } from "zod";

/**
 * 기본 API 응답 스키마
 */
export const BaseApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  timestamp: z.string().datetime().optional(),
});

/**
 * 페이지네이션 스키마
 */
export const PaginationSchema = z.object({
  page: z.number().int().min(1),
  limit: z.number().int().min(1).max(100),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
});

/**
 * 페이지네이션된 응답 스키마
 */
export function createPaginatedResponseSchema<T extends z.ZodTypeAny>(
  dataSchema: T
) {
  return BaseApiResponseSchema.extend({
    data: z.array(dataSchema),
    pagination: PaginationSchema,
  });
}

/**
 * 성공 응답 스키마
 */
export function createSuccessResponseSchema<T extends z.ZodTypeAny>(
  dataSchema: T
) {
  return BaseApiResponseSchema.extend({
    data: dataSchema,
  });
}

/**
 * 에러 응답 스키마 (실제 API 스펙에 맞게 수정)
 */
export const ErrorResponseSchema = z.object({
  message: z.string(),
  error: z.string(),
  statusCode: z.number(),
});

/**
 * ID 파라미터 스키마
 */
export const IdParamSchema = z.object({
  id: z.string().uuid("유효하지 않은 ID 형식입니다"),
});

/**
 * 타임스탬프 스키마
 */
export const TimestampsSchema = z.object({
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

/**
 * 이메일 스키마
 */
export const EmailSchema = z
  .string()
  .email("유효하지 않은 이메일 형식입니다")
  .max(255, "이메일은 255자를 초과할 수 없습니다");

/**
 * 비밀번호 스키마
 */
export const PasswordSchema = z
  .string()
  .min(8, "비밀번호는 최소 8자 이상이어야 합니다")
  .max(128, "비밀번호는 128자를 초과할 수 없습니다")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "비밀번호는 대문자, 소문자, 숫자를 포함해야 합니다"
  );

// 타입 추출
export type BaseApiResponse = z.infer<typeof BaseApiResponseSchema>;
export type Pagination = z.infer<typeof PaginationSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
export type IdParam = z.infer<typeof IdParamSchema>;

// 호환성을 위한 추가 타입들
export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};
