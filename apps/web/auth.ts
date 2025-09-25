import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { createAdmin } from "@/utils/supabase/admin";

/**
 * Next-Auth v5 설정
 * 이메일/패스워드 기반 인증을 위한 Credentials 프로바이더를 사용합니다.
 * JWT 세션을 사용하여 Supabase 데이터베이스와 직접 연동합니다.
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
          const supabase = createAdmin();
          console.log("✅ Supabase Admin 클라이언트 생성 완료");

          // 사용자 정보 조회 (password_hash 포함)
          const { data: user, error: queryError } = await supabase
            .from("users")
            .select("id, email, name, image, password_hash")
            .eq("email", (credentials.email as string).toLowerCase())
            .single();

          console.log("📊 데이터베이스 쿼리 결과:", {
            user: user
              ? {
                  id: user.id,
                  email: user.email,
                  hasPasswordHash: !!user.password_hash,
                }
              : null,
            error: queryError,
          });

          if (!user || !user.password_hash) {
            console.log("❌ 사용자를 찾을 수 없거나 패스워드 해시가 없음");
            return null;
          }

          // 패스워드 검증
          console.log("🔐 패스워드 검증 시작");
          const isValidPassword = await bcrypt.compare(
            credentials.password as string,
            user.password_hash
          );

          console.log("🔐 패스워드 검증 결과:", isValidPassword);

          if (!isValidPassword) {
            console.log("❌ 패스워드 불일치");
            return null;
          }

          console.log("✅ 인증 성공");
          // 인증 성공 - 사용자 정보 반환
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } catch (error) {
          console.error("❌ 인증 오류:", error);
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
    async jwt({ token, user }) {
      // 로그인 시 사용자 정보를 토큰에 추가
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      // 세션에 사용자 ID 추가
      if (token?.id) {
        session.user.id = token.id as string;

        // 데이터베이스에서 최신 사용자 정보 가져오기
        try {
          const supabase = createAdmin();
          const { data: user } = await supabase
            .from("users")
            .select("id, email, name, image")
            .eq("id", token.id as string)
            .single();

          if (user) {
            session.user = {
              ...session.user,
              id: user.id,
              email: user.email,
              name: user.name,
              image: user.image,
            };
          }
        } catch (error) {
          console.error("세션 업데이트 중 사용자 정보 조회 오류:", error);
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
