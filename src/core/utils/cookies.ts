import { cookies } from 'next/headers';

const COOKIE_NAME = 'evopress_session';

export async function setSessionCookie(token: string) {
  const c = await cookies();
  
  // Em desenvolvimento (localhost), secure deve ser false se não usar https
  const isProduction = process.env.NODE_ENV === 'production';

  c.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction, // False em dev para funcionar no localhost
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 dias
  });
}

export async function getSessionCookie() {
  const c = await cookies();
  return c.get(COOKIE_NAME)?.value;
}

export async function removeSessionCookie() {
  const c = await cookies();
  c.delete(COOKIE_NAME);
}
