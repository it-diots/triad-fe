import { Route } from "next";
import { type NextRequest, NextResponse } from "next/server";
import type { Session } from "next-auth";

import { auth } from "@/auth";

const publicPaths = ["/", "/login", "/signup", "/home"] as Route[];

/**
 * Next-Auth 미들웨어
 * 인증이 필요한 페이지 접근을 제어합니다.
 */
interface AuthenticatedRequest extends NextRequest {
  auth: Session | null;
}

const middleware = auth((req: AuthenticatedRequest) => {
  const { pathname } = req.nextUrl;

  const isAuthenticated = !!req.auth;

  // 공개 경로 정의
  const isPublicPath = (publicPaths as string[]).includes(pathname);

  // 인증이 필요한 경로에 미인증 사용자가 접근하는 경우
  if (!isAuthenticated && !isPublicPath) {
    const loginUrl = new URL("/home", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // 인증된 사용자가 로그인/회원가입 페이지에 접근하는 경우
  if (isAuthenticated && (pathname === "/login" || pathname === "/signup")) {
    const homeUrl = new URL("/", req.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
});

export default middleware;

export const config = {
  matcher: [
    /*
     * 다음 경로를 제외한 모든 경로에 적용:
     * - API 라우트 (/api)
     * - 정적 파일 (_next/static)
     * - 이미지 파일 (_next/image)
     * - 파비콘 (favicon.ico)
     * - 확장자가 있는 파일 (이미지, 폰트 등)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
