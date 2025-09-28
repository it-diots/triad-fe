/**
 * NextAuth 타입 확장
 * 세션과 JWT에 커스텀 필드 추가
 */

import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
    };
    accessToken: string;
    // 에러 상태 타입 추가
    error?: "RefreshTokenError" | "RefreshTokenExpired";
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenExpiry: number;
    // JWT 레벨에서도 에러 상태 관리
    error?: "RefreshTokenError" | "RefreshTokenExpired";
  }
}
