import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { LoginRequestSchema, LoginResponseSchema } from "@/schemas/auth";
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
          const response = await apiClient.post(
            API_ENDPOINTS.AUTH.LOGIN,
            loginData
          );

          // 응답 데이터 검증 (실제 API 응답 구조)
          const validatedResponse = LoginResponseSchema.parse(response.data);

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
          if (error && typeof error === "object" && "status" in error) {
            const apiError = error as {
              status: number;
              data?: { message?: string; error?: { code?: string } };
            };
            console.error("API 에러 상세:", {
              status: apiError.status,
              message: apiError.data?.message,
              code: apiError.data?.error?.code,
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

      // 토큰 만료 확인 및 갱신
      if (token.tokenExpiry && Date.now() > (token.tokenExpiry as number)) {
        console.log("🔄 토큰 만료, 갱신 시도");

        try {
          const response = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH, {
            refreshToken: token.refreshToken,
          });

          const refreshedTokens = response.data as {
            accessToken: string;
            refreshToken: string;
            expiresIn: number;
          };

          token.accessToken = refreshedTokens.accessToken;
          token.refreshToken = refreshedTokens.refreshToken;
          token.expiresIn = refreshedTokens.expiresIn;
          token.tokenExpiry = Date.now() + refreshedTokens.expiresIn * 1000;

          console.log("✅ 토큰 갱신 성공");
        } catch (error) {
          console.error("❌ 토큰 갱신 실패:", error);
          // 토큰 갱신 실패 시 로그아웃 처리
          return null;
        }
      }

      return token;
    },

    async session({ session, token }) {
      // 세션에 사용자 정보와 토큰 추가
      if (token?.id) {
        session.user.id = token.id as string;
        session.accessToken = token.accessToken as string;

        // 외부 API에서 최신 사용자 정보 가져오기
        try {
          // 서버 환경에서 토큰 설정
          setServerToken(token.accessToken as string);
          const response = await apiClient.get(API_ENDPOINTS.AUTH.PROFILE);

          const userData = response.data as {
            id: string;
            email: string;
            username: string;
            firstName?: string;
            lastName?: string;
            avatar?: string;
          };

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
