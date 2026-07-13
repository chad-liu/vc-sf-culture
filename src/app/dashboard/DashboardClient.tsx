'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Notice from '@/components/Notice';
import SchoolEditForm from '@/components/SchoolEditForm';
import StudentTable from '@/components/StudentTable';

type Tab = 'notice' | 'profile' | 'students';

interface Props {
  school: string;
  contract: string;
  conTitle: string;
}

export default function DashboardClient({ school, contract, conTitle }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('notice');

  const headerName = `${school}-${contract}${conTitle}`;

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  const tabClass = (t: Tab) =>
    `px-5 py-2 text-sm font-medium rounded-t-md border-t border-l border-r transition-colors ${
      tab === t
        ? 'bg-white text-blue-700 border-gray-300 border-b-white -mb-px relative z-10'
        : 'bg-gray-100 text-gray-600 border-transparent hover:bg-gray-200'
    }`;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="text-white px-6 py-3 flex items-center justify-between" style={{ backgroundColor: '#0E1D49' }}>
        <div className="flex items-center">
          <a href="https://sunflower.org.tw/" target="_blank" rel="noopener noreferrer" className="mr-2 flex items-center">
            <img
              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/sf_images/TopLogo.png`}
              alt=""
              style={{ height: '16px' }}
            />
          </a>
          <span className="font-bold text-sm mr-3">三花文化館盃學生導覽競賽</span>
          <span className="text-xs bg-blue-600 px-3 py-1.5 rounded">{headerName}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleLogout}
            className="text-xs bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded">
            登出
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 pt-4">
        <div className="flex gap-1 border-b border-gray-300">
          <button className={tabClass('notice')} onClick={() => setTab('notice')}>注意事項</button>
          <button className={tabClass('profile')} onClick={() => setTab('profile')}>資料編輯</button>
          <button className={tabClass('students')} onClick={() => setTab('students')}>參賽學生</button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-6 py-5">
        {tab === 'notice' && <Notice />}
        {tab === 'profile' && <SchoolEditForm />}
        {tab === 'students' && <StudentTable />}
      </div>
    </div>
  );
}
