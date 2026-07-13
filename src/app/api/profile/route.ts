import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSession } from '@/lib/session';

export async function GET() {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: '未登入' }, { status: 401 });

  const { data, error } = await supabase
    .from('sf_cul_school')
    .select('*')
    .eq('id', session.id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: '未登入' }, { status: 401 });

  const body = await req.json();
  const { school, schoolFull, vocational, city, address, tel, contract, conTitle, conEmail, conMobile, password } = body;

  if (!school || !schoolFull || !vocational || !city || !address || !tel || !contract || !conTitle || !conEmail || !conMobile || !password) {
    return NextResponse.json({ error: '所有欄位皆為必填' }, { status: 400 });
  }

  const { error } = await supabase
    .from('sf_cul_school')
    .update({
      school,
      schoolfull: schoolFull,
      vocational,
      city,
      address,
      tel,
      contract,
      contitle:  conTitle,
      conemail:  conEmail,
      conmobile: conMobile,
      password,
    })
    .eq('id', session.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // 同步更新 session 中的資料
  session.school = school;
  session.schoolFull = schoolFull;
  session.mobile = conMobile;
  session.contract = contract;
  session.conTitle = conTitle;
  await session.save();

  return NextResponse.json({ ok: true });
}
