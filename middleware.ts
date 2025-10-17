import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized: ({ token }) => Boolean(token && token.emailVerified),
  },
  pages: {
    signIn: '/login',
  },
});

export const config = {
  matcher: ['/prompts/:path*', '/account'],
};
