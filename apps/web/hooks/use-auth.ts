"use client";

import { useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";

import { SignupRequestSchema, SignupResponseSchema } from "@/schemas/auth";
import {
  type UpdateUserProfileRequest,
  UpdateUserProfileRequestSchema,
} from "@/schemas/users";
import type { AuthStatus, LoginRequest, SignupRequest } from "@/types/auth";
import { API_ENDPOINTS, apiClient } from "@/utils/api-client";
import { formatZodError } from "@/utils/zod-helpers";

/**
 * 인증 관련 커스텀 훅
 * Next-Auth의 useSession을 확장하여 추가 기능을 제공합니다.
 * 새로운 API 클라이언트와 Zod 스키마를 사용합니다.
 */
export function useAuth() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 로그인 함수
   */
  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      });

      if (result?.error) {
        setError("이메일 또는 비밀번호가 올바르지 않습니다.");
        return { success: false, error: result.error };
      }

      // 로그인 성공시 홈페이지로 리다이렉트
      router.push("/");
      return { success: true };
    } catch (error: unknown) {
      const errorMessage = "로그인 중 오류가 발생했습니다.";
      setError(errorMessage);
      console.error("로그인 오류:", error);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 회원가입 함수
   */
  const signup = async (data: SignupRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      // 요청 데이터 검증
      const validatedData = SignupRequestSchema.parse(data);

      // 회원가입 요청
      const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, {
        json: validatedData,
      });

      // 응답 데이터 검증
      const responseData = await response.json();
      const validatedResponse = SignupResponseSchema.parse(responseData);

      if (!validatedResponse.user) {
        setError("회원가입 중 오류가 발생했습니다.");
        return { success: false, error: "회원가입 실패" };
      }

      // 회원가입 성공 후 자동 로그인 시도
      const loginResult = await login({
        email: data.email,
        password: data.password,
      });

      return {
        user: validatedResponse.user,
        ...loginResult,
      };
    } catch (error: unknown) {
      // Zod 검증 에러는 formatZodError 사용
      if (error && typeof error === "object" && "issues" in error) {
        const zodError = error as {
          issues: Array<{ message?: string; path: string[] }>;
        };
        const formattedError = formatZodError(
          zodError as import("zod").ZodError
        );
        setError(formattedError);
        return { success: false, error: formattedError };
      }

      // HTTP 에러는 API 클라이언트에서 이미 처리됨
      const errorMessage = "회원가입 중 오류가 발생했습니다.";
      setError(errorMessage);
      console.error("회원가입 오류:", error);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 로그아웃 함수
   */
  const logout = async () => {
    setIsLoading(true);
    try {
      await signOut({ redirect: false });
      router.push("/login");
    } catch (err) {
      console.error("로그아웃 오류:", err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 세션 새로고침 함수
   */
  const refreshSession = async () => {
    try {
      await update();
    } catch (error) {
      console.error("세션 새로고침 오류:", error);
    }
  };

  /**
   * 프로필 정보 가져오기
   */
  const getProfile = async () => {
    if (!session?.accessToken) {
      throw new Error("인증이 필요합니다.");
    }

    try {
      const response = await apiClient.get(API_ENDPOINTS.AUTH.PROFILE);

      return await response.json();
    } catch (error: unknown) {
      console.error("프로필 조회 오류:", error);
      throw error;
    }
  };

  /**
   * 프로필 업데이트
   */
  const updateProfile = async (profileData: UpdateUserProfileRequest) => {
    if (!session?.accessToken) {
      throw new Error("인증이 필요합니다.");
    }

    try {
      // 요청 데이터 검증
      const validatedData = UpdateUserProfileRequestSchema.parse(profileData);

      const response = await apiClient.patch(
        API_ENDPOINTS.USERS.BY_ID(session.user.id),
        { json: validatedData }
      );

      // 세션 업데이트
      await refreshSession();

      return await response.json();
    } catch (error: unknown) {
      // Zod 검증 에러는 formatZodError 사용
      if (error && typeof error === "object" && "issues" in error) {
        const zodError = error as {
          issues: Array<{ message?: string; path: string[] }>;
        };
        const formattedError = formatZodError(
          zodError as import("zod").ZodError
        );
        console.error("프로필 업데이트 검증 오류:", formattedError);
        throw new Error(formattedError);
      }

      console.error("프로필 업데이트 오류:", error);
      throw error;
    }
  };

  /**
   * 인증 상태 확인
   */
  const isAuthenticated = status === "authenticated";
  const isAuthLoading = status === "loading";
  const user = session?.user || null;

  /**
   * 로그인 필요 페이지 리다이렉트
   */
  const requireAuth = () => {
    if (!isAuthenticated && !isAuthLoading) {
      router.push("/login");
      return false;
    }
    return true;
  };

  return {
    // 상태
    user,
    session,
    isAuthenticated,
    isLoading: isAuthLoading || isLoading,
    error,
    status: status as AuthStatus,

    // 액션
    login,
    signup,
    logout,
    refreshSession,
    requireAuth,

    getProfile,
    updateProfile,

    // 유틸리티
    clearError: () => setError(null),
  };
}
