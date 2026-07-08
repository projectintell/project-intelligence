// Claims Intelligence dashboard layout — the consulting-client-facing
// product. TODO: gate this behind auth once the identity approach is
// decided (see open items in project-intelligence-rebuild-evaluation
// memory).
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <span className="font-semibold">Claims Intelligence</span>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
