export { auth as middleware } from '@/lib/auth';

export const config = {
  matcher: ['/dashboard/:path*', '/revenue/:path*', '/expenses/:path*', '/cashflow/:path*', '/ar-ap/:path*', '/settings/:path*'],
};
