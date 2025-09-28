"use client";

import { useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";

import { SignupRequestSchema, SignupResponseSchema } from "@/schemas/auth";
import type { AuthStatus, LoginRequest, SignupRequest } from "@/types/auth";
import { API_ENDPOINTS, apiClient } from "@/utils/api-client";

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
   * 회원가입 함수 (새로운 API 클라이언트와 Zod 스키마 사용)
   */
  const signup = async (data: SignupRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      // 요청 데이터 검증
      const validatedData = SignupRequestSchema.parse(data);

      // 새로운 API 클라이언트로 회원가입 요청
      const response = await apiClient.post(
        API_ENDPOINTS.AUTH.REGISTER,
        validatedData
      );

      // 응답 데이터 검증
      const validatedResponse = SignupResponseSchema.parse(response.data);

      // 실제 API는 성공 시 직접 데이터를 반환하므로 success 체크 불필요
      if (!validatedResponse.user) {
        setError("회원가입 중 오류가 발생했습니다.");
        return {
          success: false,
          error: "회원가입 실패",
        };
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
      let errorMessage = "회원가입 중 오류가 발생했습니다.";

      // API 클라이언트 에러 처리
      if (
        error &&
        typeof error === "object" &&
        "status" in error &&
        "data" in error
      ) {
        const apiError = error as {
          status: number;
          data?: { message?: string };
        };
        errorMessage = apiError.data?.message || errorMessage;
      }
      // Zod 검증 에러 처리
      else if (error && typeof error === "object" && "issues" in error) {
        const zodError = error as { issues: Array<{ message?: string }> };
        errorMessage = zodError.issues[0]?.message || errorMessage;
      }

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
   * 프로필 정보 가져오기 (새로운 API 사용)
   */
  const getProfile = async () => {
    if (!session?.accessToken) {
      throw new Error("인증이 필요합니다.");
    }

    try {
      const response = await apiClient.get(API_ENDPOINTS.AUTH.PROFILE);

      return response.data;
    } catch (error: unknown) {
      console.error("프로필 조회 오류:", error);
      throw error;
    }
  };

  /**
   * 프로필 업데이트 (새로운 API 사용)
   */
  const updateProfile = async (profileData: Record<string, unknown>) => {
    if (!session?.accessToken) {
      throw new Error("인증이 필요합니다.");
    }

    try {
      const response = await apiClient.patch(
        API_ENDPOINTS.USERS.BY_ID(session.user.id),
        profileData
      );

      // 세션 업데이트
      await refreshSession();

      return response.data;
    } catch (error: unknown) {
      console.error("프로필 업데이트 오류:", error);
      throw error;
    }
  };

  /**
   * 인증 상태 확인
   */
  const isAuthenticated = status === "authenticated";
  const isLoading_auth = status === "loading";
  const user = session?.user || null;

  /**
   * 로그인 필요 페이지 리다이렉트
   */
  const requireAuth = () => {
    if (!isAuthenticated && !isLoading_auth) {
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
    isLoading: isLoading_auth || isLoading,
    error,
    status: status as AuthStatus,

    // 액션
    login,
    signup,
    logout,
    refreshSession,
    requireAuth,

    // 새로운 API 메서드
    getProfile,
    updateProfile,

    // 유틸리티
    clearError: () => setError(null),
  };
}
