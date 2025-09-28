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
import { GetUserProfileResponseSchema } from "@/schemas/users";
import { API_ENDPOINTS, apiClient } from "@/utils/api-client";
import { setServerToken } from "@/utils/api-client/auth-adapter";

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

          // 응답 데이터 검증 (실제 API 응답 구조)
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

      // 토큰 만료 전 미리 갱신 (5분 여유)
      const refreshThreshold = 5 * 60 * 1000; // 5분
      const shouldRefresh =
        token.tokenExpiry &&
        typeof token.tokenExpiry === "number" &&
        Date.now() > token.tokenExpiry - refreshThreshold;

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

          return token; // null 반환 대신 error flag와 함께 토큰 반환
        }
      }

      return token;
    },

    async session({ session, token }) {
      // 토큰 에러 상태 확인
      if (token?.error) {
        session.error = token.error;
        return session;
      }

      // 세션에 사용자 정보와 토큰 추가
      if (token?.id && typeof token.id === "string") {
        session.user.id = token.id;

        if (typeof token.accessToken === "string") {
          session.accessToken = token.accessToken;

          // 외부 API에서 최신 사용자 정보 가져오기
          try {
            // 서버 환경에서 토큰 설정
            setServerToken(token.accessToken);
            const response = await apiClient.get(API_ENDPOINTS.AUTH.PROFILE);

            const responseData = await response.json();
            const validatedResponse =
              GetUserProfileResponseSchema.parse(responseData);
            const userData = validatedResponse.data;

            if (userData) {
              session.user = {
                ...session.user,
                id: userData.id,
                email: userData.email,
                name:
                  `${userData.firstName || ""} ${userData.lastName || ""}`.trim() ||
                  userData.username,
                image: userData.avatar,
              };
            }
          } catch (error) {
            console.error("세션 업데이트 중 사용자 정보 조회 오류:", error);
            // 사용자 정보 조회 실패해도 기존 세션 정보는 유지
          }
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
