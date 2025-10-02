/**
 * API 엔드포인트 상수
 * prefixUrl과 함께 사용하므로 경로는 슬래시 없이 시작합니다
 */

const API_BASE = "api/v1" as const;

export const API_ENDPOINTS = {
  /**
   * 인증 관련 API 엔드포인트
   */
  AUTH: {
    /** 사용자 로그인 (POST) */
    LOGIN: `${API_BASE}/auth/login`,
    /** 사용자 회원가입 (POST) */
    REGISTER: `${API_BASE}/auth/register`,
    /** 사용자 로그아웃 (POST) */
    LOGOUT: `${API_BASE}/auth/logout`,
    /** 액세스 토큰 갱신 (POST) */
    REFRESH: `${API_BASE}/auth/refresh`,
    /** 현재 로그인한 사용자 프로필 조회/수정 (GET/PUT) */
    PROFILE: `${API_BASE}/auth/profile`,
    /** NextAuth.js 엔드포인트 (절대 경로) */
    NEXT_AUTH: "/api/auth",
  },

  /**
   * 사용자 관리 관련 API 엔드포인트
   */
  USERS: {
    /** 사용자 목록 조회 (GET) */
    LIST: `${API_BASE}/users`,
    /** 새 사용자 생성 (POST) */
    CREATE: `${API_BASE}/users`,
    /** 특정 사용자 조회 (GET) */
    BY_ID: (id: string) => `${API_BASE}/users/${id}`,
    /** 특정 사용자 정보 수정 (PUT/PATCH) */
    UPDATE: (id: string) => `${API_BASE}/users/${id}`,
    /** 특정 사용자 삭제 (DELETE) */
    DELETE: (id: string) => `${API_BASE}/users/${id}`,
  },
} as const;

/**
 * API 엔드포인트 타입
 */
export type ApiEndpoint = typeof API_ENDPOINTS;

/**
 * HTTP 메서드 상수
 */
export const HTTP_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
} as const;

export type HttpMethod = (typeof HTTP_METHODS)[keyof typeof HTTP_METHODS];
