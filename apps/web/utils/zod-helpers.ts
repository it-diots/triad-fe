/**
 * Zod 유틸리티
 * 에러 메시지를 사용자 친화적인 한국어로 변환
 */

import { ZodError, ZodIssue } from "zod";

/**
 * ZodError를 사용자 친화적인 한국어 메시지로 변환
 *
 * @param error - 변환할 ZodError 객체
 * @returns 사용자가 이해하기 쉬운 한국어 에러 메시지
 *
 * @example
 * ```typescript
 * import { z } from 'zod';
 * import { formatZodError } from '@/utils/zod-helpers';
 *
 * const userSchema = z.object({
 *   email: z.string().email(),
 *   password: z.string().min(8)
 * });
 *
 * try {
 *   userSchema.parse({ email: 'invalid-email', password: '123' });
 * } catch (error) {
 *   if (error instanceof ZodError) {
 *     const message = formatZodError(error);
 *     console.log(message); // "비밀번호는 최소 8자 이상이어야 합니다"
 *   }
 * }
 * ```
 */
export function formatZodError(error: ZodError): string {
  const issues = error.issues;

  if (issues.length === 1) {
    return formatSingleIssue(issues[0]);
  }

  // 여러 에러가 있는 경우 첫 번째 에러만 표시
  return formatSingleIssue(issues[0]);
}

/**
 * 단일 Zod 이슈를 한국어 메시지로 포맷팅
 */
function formatSingleIssue(issue: ZodIssue): string {
  const { code, path, message } = issue;

  // 필드 이름을 한국어로 매핑
  const fieldMap: Record<string, string> = {
    email: "이메일",
    password: "비밀번호",
    confirmPassword: "비밀번호 확인",
    username: "사용자명",
    firstName: "이름",
    lastName: "성",
  };

  const pathKey = String(path.length > 0 ? path[0] : "");
  const fieldName = pathKey ? fieldMap[pathKey] || pathKey : "입력값";

  // 에러 코드별 커스텀 메시지
  // Zod 4에서는 message를 우선 사용
  switch (code) {
    case "invalid_type":
      return message || `${fieldName}의 형식이 올바르지 않습니다.`;

    case "too_small":
      return message || `${fieldName}이(가) 너무 짧습니다.`;

    case "too_big":
      return message || `${fieldName}이(가) 너무 깁니다.`;

    case "invalid_format":
      return message || `${fieldName}의 형식이 올바르지 않습니다.`;

    case "custom":
      return message;

    default:
      return message || `${fieldName}에 오류가 있습니다.`;
  }
}
