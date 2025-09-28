import { GetUserProfileResponseSchema } from "@/schemas/users";
import { API_ENDPOINTS, apiClient } from "@/utils/api-client";
import { setServerToken } from "@/utils/api-client/auth-adapter";
import {
  ApiResponseHandler,
  ErrorHandlers,
  withErrorHandler,
} from "@/utils/api-error-handler";

/**
 * 현재 로그인한 사용자 프로필 조회 API 엔드포인트
 * 외부 API 서버와 통신하여 인증된 사용자의 프로필 정보를 가져옵니다.
 */

const getProfileHandler = async (request: Request): Promise<Response> => {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw {
      status: 401,
      data: {
        message: "인증 토큰이 필요합니다.",
        error: { code: "UNAUTHORIZED" },
      },
    };
  }

  const token = authHeader.substring(7);

  // 서버 환경에서 토큰 설정
  setServerToken(token);
  const response = await apiClient.get(API_ENDPOINTS.AUTH.PROFILE);

  const validatedResponse = GetUserProfileResponseSchema.parse(response.data);

  return ApiResponseHandler.success(validatedResponse);
};

export const GET = withErrorHandler(getProfileHandler, ErrorHandlers.auth);
