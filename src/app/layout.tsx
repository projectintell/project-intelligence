import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Project Intelligence',
  description:
    'Claims Intelligence and Claim Score — AI-assisted construction claims analysis.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
