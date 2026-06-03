'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ImportPage() {
  const [textInput, setTextInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [dmpApiKey, setDmpApiKey] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; count: number; message: string } | null>(null);

  const handleTextImport = async () => {
    setIsImporting(true);
    try {
      const res = await fetch('/api/import/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textInput }),
      });
      const data = await res.json();
      setResult(data);
      if (data.success) setTextInput('');
    } catch (error) {
      setResult({ success: false, count: 0, message: 'Ошибка импорта' });
    } finally {
      setIsImporting(false);
    }
  };

  const handleFileImport = async () => {
    if (!file) return;
    setIsImporting(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/import/file', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setResult(data);
      if (data.success) setFile(null);
    } catch (error) {
      setResult({ success: false, count: 0, message: 'Ошибка импорта файла' });
    } finally {
      setIsImporting(false);
    }
  };

  const handleDmpImport = async () => {
    setIsImporting(true);
    try {
      const res = await fetch('/api/import/dmp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: dmpApiKey }),
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      setResult({ success: false, count: 0, message: 'Ошибка подключения к DMP.ONE' });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            ← Назад к лидам
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Импорт лидов</h1>
        </div>

        {result && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}
          >
            <p className={result.success ? 'text-green-800' : 'text-red-800'}>
              {result.message} {result.success && `(${result.count} номеров)`}
            </p>
          </div>
        )}

        <div className="space-y-6">
          {/* Импорт текстом */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Импорт текстом</h2>
            <p className="text-sm text-gray-600 mb-4">
              Вставьте номера телефонов в любом формате — каждый с новой строки или через запятую
            </p>
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={`+7 (912) 345-67-89\n89123456790\n+79123456791, 89123456792`}
              className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={handleTextImport}
              disabled={!textInput.trim() || isImporting}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isImporting ? 'Импорт...' : 'Импортировать текст'}
            </button>
          </div>

          {/* Импорт файлом */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">2. Импорт файлом</h2>
            <p className="text-sm text-gray-600 mb-4">
              Загрузите файл: CSV, TXT, Excel (.xlsx, .xls)
            </p>
            <input
              type="file"
              accept=".csv,.txt,.xlsx,.xls"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="mb-4"
            />
            {file && <p className="text-sm text-gray-600 mb-4">Файл: {file.name}</p>}
            <button
              onClick={handleFileImport}
              disabled={!file || isImporting}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isImporting ? 'Импорт...' : 'Импортировать файл'}
            </button>
          </div>

          {/* Импорт из DMP.ONE */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">3. Импорт из DMP.ONE</h2>
            <p className="text-sm text-gray-600 mb-4">
              API ключ от <a href="https://dmp.one/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">dmp.one</a>
            </p>
            <input
              type="text"
              value={dmpApiKey}
              onChange={(e) => setDmpApiKey(e.target.value)}
              placeholder="Введите API ключ от DMP.ONE"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
            />
            <button
              onClick={handleDmpImport}
              disabled={!dmpApiKey.trim() || isImporting}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isImporting ? 'Импорт...' : 'Импортировать из DMP.ONE'}
            </button>
            <p className="text-xs text-gray-500 mt-2">
              ℹ️ Если у DMP.ONE нет публичного API, можно экспортировать CSV из их интерфейса и загрузить через пункт 2
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
