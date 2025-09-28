/**
 * 인증 관련 Zod 스키마 정의
 * 로그인, 회원가입, 토큰 관리 등의 스키마
 */

import { z } from "zod";

import { EmailSchema, PasswordSchema, TimestampsSchema } from "./common";

/**
 * 사용자 기본 정보 스키마 (실제 API 응답 구조)
 */
export const UserSchema = z
  .object({
    id: z.string().uuid(),
    email: EmailSchema,
    username: z.string(),
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    avatar: z.string().url().nullable(),
    role: z.enum(["USER", "ADMIN", "MODERATOR"]),
    status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED", "DELETED"]),
    provider: z.enum(["LOCAL", "GOOGLE", "GITHUB"]),
    isEmailVerified: z.boolean(),
  })
  .merge(TimestampsSchema);

/**
 * JWT 토큰 스키마 (실제 API 응답)
 */
export const TokenSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresIn: z.number().int().positive(),
  tokenType: z.literal("Bearer"),
});

/**
 * 토큰 응답 스키마 (실제 API TokenResponseDto)
 */
export const TokenResponseSchema = z.object({
  user: UserSchema,
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresIn: z.number().int().positive(),
});

/**
 * 로그인 요청 스키마
 */
export const LoginRequestSchema = z.object({
  email: EmailSchema,
  password: z.string().min(1, "비밀번호를 입력해주세요"),
});

/**
 * 로그인 응답 스키마 (실제 API 응답)
 */
export const LoginResponseSchema = TokenResponseSchema;

/**
 * 회원가입 요청 스키마 (실제 API RegisterDto)
 */
export const SignupRequestSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
  username: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_-]+$/),
  firstName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
});

/**
 * 회원가입 응답 스키마 (실제 API 응답)
 */
export const SignupResponseSchema = TokenResponseSchema;

/**
 * 토큰 갱신 요청 스키마
 */
export const RefreshTokenRequestSchema = z.object({
  refreshToken: z.string().min(1, "리프레시 토큰이 필요합니다"),
});

/**
 * 토큰 갱신 응답 스키마 (실제 API 응답)
 */
export const RefreshTokenResponseSchema = TokenResponseSchema;

// 타입 추출
export type User = z.infer<typeof UserSchema>;
export type Token = z.infer<typeof TokenSchema>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type SignupRequest = z.infer<typeof SignupRequestSchema>;
export type SignupResponse = z.infer<typeof SignupResponseSchema>;
export type RefreshTokenRequest = z.infer<typeof RefreshTokenRequestSchema>;
export type RefreshTokenResponse = z.infer<typeof RefreshTokenResponseSchema>;

// 사용자 인증 관련 타입들만 제공
