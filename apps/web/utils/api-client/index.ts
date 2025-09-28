/**
 * 유니버설 API 클라이언트
 * 환경에 따라 적절한 어댑터를 자동으로 선택
 * - 서버 컴포넌트: KyAdapter (Fetch API 기반)
 * - 클라이언트 컴포넌트: AxiosAdapter 또는 KyAdapter
 */

import { KyAdapter } from "./ky-adapter";
import { ApiClient, ApiClientConfig } from "./types";
import { getEnvironmentToken } from "./auth-adapter";

/**
 * 현재 환경이 브라우저인지 확인
 */
function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/**
 * 환경에 따라 적절한 어댑터를 선택하여 API 클라이언트를 생성
 */
export function createApiClient(
  config: ApiClientConfig,
  preferAxios = true
): ApiClient {
  // 서버 환경에서는 Ky만 사용 가능 (Fetch API 기반)
  if (!isBrowser()) {
    return new KyAdapter(config);
  }

  // 브라우저 환경에서도 Ky 어댑터 사용 (타입 안전성)
  return new KyAdapter(config);
}

/**
 * 기본 API 클라이언트 인스턴스 생성
 */
export function createDefaultApiClient(): ApiClient {
  const baseURL =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "http://ec2-13-209-40-130.ap-northeast-2.compute.amazonaws.com:8080";

  const config: ApiClientConfig = {
    baseURL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
    interceptors: {
      request: async (config) => {
        // 인증 토큰 자동 추가 (NextAuth 세션 우선, fallback으로 로컬 스토리지)
        try {
          const token = await getEnvironmentToken();
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.warn("토큰 가져오기 실패:", error);
        }
        return config;
      },
      response: async (response) => {
        // 응답 로깅 (개발 환경)
        if (process.env.NODE_ENV === "development") {
          console.log(`API Response [${response.status}]:`, {
            url: response.headers["request-url"] || "unknown",
            status: response.status,
            data: response.data,
          });
        }
        return response;
      },
      error: async (error) => {
        // 401 에러 시 자동 로그아웃 처리 (클라이언트에서만)
        if (error.status === 401 && isBrowser()) {
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
          status: error.status,
          data: error.data,
        });

        throw error;
      },
    },
  };

  return createApiClient(config);
}

// 기본 인스턴스 내보내기
export const apiClient = createDefaultApiClient();

// 타입과 어댑터들도 내보내기
export { KyAdapter } from "./ky-adapter";
export * from "./types";

// API 엔드포인트 상수 재내보내기
export { API_ENDPOINTS } from "../../constants/api-endpoints";
