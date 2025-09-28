/**
 * API 관련 타입 정의
 * RESTful API와 클라이언트 간의 데이터 교환을 위한 타입들
 */

// Re-export from schemas for convenience
export type {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  SignupRequest,
  SignupResponse,
  // Auth types
  User,
} from "@/schemas/auth";
export type {
  ApiErrorData,
  ApiResponse,
  // Common types
  BaseApiResponse,
  ErrorResponse,
  IdParam,
  Pagination,
} from "@/schemas/common";

// Import Pagination separately for interface extension
export type {
  DeleteUserParams,
  DeleteUserResponse,
  ExtendedUserProfile,
  GetUserByIdParams,
  GetUserByIdResponse,
  GetUserProfileResponse,
  GetUsersQuery,
  GetUsersResponse,
  UpdateUserProfileRequest,
  UpdateUserProfileResponse,
  // User types
  UserProfile,
} from "@/schemas/users";

// API-specific types
export type ApiEndpoint = string;

/**
 * HTTP 상태 코드 타입
 */
export type HttpStatusCode =
  | 200 // OK
  | 201 // Created
  | 204 // No Content
  | 400 // Bad Request
  | 401 // Unauthorized
  | 403 // Forbidden
  | 404 // Not Found
  | 409 // Conflict
  | 422 // Unprocessable Entity
  | 429 // Too Many Requests
  | 500 // Internal Server Error
  | 502 // Bad Gateway
  | 503; // Service Unavailable

/**
 * API 에러 코드 타입
 */
export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "AUTHENTICATION_FAILED"
  | "AUTHORIZATION_FAILED"
  | "RESOURCE_NOT_FOUND"
  | "RESOURCE_CONFLICT"
  | "RATE_LIMIT_EXCEEDED"
  | "INTERNAL_SERVER_ERROR"
  | "SERVICE_UNAVAILABLE"
  | "INVALID_TOKEN"
  | "TOKEN_EXPIRED"
  | "USER_NOT_FOUND"
  | "EMAIL_ALREADY_EXISTS"
  | "INVALID_CREDENTIALS"
  | "EMAIL_NOT_VERIFIED"
  | "PASSWORD_TOO_WEAK"
  | "FILE_TOO_LARGE"
  | "UNSUPPORTED_FILE_TYPE";

/**
 * 정렬 방향 타입
 */
export type SortOrder = "asc" | "desc";

/**
 * 언어 코드 타입
 */
export type LanguageCode = "ko" | "en";

/**
 * 시간대 타입
 */
export type Timezone =
  | "Asia/Seoul"
  | "UTC"
  | "America/New_York"
  | "Europe/London";

/**
 * 사용자 역할 타입
 */
export type UserRole = "admin" | "user";

/**
 * 사용자 상태 타입
 */
export type UserStatus = "active" | "inactive" | "suspended";

/**
 * 활동 로그 액션 타입
 */
export type ActivityAction =
  | "login"
  | "logout"
  | "profile_update"
  | "password_change";

/**
 * 파일 MIME 타입 (이미지)
 */
export type ImageMimeType = "image/jpeg" | "image/png" | "image/webp";

/**
 * 알림 설정 타입
 */
export interface NotificationSettings {
  email: boolean;
  push: boolean;
  marketing: boolean;
}

/**
 * 사용자 환경설정 타입
 */
export interface UserPreferences {
  language: LanguageCode;
  timezone: Timezone;
  notifications: NotificationSettings;
}

/**
 * 이미지 썸네일 타입
 */
export interface ImageThumbnails {
  small: string;
  medium: string;
  large: string;
}

/**
 * API 요청 메타데이터 타입
 */
export interface RequestMetadata {
  timestamp: string;
  requestId: string;
  userAgent?: string;
  ipAddress?: string;
}

/**
 * API 응답 메타데이터 타입
 */
export interface ResponseMetadata {
  timestamp: string;
  requestId: string;
  processingTime: number;
  version: string;
}

/**
 * 페이지네이션 헬퍼 타입
 */
export interface PaginationHelpers {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isFirstPage: boolean;
  isLastPage: boolean;
  nextPage?: number;
  previousPage?: number;
}

/**
 * 확장된 페이지네이션 타입
 */
export interface ExtendedPagination extends PaginationHelpers {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * API 클라이언트 설정 타입
 */
export interface ApiClientSettings {
  retryAttempts: number;
  retryDelay: number;
  timeout: number;
  enableLogging: boolean;
  enableCache: boolean;
  cacheTimeout: number;
}

/**
 * 캐시 엔트리 타입
 */
export interface CacheEntry<T = unknown> {
  data: T;
  timestamp: number;
  expiresAt: number;
  key: string;
}

/**
 * 업로드 진행률 타입
 */
export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
  speed?: number;
  remainingTime?: number;
}

/**
 * 배치 작업 상태 타입
 */
export type BatchJobStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled";

/**
 * 배치 작업 결과 타입
 */
export interface BatchJobResult<T = unknown> {
  id: string;
  status: BatchJobStatus;
  progress: number;
  total: number;
  successful: number;
  failed: number;
  errors: string[];
  result?: T;
  startedAt: string;
  completedAt?: string;
}

/**
 * WebSocket 메시지 타입
 */
export interface WebSocketMessage<T = unknown> {
  type: string;
  payload: T;
  timestamp: string;
  id?: string;
}

/**
 * 실시간 알림 타입
 */
export interface RealtimeNotification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  data?: unknown;
  createdAt: string;
  read: boolean;
}

/**
 * 유틸리티 타입들
 */

// Partial한 업데이트 요청을 위한 타입
export type PartialUpdate<T> = Partial<
  Omit<T, "id" | "createdAt" | "updatedAt">
>;

// ID만 포함한 참조 타입
export type EntityReference = Pick<{ id: string }, "id">;

// 타임스탬프를 제외한 타입
export type WithoutTimestamps<T> = Omit<T, "createdAt" | "updatedAt">;

// 생성 시 필요한 필드만 포함한 타입
export type CreateInput<T> = Omit<T, "id" | "createdAt" | "updatedAt">;

// 업데이트 시 필요한 필드만 포함한 타입
export type UpdateInput<T> = Partial<CreateInput<T>>;

// API 응답에서 데이터만 추출하는 유틸리티 타입
export type ExtractData<T> = T extends { data: infer U } ? U : never;

// 검색 필터 베이스 타입
export interface BaseSearchFilter {
  query?: string;
  dateFrom?: string;
  dateTo?: string;
  tags?: string[];
}
