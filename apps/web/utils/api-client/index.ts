/**
 * Ky 기반 API 클라이언트
 * NextAuth 세션과 연동하여 자동 인증 처리
 */

import ky, { type KyInstance } from "ky";

import { getEnvironmentToken } from "./auth-adapter";

/**
 * 기본 API 클라이언트 인스턴스 생성
 */
export function createApiClient(): KyInstance {
  const baseURL =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "http://ec2-13-209-40-130.ap-northeast-2.compute.amazonaws.com:8080";

  return ky.create({
    prefixUrl: baseURL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
    retry: {
      limit: 2,
      methods: ["get", "put", "head", "delete", "options", "trace"],
      statusCodes: [408, 413, 429, 500, 502, 503, 504],
    },
    hooks: {
      beforeRequest: [
        async (request) => {
          // NextAuth 세션 또는 로컬 스토리지에서 토큰 자동 추가
          try {
            const token = await getEnvironmentToken();
            if (token) {
              request.headers.set("Authorization", `Bearer ${token}`);
            }
          } catch (error) {
            console.warn("토큰 가져오기 실패:", error);
          }
        },
      ],
      afterResponse: [
        (_request, _options, response) => {
          // 개발 환경에서 응답 로깅
          if (process.env.NODE_ENV === "development") {
            console.log(`API Response [${response.status}]:`, {
              url: response.url,
              status: response.status,
            });
          }
          return response;
        },
      ],
      beforeError: [
        (error) => {
          // 401 에러 시 자동 로그아웃 처리 (브라우저에서만)
          if (error.response?.status === 401 && typeof window !== "undefined") {
            localStorage.removeItem("auth-token");
            sessionStorage.removeItem("auth-token");

            // 현재 페이지가 로그인 페이지가 아니면 리다이렉트
            if (!window.location.pathname.includes("/login")) {
              window.location.href = "/login";
            }
          }

          // 에러 로깅
          console.error("API Error:", {
            message: error.message,
            status: error.response?.status,
            url: error.request?.url,
          });

          return error;
        },
      ],
    },
  });
}

// 기본 인스턴스 내보내기
export const apiClient = createApiClient();

// API 엔드포인트 상수 재내보내기
export { API_ENDPOINTS } from "../../constants/api-endpoints";
