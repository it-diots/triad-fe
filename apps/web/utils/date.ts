/**
 * 날짜 관련 유틸리티 함수 모음
 */

/**
 * 주어진 날짜로부터 현재까지의 상대적 시간을 한글로 반환합니다
 *
 * @param date - ISO 8601 형식의 날짜 문자열 또는 Date 객체
 * @param locale - 언어 로케일 (기본값: "ko-KR")
 * @returns 상대 시간 문자열 (예: "3일 전", "2시간 전")
 *
 * @example
 * ```ts
 * getRelativeTime("2024-05-01T09:00:00.000Z") // "3일 전"
 * getRelativeTime(new Date(Date.now() - 1000 * 60 * 60)) // "1시간 전"
 * ```
 */
export function getRelativeTime(
  date: string | Date,
  locale: string = "ko-KR"
): string {
  const now = new Date();
  const targetDate = typeof date === "string" ? new Date(date) : date;

  const diffInMs = now.getTime() - targetDate.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  // 1분 미만
  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, "second");
  }
  // 1시간 미만
  if (diffInMinutes < 60) {
    return rtf.format(-diffInMinutes, "minute");
  }
  // 1일 미만
  if (diffInHours < 24) {
    return rtf.format(-diffInHours, "hour");
  }
  // 30일 미만
  if (diffInDays < 30) {
    return rtf.format(-diffInDays, "day");
  }
  // 12개월 미만
  if (diffInMonths < 12) {
    return rtf.format(-diffInMonths, "month");
  }
  // 1년 이상
  return rtf.format(-diffInYears, "year");
}

/**
 * ISO 8601 날짜 문자열을 로케일에 맞는 포맷으로 변환합니다
 *
 * @param date - ISO 8601 형식의 날짜 문자열 또는 Date 객체
 * @param locale - 언어 로케일 (기본값: "ko-KR")
 * @param options - Intl.DateTimeFormat 옵션
 * @returns 포맷된 날짜 문자열
 *
 * @example
 * ```ts
 * formatDate("2024-05-01T09:00:00.000Z") // "2024. 5. 1."
 * formatDate("2024-05-01T09:00:00.000Z", "ko-KR", { dateStyle: "long" }) // "2024년 5월 1일"
 * ```
 */
export function formatDate(
  date: string | Date,
  locale: string = "ko-KR",
  options?: Intl.DateTimeFormatOptions
): string {
  const targetDate = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, options).format(targetDate);
}
