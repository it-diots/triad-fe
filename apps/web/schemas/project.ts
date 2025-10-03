/**
 * 프로젝트 관련 Zod 스키마 정의
 */

import { z } from "zod";

/**
 * 프로젝트 설정 스키마
 */
export const ProjectSettingsSchema = z.object({
  allowComments: z.boolean(),
  allowGuests: z.boolean(),
  maxParticipants: z
    .number()
    .int()
    .positive({
      message: "최대 참여자 수는 1명 이상이어야 합니다",
    })
    .optional(),
  isPublic: z.boolean(),
});

/**
 * 프로젝트 생성 요청 스키마
 */
export const CreateProjectRequestSchema = z.object({
  name: z
    .string({
      message: "프로젝트 이름을 입력해주세요",
    })
    .min(1, { message: "프로젝트 이름은 필수입니다" })
    .max(100, { message: "프로젝트 이름은 100자를 초과할 수 없습니다" })
    .trim(),
  description: z
    .string()
    .max(500, { message: "설명은 500자를 초과할 수 없습니다" })
    .optional(),
  url: z
    .string()
    .url({ message: "유효한 URL을 입력해주세요" })
    .optional()
    .or(z.literal("")),
  domain: z
    .string()
    .max(255, { message: "도메인은 255자를 초과할 수 없습니다" })
    .optional(),
  isPublic: z.boolean(),
  settings: ProjectSettingsSchema,
});

/**
 * 프로젝트 응답 스키마 (기본 구조)
 */
export const ProjectSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable(),
  name: z.string(),
  description: z.string().nullable(),
  url: z.string().nullable(),
  domain: z.string().nullable(),
  isPublic: z.boolean(),
  ownerId: z.string(),
  settings: ProjectSettingsSchema,
});

/**
 * 프로젝트 소유자 스키마
 */
export const ProjectOwnerSchema = z.object({
  id: z.string(),
  username: z.string(),
  avatar: z.string().nullable(),
});

/**
 * Owner 정보가 포함된 프로젝트 스키마
 */
export const ProjectWithOwnerSchema = ProjectSchema.extend({
  owner: ProjectOwnerSchema,
});

/**
 * 프로젝트 목록 응답 스키마 (API 응답 구조)
 */
export const ProjectListResponseSchema = z
  .object({
    projects: z.array(ProjectWithOwnerSchema),
    total: z.number().int().nonnegative(),
    page: z.number().int().positive(),
    limit: z.number().int().positive(),
  })
  .transform((data) => ({
    ...data,
    totalPages: Math.ceil(data.total / data.limit),
  }));

// 타입 추출
export type ProjectSettings = z.infer<typeof ProjectSettingsSchema>;
export type CreateProjectRequest = z.infer<typeof CreateProjectRequestSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type ProjectOwner = z.infer<typeof ProjectOwnerSchema>;
export type ProjectWithOwner = z.infer<typeof ProjectWithOwnerSchema>;
export type ProjectListResponse = z.infer<typeof ProjectListResponseSchema>;
