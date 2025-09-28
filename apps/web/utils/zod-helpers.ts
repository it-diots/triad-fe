/**
 * Zod 유틸리티
 * 에러 처리와 사용자 친화적 메시지 제공
 */

import { ZodError, ZodIssue } from "zod";

/**
 * ZodError를 사용자 친화적인 메시지로 변환
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
 * 단일 Zod 이슈를 포맷팅
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

  const fieldName = path.length > 0 ? fieldMap[path[0]] || path[0] : "입력값";

  // 에러 코드별 커스텀 메시지
  switch (code) {
    case "invalid_type":
      if (issue.expected === "string" && issue.received === "undefined") {
        return `${fieldName}을(를) 입력해주세요.`;
      }
      return `${fieldName}의 형식이 올바르지 않습니다.`;

    case "too_small":
      if (issue.type === "string") {
        return message; // 이미 한국어로 정의된 메시지 사용
      }
      return `${fieldName}이(가) 너무 짧습니다.`;

    case "too_big":
      if (issue.type === "string") {
        return message;
      }
      return `${fieldName}이(가) 너무 깁니다.`;

    case "invalid_string":
      if (issue.validation === "email") {
        return "올바른 이메일 주소를 입력해주세요.";
      }
      if (issue.validation === "regex") {
        return message; // 이미 한국어로 정의된 메시지 사용
      }
      return `${fieldName}의 형식이 올바르지 않습니다.`;

    case "custom":
      return message;

    default:
      return message || `${fieldName}에 오류가 있습니다.`;
  }
}

/**
 * ZodError를 필드별 에러 객체로 변환
 * 폼 라이브러리와 함께 사용하기 적합
 *
 * @param error - 변환할 ZodError 객체
 * @returns 필드명을 키로 하는 에러 메시지 객체
 *
 * @example
 * ```typescript
 * import { z } from 'zod';
 * import { flattenZodError } from '@/utils/zod-helpers';
 *
 * const schema = z.object({
 *   email: z.string().email(),
 *   password: z.string().min(8),
 *   confirmPassword: z.string()
 * });
 *
 * try {
 *   schema.parse({ email: 'invalid', password: '123', confirmPassword: '456' });
 * } catch (error) {
 *   if (error instanceof ZodError) {
 *     const fieldErrors = flattenZodError(error);
 *     console.log(fieldErrors);
 *     // {
 *     //   email: "올바른 이메일 주소를 입력해주세요.",
 *     //   password: "비밀번호는 최소 8자 이상이어야 합니다"
 *     // }
 *   }
 * }
 * ```
 */
export function flattenZodError(error: ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};

  error.issues.forEach((issue) => {
    const fieldName = issue.path.join(".");
    if (!fieldErrors[fieldName]) {
      fieldErrors[fieldName] = formatSingleIssue(issue);
    }
  });

  return fieldErrors;
}

/**
 * 안전한 파싱 유틸리티
 * 성공/실패를 명확히 구분하는 타입 안전한 파서
 *
 * @param schema - 파싱에 사용할 Zod 스키마
 * @param data - 검증할 데이터
 * @returns 성공 시 데이터와 함께, 실패 시 에러 메시지와 함께 반환
 *
 * @example
 * ```typescript
 * import { z } from 'zod';
 * import { safeParse } from '@/utils/zod-helpers';
 *
 * const userSchema = z.object({
 *   name: z.string(),
 *   age: z.number().min(0)
 * });
 *
 * const result = safeParse(userSchema, { name: 'John', age: 25 });
 *
 * if (result.success) {
 *   console.log('사용자 데이터:', result.data);
 * } else {
 *   console.log('에러:', result.error);
 *   console.log('필드 에러:', result.fieldErrors);
 * }
 * ```
 */
export function safeParse<T>(
  schema: {
    safeParse: (
      data: unknown
    ) => { success: true; data: T } | { success: false; error: ZodError };
  },
  data: unknown
):
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string> } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return {
    success: false,
    error: formatZodError(result.error),
    fieldErrors: flattenZodError(result.error),
  };
}

/**
 * 비동기 검증을 위한 유틸리티
 * 비동기 스키마 검증을 안전하게 처리
 *
 * @param schema - 비동기 파싱을 지원하는 Zod 스키마
 * @param data - 검증할 데이터
 * @returns 성공 시 데이터와 함께, 실패 시 에러 메시지와 함께 반환하는 Promise
 *
 * @example
 * ```typescript
 * import { z } from 'zod';
 * import { safeParseAsync } from '@/utils/zod-helpers';
 *
 * const asyncUserSchema = z.object({
 *   email: z.string().email().refine(async (email) => {
 *     // 비동기 이메일 중복 검사
 *     const exists = await checkEmailExists(email);
 *     return !exists;
 *   }, '이미 사용 중인 이메일입니다')
 * });
 *
 * const result = await safeParseAsync(asyncUserSchema, {
 *   email: 'user@example.com'
 * });
 *
 * if (result.success) {
 *   console.log('검증 성공:', result.data);
 * } else {
 *   console.log('검증 실패:', result.error);
 * }
 * ```
 */
export async function safeParseAsync<T>(
  schema: {
    safeParseAsync: (
      data: unknown
    ) => Promise<
      { success: true; data: T } | { success: false; error: ZodError }
    >;
  },
  data: unknown
): Promise<
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string> }
> {
  try {
    const result = await schema.safeParseAsync(data);

    if (result.success) {
      return { success: true, data: result.data };
    }

    return {
      success: false,
      error: formatZodError(result.error),
      fieldErrors: flattenZodError(result.error),
    };
  } catch {
    return {
      success: false,
      error: "검증 중 오류가 발생했습니다.",
    };
  }
}
