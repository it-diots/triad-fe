import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { getProjectById } from "@/lib/api/projects";
import { setServerToken } from "@/utils/api-client/auth-adapter";

import { ProjectDetailView } from "./project-detail-view";

/**
 * 프로젝트 상세 페이지 (서버 컴포넌트)
 * 동적 라우트로 프로젝트 ID를 받아 상세 정보를 조회합니다
 *
 * @param params.projectId - URL 경로의 프로젝트 ID
 */

interface ProjectDetailPageProps {
  params: Promise<{ projectId: string }>;
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { projectId } = await params;

  // NextAuth 세션에서 토큰 가져오기
  const session = await auth();

  if (!session?.accessToken) {
    // 인증되지 않은 경우 404 (또는 로그인 페이지로 리디렉션)
    notFound();
  }

  // 서버 환경에서 API 호출을 위한 토큰 설정
  setServerToken(session.accessToken);

  try {
    // 프로젝트 상세 정보 조회
    const project = await getProjectById(projectId);

    return <ProjectDetailView project={project} />;
  } catch (error) {
    console.error("프로젝트 조회 실패:", error);
    // 404 페이지 표시
    notFound();
  } finally {
    // 보안을 위해 토큰 정리
    setServerToken(null);
  }
}
