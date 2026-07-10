import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    userType?: 'consultant' | 'subcontractor';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userType?: 'consultant' | 'subcontractor';
  }
}
