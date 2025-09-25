"use client";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@triad/ui";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuth } from "@/hooks/use-auth";
import type { FormState } from "@/types/auth";

/**
 * 사용자 프로필 관리 페이지
 * 인증된 사용자만 접근 가능한 보호된 페이지
 */
export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, isAuthenticated, isLoading, refreshSession } = useAuth();

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
  });

  const [formState, setFormState] = useState<FormState>({
    isLoading: false,
    error: null,
    success: null,
  });

  /**
   * 컴포넌트 마운트 시 사용자 데이터 설정
   */
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  /**
   * 폼 입력 값 변경 핸들러
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 에러/성공 메시지 초기화
    if (formState.error || formState.success) {
      setFormState((prev) => ({ ...prev, error: null, success: null }));
    }
  };

  /**
   * 프로필 업데이트 처리
   */
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profileData.name || !profileData.email) {
      setFormState((prev) => ({
        ...prev,
        error: "이름과 이메일을 모두 입력해주세요.",
      }));
      return;
    }

    setFormState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: profileData.name,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "프로필 업데이트에 실패했습니다.");
      }

      setFormState((prev) => ({
        ...prev,
        success: "프로필이 성공적으로 업데이트되었습니다.",
      }));

      // 세션 새로고침하여 업데이트된 사용자 정보 반영
      await refreshSession();
    } catch (error) {
      setFormState((prev) => ({
        ...prev,
        error:
          error instanceof Error
            ? error.message
            : "프로필 업데이트 중 오류가 발생했습니다.",
      }));
    } finally {
      setFormState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  /**
   * 로그아웃 처리
   */
  const handleLogout = async () => {
    await logout();
  };

  // 로딩 중이거나 인증되지 않은 경우
  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">
            {isLoading ? "로딩 중..." : "인증 확인 중..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* 페이지 헤더 */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            프로필
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            계정 정보를 관리하고 설정을 변경하세요
          </p>
        </div>

        {/* 프로필 정보 카드 */}
        <Card>
          <CardHeader>
            <CardTitle>기본 정보</CardTitle>
            <CardDescription>사용자 정보를 수정할 수 있습니다</CardDescription>
          </CardHeader>

          <form onSubmit={handleProfileUpdate}>
            <CardContent className="space-y-4">
              {/* 성공 메시지 */}
              {formState.success && (
                <div className="rounded-md border border-green-200 bg-green-50 p-3">
                  <p className="text-sm text-green-600">{formState.success}</p>
                </div>
              )}

              {/* 에러 메시지 */}
              {formState.error && (
                <div className="rounded-md border border-red-200 bg-red-50 p-3">
                  <p className="text-sm text-red-600">{formState.error}</p>
                </div>
              )}

              {/* 이름 입력 */}
              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={profileData.name}
                  onChange={handleInputChange}
                  disabled={formState.isLoading}
                  className="w-full"
                  placeholder="이름을 입력하세요"
                />
              </div>

              {/* 이메일 표시 (읽기 전용) */}
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={profileData.email}
                  disabled
                  className="w-full bg-gray-50"
                  placeholder="이메일 주소"
                />
                <p className="text-xs text-gray-500">
                  이메일 주소는 변경할 수 없습니다
                </p>
              </div>
            </CardContent>

            <CardFooter>
              <Button
                type="submit"
                disabled={formState.isLoading}
                className="w-full"
              >
                {formState.isLoading ? "업데이트 중..." : "프로필 업데이트"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* 계정 관리 카드 */}
        <Card>
          <CardHeader>
            <CardTitle>계정 관리</CardTitle>
            <CardDescription>
              계정 관련 작업을 수행할 수 있습니다
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* 사용자 정보 요약 */}
            <div className="rounded-lg bg-gray-50 p-4">
              <h3 className="font-medium text-gray-900">계정 정보</h3>
              <div className="mt-2 space-y-1 text-sm text-gray-600">
                <p>이름: {user?.name || "설정되지 않음"}</p>
                <p>이메일: {user?.email}</p>
                <p>계정 ID: {user?.id}</p>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="w-full sm:w-auto"
            >
              홈으로 돌아가기
            </Button>

            <Button
              variant="destructive"
              onClick={handleLogout}
              className="w-full sm:w-auto"
            >
              로그아웃
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
