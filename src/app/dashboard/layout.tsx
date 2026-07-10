// Claims Intelligence dashboard layout — the consulting-client-facing
// product. Route-level auth gating (Microsoft sign-in required) is handled
// by src/middleware.ts, not here — see lib/auth.ts for the provider setup.
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
