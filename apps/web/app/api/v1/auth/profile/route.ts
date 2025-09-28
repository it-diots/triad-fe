import { GetUserProfileResponseSchema } from "@/schemas/users";
import { API_ENDPOINTS } from "@/utils/api-client";
import { createServerApiWithAuth } from "@/utils/api-client";
import {
  ApiResponseHandler,
  ErrorHandlers,
  withErrorHandler,
} from "@/utils/api-error-handler";

/**
 * 현재 로그인한 사용자 프로필 조회 API 엔드포인트
 * 외부 API 서버와 통신하여 인증된 사용자의 프로필 정보를 가져옵니다.
 */
const getProfileHandler = async (): Promise<Response> => {
  const { apiClient, isAuthenticated } = await createServerApiWithAuth();

  if (!isAuthenticated) {
    throw {
      status: 401,
      data: {
        message: "인증 토큰이 필요합니다.",
        error: { code: "UNAUTHORIZED" },
      },
    };
  }

  const response = await apiClient.get(API_ENDPOINTS.AUTH.PROFILE);
  const responseData = await response.json();
  const validatedResponse = GetUserProfileResponseSchema.parse(responseData);

  return ApiResponseHandler.success(validatedResponse);
};

export const GET = withErrorHandler(getProfileHandler, ErrorHandlers.auth);
