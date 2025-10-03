import NextAuth from "next-auth";
import type { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";

import {
  isApiError,
  isHttpError,
  TOKEN_ERROR_CODES,
} from "@/constants/auth-errors";
import {
  LoginRequestSchema,
  LoginResponseSchema,
  RefreshTokenResponseSchema,
} from "@/schemas/auth";
import { API_ENDPOINTS, apiClient } from "@/utils/api-client";

/**
 * Next-Auth v5 설정
 * 이메일/패스워드 기반 인증을 위한 Credentials 프로바이더를 사용합니다.
 * JWT 세션을 사용하여 외부 API 서버와 통신합니다.
 */
const nextAuth = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: {
          label: "이메일",
          type: "email",
          placeholder: "your-email@example.com",
        },
        password: {
          label: "비밀번호",
          type: "password",
        },
      },
      async authorize(credentials) {
        // 자격 증명 유효성 검사
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // 요청 데이터 검증 및 로그인
          const loginData = LoginRequestSchema.parse({
            email: (credentials.email as string).toLowerCase(),
            password: credentials.password as string,
          });

          const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
            json: loginData,
          });

          const validatedResponse = LoginResponseSchema.parse(
            await response.json()
          );

          if (!validatedResponse.user) {
            return null;
          }

          // 인증 성공 - API User 정보와 토큰 반환
          return {
            ...validatedResponse.user,
            accessToken: validatedResponse.accessToken,
            refreshToken: validatedResponse.refreshToken,
            expiresIn: validatedResponse.expiresIn,
          };
        } catch (error: unknown) {
          // 개발 환경에서만 에러 상세 로깅
          if (process.env.NODE_ENV === "development") {
            console.error("❌ 인증 오류:", error);
            if (isApiError(error)) {
              console.error("API 에러 상세:", {
                status: error.status,
                message: error.data?.message,
                code: error.data?.error?.code,
              });
            }
          }
          return null;
        }
      },
    }),
  ],

  // 세션 전략 설정
  session: {
    strategy: "jwt", // JWT 기반 세션 사용
    maxAge: 30 * 24 * 60 * 60, // 30일
  },

  // 콜백 함수 설정
  callbacks: {
    async jwt({ token, user, account }): Promise<JWT> {
      // 초기 로그인 시: user 객체의 모든 정보를 JWT에 저장
      if (account) {
        // 토큰 필드를 제외한 사용자 정보 추출
        const {
          accessToken: _accessToken,
          refreshToken: _refreshToken,
          expiresIn: _expiresIn,
          ...apiUser
        } = user;

        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          expiresIn: user.expiresIn,
          tokenExpiry: Date.now() + user.expiresIn * 1000,
          userInfo: apiUser,
        } as JWT;
      }

      // 토큰 갱신 로직
      // 에러가 있거나 refreshToken이 없으면 갱신 불가
      if (token.error || !token.refreshToken) {
        return token;
      }

      // 토큰 만료 체크 (5분 전에 갱신 시도)
      const refreshThreshold = 5 * 60 * 1000; // 5분
      const shouldRefresh =
        token.tokenExpiry &&
        Date.now() > (token.tokenExpiry as number) - refreshThreshold;

      if (shouldRefresh) {
        try {
          const response = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH, {
            json: { refreshToken: token.refreshToken },
          });

          const refreshedTokens = RefreshTokenResponseSchema.parse(
            await response.json()
          );

          // 갱신된 토큰으로 업데이트
          return {
            ...token,
            accessToken: refreshedTokens.accessToken,
            refreshToken: refreshedTokens.refreshToken || token.refreshToken,
            expiresIn: refreshedTokens.expiresIn,
            tokenExpiry: Date.now() + refreshedTokens.expiresIn * 1000,
          } as JWT;
        } catch (error) {
          // 개발 환경에서만 에러 로깅
          if (process.env.NODE_ENV === "development") {
            console.error("❌ 토큰 갱신 실패:", error);
          }

          // 에러 타입에 따른 차별화된 처리
          const errorCode =
            isHttpError(error) && error.response?.status === 401
              ? TOKEN_ERROR_CODES.REFRESH_TOKEN_EXPIRED
              : TOKEN_ERROR_CODES.REFRESH_TOKEN_ERROR;

          // 에러 상태로 반환 (재로그인 유도)
          return { ...token, error: errorCode } as JWT;
        }
      }

      return token;
    },

    async session({ session, token }) {
      // 에러 전파
      if (token.error) {
        session.error = token.error;
      }

      // accessToken 추가
      if (token.accessToken) {
        session.accessToken = token.accessToken;
      }

      // User 정보 추가
      if (token.userInfo) {
        session.user = {
          ...token.userInfo,
          name:
            `${token.userInfo.firstName || ""} ${token.userInfo.lastName || ""}`.trim() ||
            token.userInfo.username,
          image: token.userInfo.avatar,
        } as typeof session.user;
      }

      return session;
    },
  },

  // 페이지 경로 설정
  pages: {
    signIn: "/login", // 로그인 페이지
  },

  // 디버그 설정 (개발 환경에서만)
  debug: process.env.NODE_ENV === "development",
});

export const { handlers, auth, signIn, signOut } = nextAuth;
