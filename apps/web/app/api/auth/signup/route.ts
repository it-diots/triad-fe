import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

import { createAdmin } from "@/utils/supabase/admin";

/**
 * 회원가입 API 엔드포인트
 * 새로운 사용자를 등록하고 안전하게 패스워드를 저장합니다.
 */

interface SignupRequest {
  email: string;
  password: string;
  name?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, name }: SignupRequest = await request.json();

    // 입력 값 유효성 검사
    if (!email || !password) {
      return NextResponse.json(
        { error: "이메일과 비밀번호는 필수입니다." },
        { status: 400 }
      );
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "올바른 이메일 형식이 아닙니다." },
        { status: 400 }
      );
    }

    // 패스워드 강도 검증 (최소 8자, 대소문자, 숫자 포함)
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        {
          error:
            "비밀번호는 최소 8자 이상이며, 대문자, 소문자, 숫자를 포함해야 합니다.",
        },
        { status: 400 }
      );
    }

    // Admin 클라이언트로 기존 사용자 확인 (RLS 우회)
    const adminSupabase = createAdmin();
    const { data: existingUser } = await adminSupabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: "이미 사용 중인 이메일입니다." },
        { status: 409 }
      );
    }

    // 패스워드 해싱
    const saltRounds = 12; // 보안을 위해 높은 salt rounds 사용
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Admin 클라이언트로 사용자 생성 (RLS 우회)
    const { data: newUser, error: userError } = await adminSupabase
      .from("users")
      .insert([
        {
          email: email.toLowerCase(), // 이메일 소문자로 정규화
          name: name || null,
          email_verified: null, // 이메일 인증은 추후 구현
          password_hash: passwordHash,
        },
      ])
      .select()
      .single();

    if (userError) {
      console.error("사용자 생성 오류:", userError);
      return NextResponse.json(
        { error: "사용자 생성 중 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    // 성공 응답 (패스워드는 절대 포함하지 않음)
    return NextResponse.json(
      {
        message: "회원가입이 완료되었습니다.",
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("회원가입 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
