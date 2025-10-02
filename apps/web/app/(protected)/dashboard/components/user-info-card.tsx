import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Card,
  Icon,
} from "@triad/ui";
import { Session } from "next-auth";

interface UserInfoCardProps {
  session: Session | null;
}

export default function UserInfoCard({ session }: UserInfoCardProps) {
  if (!session?.user) {
    return null;
  }

  const { user } = session;

  const fullName = `${user.firstName} ${user.lastName}` || user.username;

  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="flex flex-col p-6">
      <div className="flex flex-col items-center">
        <Avatar className="h-24 w-24">
          <AvatarImage src={user.avatar || undefined} alt={fullName} />
          <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
        </Avatar>

        <div className="mt-4 flex items-center gap-2">
          <h2 className="text-xl font-bold">{fullName}</h2>
          <Badge variant="default">Pro</Badge>
        </div>

        <p className="text-muted-foreground mt-1 text-sm">{user.role}</p>

        <div className="mt-6 grid w-full grid-cols-3 divide-x border-y py-6">
          <div className="text-center">
            <div className="text-2xl font-bold">184</div>
            <div className="text-muted-foreground text-sm">Comments</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">32</div>
            <div className="text-muted-foreground text-sm">Projects</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">4</div>
            <div className="text-muted-foreground text-sm">Teams</div>
          </div>
        </div>

        <div className="mt-6 w-full space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Icon.Building className="text-muted-foreground h-4 w-4" />
            <span>셀러노트</span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Icon.UserStar className="text-muted-foreground h-4 w-4" />
            <span>프론트엔드</span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Icon.Mail className="text-muted-foreground h-4 w-4" />
            <span>{user.email}</span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Icon.Phone className="text-muted-foreground h-4 w-4" />
            <span>(+82-10) 1234 5678</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
