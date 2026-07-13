'use client';
import { useState, useEffect } from 'react';

interface NewsItem {
  id: number;
  news: string;
}

export default function Notice() {
  const [items, setItems] = useState<NewsItem[]>([]);

  useEffect(() => {
    fetch('/api/notice')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setItems(data); });
  }, []);

  return (
    <div className="bg-white rounded-lg p-6 max-w-2xl">
      <h2 className="text-lg font-bold text-gray-800 mb-4">注意事項</h2>
      <ol className="space-y-4 text-gray-700 text-sm leading-relaxed list-decimal list-inside">
        {items.map(item => (
          <li key={item.id}>{item.news}</li>
        ))}
      </ol>

      <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-700 space-y-1">
        <p>
          <a
            href="https://sunflower.org.tw/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 hover:underline"
          >
            三花基金會官網
          </a>
        </p>
      </div>
    </div>
  );
}
