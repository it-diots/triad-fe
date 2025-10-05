import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
  Icon,
  Separator,
} from "@triad/ui";

import { formatDate } from "@/utils/date";

import CreateProject from "./create-project";

const PROJECT_LIST = [
  {
    id: "1a2b3c4d-1111-2222-3333-444455556666",
    createdAt: "2024-05-01T09:00:00.000Z",
    updatedAt: "2024-05-01T09:00:00.000Z",
    deletedAt: null,
    name: "크롬 브라우저 로그인 테스트",
    description: "Chrome 환경에서 로그인 기능 QA 자동화 테스트",
    url: "https://qa-test.com/chrome-login",
    domain: "qa-test.com",
    isPublic: true,
    ownerId: "user-001",
    settings: {
      allowComments: true,
      allowGuests: false,
      maxParticipants: 5,
      isPublic: true,
    },
    owner: {
      id: "user-001",
      username: "qa_leader",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    },
  },
  {
    id: "2b3c4d5e-2222-3333-4444-555566667777",
    createdAt: "2024-05-02T10:30:00.000Z",
    updatedAt: "2024-05-02T10:30:00.000Z",
    deletedAt: null,
    name: "파이어폭스 결제 프로세스 QA",
    description: "Firefox 브라우저에서 결제 플로우 자동화 테스트",
    url: "https://qa-test.com/firefox-payment",
    domain: "qa-test.com",
    isPublic: false,
    ownerId: "user-002",
    settings: {
      allowComments: false,
      allowGuests: false,
      maxParticipants: 3,
      isPublic: false,
    },
    owner: {
      id: "user-002",
      username: "tester_fox",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    },
  },
  {
    id: "3c4d5e6f-3333-4444-5555-666677778888",
    createdAt: "2024-05-03T14:15:00.000Z",
    updatedAt: "2024-05-03T14:15:00.000Z",
    deletedAt: null,
    name: "엣지 브라우저 회원가입 QA",
    description: "Edge 브라우저에서 회원가입 시나리오 QA 테스트",
    url: "https://qa-test.com/edge-signup",
    domain: "qa-test.com",
    isPublic: true,
    ownerId: "user-003",
    settings: {
      allowComments: true,
      allowGuests: true,
      maxParticipants: 8,
      isPublic: true,
    },
    owner: {
      id: "user-003",
      username: "edge_tester",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    },
  },
  {
    id: "4d5e6f7g-4444-5555-6666-777788889999",
    createdAt: "2024-05-04T16:45:00.000Z",
    updatedAt: "2024-05-04T16:45:00.000Z",
    deletedAt: null,
    name: "사파리 브라우저 UI 렌더링 QA",
    description: "Safari 환경에서 UI 요소 렌더링 자동화 테스트",
    url: "https://qa-test.com/safari-ui",
    domain: "qa-test.com",
    isPublic: false,
    ownerId: "user-004",
    settings: {
      allowComments: false,
      allowGuests: false,
      maxParticipants: 2,
      isPublic: false,
    },
    owner: {
      id: "user-004",
      username: "safari_qa",
      avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    },
  },
  {
    id: "5e6f7g8h-5555-6666-7777-888899990000",
    createdAt: "2024-05-05T18:00:00.000Z",
    updatedAt: "2024-05-05T18:00:00.000Z",
    deletedAt: null,
    name: "모바일 브라우저 반응형 QA",
    description: "모바일 환경(Chrome, Safari)에서 반응형 UI QA 테스트",
    url: "https://qa-test.com/mobile-responsive",
    domain: "qa-test.com",
    isPublic: true,
    ownerId: "user-005",
    settings: {
      allowComments: true,
      allowGuests: true,
      maxParticipants: 12,
      isPublic: true,
    },
    owner: {
      id: "user-005",
      username: "mobile_qa",
      avatar: "https://randomuser.me/api/portraits/men/5.jpg",
    },
  },
];

export default function ProjectCard() {
  return (
    <div className="bg-card flex flex-col gap-4 rounded-xl p-6">
      <div className="flex items-center justify-between">
        <b className="text-lg font-bold">Projects</b>

        <CreateProject />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {PROJECT_LIST.map((project, index) => (
          <Card
            key={project.id}
            className={cn("relative cursor-pointer gap-4 p-0", {
              "cursor-not-allowed": index === 1,
            })}
          >
            <CardHeader className="flex flex-col gap-4 p-4 pb-0">
              <CardTitle className="flex flex-col gap-2">
                <div className="flex items-center gap-1">
                  <Icon.ClockPlus className="h-4 w-4" />

                  <span className="text-sm">
                    {formatDate(project.createdAt)}
                  </span>
                </div>

                <p>{project.name}</p>
              </CardTitle>

              <CardDescription className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={project.owner.avatar} />
                    <AvatarFallback>{project.owner.username}</AvatarFallback>
                  </Avatar>

                  <span className="text-sm font-bold">
                    {project.owner.username}
                  </span>
                </div>

                <p>{project.description}</p>
              </CardDescription>
            </CardHeader>

            <Separator />

            <CardContent className="p-4 pt-0">
              <ul className="flex flex-col gap-2">
                <li className="flex items-center gap-2">
                  <Icon.RectangleEllipsis className="h-4 w-4" />

                  <span className="text-sm font-medium">
                    <b className="text-sm font-bold">
                      {project.settings.isPublic ? "공개" : "비공개"}
                    </b>
                    &nbsp;프로젝트
                  </span>
                </li>

                <li className="flex items-center gap-2">
                  <Icon.RectangleEllipsis className="h-4 w-4" />

                  <span className="text-sm font-medium">
                    코멘트&nbsp;
                    <b className="text-sm font-bold">
                      {project.settings.allowComments ? "허용" : "불가"}
                    </b>
                  </span>
                </li>

                <li className="flex items-center gap-2">
                  <Icon.RectangleEllipsis className="h-4 w-4" />

                  <span className="text-sm font-medium">
                    게스트&nbsp;
                    <b className="text-sm font-bold">
                      {project.settings.allowGuests ? "허용" : "불가"}
                    </b>
                  </span>
                </li>

                <li className="flex items-center gap-2">
                  <Icon.RectangleEllipsis className="h-4 w-4" />

                  <span className="text-sm font-medium">
                    최대 참여자 수&nbsp;
                    <b className="text-sm font-bold">
                      {project.settings.maxParticipants}명
                    </b>
                  </span>
                </li>
              </ul>
            </CardContent>

            {index === 1 && (
              <>
                <div className="absolute inset-0 z-10 h-full w-full bg-[rgba(255,255,255,0.93)] blur-sm" />
                <div className="absolute inset-0 z-10 flex h-full w-full items-center justify-center">
                  <span className="text-sm">
                    {formatDate(project.updatedAt)}에 삭제됨
                  </span>
                </div>
              </>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
