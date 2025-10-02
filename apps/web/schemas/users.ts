/**
 * 사용자 관련 Zod 스키마 정의
 * 프로필 업데이트에 사용되는 스키마
 */

import { z } from "zod";

import { EmailSchema } from "./common";

/**
 * 사용자 프로필 업데이트 요청 스키마 (실제 API UpdateUserDto)
 */
export const UpdateUserProfileRequestSchema = z.object({
  email: EmailSchema.optional(),
  username: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_-]+$/)
    .optional(),
  firstName: z.string().max(100).nullable().optional(),
  lastName: z.string().max(100).nullable().optional(),
  avatar: z.url().nullable().optional(),
});

// 타입 추출
export type UpdateUserProfileRequest = z.infer<
  typeof UpdateUserProfileRequestSchema
>;
