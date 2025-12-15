import { NextResponse } from 'next/server';

import { removeSessionCookie } from '@/core/utils/cookies';

export async function GET() {
  await removeSessionCookie();
  return NextResponse.redirect(new URL('/admin/login', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
}

