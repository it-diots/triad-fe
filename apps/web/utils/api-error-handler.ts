import { ZodError } from "zod";

import { type ApiErrorData, ErrorResponseSchema } from "@/schemas/common";

import { formatZodError } from "./zod-helpers";

export interface ApiError {
  status: number;
  data?: {
    message?: string;
    error?: string | { code?: string; details?: unknown };
    statusCode?: number;
  };
}

export interface KyHttpError {
  name: string;
  response?: Response;
  request?: Request;
  message: string;
}

export interface ApiErrorHandlerOptions {
  defaultMessage?: string;
  defaultErrorCode?: string;
  logError?: boolean;
}

/**
 * API 응답 처리를 위한 공통 유틸리티
 * 성공 및 에러 응답을 표준화된 형식으로 생성
 *
 * @example
 * ```typescript
 * import { ApiResponseHandler } from '@/utils/api-error-handler';
 *
 * // 성공 응답
 * const users = await getUsers();
 * return ApiResponseHandler.success(users);
 *
 * // 에러 응답
 * try {
 *   const data = await riskyOperation();
 *   return ApiResponseHandler.success(data);
 * } catch (error) {
 *   return ApiResponseHandler.error(error, {
 *     defaultMessage: '작업 실패',
 *     defaultErrorCode: 'OPERATION_FAILED'
 *   });
 * }
 * ```
 */
