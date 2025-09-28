import { SignupRequestSchema, SignupResponseSchema } from "@/schemas/auth";
import { apiClient } from "@/utils/api-client";
import {
  ApiResponseHandler,
  ErrorHandlers,
  withErrorHandler,
} from "@/utils/api-error-handler";

/**
 * 회원가입 API 엔드포인트
 * 외부 API 서버와 통신하여 새로운 사용자를 등록합니다.
 */

const registerHandler = async (request: Request): Promise<Response> => {
  const body = await request.json();
  const validatedBody = SignupRequestSchema.parse(body);
  const { email, password, username, firstName, lastName } = validatedBody;

  const response = await apiClient.post("/auth/register", {
    email: email.toLowerCase(),
    password,
    username,
    firstName,
    lastName,
  });

  const validatedResponse = SignupResponseSchema.parse(response.data);

  return ApiResponseHandler.success(validatedResponse, 201);
};

export const POST = withErrorHandler(registerHandler, ErrorHandlers.auth);
