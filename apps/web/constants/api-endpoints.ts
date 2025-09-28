/**
 * API 엔드포인트 상수
 */

const API_BASE = "/api/v1";

export const API_ENDPOINTS = {
  // 인증 관련
  AUTH: {
    LOGIN: `${API_BASE}/auth/login`,
    REGISTER: `${API_BASE}/auth/register`,
    LOGOUT: `${API_BASE}/auth/logout`,
    REFRESH: `${API_BASE}/auth/refresh`,
    PROFILE: `${API_BASE}/auth/profile`,
    NEXT_AUTH: "/api/auth", // NextAuth.js 엔드포인트
  },

  // 사용자 관련
  USERS: {
    LIST: `${API_BASE}/users`,
    CREATE: `${API_BASE}/users`,
    BY_ID: (id: string) => `${API_BASE}/users/${id}`,
    UPDATE: (id: string) => `${API_BASE}/users/${id}`,
    DELETE: (id: string) => `${API_BASE}/users/${id}`,
    PROFILE: `${API_BASE}/auth/profile`, // 현재 사용자 프로필
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
