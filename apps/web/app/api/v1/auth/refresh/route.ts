import {
  RefreshTokenRequestSchema,
  RefreshTokenResponseSchema,
} from "@/schemas/auth";
import { API_ENDPOINTS, apiClient } from "@/utils/api-client";
import {
  ApiResponseHandler,
  ErrorHandlers,
  withErrorHandler,
} from "@/utils/api-error-handler";

/**
 * 토큰 새로고침 API 엔드포인트
 * 외부 API 서버와 통신하여 새로운 액세스 토큰을 발급받습니다.
 */
const refreshTokenHandler = async (request: Request): Promise<Response> => {
  const body: unknown = await request.json();
  const validatedBody = RefreshTokenRequestSchema.parse(body);

  const response = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH, {
    json: {
      refreshToken: validatedBody.refreshToken,
    },
  });

  const responseData = await response.json();
  const validatedResponse = RefreshTokenResponseSchema.parse(responseData);

  return ApiResponseHandler.success(validatedResponse);
};

export const POST = withErrorHandler(refreshTokenHandler, ErrorHandlers.auth);
