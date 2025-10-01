"use client";

import { useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";

import { SignupRequestSchema, SignupResponseSchema } from "@/schemas/auth";
import type { LoginRequest, SignupRequest } from "@/types/auth";
import { API_ENDPOINTS, apiClient } from "@/utils/api-client";
import { formatZodError } from "@/utils/zod-helpers";

/**
 * 인증 관련 커스텀 훅
 * Next-Auth의 useSession을 확장하여 로그인/로그아웃/회원가입 기능을 제공합니다.
 */
export function useAuth() {
  const { status } = useSession();
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
      router.push("/home");
    } catch (err) {
      console.error("로그아웃 오류:", err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 인증 상태 확인
   */
  const isAuthenticated = status === "authenticated";
  const isAuthLoading = status === "loading";

  return {
    // 상태
    isAuthenticated,
    isLoading: isAuthLoading || isLoading,
    error,

    // 액션
    login,
    signup,
    logout,
  };
}
