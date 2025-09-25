"use client";

import { Button } from "@triad/ui";
import Link from "next/link";

import { useAuth } from "@/hooks/use-auth";

/**
 * 홈 페이지
 * 인증 상태에 따라 다른 콘텐츠를 표시합니다.
 */
export default function HomePage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 헤더 */}
      <header className="border-b border-white/20 bg-white/10 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Triad</h1>
            </div>

            <nav className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-gray-700">
                    안녕하세요, {user?.name || user?.email}님!
                  </span>
                  <Link href="/profile">
                    <Button variant="outline" size="sm">
                      프로필
                    </Button>
                  </Link>
                  <Button variant="destructive" size="sm" onClick={logout}>
                    로그아웃
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="outline">로그인</Button>
                  </Link>
                  <Link href="/signup">
                    <Button>회원가입</Button>
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>
    </div>
  );
}
