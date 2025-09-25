import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";
import { createAdmin } from "@/utils/supabase/admin";

/**
 * 사용자 프로필 API 엔드포인트
 * 인증된 사용자의 프로필 정보를 조회하고 업데이트합니다.
 */

interface ProfileUpdateRequest {
  name?: string;
  image?: string;
}

/**
 * 프로필 정보 조회 (GET)
 */
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const supabase = createAdmin();

    // 사용자 정보 조회
    const { data: user, error } = await supabase
      .from("users")
      .select("id, name, email, image, created_at, updated_at")
      .eq("id", session.user.id)
      .single();

    if (error) {
      console.error("사용자 정보 조회 오류:", error);
      return NextResponse.json(
        { error: "사용자 정보를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      },
    });
  } catch (error) {
    console.error("프로필 조회 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

/**
 * 프로필 정보 업데이트 (PUT)
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const { name, image }: ProfileUpdateRequest = await request.json();

    // 입력 값 유효성 검사
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: "이름은 필수 입력 항목입니다." },
        { status: 400 }
      );
    }

    if (name.trim().length > 50) {
      return NextResponse.json(
        { error: "이름은 50자를 초과할 수 없습니다." },
        { status: 400 }
      );
    }

    const supabase = createAdmin();

    // 사용자 정보 업데이트
    const { data: updatedUser, error } = await supabase
      .from("users")
      .update({
        name: name.trim(),
        image: image || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", session.user.id)
      .select()
      .single();

    if (error) {
      console.error("프로필 업데이트 오류:", error);
      return NextResponse.json(
        { error: "프로필 업데이트에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "프로필이 성공적으로 업데이트되었습니다.",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        image: updatedUser.image,
        updatedAt: updatedUser.updated_at,
      },
    });
  } catch (error) {
    console.error("프로필 업데이트 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

/**
 * 프로필 삭제 (DELETE) - 계정 삭제
 */
export async function DELETE() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const supabase = createAdmin();

    // 사용자 계정 삭제 (CASCADE 옵션으로 관련 데이터도 함께 삭제)
    const { error } = await supabase
      .from("users")
      .delete()
      .eq("id", session.user.id);

    if (error) {
      console.error("계정 삭제 오류:", error);
      return NextResponse.json(
        { error: "계정 삭제에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "계정이 성공적으로 삭제되었습니다.",
    });
  } catch (error) {
    console.error("계정 삭제 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
