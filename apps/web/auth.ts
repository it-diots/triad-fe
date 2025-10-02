import NextAuth from "next-auth";
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
        console.log("🔍 인증 시작:", {
          email: credentials?.email,
          hasPassword: !!credentials?.password,
        });

        // 자격 증명 유효성 검사
        if (!credentials?.email || !credentials?.password) {
          console.log("❌ 자격 증명 누락");
          return null;
        }

        try {
          // 요청 데이터 검증
          const loginData = LoginRequestSchema.parse({
            email: (credentials.email as string).toLowerCase(),
            password: credentials.password as string,
          });

          console.log("✅ 외부 API 서버로 로그인 요청");

          // 외부 API 서버로 로그인 요청
          const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
            json: loginData,
          });

          const responseData = await response.json();

          const validatedResponse = LoginResponseSchema.parse(responseData);

          console.log("📊 API 응답 결과:", {
            hasUser: !!validatedResponse.user,
            hasTokens: !!validatedResponse.accessToken,
          });

          if (!validatedResponse.user) {
            console.log("❌ 로그인 실패 또는 사용자 정보 없음");
            return null;
          }

          console.log("✅ 인증 성공");

          // 인증 성공 - 사용자 정보와 토큰 반환
          const { user } = validatedResponse;

          return {
            id: user.id,
            email: user.email,
            name:
              `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
              user.username,
            image: user.avatar,
            accessToken: validatedResponse.accessToken,
            refreshToken: validatedResponse.refreshToken,
            expiresIn: validatedResponse.expiresIn,
          };
        } catch (error: unknown) {
          console.error("❌ 인증 오류:", error);

          // API 에러 로깅
          if (isApiError(error)) {
            console.error("API 에러 상세:", {
              status: error.status,
              message: error.data?.message,
              code: error.data?.error?.code,
            });
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
    async jwt({ token, user, account }) {
      // 로그인 시 사용자 정보와 토큰을 JWT에 추가
      if (user && account) {
        token.id = user.id;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.expiresIn = user.expiresIn;
        token.tokenExpiry = Date.now() + user.expiresIn * 1000;
      }

      // 이미 에러가 있거나 tokenExpiry가 0이면 갱신 시도하지 않음 (무한 루프 방지)
      if (token.error || token.tokenExpiry === 0) {
        return token;
      }

      // refreshToken이 없으면 갱신 불가
      if (!token.refreshToken) {
        return token;
      }

      // 토큰 갱신 조건:
      // 1. 만료 5분 전
      // 2. tokenExpiry가 과거인 경우 (백엔드와 불일치)
      const refreshThreshold = 5 * 60 * 1000; // 5분

      const isExpiringSoon =
        token.tokenExpiry &&
        typeof token.tokenExpiry === "number" &&
        Date.now() > token.tokenExpiry - refreshThreshold;

      const isAlreadyExpired =
        token.tokenExpiry &&
        typeof token.tokenExpiry === "number" &&
        Date.now() > token.tokenExpiry;

      const shouldRefresh = isExpiringSoon || isAlreadyExpired;

      if (shouldRefresh) {
        console.log("🔄 토큰 갱신 시도 (만료 전 갱신)");

        try {
          const response = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH, {
            json: { refreshToken: token.refreshToken },
          });

          const responseData = await response.json();
          const refreshedTokens =
            RefreshTokenResponseSchema.parse(responseData);

          // 새로운 refresh token이 있으면 교체, 없으면 기존 유지
          const newRefreshToken =
            refreshedTokens.refreshToken || token.refreshToken;

          token.accessToken = refreshedTokens.accessToken;
          token.refreshToken = newRefreshToken;
          token.expiresIn = refreshedTokens.expiresIn;
          token.tokenExpiry = Date.now() + refreshedTokens.expiresIn * 1000;

          console.log("✅ 토큰 갱신 성공");
        } catch (error) {
          console.error("❌ 토큰 갱신 실패:", error);

          // 에러 타입에 따른 차별화된 처리
          if (isHttpError(error)) {
            if (error.response?.status === 401) {
              // refresh token이 만료된 경우 - 재로그인 필요
              token.error = TOKEN_ERROR_CODES.REFRESH_TOKEN_EXPIRED;
            } else {
              // 네트워크 오류 등 - 재시도 가능
              token.error = TOKEN_ERROR_CODES.REFRESH_TOKEN_ERROR;
            }
          } else {
            token.error = TOKEN_ERROR_CODES.REFRESH_TOKEN_ERROR;
          }

          // 무한 루프 방지: tokenExpiry를 0으로 설정하여 더 이상 갱신 시도 안함
          token.tokenExpiry = 0;

          return token; // null 반환 대신 error flag와 함께 토큰 반환
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token?.error) {
        session.error = token.error;
        return session;
      }

      if (token?.id && typeof token.id === "string") {
        session.user.id = token.id;

        if (typeof token.accessToken === "string") {
          session.accessToken = token.accessToken;
        }
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
