import Link from 'next/link';
import { mockLeads } from '@/lib/mock-data';

export default async function HomePage() {
  const leads = mockLeads;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Demo banner */}
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>🚧 Demo-версия</strong> — используются моковые данные. Для полного функционала подключите БД (Neon, Turso или др.)
          </p>
        </div>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Studio Call Navigator</h1>
          <div className="flex gap-3">
            <Link
              href="/import"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              + Импорт лидов
            </Link>
            <Link
              href="/map"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Карта сегментов
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Список лидов</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {leads.map((lead) => (
              <Link
                key={lead.id}
                href={`/call/${lead.id}`}
                className="block px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        {lead.name || 'Без имени'}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          lead.leadGrade === 'A'
                            ? 'bg-green-100 text-green-800'
                            : lead.leadGrade === 'B'
                            ? 'bg-blue-100 text-blue-800'
                            : lead.leadGrade === 'C'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {lead.leadGrade || '—'}
                      </span>
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                        {lead.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{lead.phone}</p>
                    <div className="flex gap-4 mt-2 text-sm text-gray-500">
                      {lead.segment && <span>📍 {lead.segment}</span>}
                      {lead.finishingType && <span>🏠 {lead.finishingType}</span>}
                      {lead.city && <span>📌 {lead.city}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Fit: {lead.fitScore}</div>
                      <div className="text-sm text-gray-500">Intent: {lead.intentScore}</div>
                    </div>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
                      Позвонить
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {leads.length === 0 && (
            <div className="px-6 py-12 text-center text-gray-500">
              Лидов пока нет. Запустите seed: npm run db:seed
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
