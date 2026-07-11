import { type NextAuthOptions, getServerSession } from 'next-auth';
import AzureADProvider from 'next-auth/providers/azure-ad';

// Claims Intelligence sign-in ONLY — consultants/your team sign in with
// their existing Microsoft 365 work account (Entra ID OAuth), no separate
// password. Claim Score subcontractors do NOT go through this file at all;
// see lib/magic-link.ts for their separate, database-free passwordless
// flow. Both paths end up minting the same shape of NextAuth JWT session
// cookie (see note in magic-link.ts), so getSessionUser() below and the
// route-guarding in middleware.ts work uniformly across both products.
//
// Decision + rationale recorded in build-decisions.md (Q5, 2026-07-09).

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' }, // no database adapter needed
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID!,
    }),
  ],
  pages: {
    signIn: '/dashboard/signin',
  },
  callbacks: {
      async jwt({ token, account }) {
                // Anyone arriving via this provider is, by definition, a Claims
                // Intelligence consultant signing in with a Microsoft account.
                if (account?.provider === 'azure-ad') {
                            token.userType = 'consultant';
                }
                return token;
      },
    async session({ session, token }) {
      session.userType = token.userType as 'consultant' | 'subcontractor' | undefined;
      return session;
    },
  },
};

/** Server-side helper — use in server components/route handlers. */
export function getSessionUser() {
  return getServerSession(authOptions);
}
