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
 * 회원가입 페이지
 * shadcn-ui 컴포넌트를 활용한 사용자 등록 폼
 */
export default function SignupPage() {
  const router = useRouter();
  const { signup, isLoading, error, clearError } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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
   * 폼 유효성 검사
   */
  const validateForm = () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      return "모든 필드를 입력해주세요.";
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return "올바른 이메일 형식이 아닙니다.";
    }

    // 패스워드 강도 검증
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      return "비밀번호는 최소 8자 이상이며, 대문자, 소문자, 숫자를 포함해야 합니다.";
    }

    // 패스워드 확인
    if (formData.password !== formData.confirmPassword) {
      return "비밀번호가 일치하지 않습니다.";
    }

    return null;
  };

  /**
   * 회원가입 폼 제출 핸들러
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 폼 유효성 검사
    const validationError = validateForm();
    if (validationError) {
      setFormState((prev) => ({
        ...prev,
        error: validationError,
      }));
      return;
    }

    setFormState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (result.success) {
        // 회원가입 성공 후 자동으로 로그인되고 홈으로 리다이렉트됨
        setFormState((prev) => ({
          ...prev,
          success: "회원가입이 완료되었습니다. 자동으로 로그인됩니다.",
        }));

        // 명시적으로 메인 페이지로 리다이렉트
        setTimeout(() => {
          router.push("/" as Route);
        }, 1500);
      } else {
        setFormState((prev) => ({
          ...prev,
          error: result.error || "회원가입에 실패했습니다.",
        }));
      }
    } catch {
      setFormState((prev) => ({
        ...prev,
        error: "회원가입 중 오류가 발생했습니다.",
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

        {/* 회원가입 카드 */}
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold">회원가입</CardTitle>
            <div>새 계정을 만들어 Triad를 시작하세요</div>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {/* 성공 메시지 표시 */}
              {formState.success && (
                <div className="rounded-md border border-green-200 bg-green-50 p-3">
                  <p className="text-sm text-green-600">{formState.success}</p>
                </div>
              )}

              {/* 에러 메시지 표시 */}
              {displayError && (
                <div className="rounded-md border border-red-200 bg-red-50 p-3">
                  <p className="text-sm text-red-600">{displayError}</p>
                </div>
              )}

              {/* 이름 입력 */}
              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="홍길동"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={displayLoading}
                  required
                  className="w-full"
                />
              </div>

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
                <p className="text-xs text-gray-500">
                  8자 이상, 대소문자, 숫자 포함
                </p>
              </div>

              {/* 비밀번호 확인 입력 */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="비밀번호를 다시 입력하세요"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  disabled={displayLoading}
                  required
                  className="w-full"
                />
              </div>
            </CardContent>

            <div className="flex flex-col space-y-4">
              {/* 회원가입 버튼 */}
              <Button
                type="submit"
                disabled={displayLoading}
                className="w-full"
              >
                {displayLoading ? "회원가입 중..." : "회원가입"}
              </Button>

              {/* 로그인 링크 */}
              <div className="text-center text-sm text-gray-600">
                이미 계정이 있으신가요?{" "}
                <Link
                  href="/login"
                  className="font-medium text-blue-600 transition-colors hover:text-blue-500"
                >
                  로그인
                </Link>
              </div>
            </div>
          </form>
        </Card>

        {/* 추가 정보 */}
        <div className="text-center text-xs text-gray-500">
          회원가입하면{" "}
          <Link href="#" className="underline hover:text-gray-700">
            이용약관
          </Link>{" "}
          및{" "}
          <Link href="#" className="underline hover:text-gray-700">
            개인정보처리방침
          </Link>
          에 동의하는 것으로 간주됩니다.
        </div>
      </div>
    </div>
  );
}
