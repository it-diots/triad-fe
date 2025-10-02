/**
 * NextAuth 타입 확장
 * 세션과 JWT에 커스텀 필드 추가
 */
import "next-auth";
import "next-auth/jwt";

import type { DefaultSession } from "next-auth";

import type { TokenErrorCode } from "@/constants/auth-errors";
import type { User as ApiUser } from "@/schemas/auth";

declare module "next-auth" {
  /**
   * Session 타입 확장
   * 클라이언트에서 useSession()으로 접근 가능한 세션 데이터
   */
  interface Session extends DefaultSession {
    user: ApiUser & {
      name: string;
      image: string | null;
    };
    accessToken: string;
    error?: TokenErrorCode;
  }

  /**
   * User 타입 확장
   * authorize() 콜백에서 반환하는 사용자 객체
   */
  interface User extends ApiUser {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }
}

declare module "next-auth/jwt" {
  /**
   * JWT 타입 확장
   * JWT 토큰에 저장되는 데이터
   */
  interface JWT {
    // 기본 인증 정보
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenExpiry: number;
    error?: TokenErrorCode;
    // API User 정보 (백엔드로부터 받은 전체 사용자 정보)
    userInfo?: ApiUser;
  }
}
