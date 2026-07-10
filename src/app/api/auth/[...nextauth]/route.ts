import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

// Claims Intelligence's Microsoft sign-in only. Claim Score's magic-link
// flow lives under src/app/claim-score/api/auth/ instead — see
// lib/magic-link.ts for why it doesn't go through NextAuth's own handler.
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