export class ApiResponseHandler {
  /**
   * 성공 응답을 생성합니다
   *
   * @param data - 응답에 포함할 데이터
   * @param status - HTTP 상태 코드 (기본값: 200)
   * @returns JSON 응답 객체
   *
   * @example
   * ```typescript
   * // 기본 성공 응답
   * return ApiResponseHandler.success({ message: '성공' });
   *
   * // 생성 성공 응답 (201)
   * return ApiResponseHandler.success(newUser, 201);
   *
   * // 사용자 목록 응답
   * const users = await getUserList();
   * return ApiResponseHandler.success(users);
   * ```
   */
  static success<T>(data: T, status = 200): Response {
    return Response.json(data, {
      status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  /**
   * 에러 응답을 생성합니다
   * 다양한 에러 유형에 따라 적절한 에러 응답을 생성
   *
   * @param error - 처리할 에러 객체
   * @param options - 에러 처리 옵션
   * @returns 표준화된 에러 응답
   *
   * @example
   * ```typescript
   * import { ZodError } from 'zod';
   * import { ApiResponseHandler } from '@/utils/api-error-handler';
   *
   * // Zod 검증 에러
   * try {
   *   userSchema.parse(invalidData);
   * } catch (error) {
   *   if (error instanceof ZodError) {
   *     return ApiResponseHandler.error(error); // 400 + 사용자 친화적 메시지
   *   }
   * }
   *
   * // HTTP 에러
   * try {
   *   await externalApiCall();
   * } catch (httpError) {
   *   return ApiResponseHandler.error(httpError, {
   *     defaultMessage: '외부 API 호출 실패',
   *     defaultErrorCode: 'EXTERNAL_API_ERROR'
   *   });
   * }
   *
   * // 일반 에러
   * try {
   *   await databaseOperation();
   * } catch (error) {
   *   return ApiResponseHandler.error(error, {
   *     defaultMessage: '데이터베이스 오류가 발생했습니다.',
   *     logError: true
   *   });
   * }
   * ```
   */
  static async error(
    error: unknown,
    options: ApiErrorHandlerOptions = {}
  ): Promise<Response> {
    const {
      defaultMessage = "서버 오류가 발생했습니다.",
      defaultErrorCode = "INTERNAL_SERVER_ERROR",
      logError = true,
    } = options;

    if (logError) {
      console.error("API 오류:", error);
    }

    // Zod 검증 에러 처리 - 개선된 메시지 사용
    if (error instanceof ZodError) {
      const userFriendlyMessage = formatZodError(error);

      const errorResponse = {
        success: false,
        message: userFriendlyMessage,
        error: {
          code: "VALIDATION_ERROR",
          details: error.errors,
        },
      };

      const validatedError = ErrorResponseSchema.parse(errorResponse);
      return Response.json(validatedError, {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // Ky HTTPError 처리
    if (this.isKyHttpError(error)) {
      const status = error.response?.status || 500;
      let errorMessage = defaultMessage;
      let errorCode = defaultErrorCode;

      try {
        if (error.response) {
          const errorData = (await error.response
            .clone()
            .json()) as ApiErrorData;
          errorMessage = errorData.message || errorMessage;
          errorCode = errorData.error?.code || errorCode;
        }
      } catch {
        // JSON 파싱 실패 시 기본값 사용
      }

      const errorResponse = {
        success: false,
        message: errorMessage,
        error: { code: errorCode },
      };

      const validatedError = ErrorResponseSchema.parse(errorResponse);
      return Response.json(validatedError, {
        status,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // 기존 API 클라이언트 에러 처리 (호환성)
    if (this.isApiError(error)) {
      const errorResponse = {
        success: false,
        message: this.getErrorMessage(error, defaultMessage),
        error: this.getErrorDetails(error, defaultErrorCode),
      };

      const validatedError = ErrorResponseSchema.parse(errorResponse);
      return Response.json(validatedError, {
        status: error.status,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // 예상하지 못한 에러
    const serverError = {
      success: false,
      message: defaultMessage,
      error: {
        code: defaultErrorCode,
      },
    };

    const validatedError = ErrorResponseSchema.parse(serverError);
    return Response.json(validatedError, {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  /**
   * 주어진 에러가 Ky HTTPError인지 확인합니다
   */
  private static isKyHttpError(error: unknown): error is KyHttpError {
    return (
      error !== null &&
      typeof error === "object" &&
      "response" in error &&
      "name" in error &&
      typeof (error as { name: unknown }).name === "string" &&
      (error as { name: string }).name === "HTTPError"
    );
  }

  /**
   * 주어진 에러가 API 에러인지 확인합니다
   */
  private static isApiError(error: unknown): error is ApiError {
    return (
      error !== null &&
      typeof error === "object" &&
      "status" in error &&
      typeof (error as { status: unknown }).status === "number"
    );
  }

  /**
   * API 에러에서 메시지를 추출합니다
   */
  private static getErrorMessage(
    error: ApiError,
    defaultMessage: string
  ): string {
    return error.data?.message || defaultMessage;
  }

  /**
   * API 에러에서 에러 상세 정보를 추출합니다
   */
  private static getErrorDetails(error: ApiError, defaultErrorCode: string) {
    const errorData = error.data?.error;

    if (typeof errorData === "string") {
      return {
        code: errorData,
      };
    }

    if (typeof errorData === "object" && errorData !== null) {
      return {
        code: errorData.code || defaultErrorCode,
        details: errorData.details,
      };
    }

    return {
      code: defaultErrorCode,
    };
  }
}

/**
 * API 라우트 핸들러를 감싸는 HOC
 * 자동으로 에러를 잡아서 표준화된 에러 응답으로 변환
 *
 * @param handler - 래핑할 API 라우트 핸들러 함수
 * @param options - 에러 처리 옵션
 * @returns 에러 처리가 적용된 핸들러 함수
 *
 * @example
 * ```typescript
 * import { withErrorHandler, ErrorHandlers } from '@/utils/api-error-handler';
 * import { userSchema } from '@/schemas/users';
 *
 * // 기본 사용법
 * const getUserHandler = async (request: Request): Promise<Response> => {
 *   const { searchParams } = new URL(request.url);
 *   const userId = searchParams.get('id');
 *
 *   if (!userId) {
 *     throw new Error('사용자 ID가 필요합니다');
 *   }
 *
 *   const user = await getUserById(userId);
 *   return ApiResponseHandler.success(user);
 * };
 *
 * // 자동 에러 처리 적용
 * export const GET = withErrorHandler(getUserHandler, ErrorHandlers.users);
 *
 * // 커스텀 에러 처리
 * export const POST = withErrorHandler(createUserHandler, {
 *   defaultMessage: '사용자 생성 실패',
 *   defaultErrorCode: 'USER_CREATION_FAILED',
 *   logError: true
 * });
 * ```
 */
export function withErrorHandler<T extends unknown[]>(
  handler: (...args: T) => Promise<Response>,
  options?: ApiErrorHandlerOptions
) {
  return async (...args: T): Promise<Response> => {
    try {
      return await handler(...args);
    } catch (error) {
      return ApiResponseHandler.error(error, options);
    }
  };
}

/**
 * 특정 에러 코드에 대한 사전 정의된 핸들러
 */
export const ErrorHandlers = {
  users: {
    defaultMessage: "사용자 관련 작업 중 오류가 발생했습니다.",
    defaultErrorCode: "USERS_ERROR",
  },
  auth: {
    defaultMessage: "인증 관련 작업 중 오류가 발생했습니다.",
    defaultErrorCode: "AUTH_ERROR",
  },
} as const;
