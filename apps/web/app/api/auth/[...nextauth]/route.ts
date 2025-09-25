import { handlers } from "@/auth";

/**
 * Next-Auth API 라우트 핸들러
 * GET, POST 요청을 처리하여 인증 관련 작업을 수행합니다.
 *
 * 지원 기능:
 * - 로그인/로그아웃
 * - 세션 관리
 * - 사용자 인증
 * - JWT 토큰 처리
 */

// GET 요청 핸들러 (세션 확인, 로그인 페이지 등)
export const { GET, POST } = handlers;
