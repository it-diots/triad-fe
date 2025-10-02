export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className="bg-zinc-950 p-4">{children}</section>;
}
