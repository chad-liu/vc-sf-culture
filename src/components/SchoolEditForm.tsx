'use client';
import { useState, useEffect } from 'react';

const VOCATIONAL_OPTIONS = [
  '高級職業學校',
  '高級中學附設職業類科',
  '綜合高中開設專門學程',
  '高職進修學校',
  '五專前三年',
];

const EMPTY_FORM = {
  schoolNo: '', school: '', schoolFull: '', vocational: '', city: '', address: '', tel: '',
  contract: '', conTitle: '', conEmail: '', conMobile: '', password: '',
};

export default function SchoolEditForm() {
  const [cities, setCities] = useState<string[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [savedForm, setSavedForm] = useState(EMPTY_FORM);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetch('/api/cities').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setCities(data);
    });
    fetch('/api/profile').then(r => r.json()).then(data => {
      if (data.error) return;
      const loaded = {
        schoolNo:   data.schoolno || '',
        school:     data.school || '',
        schoolFull: data.schoolfull || '',
        vocational: data.vocational || '',
        city:       data.city || '',
        address:    data.address || '',
        tel:        data.tel || '',
        contract:   data.contract || '',
        conTitle:   data.contitle || '',
        conEmail:   data.conemail || '',
        conMobile:  data.conmobile || '',
        password:   data.password || '',
      };
      setForm(loaded);
      setSavedForm(loaded);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');

    const emptyField = Object.values(form).some(v => !v.trim());
    if (emptyField) {
      setMsg('錯誤：所有欄位皆為必填');
      return;
    }

    setLoading(true);
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.error) {
      setMsg(`錯誤：${data.error}`);
    } else {
      setMsg('資料已儲存');
      setSavedForm(form);
      setIsEditing(false);
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setForm(savedForm);
    setMsg('');
    setIsEditing(false);
  };

  const field = (label: string, name: keyof typeof form, type = 'text') => {
    const readOnly = !isEditing || name === 'schoolNo';
    return (
      <div className="flex items-center gap-2 mb-3">
        <label className="w-32 text-sm text-gray-700 text-right flex-shrink-0">
          {label}
        </label>
        <input
          type={type}
          name={name}
          value={form[name]}
          onChange={handleChange}
          readOnly={readOnly}
          required
          placeholder="(必填)"
          className={`flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm ${readOnly ? 'bg-gray-100' : 'bg-white'}`}
        />
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="bg-blue-50 rounded-lg p-6 max-w-xl">
      <h2 className="text-base font-bold text-gray-800 mb-4">承辦人資料編輯</h2>
      {field('學校代碼', 'schoolNo')}
      {field('學校全稱', 'schoolFull')}
      {field('學校簡稱', 'school')}
      <div className="flex items-center gap-2 mb-3">
        <label className="w-32 text-sm text-gray-700 text-right flex-shrink-0">
          職業類科
        </label>
        <select name="vocational" value={form.vocational} onChange={handleChange} required
          disabled={!isEditing}
          className={`flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm ${!isEditing ? 'bg-gray-100' : 'bg-white'}`}>
          <option value="">(必填)</option>
          {VOCATIONAL_OPTIONS.map(v => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>
      <div className="flex items-center gap-2 mb-3">
        <label className="w-32 text-sm text-gray-700 text-right flex-shrink-0">
          縣市
        </label>
        <select name="city" value={form.city} onChange={handleChange} required
          disabled={!isEditing}
          className={`flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm ${!isEditing ? 'bg-gray-100' : 'bg-white'}`}>
          <option value="">(必填)</option>
          {cities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      {field('學校地址', 'address')}
      {field('電話', 'tel')}
      {field('承辦人姓名', 'contract')}
      {field('承辦人職稱', 'conTitle')}
      {field('承辦人手機', 'conMobile')}
      {field('承辦人Email', 'conEmail', 'email')}
      <div className="flex items-center gap-2 mb-3 mt-2">
        <label className="w-32 text-sm text-gray-700 text-right flex-shrink-0">
          密碼
        </label>
        <input type="text" name="password" value={form.password} onChange={handleChange}
          readOnly={!isEditing} required placeholder="(必填)"
          className={`flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm text-black ${!isEditing ? 'bg-gray-100' : 'bg-white'}`} />
      </div>
      {msg && <p className={`text-sm mb-2 ${msg.startsWith('錯誤') ? 'text-red-600' : 'text-green-600'}`}>{msg}</p>}
      {isEditing ? (
        <div className="flex gap-3">
          <button type="submit" disabled={loading}
            className="bg-green-600 text-white px-6 py-2 rounded text-sm hover:bg-green-700 disabled:opacity-50">
            {loading ? '儲存中...' : '儲存'}
          </button>
          <button type="button" onClick={handleCancel} disabled={loading}
            className="bg-orange-500 text-white px-6 py-2 rounded text-sm hover:bg-orange-600 disabled:opacity-50">
            取消
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => { setMsg(''); setIsEditing(true); }}
          className="bg-blue-600 text-white px-6 py-2 rounded text-sm hover:bg-blue-700">
          修改
        </button>
      )}
    </form>
  );
}
