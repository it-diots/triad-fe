import { LoginRequestSchema, LoginResponseSchema } from "@/schemas/auth";
import { API_ENDPOINTS, apiClient } from "@/utils/api-client";
import {
  ApiResponseHandler,
  ErrorHandlers,
  withErrorHandler,
} from "@/utils/api-error-handler";

/**
 * 로그인 API 엔드포인트
 * 외부 API 서버와 통신하여 사용자 인증을 처리합니다.
 */
const loginHandler = async (request: Request): Promise<Response> => {
  const body: unknown = await request.json();
  const validatedBody = LoginRequestSchema.parse(body);
  const { email, password } = validatedBody;

  const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
    json: {
      email: email.toLowerCase(),
      password,
    },
  });

  const responseData = await response.json();
  const validatedResponse = LoginResponseSchema.parse(responseData);

  return ApiResponseHandler.success(validatedResponse);
};

export const POST = withErrorHandler(loginHandler, ErrorHandlers.auth);
