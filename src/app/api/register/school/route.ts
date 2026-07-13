import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const CUL_YEAR = '2026';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { schoolNo, school, schoolFull, vocational, city, address, tel, contract, conTitle, conEmail, conMobile } = body;

  if (!schoolNo || !school || !schoolFull || !vocational || !city || !address || !tel || !contract || !conTitle || !conEmail || !conMobile) {
    return NextResponse.json({ error: '所有欄位皆為必填' }, { status: 400 });
  }

  // 確認是否已申請過
  const { data: existing } = await supabase
    .from('sf_cul_school')
    .select('contract')
    .eq('schoolno', schoolNo)
    .eq('culyear', CUL_YEAR)
    .single();

  if (existing) {
    return NextResponse.json({ error: `此代號已由${existing.contract}申請` }, { status: 409 });
  }

  const { error } = await supabase.from('sf_cul_school').insert({
    culyear:    CUL_YEAR,
    schoolno:   schoolNo,
    school,
    schoolfull: schoolFull,
    vocational,
    city,
    address,
    tel,
    contract,
    contitle:   conTitle,
    conemail:   conEmail,
    conmobile:  conMobile,
    password:   conMobile,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
