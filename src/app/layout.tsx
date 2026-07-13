import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '三花文化館盃學生導覽競賽',
  description: '學生導覽競賽報名系統',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
