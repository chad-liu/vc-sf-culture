import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSession } from '@/lib/session';

export async function POST(req: NextRequest) {
  const { account, password } = await req.json();

  if (!account || !password) {
    return NextResponse.json({ error: '請輸入帳號和密碼' }, { status: 400 });
  }

  const trimmedAccount = account.trim();
  const trimmedPassword = password.trim();

  const { data: schoolUser } = await supabase
    .from('sf_cul_school')
    .select('*')
    .eq('schoolno', trimmedAccount)
    .eq('password', trimmedPassword)
    .single();

  if (!schoolUser) {
    return NextResponse.json({ error: '帳號或密碼錯誤' }, { status: 401 });
  }

  const session = await getSession();
  session.isLoggedIn = true;
  session.id = schoolUser.id;
  session.schoolNo = schoolUser.schoolno;
  session.school = schoolUser.school;
  session.schoolFull = schoolUser.schoolfull;
  session.mobile = schoolUser.conmobile;
  session.contract = schoolUser.contract;
  session.conTitle = schoolUser.contitle;
  await session.save();

  return NextResponse.json({ ok: true });
}
