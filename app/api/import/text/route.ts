import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    // Парсим номера из текста
    const phoneRegex = /[\+]?[0-9]{10,15}/g;
    const matches = text.match(phoneRegex);

    if (!matches || matches.length === 0) {
      return NextResponse.json(
        { success: false, count: 0, message: 'Номера не найдены' },
        { status: 400 }
      );
    }

    // Создаём лидов
    const created = [];
    for (const phone of matches) {
      const normalized = phone.replace(/[^\d]/g, '');

      // Проверка на дубликат
      const existing = await prisma.lead.findFirst({
        where: { phone: { contains: normalized.slice(-10) } },
      });

      if (!existing) {
        const lead = await prisma.lead.create({
          data: {
            phone: normalized,
            source: 'Импорт текстом',
            status: 'Новый',
          },
        });
        created.push(lead);
      }
    }

    return NextResponse.json({
      success: true,
      count: created.length,
      message: `Импортировано ${created.length} из ${matches.length} номеров`,
    });
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json(
      { success: false, count: 0, message: 'Ошибка импорта' },
      { status: 500 }
    );
  }
}
