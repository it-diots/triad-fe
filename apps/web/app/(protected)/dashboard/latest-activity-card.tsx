import {
  Badge,
  Card,
  CardAction,
  CardHeader,
  CardTitle,
  cn,
  Icon,
} from "@triad/ui";

const activities = [
  {
    id: 1,
    icon: "package" as const,
    title: "Shadcn UI Kit Application UI v2.0.0",
    badge: "Latest",
    date: "December 2nd, 2025",
    description:
      "Get access to over 20+ pages including a dashboard layout, charts, kanban board, calendar, and pre-order E-commerce & Marketing pages.",
    hasDownload: true,
  },
  {
    id: 2,
    icon: "target" as const,
    title: "Shadcn UI Kit Figma v1.3.0",
    date: "December 2nd, 2025",
    description:
      "All of the pages and components are first designed in Figma and we keep a parity between the two versions even as we update the project.",
    hasDownload: false,
  },
  {
    id: 3,
    icon: "package" as const,
    title: "Shadcn UI Kit Library v1.2.2",
    date: "December 2nd, 2025",
    description:
      "Get started with dozens of web components and interactive elements built on top of Tailwind CSS.",
    hasDownload: false,
  },
];

interface LatestActivityCardProps {
  className?: string;
}

export default function LatestActivityCard({
  className,
}: LatestActivityCardProps) {
  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader>
        <CardTitle>Latest Activity</CardTitle>
        <CardAction>
          <button className="text-primary text-sm font-medium hover:underline">
            View All
          </button>
        </CardAction>
      </CardHeader>

      <div className="space-y-6 overflow-auto px-6 pb-6">
        {activities.map((activity) => (
          <div key={activity.id} className="space-y-3">
            <div className="flex items-start gap-3">
              {activity.icon === "package" ? (
                <Icon.Package className="text-muted-foreground mt-1 h-5 w-5" />
              ) : (
                <Icon.Target className="text-muted-foreground mt-1 h-5 w-5" />
              )}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{activity.title}</h4>
                  {activity.badge && (
                    <Badge variant="default" className="text-xs">
                      {activity.badge}
                    </Badge>
                  )}
                </div>
                <div className="text-muted-foreground flex items-center gap-1 text-sm">
                  <Icon.Clock className="h-3 w-3" />
                  <span>Released on {activity.date}</span>
                </div>
                <p className="text-muted-foreground text-sm">
                  {activity.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
