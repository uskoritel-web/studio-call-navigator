import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import Papa from 'papaparse';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, count: 0, message: 'Файл не найден' },
        { status: 400 }
      );
    }

    const text = await file.text();
    const ext = file.name.split('.').pop()?.toLowerCase();

    let phones: string[] = [];

    if (ext === 'csv' || ext === 'txt') {
      // Парсим CSV/TXT
      const parsed = Papa.parse(text, { header: false });
      const allCells = parsed.data.flat();

      const phoneRegex = /[\+]?[0-9]{10,15}/g;
      allCells.forEach((cell: any) => {
        if (typeof cell === 'string') {
          const matches = cell.match(phoneRegex);
          if (matches) phones.push(...matches);
        }
      });
    } else if (ext === 'xlsx' || ext === 'xls') {
      // Для Excel потребуется библиотека xlsx, пока парсим как текст
      const phoneRegex = /[\+]?[0-9]{10,15}/g;
      const matches = text.match(phoneRegex);
      if (matches) phones = matches;
    } else {
      return NextResponse.json(
        { success: false, count: 0, message: 'Неподдерживаемый формат файла' },
        { status: 400 }
      );
    }

    if (phones.length === 0) {
      return NextResponse.json(
        { success: false, count: 0, message: 'Номера не найдены в файле' },
        { status: 400 }
      );
    }

    // Создаём лидов
    const created = [];
    for (const phone of phones) {
      const normalized = phone.replace(/[^\d]/g, '');

      const existing = await prisma.lead.findFirst({
        where: { phone: { contains: normalized.slice(-10) } },
      });

      if (!existing) {
        const lead = await prisma.lead.create({
          data: {
            phone: normalized,
            source: `Импорт файла: ${file.name}`,
            status: 'Новый',
          },
        });
        created.push(lead);
      }
    }

    return NextResponse.json({
      success: true,
      count: created.length,
      message: `Импортировано ${created.length} из ${phones.length} номеров`,
    });
  } catch (error) {
    console.error('File import error:', error);
    return NextResponse.json(
      { success: false, count: 0, message: 'Ошибка импорта файла' },
      { status: 500 }
    );
  }
}
