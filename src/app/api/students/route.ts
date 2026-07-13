import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSession } from '@/lib/session';

const CUL_YEAR = '2026';

export async function GET() {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: '未登入' }, { status: 401 });

  const { data, error } = await supabase
    .from('sf_cul_student')
    .select('*')
    .eq('culyear', CUL_YEAR)
    .eq('schoolno', session.schoolNo)
    .order('stuno');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: '未登入' }, { status: 401 });

  const { stuName, teaName, youtube } = await req.json();

  if (!stuName || !teaName || !youtube) {
    return NextResponse.json({ error: '所有欄位皆為必填' }, { status: 400 });
  }
  if (youtube.length !== 11) {
    return NextResponse.json({ error: 'YouTube 代碼須為 11 碼' }, { status: 400 });
  }

  // 查詢現有編號
  const { data: existing } = await supabase
    .from('sf_cul_student')
    .select('stuno')
    .like('stuno', `${session.schoolNo}-%`)
    .eq('culyear', CUL_YEAR);

  const existingNos = (existing || []).map((r) => r.stuno as string);
  const maxSeq = existingNos.length > 0
    ? Math.max(...existingNos.map((n) => parseInt(n.split('-')[1] || '0')))
    : 0;
  const stuNo = `${session.schoolNo}-${String(maxSeq + 1).padStart(2, '0')}`;

  const { error } = await supabase.from('sf_cul_student').insert({
    culyear:  CUL_YEAR,
    schoolno: session.schoolNo,
    stuno:    stuNo,
    stuname:  stuName,
    teaname:  teaName,
    youtube,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, stuNo });
}
