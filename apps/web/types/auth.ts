/**
 * 레거시 auth 타입 정의 파일
 * Supabase에서 REST API로 마이그레이션 후 더 이상 사용되지 않음
 *
 * @deprecated 이 파일은 더 이상 사용되지 않습니다.
 * 새로운 타입은 types/api.ts, schemas/auth.ts, types/next-auth.d.ts를 사용하세요.
 */

// 기존 코드와의 호환성을 위해 유지되는 타입들
export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export interface FormState {
  isLoading: boolean;
  error: string | null;
  success: string | null;
}

export interface ValidationError {
  field: string;
  message: string;
}

// 새로운 타입 시스템으로 마이그레이션을 위한 re-export
export type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  User,
} from "@/schemas/auth";

// 사용자 프로필 업데이트 타입은 users 스키마에서 가져옴
export type {
  ApiResponse,
  BaseApiResponse,
  ErrorResponse,
} from "@/schemas/common";
export type { UpdateUserProfileRequestSchema as ProfileUpdateRequest } from "@/schemas/users";

// 새로운 타입 시스템으로 마이그레이션을 권장하는 메시지
console.warn(
  "⚠️  types/auth.ts는 deprecated되었습니다. " +
    "schemas/auth.ts와 types/next-auth.d.ts의 새로운 타입 시스템을 사용하세요."
);
