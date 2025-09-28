"use client";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@triad/ui";
import type { Route } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useAuth } from "@/hooks/use-auth";
import type { FormState } from "@/types/auth";

/**
 * 로그인 페이지
 * shadcn-ui 컴포넌트를 활용한 사용자 인증 폼
 */
export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [formState, setFormState] = useState<FormState>({
    isLoading: false,
    error: null,
    success: null,
  });

  /**
   * 폼 입력 값 변경 핸들러
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 에러 메시지 초기화
    if (error || formState.error) {
      clearError();
      setFormState((prev) => ({ ...prev, error: null }));
    }
  };

  /**
   * 로그인 폼 제출 핸들러
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 입력 값 유효성 검사
    if (!formData.email || !formData.password) {
      setFormState((prev) => ({
        ...prev,
        error: "이메일과 비밀번호를 모두 입력해주세요.",
      }));
      return;
    }

    setFormState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await login(formData);

      if (result.success) {
        // 로그인 성공시 홈으로 리다이렉트
        router.push("/" as Route);
      } else {
        setFormState((prev) => ({
          ...prev,
          error: result.error || "로그인에 실패했습니다.",
        }));
      }
    } catch {
      setFormState((prev) => ({
        ...prev,
        error: "로그인 중 오류가 발생했습니다.",
      }));
    } finally {
      setFormState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const displayError = error || formState.error;
  const displayLoading = isLoading || formState.isLoading;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* 로고/브랜드 영역 */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Triad
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            팀워크 향상을 위한 협업 도구
          </p>
        </div>

        {/* 로그인 카드 */}
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold">로그인</CardTitle>
            <div>이메일과 비밀번호를 입력하여 계정에 로그인하세요</div>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {/* 에러 메시지 표시 */}
              {displayError && (
                <div className="rounded-md border border-red-200 bg-red-50 p-3">
                  <p className="text-sm text-red-600">{displayError}</p>
                </div>
              )}

              {/* 이메일 입력 */}
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your-email@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={displayLoading}
                  required
                  className="w-full"
                />
              </div>

              {/* 비밀번호 입력 */}
              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={displayLoading}
                  required
                  className="w-full"
                />
              </div>
            </CardContent>

            <div className="flex flex-col space-y-4">
              {/* 로그인 버튼 */}
              <Button
                type="submit"
                disabled={displayLoading}
                className="w-full"
              >
                {displayLoading ? "로그인 중..." : "로그인"}
              </Button>

              {/* 회원가입 링크 */}
              <div className="text-center text-sm text-gray-600">
                아직 계정이 없으신가요?{" "}
                <Link
                  href="/signup"
                  className="font-medium text-blue-600 transition-colors hover:text-blue-500"
                >
                  회원가입
                </Link>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
