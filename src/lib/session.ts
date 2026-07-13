import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

export interface SessionData {
  isLoggedIn: boolean;
  id: number;
  schoolNo: string;
  school: string;
  schoolFull: string;
  mobile: string;
  contract: string;
  conTitle: string;
}

export const sessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: 'culture-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}
