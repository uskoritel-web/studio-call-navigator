type Lead = {
  segment?: string | null;
  subsegment?: string | null;
  finishingType?: string | null;
  scenario?: string | null;
  needsAcceptance?: boolean;
  mainPain?: string | null;
};

export function getRecommendedRoute(lead: Lead) {
  const warnings: string[] = [];
  const suggestedServices: string[] = [];
  const nextActions: string[] = [];
  let funnel = '';
  let operatorHint = '';

  // Приёмка
  if (lead.needsAcceptance) {
    funnel = 'Приёмка → Прогрев';
    operatorHint = 'Предложить приёмку квартиры перед ремонтом, затем вернуться к проекту и ремонту';
    suggestedServices.push('Приёмка');
    nextActions.push('Назначить приёмку', 'После приёмки вернуться к клиенту');
    return { funnel, operatorHint, suggestedServices, nextActions, warnings };
  }

  // Новостройка
  if (lead.segment === 'Новостройка') {
    if (lead.finishingType === 'Бетон') {
      funnel = 'Полный комплекс';
      operatorHint =
        'Для квартиры в бетоне лучше начинать с дизайн-проекта. Предлагать полный комплекс: проект → ремонт → комплектация → мебель.';
      suggestedServices.push('Дизайн-проект', 'Ремонт', 'Комплектация', 'Кухня', 'Корпусная мебель');
      nextActions.push('Назначить консультацию по дизайн-проекту');
      warnings.push('⚠️ Не считать ремонт на глаз без проекта');
    } else if (lead.finishingType === 'Whitebox') {
      funnel = 'Полный комплекс';
      operatorHint =
        'В whitebox важно проверить электрику, санузлы, материалы. Можно предложить проект или ремонт без дизайна.';
      suggestedServices.push('Дизайн-проект', 'Ремонт', 'Комплектация', 'Кухня', 'Корпусная мебель');
      nextActions.push('Уточнить электрику', 'Уточнить санузлы', 'Предложить консультацию');
    } else if (lead.finishingType === 'Чистовая') {
      if (lead.scenario === 'Сохраняют отделку') {
        funnel = 'Кухня и мебель';
        operatorHint =
          'Отделку сохраняют — не предлагать дизайн и ремонт. Предложить кухню, шкафы, мебель в санузел, частичную комплектацию.';
        suggestedServices.push('Кухня', 'Корпусная мебель', 'Переделка санузла', 'Комплектация');
        nextActions.push('Уточнить нужна ли кухня', 'Уточнить нужны ли шкафы');
        warnings.push('⚠️ Если ничего не планируют менять — не тратить время');
      } else if (lead.scenario === 'Капитальная переделка') {
        funnel = 'Полный комплекс';
        operatorHint = 'Капитальная переделка чистовой — начинать с проекта, учитывать демонтаж.';
        suggestedServices.push('Дизайн-проект', 'Ремонт', 'Комплектация', 'Кухня', 'Корпусная мебель');
        nextActions.push('Назначить консультацию');
      } else {
        funnel = 'Кухня и мебель';
        operatorHint = 'Уточнить планы клиента: сохраняют отделку или переделывают.';
        nextActions.push('Уточнить планы с отделкой');
      }
    }
  }

  // Вторичка
  if (lead.segment === 'Вторичка') {
    if (
      lead.mainPain?.includes('перепланировка') ||
      lead.mainPain?.includes('узаконивание') ||
      lead.mainPain?.includes('газ')
    ) {
      funnel = 'Вторичка — короткая воронка';
      operatorHint = 'Не тратить много времени. Предложить дорогой дизайн-проект, один follow-up.';
      suggestedServices.push('Дизайн-проект');
      nextActions.push('Предложить проект', 'Один follow-up через 7-30 дней');
      warnings.push('⚠️ Не уходить в бесплатные консультации по перепланировке');
    } else {
      funnel = 'Дизайн-проект';
      operatorHint = 'Для вторички важен проект — оценить состояние, перепланировку, бюджет.';
      suggestedServices.push('Дизайн-проект', 'Ремонт', 'Комплектация');
      nextActions.push('Предложить консультацию');
    }
  }

  // Коммерция
  if (lead.segment === 'Коммерция') {
    funnel = 'Полный комплекс';
    operatorHint = 'Для коммерции важны сроки, бюджет, функциональность. Предложить концепцию и рабочий проект.';
    suggestedServices.push('Дизайн-проект', 'Ремонт', 'Комплектация', 'Корпусная мебель');
    nextActions.push('Уточнить сроки открытия', 'Уточнить ЛПР', 'Предложить консультацию');
  }

  return { funnel, operatorHint, suggestedServices, nextActions, warnings };
}
