/**
 * 레거시 데이터베이스 타입 정의 파일
 * Supabase에서 REST API로 마이그레이션 후 더 이상 사용되지 않음
 *
 * @deprecated 이 파일은 더 이상 사용되지 않습니다.
 * 새로운 타입은 types/api.ts와 schemas/ 디렉토리를 사용하세요.
 */

// 기존 코드와의 호환성을 위해 기본 타입만 유지
export interface LegacyUser {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

// 새로운 타입 시스템으로 마이그레이션을 권장하는 메시지
console.warn(
  "⚠️  types/database.ts는 deprecated되었습니다. " +
    "types/api.ts와 schemas/ 디렉토리의 새로운 타입 시스템을 사용하세요."
);
