import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { apiKey } = await request.json();

    // DMP.ONE не имеет публичного API в их документации
    // Это заглушка для будущей интеграции
    // Пользователь должен экспортировать CSV из DMP.ONE и загрузить через импорт файла

    return NextResponse.json({
      success: false,
      count: 0,
      message:
        'DMP.ONE не предоставляет публичный API. Экспортируйте данные в CSV из интерфейса DMP.ONE и загрузите через "Импорт файлом"',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, count: 0, message: 'Ошибка подключения' },
      { status: 500 }
    );
  }
}
