import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

/**
 * Supabase Admin 클라이언트 생성
 * Service Role Key를 사용하여 RLS를 우회합니다.
 * 주의: 이 클라이언트는 서버 사이드에서만 사용해야 합니다.
 */
export function createAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!supabaseServiceKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY 환경변수가 설정되지 않았습니다."
    );
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
