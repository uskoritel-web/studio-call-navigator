import { getRecommendedRoute } from '@/lib/routing';
import { calculateLeadScore } from '@/lib/scoring';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { mockLeads, mockScripts } from '@/lib/mock-data';

export default async function CallPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = mockLeads.find(l => l.id === id);

  if (!lead) {
    notFound();
  }

  const route = getRecommendedRoute(lead);
  const score = calculateLeadScore(lead);

  const scripts = mockScripts.filter(
    s => s.segment === lead.segment || s.subsegment === lead.subsegment || !s.segment
  ).slice(0, 10);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Хедер */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-blue-600 hover:text-blue-700">
              ← Назад
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{lead.name || lead.phone}</h1>
              <p className="text-sm text-gray-600">{lead.status}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
              Не дозвонились
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Завершить звонок
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Левая колонка — Карточка лида */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Карточка лида</h2>

            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Телефон:</span>
                <p className="font-medium">{lead.phone}</p>
              </div>

              {lead.city && (
                <div>
                  <span className="text-sm text-gray-600">Город:</span>
                  <p className="font-medium">{lead.city}</p>
                </div>
              )}

              {lead.source && (
                <div>
                  <span className="text-sm text-gray-600">Источник:</span>
                  <p className="font-medium">{lead.source}</p>
                </div>
              )}

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Fit Score:</span>
                  <span className="text-lg font-bold text-blue-600">{score.fitScore}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Intent Score:</span>
                  <span className="text-lg font-bold text-green-600">{score.intentScore}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Grade:</span>
                  <span
                    className={`px-3 py-1 text-sm font-bold rounded-full ${
                      score.leadGrade === 'A'
                        ? 'bg-green-100 text-green-800'
                        : score.leadGrade === 'B'
                        ? 'bg-blue-100 text-blue-800'
                        : score.leadGrade === 'C'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {score.leadGrade}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Центральная колонка — Классификация */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Классификация</h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Тип объекта:</p>
                <div className="grid grid-cols-3 gap-2">
                  {['Новостройка', 'Вторичка', 'Коммерция'].map((seg) => (
                    <button
                      key={seg}
                      className={`px-4 py-2 rounded text-sm font-medium ${
                        lead.segment === seg
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {seg}
                    </button>
                  ))}
                </div>
              </div>

              {lead.segment === 'Новостройка' && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Тип отделки:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {['Бетон', 'Whitebox', 'Чистовая'].map((type) => (
                      <button
                        key={type}
                        className={`px-4 py-2 rounded text-sm font-medium ${
                          lead.finishingType === type
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t">
                <p className="text-sm font-semibold text-gray-700 mb-2">Рекомендуемая воронка:</p>
                <p className="text-lg font-bold text-purple-600">{route.funnel || 'Не определена'}</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Предлагаемые услуги:</p>
                <div className="flex flex-wrap gap-2">
                  {route.suggestedServices.map((service) => (
                    <span key={service} className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Правая колонка — Подсказки */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Подсказки оператору</h2>

            <div className="space-y-4">
              {route.operatorHint && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-semibold text-blue-900 mb-1">Что сказать:</p>
                  <p className="text-sm text-blue-800">{route.operatorHint}</p>
                </div>
              )}

              {route.nextActions.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Следующий шаг:</p>
                  <ul className="space-y-1">
                    {route.nextActions.map((action, idx) => (
                      <li key={idx} className="text-sm text-gray-700">
                        • {action}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {route.warnings.length > 0 && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm font-semibold text-yellow-900 mb-1">Предупреждения:</p>
                  {route.warnings.map((warning, idx) => (
                    <p key={idx} className="text-sm text-yellow-800">
                      {warning}
                    </p>
                  ))}
                </div>
              )}

              {scripts.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Скрипты:</p>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {scripts.slice(0, 5).map((script) => (
                      <div key={script.id} className="p-3 bg-gray-50 rounded text-xs">
                        <p className="font-semibold text-gray-900 mb-1">{script.title}</p>
                        <p className="text-gray-700">{script.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
