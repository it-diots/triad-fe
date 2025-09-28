/**
 * Ky 기반 API 클라이언트 어댑터
 * 서버 컴포넌트와 클라이언트 컴포넌트 모두에서 사용 가능
 * Fetch API 기반으로 동작
 */

import ky, { type KyInstance, type Options } from "ky";

import {
  ApiClient,
  ApiClientConfig,
  ApiError,
  ApiResponse,
  RequestConfig,
} from "./types";

export class KyAdapter implements ApiClient {
  private client: KyInstance;

  constructor(config: ApiClientConfig) {
    const kyOptions: Options = {
      prefixUrl: config.baseURL,
      timeout: config.timeout || 10000,
      headers: config.headers || {},
      hooks: {},
      retry: {
        limit: 2,
        methods: ["get", "put", "head", "delete", "options", "trace"],
        statusCodes: [408, 413, 429, 500, 502, 503, 504],
      },
    };

    // 요청 인터셉터 설정
    if (config.interceptors?.request) {
      kyOptions.hooks!.beforeRequest = [
        async (request) => {
          const url = new URL(request.url);
          const requestConfig: RequestConfig = {
            headers: Object.fromEntries(request.headers.entries()),
            params: Object.fromEntries(url.searchParams.entries()),
          };

          const modifiedConfig =
            await config.interceptors!.request!(requestConfig);

          // 헤더 업데이트
          if (modifiedConfig.headers) {
            Object.entries(modifiedConfig.headers).forEach(([key, value]) => {
              request.headers.set(key, value);
            });
          }

          // 쿼리 파라미터 업데이트
          if (modifiedConfig.params) {
            Object.entries(modifiedConfig.params).forEach(([key, value]) => {
              url.searchParams.set(key, String(value));
            });
          }
        },
      ];
    }

    // 응답 인터셉터 설정
    if (config.interceptors?.response) {
      kyOptions.hooks!.afterResponse = [
        async (request, options, response) => {
          const apiResponse: ApiResponse = {
            data: await response
              .clone()
              .json()
              .catch(() => response.clone().text()),
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries()),
          };

          await config.interceptors!.response!(apiResponse);
          return response;
        },
      ];
    }

    // 에러 인터셉터 설정
    if (config.interceptors?.error) {
      kyOptions.hooks!.beforeError = [
        async (error) => {
          const apiError: ApiError = {
            message: error.message,
            status: error.response?.status,
            data: error.response
              ? await error.response.json().catch(() => null)
              : null,
          };

          return config.interceptors!.error!(apiError);
        },
      ];
    }

    this.client = ky.create(kyOptions);
  }

  private async handleRequest<T>(
    method: string,
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const options: Options = {
        method: method as "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
        signal: config?.signal,
        timeout: config?.timeout,
      };

      if (config?.headers) {
        options.headers = { ...options.headers, ...config.headers };
      }

      if (config?.params) {
        options.searchParams = config.params;
      }

      if (data !== undefined) {
        if (data instanceof FormData) {
          options.body = data;
        } else if (typeof data === "object" && data !== null) {
          options.json = data;
        } else if (typeof data === "string") {
          options.body = data;
        }
      }

      const response = await this.client(url, options);

      const responseData = await response.json<T>().catch(async () => {
        const text = await response.text();
        return text as T;
      });

      return {
        data: responseData,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      };
    } catch (error: unknown) {
      throw this.transformError(error);
    }
  }

  private transformError(error: unknown): ApiError {
    if (error && typeof error === "object" && "response" in error) {
      const httpError = error as {
        message?: string;
        response?: { status?: number; body?: unknown };
      };
      return {
        message: httpError.message || "Request failed",
        status: httpError.response?.status,
        data: httpError.response?.body || null,
      };
    }

    if (error && typeof error === "object" && "message" in error) {
      return {
        message: (error as { message: string }).message || "Network error",
        status: 0,
      };
    }

    return {
      message: "Unknown error",
      status: 0,
    };
  }

  async get<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.handleRequest<T>("GET", url, undefined, config);
  }

  async post<T>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.handleRequest<T>("POST", url, data, config);
  }

  async put<T>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.handleRequest<T>("PUT", url, data, config);
  }

  async patch<T>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.handleRequest<T>("PATCH", url, data, config);
  }

  async delete<T>(
    url: string,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.handleRequest<T>("DELETE", url, undefined, config);
  }
}
