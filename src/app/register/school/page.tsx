'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const VOCATIONAL_OPTIONS = [
  '高級職業學校',
  '高級中學附設職業類科',
  '綜合高中開設專門學程',
  '高職進修學校',
  '五專前三年',
];

export default function SchoolRegisterPage() {
  const router = useRouter();
  const [cities, setCities] = useState<string[]>([]);
  const [form, setForm] = useState({
    schoolNo: '', school: '', schoolFull: '', vocational: '', city: '', address: '', tel: '',
    contract: '', conTitle: '', conEmail: '', conMobile: '',
  });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/cities').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setCities(data);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { schoolNo, school, schoolFull, vocational, city, address, tel, contract, conTitle, conEmail, conMobile } = form;
    if (!schoolNo.trim() || !school.trim() || !schoolFull.trim() || !vocational.trim() || !city.trim() || !address.trim() || !tel.trim()
      || !contract.trim() || !conTitle.trim() || !conEmail.trim() || !conMobile.trim()) {
      setMsg('所有欄位皆為必填');
      return;
    }

    setLoading(true);
    setMsg('');
    const res = await fetch('/api/register/school', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.error) {
      setMsg(data.error);
      setLoading(false);
      return;
    }
    alert(`申請成功！請以學校代碼 ${form.schoolNo} 和行動電話 ${form.conMobile} 登入。`);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex items-start justify-center pt-8">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg overflow-hidden">
        <div className="bg-blue-700 text-white text-center py-3 px-6">
          <h1 className="text-base font-bold">承辦人申請</h1>
        </div>
        <form onSubmit={handleSubmit} className="p-6 bg-blue-50">
          <div className="flex items-center gap-2 mb-3">
            <label className="w-28 text-sm text-gray-700 text-right flex-shrink-0">
              學校代碼
            </label>
            <input type="text" name="schoolNo" value={form.schoolNo} onChange={handleChange}
              placeholder="(必填)"
              className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm bg-white" />
            <a
              href="https://iss.ntus.edu.tw/open/school"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 whitespace-nowrap"
            >
              代碼查詢
            </a>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <label className="w-28 text-sm text-gray-700 text-right flex-shrink-0">學校全稱</label>
            <input type="text" name="schoolFull" value={form.schoolFull} onChange={handleChange}
              placeholder="(必填)"
              className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm bg-white" />
          </div>
          <div className="flex items-center gap-2 mb-3">
            <label className="w-28 text-sm text-gray-700 text-right flex-shrink-0">學校簡稱</label>
            <input type="text" name="school" value={form.school} onChange={handleChange}
              placeholder="(必填)"
              className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm bg-white" />
          </div>
          <div className="flex items-center gap-2 mb-3">
            <label className="w-28 text-sm text-gray-700 text-right flex-shrink-0">職業類科</label>
            <select name="vocational" value={form.vocational} onChange={handleChange}
              className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm bg-white">
              <option value="">請選擇職業類科</option>
              {VOCATIONAL_OPTIONS.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <label className="w-28 text-sm text-gray-700 text-right flex-shrink-0">縣市</label>
            <select name="city" value={form.city} onChange={handleChange}
              className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm bg-white">
              <option value="">請選擇縣市</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <label className="w-28 text-sm text-gray-700 text-right flex-shrink-0">學校地址</label>
            <input type="text" name="address" value={form.address} onChange={handleChange}
              placeholder="(必填)"
              className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm bg-white" />
          </div>
          <div className="flex items-center gap-2 mb-3">
            <label className="w-28 text-sm text-gray-700 text-right flex-shrink-0">電話</label>
            <input type="text" name="tel" value={form.tel} onChange={handleChange}
              placeholder="(必填)"
              className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm bg-white" />
          </div>
          <div className="flex items-center gap-2 mb-3">
            <label className="w-28 text-sm text-gray-700 text-right flex-shrink-0">
              承辦人姓名
            </label>
            <input type="text" name="contract" value={form.contract} onChange={handleChange}
              placeholder="(必填)"
              className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm bg-white" />
          </div>
          <div className="flex items-center gap-2 mb-3">
            <label className="w-28 text-sm text-gray-700 text-right flex-shrink-0">承辦人職稱</label>
            <input type="text" name="conTitle" value={form.conTitle} onChange={handleChange}
              placeholder="(必填)"
              className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm bg-white" />
          </div>
          <div className="flex items-center gap-2 mb-3">
            <label className="w-28 text-sm text-gray-700 text-right flex-shrink-0">
              承辦人手機
            </label>
            <input type="tel" name="conMobile" value={form.conMobile} onChange={handleChange}
              maxLength={10}
              placeholder="必填，為預設密碼"
              className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm bg-white" />
          </div>
          <div className="flex items-center gap-2 mb-3">
            <label className="w-28 text-sm text-gray-700 text-right flex-shrink-0">承辦人Email</label>
            <input type="email" name="conEmail" value={form.conEmail} onChange={handleChange}
              placeholder="(必填)"
              className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm bg-white" />
          </div>
          {msg && <p className="text-sm mb-3 text-red-600">{msg}</p>}
          <div className="flex gap-3 justify-end">
            <Link href="/" className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 bg-white">返回</Link>
            <button type="submit" disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50">
              {loading ? '申請中...' : '申請確定'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
