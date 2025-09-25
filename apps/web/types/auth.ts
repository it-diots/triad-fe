import type { DefaultSession } from "next-auth";

/**
 * Next-Auth 관련 타입 확장
 * 기본 세션과 사용자 타입에 추가 필드를 포함합니다.
 */

// Next-Auth 세션 타입 확장
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
  }
}

// JWT 토큰 타입 확장
declare module "next-auth" {
  interface JWT {
    id: string;
  }
}

/**
 * 사용자 인증 관련 타입 정의
 */
export interface User {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  emailVerified?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 사용자 자격 증명 타입
 */
export interface UserCredentials {
  id: string;
  userId: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 로그인 요청 타입
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * 회원가입 요청 타입
 */
export interface SignupRequest {
  email: string;
  password: string;
  name?: string;
}

/**
 * API 응답 타입
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * 사용자 프로필 업데이트 타입
 */
export interface ProfileUpdateRequest {
  name?: string;
  image?: string;
}

/**
 * 패스워드 변경 요청 타입
 */
export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * 인증 상태 타입
 */
export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

/**
 * 폼 상태 관리를 위한 타입
 */
export interface FormState {
  isLoading: boolean;
  error: string | null;
  success: string | null;
}

/**
 * 유효성 검사 오류 타입
 */
export interface ValidationError {
  field: string;
  message: string;
}
