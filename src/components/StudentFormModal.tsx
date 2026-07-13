'use client';
import { useState, useEffect } from 'react';

interface StudentData {
  id?: number;
  stuno?: string;
  stuname?: string;
  teaname?: string;
  youtube?: string;
}

interface Props {
  student?: StudentData | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function StudentFormModal({ student, onClose, onSaved }: Props) {
  const isEdit = !!student?.id;
  const [form, setForm] = useState({ stuName: '', teaName: '', youtube: '' });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (student) {
      setForm({
        stuName: student.stuname || '',
        teaName: student.teaname || '',
        youtube: student.youtube || '',
      });
    }
  }, [student]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');

    if (!form.stuName.trim() || !form.teaName.trim() || !form.youtube.trim()) {
      setMsg('所有欄位皆為必填');
      return;
    }
    if (form.youtube.length !== 11) {
      setMsg('YouTube 代碼須為 11 碼');
      return;
    }

    setLoading(true);
    const url = isEdit ? `/api/students/${student!.id}` : '/api/students';
    const method = isEdit ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.error) {
      setMsg(`錯誤：${data.error}`);
      setLoading(false);
      return;
    }
    onSaved();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="bg-blue-800 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
          <span className="font-semibold text-sm">{isEdit ? '編輯學生資料' : '新增參賽學生'}</span>
          <button onClick={onClose} className="text-white hover:text-gray-200 text-xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-5">
          {isEdit && (
            <div className="flex items-center gap-2 mb-2.5">
              <label className="w-24 text-sm text-gray-700 text-right flex-shrink-0">學生編號</label>
              <span className="text-sm text-gray-600">{student?.stuno}</span>
            </div>
          )}
          <div className="flex items-center gap-2 mb-2.5">
            <label className="w-24 text-sm text-gray-700 text-right flex-shrink-0">學生姓名</label>
            <input type="text" name="stuName" value={form.stuName} onChange={handleChange}
              required placeholder="(必填)"
              className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm" />
          </div>
          <div className="flex items-center gap-2 mb-2.5">
            <label className="w-24 text-sm text-gray-700 text-right flex-shrink-0">指導老師</label>
            <input type="text" name="teaName" value={form.teaName} onChange={handleChange}
              required placeholder="(必填)"
              className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm" />
          </div>
          <div className="flex items-center gap-2 mb-2.5">
            <label className="w-24 text-sm text-gray-700 text-right flex-shrink-0">
              Youtube<br/>(11碼)
            </label>
            <input type="text" name="youtube" value={form.youtube} onChange={handleChange} maxLength={11}
              required placeholder="(必填)"
              className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm" />
          </div>
          {msg && <p className="text-red-600 text-sm mb-2">{msg}</p>}
          <div className="flex justify-end gap-2 mt-3">
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50">取消</button>
            <button type="submit" disabled={loading}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
              {loading ? '儲存中...' : '確認'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
