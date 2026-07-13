import type { Metadata } from 'next';
import './globals.css';
import { AuthSessionProvider } from '@/components/auth-session-provider';
import { getLocale } from '@/lib/i18n/get-locale';

export const metadata: Metadata = {
  title: 'Chronicle',
  description:
    'Claims Intelligence and Claim Score — AI-assisted construction claims analysis.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Only 'en' exists today, so this always resolves to "en" — but wiring
  // it through getLocale() now means the <html lang> attribute (used by
  // screen readers, translation tools, and search engines) is already
  // correct the moment a second language is added. See src/lib/i18n/.
  const locale = getLocale();

  return (
    <html lang={locale}>
      <body className="min-h-screen bg-white text-slate-900 antialiased">
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  );
}
