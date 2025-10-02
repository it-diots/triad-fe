/**
 * 인증 관련 타입 정의
 * NextAuth 세션 상태와 기본 타입 re-export
 */

// NextAuth 세션 상태 타입
export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

// 인증 관련 타입 re-export (편의성을 위해)
export type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  User,
} from "@/schemas/auth";
