'use client';
import { useState, useEffect, useCallback } from 'react';
import StudentFormModal from './StudentFormModal';

interface Student {
  id: number;
  stuno: string;
  stuname: string;
  teaname: string;
  youtube: string;
  isfinal: boolean;
}

export default function StudentTable() {
  const [students, setStudents] = useState<Student[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const load = useCallback(async () => {
    const res = await fetch('/api/students');
    const data = await res.json();
    if (Array.isArray(data)) setStudents(data);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: number) => {
    await fetch(`/api/students/${id}`, { method: 'DELETE' });
    setDeleteConfirm(null);
    load();
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => { setEditStudent(null); setShowModal(true); }}
          className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm hover:bg-blue-700">
          新增參賽學生
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-blue-800 text-white">
              <th className="px-3 py-2 text-left whitespace-nowrap">學生編號</th>
              <th className="px-3 py-2 text-left whitespace-nowrap">學生姓名</th>
              <th className="px-3 py-2 text-left whitespace-nowrap">指導老師</th>
              <th className="px-3 py-2 text-left whitespace-nowrap">Youtube(11碼)</th>
              <th className="px-3 py-2 text-left whitespace-nowrap">影片</th>
              <th className="px-3 py-2 text-left whitespace-nowrap">入決賽</th>
              <th className="px-3 py-2 text-left whitespace-nowrap">操作</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 && (
              <tr><td colSpan={7} className="text-center py-6 text-gray-400">尚無資料</td></tr>
            )}
            {students.map((s, i) => (
              <tr key={s.id} className={i % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
                <td className="px-3 py-2 whitespace-nowrap font-mono text-xs">{s.stuno}</td>
                <td className="px-3 py-2 whitespace-nowrap">{s.stuname}</td>
                <td className="px-3 py-2 whitespace-nowrap">{s.teaname}</td>
                <td className="px-3 py-2 font-mono text-xs whitespace-nowrap">{s.youtube}</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {s.youtube && (
                    <a href={`https://www.youtube.com/watch?v=${s.youtube}`} target="_blank"
                      rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs">
                      測試瀏覽
                    </a>
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {s.isfinal
                    ? <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded">是</span>
                    : <span className="text-xs bg-gray-300 text-gray-600 px-2 py-0.5 rounded">否</span>}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {deleteConfirm === s.id ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-red-600">確認刪除?</span>
                      <button onClick={() => handleDelete(s.id)}
                        className="bg-red-600 text-white px-2.5 py-1 rounded text-xs hover:bg-red-700 transition-colors">是</button>
                      <button onClick={() => setDeleteConfirm(null)}
                        className="bg-gray-200 text-gray-700 px-2.5 py-1 rounded text-xs hover:bg-gray-300 transition-colors">否</button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => { setEditStudent(s); setShowModal(true); }}
                        className="bg-blue-600 text-white px-2.5 py-1 rounded text-xs hover:bg-blue-700 transition-colors">編輯</button>
                      <button onClick={() => setDeleteConfirm(s.id)}
                        className="bg-red-500 text-white px-2.5 py-1 rounded text-xs hover:bg-red-600 transition-colors">刪除</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <StudentFormModal
          student={editStudent}
          onClose={() => { setShowModal(false); setEditStudent(null); }}
          onSaved={() => { setShowModal(false); setEditStudent(null); load(); }}
        />
      )}
    </div>
  );
}
