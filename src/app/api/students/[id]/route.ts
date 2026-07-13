import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSession } from '@/lib/session';

async function verifyOwnership(id: string, session: Awaited<ReturnType<typeof getSession>>) {
  const { data } = await supabase
    .from('sf_cul_student')
    .select('schoolno')
    .eq('id', id)
    .single();

  if (!data) return false;
  return data.schoolno === session.schoolNo;
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: '未登入' }, { status: 401 });

  const { id } = await params;
  const owned = await verifyOwnership(id, session);
  if (!owned) return NextResponse.json({ error: '無權限修改此筆資料' }, { status: 403 });

  const { stuName, teaName, youtube } = await req.json();

  if (!stuName || !teaName || !youtube) {
    return NextResponse.json({ error: '所有欄位皆為必填' }, { status: 400 });
  }
  if (youtube.length !== 11) {
    return NextResponse.json({ error: 'YouTube 代碼須為 11 碼' }, { status: 400 });
  }

  const { error } = await supabase
    .from('sf_cul_student')
    .update({ stuname: stuName, teaname: teaName, youtube })
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: '未登入' }, { status: 401 });

  const { id } = await params;
  const owned = await verifyOwnership(id, session);
  if (!owned) return NextResponse.json({ error: '無權限刪除此筆資料' }, { status: 403 });

  const { error } = await supabase.from('sf_cul_student').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
