/**
 * 프로젝트 관련 Zod 스키마 정의
 */

import { z } from "zod";

/**
 * 프로젝트 설정 스키마 (API 응답용)
 * 서버에서 반환하는 설정 구조
 */
export const ProjectSettingsSchema = z.object({
  /** 코멘트 허용 여부 */
  allowComments: z.boolean(),
  /** 게스트 허용 여부 */
  allowGuests: z.boolean(),
  /** 공개 여부 */
  isPublic: z.boolean(),
  /** 최대 참여자 수 (선택적 - 서버에서 반환하지 않을 수 있음) */
  maxParticipants: z.number().int().min(1).max(100).optional(),
});

/**
 * 프로젝트 설정 생성 스키마 (요청용)
 * 클라이언트에서 프로젝트 생성 시 전송하는 설정 구조
 */
export const CreateProjectSettingsSchema = z.object({
  /** 코멘트 허용 여부 */
  allowComments: z.boolean({
    message: "코멘트 허용 여부를 선택해주세요",
  }),
  /** 게스트 허용 여부 */
  allowGuests: z.boolean({
    message: "게스트 허용 여부를 선택해주세요",
  }),
  /** 공개 여부 */
  isPublic: z.boolean({
    message: "공개 여부를 선택해주세요",
  }),
  /** 최대 참여자 수 */
  maxParticipants: z
    .number({
      message: "최대 참여자 수를 입력해주세요",
    })
    .int("정수를 입력해주세요")
    .min(1, "최소 1명 이상이어야 합니다")
    .max(100, "최대 100명까지 가능합니다"),
});

/**
 * 프로젝트 소유자 스키마 (간단한 버전)
 */
export const ProjectOwnerSchema = z.object({
  id: z.string(),
  username: z.string(),
  avatar: z.string().url().nullable(),
});

/**
 * 프로젝트 엔티티 스키마 (전체 정보)
 */
export const ProjectSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable(),
  name: z.string(),
  description: z.string().nullable(),
  url: z.string().url().nullable(),
  domain: z.string(),
  isPublic: z.boolean(),
  ownerId: z.string(),
  settings: ProjectSettingsSchema,
});

/**
 * 소유자 정보를 포함한 프로젝트 스키마
 */
export const ProjectWithOwnerSchema = ProjectSchema.extend({
  owner: ProjectOwnerSchema,
});

/**
 * 프로젝트 생성 요청 스키마
 */
export const CreateProjectRequestSchema = z.object({
  /** 프로젝트 이름 (필수) */
  name: z
    .string({
      message: "프로젝트 이름을 입력해주세요",
    })
    .min(1, "프로젝트 이름을 입력해주세요")
    .max(100, "프로젝트 이름은 100자를 초과할 수 없습니다")
    .trim(),

  /** 프로젝트 설명 (선택) */
  description: z
    .string()
    .trim()
    .transform((val) => (val === "" ? null : val))
    .pipe(
      z
        .string()
        .max(500, "프로젝트 설명은 500자를 초과할 수 없습니다")
        .nullable()
    )
    .nullable()
    .optional(),

  /** 프로젝트 URL (선택) */
  url: z
    .string()
    .trim()
    .transform((val) => (val === "" ? null : val))
    .pipe(
      z
        .string()
        .url("유효한 URL을 입력해주세요")
        .max(2048, "URL은 2048자를 초과할 수 없습니다")
        .nullable()
    )
    .nullable()
    .optional(),

  /** 도메인 (필수) */
  domain: z
    .string({
      message: "도메인을 입력해주세요",
    })
    .min(1, "도메인을 입력해주세요")
    .max(255, "도메인은 255자를 초과할 수 없습니다")
    .regex(
      /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i,
      "유효한 도메인을 입력해주세요 (예: example.com)"
    )
    .trim(),

  /** 프로젝트 공개 여부 (필수) */
  isPublic: z.boolean({
    message: "프로젝트 공개 여부를 선택해주세요",
  }),

  /** 프로젝트 설정 (필수) */
  settings: CreateProjectSettingsSchema,
});

/**
 * 프로젝트 목록 조회 요청 파라미터 스키마
 */
export const GetProjectsParamsSchema = z
  .object({
    /** 페이지 번호 (1부터 시작) */
    page: z.number().int().min(1).optional(),
    /** 페이지 크기 */
    limit: z.number().int().min(1).max(100).optional(),
    /** 검색어 */
    search: z.string().optional(),
    /** 공개 프로젝트만 조회 */
    isPublic: z.boolean().optional(),
  })
  .optional();

/**
 * 프로젝트 목록 응답 스키마
 */
export const ProjectListResponseSchema = z.object({
  projects: z.array(ProjectWithOwnerSchema),
  total: z.number().int(),
  page: z.number().int(),
  limit: z.number().int(),
});

// 타입 추출
export type ProjectSettings = z.infer<typeof ProjectSettingsSchema>;
export type CreateProjectSettings = z.infer<typeof CreateProjectSettingsSchema>;
export type ProjectOwner = z.infer<typeof ProjectOwnerSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type ProjectWithOwner = z.infer<typeof ProjectWithOwnerSchema>;
export type CreateProjectRequest = z.infer<typeof CreateProjectRequestSchema>;
export type GetProjectsParams = z.infer<typeof GetProjectsParamsSchema>;
export type ProjectListResponse = z.infer<typeof ProjectListResponseSchema>;
