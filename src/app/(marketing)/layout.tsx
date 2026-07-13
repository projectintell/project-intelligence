// Marketing site layout — shared nav/footer for the public-facing pages
// (home, pricing, about). Claim Score and Claims Intelligence have their
// own layouts since they're logged-in / product experiences, not marketing.
//
// Text below comes from the i18n dictionary (src/lib/i18n/) rather than
// being hardcoded — this is the pattern to follow for any new
// customer-facing page: pull strings via getDictionary(getLocale()), add
// the keys to dictionaries/en.json, don't type English straight into JSX.
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { getLocale } from '@/lib/i18n/get-locale';
import { LanguageSwitcher } from '@/components/language-switcher';

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = getLocale();
  const dict = await getDictionary(locale);

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6">
      <header className="flex items-center justify-between py-6">
        <span className="text-lg font-semibold">Chronicle</span>
        <nav className="flex items-center gap-6 text-sm">
          <a href="/claims-intelligence">{dict.nav.claimsIntelligence}</a>
          <a href="/claim-score">{dict.nav.claimScore}</a>
          <a href="/pricing">{dict.nav.pricing}</a>
          <a href="/dashboard">{dict.nav.clientLogin}</a>
          <LanguageSwitcher />
        </nav>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="flex flex-col gap-2 py-10 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <span>
          © {new Date().getFullYear()} Second City Assets Ltd. {dict.footer.rightsReserved}
        </span>
        <nav className="flex gap-4">
          <a href="/privacy" className="underline">{dict.footer.privacy}</a>
          <a href="/terms" className="underline">{dict.footer.terms}</a>
        </nav>
      </footer>
    </div>
  );
}
