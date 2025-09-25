"use client";

import { useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";

import type {
  ApiResponse,
  AuthStatus,
  LoginRequest,
  SignupRequest,
} from "@/types/auth";

/**
 * 인증 관련 커스텀 훅
 * Next-Auth의 useSession을 확장하여 추가 기능을 제공합니다.
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
    } catch {
      const errorMessage = "로그인 중 오류가 발생했습니다.";
      setError(errorMessage);
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
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result: ApiResponse = await response.json();

      if (!response.ok) {
        setError(result.error || "회원가입 중 오류가 발생했습니다.");
        return { success: false, error: result.error };
      }

      // 회원가입 성공 후 자동 로그인
      const loginResult = await login({
        email: data.email,
        password: data.password,
      });

      return loginResult;
    } catch {
      const errorMessage = "회원가입 중 오류가 발생했습니다.";
      setError(errorMessage);
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
    await update();
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

    // 유틸리티
    clearError: () => setError(null),
  };
}
