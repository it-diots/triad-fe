import { QueryClient } from "@tanstack/react-query";

/**
 * TanStack Query Client 생성 함수
 * Web과 Extension 앱에서 공통으로 사용되는 QueryClient 설정
 */
export function createQueryClient(): QueryClient {
  return new QueryClient();
}
