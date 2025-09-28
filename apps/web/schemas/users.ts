/**
 * 사용자 관련 Zod 스키마 정의
 * 프로필 조회, 업데이트 등의 스키마
 */

import { z } from "zod";

import { UserSchema } from "./auth";
import {
  createSuccessResponseSchema,
  EmailSchema,
  IdParamSchema,
} from "./common";

/**
 * 사용자 프로필 스키마 (비밀번호 제외)
 */
export const UserProfileSchema = UserSchema;

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
  avatar: z.string().url().nullable().optional(),
});

/**
 * 확장된 사용자 프로필 스키마 (실제 API 응답)
 */
export const ExtendedUserProfileSchema = UserProfileSchema;

/**
 * 사용자 프로필 업데이트 응답 스키마
 */
export const UpdateUserProfileResponseSchema = createSuccessResponseSchema(
  ExtendedUserProfileSchema
);

/**
 * 사용자 프로필 조회 응답 스키마
 */
export const GetUserProfileResponseSchema = createSuccessResponseSchema(
  ExtendedUserProfileSchema
);

/**
 * 사용자 목록 조회 쿼리 스키마 (실제 API에 맞게 간소화)
 */
export const GetUsersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20).optional(),
});

/**
 * 사용자 목록 조회 응답 스키마 (실제 API 응답)
 */
export const GetUsersResponseSchema = z.array(UserProfileSchema);

/**
 * 사용자 ID로 조회 파라미터 스키마
 */
export const GetUserByIdParamsSchema = IdParamSchema;

/**
 * 사용자 ID로 조회 응답 스키마
 */
export const GetUserByIdResponseSchema = createSuccessResponseSchema(
  ExtendedUserProfileSchema
);

/**
 * 사용자 삭제 파라미터 스키마
 */
export const DeleteUserParamsSchema = IdParamSchema;

/**
 * 사용자 삭제 응답 스키마 (실제 API 응답)
 */
export const DeleteUserResponseSchema = z.object({
  message: z.string(),
});


// 타입 추출
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type UpdateUserProfileRequest = z.infer<
  typeof UpdateUserProfileRequestSchema
>;
export type ExtendedUserProfile = z.infer<typeof ExtendedUserProfileSchema>;
export type UpdateUserProfileResponse = z.infer<
  typeof UpdateUserProfileResponseSchema
>;
export type GetUserProfileResponse = z.infer<
  typeof GetUserProfileResponseSchema
>;
export type GetUsersQuery = z.infer<typeof GetUsersQuerySchema>;
export type GetUsersResponse = z.infer<typeof GetUsersResponseSchema>;
export type GetUserByIdParams = z.infer<typeof GetUserByIdParamsSchema>;
export type GetUserByIdResponse = z.infer<typeof GetUserByIdResponseSchema>;
export type DeleteUserParams = z.infer<typeof DeleteUserParamsSchema>;
export type DeleteUserResponse = z.infer<typeof DeleteUserResponseSchema>;
