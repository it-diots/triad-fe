/**
 * 인증 관련 에러 상수
 * NextAuth 세션과 토큰 관리에서 사용되는 에러 타입들
 */

/**
 * 토큰 관련 에러 코드
 */
export const TOKEN_ERROR_CODES = {
  REFRESH_TOKEN_ERROR: "RefreshTokenError",
  REFRESH_TOKEN_EXPIRED: "RefreshTokenExpired",
} as const;

/**
 * 토큰 에러 타입
 */
export type TokenErrorCode =
  (typeof TOKEN_ERROR_CODES)[keyof typeof TOKEN_ERROR_CODES];

/**
 * 토큰 에러 메시지 매핑
 */
export const TOKEN_ERROR_MESSAGES: Record<TokenErrorCode, string> = {
  [TOKEN_ERROR_CODES.REFRESH_TOKEN_ERROR]: "토큰 갱신 중 오류가 발생했습니다.",
  [TOKEN_ERROR_CODES.REFRESH_TOKEN_EXPIRED]:
    "리프레시 토큰이 만료되었습니다. 다시 로그인해 주세요.",
} as const;

/**
 * 토큰 에러 여부 확인 유틸리티
 */
export function isTokenError(error: unknown): error is TokenErrorCode {
  return (
    typeof error === "string" &&
    Object.values(TOKEN_ERROR_CODES).includes(error as TokenErrorCode)
  );
}

/**
 * 토큰 에러 메시지 가져오기
 */
export function getTokenErrorMessage(errorCode: TokenErrorCode): string {
  return TOKEN_ERROR_MESSAGES[errorCode];
}

/**
 * HTTP 에러 타입 가드 및 유틸리티
 */
export interface HttpError {
  response?: {
    status?: number;
  };
}

export function isHttpError(error: unknown): error is HttpError {
  return (
    error !== null &&
    typeof error === "object" &&
    "response" in error &&
    error.response !== null &&
    typeof error.response === "object"
  );
}

/**
 * API 에러 타입 가드 및 유틸리티
 */
export interface ApiError {
  status: number;
  data?: {
    message?: string;
    error?: {
      code?: string;
    };
  };
}

export function isApiError(error: unknown): error is ApiError {
  return (
    error !== null &&
    typeof error === "object" &&
    "status" in error &&
    typeof (error as { status: unknown }).status === "number"
  );
}
