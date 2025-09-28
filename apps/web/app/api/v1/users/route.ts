import { GetUsersQuerySchema, GetUsersResponseSchema } from "@/schemas/users";
import { API_ENDPOINTS, apiClient } from "@/utils/api-client";
import {
  ApiResponseHandler,
  ErrorHandlers,
  withErrorHandler,
} from "@/utils/api-error-handler";

/**
 * 사용자 목록 조회 API 엔드포인트
 * 외부 API 서버와 통신하여 사용자 목록을 가져옵니다.
 */

const getUsersHandler = async (request: Request): Promise<Response> => {
  const { searchParams } = new URL(request.url);

  const queryParams = GetUsersQuerySchema.parse({
    page: searchParams.get("page")
      ? Number(searchParams.get("page"))
      : undefined,
    limit: searchParams.get("limit")
      ? Number(searchParams.get("limit"))
      : undefined,
  });

  const response = await apiClient.get(API_ENDPOINTS.USERS.LIST, {
    searchParams: queryParams,
  });

  const responseData = await response.json();
  const validatedResponse = GetUsersResponseSchema.parse(responseData);

  return ApiResponseHandler.success(validatedResponse);
};

export const GET = withErrorHandler(getUsersHandler, ErrorHandlers.users);
