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
 * 더 사용자 친화적인 이메일 스키마
 */
export const EmailSchema = z
  .string({
    required_error: "이메일 주소를 입력해주세요",
    invalid_type_error: "이메일 주소 형식이 올바르지 않습니다",
  })
  .min(1, "이메일 주소를 입력해주세요")
  .email("올바른 이메일 주소 형식을 입력해주세요 (예: user@example.com)")
  .max(255, "이메일 주소는 255자를 초과할 수 없습니다")
  .toLowerCase() // 이메일 정규화
  .trim(); // 공백 제거

/**
 * 강화된 비밀번호 스키마
 */
export const PasswordSchema = z
  .string({
    required_error: "비밀번호를 입력해주세요",
    invalid_type_error: "비밀번호는 문자열이어야 합니다",
  })
  .min(8, "비밀번호는 최소 8자 이상이어야 합니다")
  .max(128, "비밀번호는 128자를 초과할 수 없습니다")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
    "비밀번호는 대문자, 소문자, 숫자, 특수문자(@$!%*?&)를 각각 최소 1개씩 포함해야 합니다"
  );

/**
 * 안전한 비밀번호 확인 스키마
 */
export const PasswordConfirmSchema = z
  .object({
    password: PasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["confirmPassword"], // 에러 위치 지정
  });

/**
 * 사용자명 스키마
 */
export const UsernameSchema = z
  .string({
    required_error: "사용자명을 입력해주세요",
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
export type BaseApiResponse = z.infer<typeof BaseApiResponseSchema>;
export type Pagination = z.infer<typeof PaginationSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
export type ApiErrorData = z.infer<typeof ApiErrorDataSchema>;
export type IdParam = z.infer<typeof IdParamSchema>;

// 호환성을 위한 추가 타입들
export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};
