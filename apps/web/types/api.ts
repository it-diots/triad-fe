/**
 * API 관련 타입 정의
 * RESTful API와 클라이언트 간의 데이터 교환을 위한 타입들
 */

// Re-export from schemas for convenience
export type {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  SignupRequest,
  SignupResponse,
  User,
} from "@/schemas/auth";
export type { ApiErrorData, ErrorResponse } from "@/schemas/common";
export type { UpdateUserProfileRequest } from "@/schemas/users";
