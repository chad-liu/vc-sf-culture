import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// API routes run server-side only; use service role key to bypass RLS
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// sf_reference「文化館盃-承辦人輸入」為「是」時，承辦人才可新增/編輯/刪除學生資料
export async function canEditStudents(): Promise<boolean> {
  const { data } = await supabase
    .from('sf_reference')
    .select('value')
    .eq('name', '文化館盃-承辦人輸入')
    .single();
  return data?.value === '是';
}
