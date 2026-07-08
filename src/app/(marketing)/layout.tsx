// Marketing site layout — shared nav/footer for the public-facing pages
// (home, pricing, about). Claim Score and Claims Intelligence have their
// own layouts since they're logged-in / product experiences, not marketing.
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6">
      <header className="flex items-center justify-between py-6">
        <span className="text-lg font-semibold">Project Intelligence</span>
        <nav className="flex gap-6 text-sm">
          <a href="/claim-score">Claim Score</a>
          <a href="/pricing">Pricing</a>
          <a href="/dashboard">Client Login</a>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="py-10 text-xs text-slate-500">
        © {new Date().getFullYear()} Second City Assets Ltd. All rights
        reserved.
      </footer>
    </div>
  );
}
