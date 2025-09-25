import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // createServerClient와 supabase.auth.getUser() 사이에 코드를 실행하지 마세요.
  // 간단한 실수로도 사용자가 무작위로 로그아웃되는 문제를 디버깅하기 매우 어려워질 수 있습니다.

  // 중요: auth.getUser()를 제거하지 마세요

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (
    !user &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/signup") &&
    !request.nextUrl.pathname.startsWith("/auth") &&
    !request.nextUrl.pathname.startsWith("/error")
  ) {
    // 사용자가 없는 경우, 로그인 페이지로 리다이렉트
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 중요: supabaseResponse 객체를 그대로 반환해야 합니다.
  // NextResponse.next()로 새 응답 객체를 생성하는 경우 다음을 확인하세요:
  // 1. 요청을 전달하세요:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. 쿠키를 복사하세요:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. 필요에 따라 myNewResponse 객체를 변경하되, 쿠키는 변경하지 마세요!
  // 4. 마지막으로:
  //    return myNewResponse
  // 이를 수행하지 않으면 브라우저와 서버가 동기화되지 않아
  // 사용자 세션이 조기에 종료될 수 있습니다!

  return supabaseResponse;
}
