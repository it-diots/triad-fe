import {
  DeleteUserParamsSchema,
  DeleteUserResponseSchema,
  GetUserByIdParamsSchema,
  GetUserByIdResponseSchema,
  UpdateUserProfileRequestSchema,
  UpdateUserProfileResponseSchema,
} from "@/schemas/users";
import { apiClient } from "@/utils/api-client";
import {
  ApiResponseHandler,
  ErrorHandlers,
  withErrorHandler,
} from "@/utils/api-error-handler";

/**
 * 사용자 ID 기반 API 엔드포인트
 * GET: 특정 사용자 조회
 * PATCH: 사용자 정보 업데이트
 * DELETE: 사용자 삭제
 */

const getUserByIdHandler = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> => {
  const resolvedParams = await params;
  const validatedParams = GetUserByIdParamsSchema.parse(resolvedParams);

  const response = await apiClient.get(`/api/v1/users/${validatedParams.id}`);
  const responseData = await response.json();
  const validatedResponse = GetUserByIdResponseSchema.parse(responseData);

  return ApiResponseHandler.success(validatedResponse);
};

const updateUserHandler = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> => {
  const resolvedParams = await params;
  const validatedParams = GetUserByIdParamsSchema.parse(resolvedParams);

  const body = await request.json();
  const validatedBody = UpdateUserProfileRequestSchema.parse(body);

  const response = await apiClient.patch(
    `/api/v1/users/${validatedParams.id}`,
    { json: validatedBody }
  );

  const responseData = await response.json();
  const validatedResponse = UpdateUserProfileResponseSchema.parse(responseData);

  return ApiResponseHandler.success(validatedResponse);
};

const deleteUserHandler = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> => {
  const resolvedParams = await params;
  const validatedParams = DeleteUserParamsSchema.parse(resolvedParams);

  const response = await apiClient.delete(
    `/api/v1/users/${validatedParams.id}`
  );
  const responseData = await response.json();
  const validatedResponse = DeleteUserResponseSchema.parse(responseData);

  return ApiResponseHandler.success(validatedResponse);
};

export const GET = withErrorHandler(getUserByIdHandler, ErrorHandlers.users);
export const PATCH = withErrorHandler(updateUserHandler, ErrorHandlers.users);
export const DELETE = withErrorHandler(deleteUserHandler, ErrorHandlers.users);
