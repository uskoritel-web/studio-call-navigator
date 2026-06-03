type Lead = {
  segment?: string | null;
  finishingType?: string | null;
  scenario?: string | null;
  budgetRange?: string | null;
  keyDate?: Date | null;
  needsAcceptance?: boolean;
  needsDesign?: boolean;
  needsCompletion?: boolean;
  needsFurniture?: boolean;
  hasDesigner?: boolean;
  hasContractor?: boolean;
  doNotCall?: boolean;
  mainPain?: string | null;
};

export function calculateLeadScore(lead: Lead) {
  let fitScore = 0;
  let intentScore = 0;
  const reasons: string[] = [];

  // Не звонить = 0
  if (lead.doNotCall) {
    return { fitScore: 0, intentScore: 0, leadGrade: 'D' as const, reasons: ['Запрет коммуникации'] };
  }

  // Fit Score
  if (lead.segment === 'Новостройка') {
    if (lead.finishingType === 'Бетон') {
      fitScore += 30;
      reasons.push('Новостройка в бетоне — высокий приоритет');
    } else if (lead.finishingType === 'Whitebox') {
      fitScore += 25;
      reasons.push('Новостройка whitebox — высокий приоритет');
    } else if (lead.finishingType === 'Чистовая') {
      fitScore += 15;
      reasons.push('Чистовая отделка — средний приоритет');
    }
  } else if (lead.segment === 'Вторичка') {
    fitScore -= 10;
    reasons.push('Вторичка — низкий приоритет');
    if (lead.mainPain?.includes('перепланировка')) {
      fitScore -= 5;
      reasons.push('Перепланировка во вторичке — риск долгой обработки');
    }
  } else if (lead.segment === 'Коммерция') {
    fitScore += 20;
    reasons.push('Коммерция — хороший сегмент');
  }

  if (lead.budgetRange === 'Да') {
    fitScore += 15;
    reasons.push('Есть бюджет');
  } else if (lead.budgetRange === 'Нет') {
    fitScore -= 5;
  }

  if (lead.needsDesign && lead.needsCompletion && lead.needsFurniture) {
    fitScore += 25;
    reasons.push('Хочет полный комплекс');
  }

  if (lead.hasDesigner) {
    fitScore -= 10;
  }

  if (lead.hasContractor) {
    fitScore -= 10;
  }

  // Intent Score
  const now = new Date();
  if (lead.keyDate) {
    const daysUntilKeys = Math.floor((lead.keyDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilKeys <= 0) {
      intentScore += 30;
      reasons.push('Ключи уже получены');
    } else if (daysUntilKeys <= 90) {
      intentScore += 20;
      reasons.push('Ключи в ближайшие 3 месяца');
    } else if (daysUntilKeys > 365) {
      intentScore -= 15;
      reasons.push('Дом сдаётся через год+');
    }
  }

  if (lead.needsAcceptance) {
    intentScore += 20;
    reasons.push('Нужна приёмка — ранний вход');
  }

  // Grade
  let leadGrade: 'A' | 'B' | 'C' | 'D';
  if (fitScore >= 40 && intentScore >= 40) {
    leadGrade = 'A';
  } else if (fitScore >= 30 || intentScore >= 30) {
    leadGrade = 'B';
  } else if (fitScore >= 15 || intentScore >= 15) {
    leadGrade = 'C';
  } else {
    leadGrade = 'D';
  }

  return { fitScore, intentScore, leadGrade, reasons };
}
