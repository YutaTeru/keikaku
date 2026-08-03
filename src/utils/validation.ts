import { PrescriptionPlan, ValidationItem } from '../types';

export function validatePrescriptionPlan(plan: PrescriptionPlan): {
  errors: ValidationItem[];
  warnings: ValidationItem[];
  totalEnglishMinutes: number;
  totalOtherMinutes: number;
  totalAllocatedMinutes: number;
  remainingMinutes: number;
} {
  const errors: ValidationItem[] = [];
  const warnings: ValidationItem[] = [];

  // Calculate times
  const totalEnglishMinutes = plan.englishAllocations.reduce(
    (sum, a) => (a.isUsed ? sum + a.minutesPerDay : sum),
    0
  );
  const totalOtherMinutes = plan.otherSubjectAllocations.reduce(
    (sum, a) => (a.isUsed ? sum + a.minutesPerDay : sum),
    0
  );
  const totalAllocatedMinutes = totalEnglishMinutes + totalOtherMinutes;
  const remainingMinutes = plan.availability.maxStudyMinutes - totalAllocatedMinutes;

  // 1. Time excess check
  if (totalAllocatedMinutes > plan.availability.maxStudyMinutes) {
    errors.push({
      id: 'err-time-excess',
      type: 'error',
      message: `配分時間（合計${totalAllocatedMinutes}分）が一日の最大勉強時間（${plan.availability.maxStudyMinutes}分）を超えています（${totalAllocatedMinutes - plan.availability.maxStudyMinutes}分オーバー）。`,
      fixAdvice: '教科・技能の配分時間を削るか、一日の最大勉強時間を見直してください。',
    });
  }

  if (totalEnglishMinutes > plan.availability.maxStudyMinutes) {
    errors.push({
      id: 'err-english-excess',
      type: 'error',
      message: `英語の配分時間（${totalEnglishMinutes}分）単体で一日の最大勉強時間（${plan.availability.maxStudyMinutes}分）を超過しています。`,
      fixAdvice: '英語の各技能の所要時間を調整してください。',
    });
  }

  // 2. Material registered but skill has no time / Skill used but no material
  const usedSkills = plan.englishAllocations.filter((a) => a.isUsed && a.minutesPerDay > 0);
  for (const skill of usedSkills) {
    // Skip review / logging / other which might not have physical textbooks
    if (['review', 'logging', 'other'].includes(skill.skillKey)) continue;

    const hasMaterial = plan.materials.some(
      (m) => m.skillKey === skill.skillKey || m.skillKey === skill.skillName
    );
    if (!hasMaterial) {
      errors.push({
        id: `err-no-material-${skill.skillKey}`,
        type: 'error',
        message: `「${skill.skillName}」に${skill.minutesPerDay}分が割り当てられていますが、使用教材が登録されていません。`,
        fixAdvice: 'ステップ5で該当技能の教材を選択・登録してください。',
      });
    }
  }

  for (const mat of plan.materials) {
    const matchedSkill = plan.englishAllocations.find(
      (a) => a.skillKey === mat.skillKey || a.skillName === mat.skillKey
    );
    if (matchedSkill && (!matchedSkill.isUsed || matchedSkill.minutesPerDay === 0)) {
      errors.push({
        id: `err-unused-material-${mat.id}`,
        type: 'error',
        message: `教材「${mat.name}」が登録されていますが、技能「${matchedSkill.skillName}」の配分時間が0分またはOFFになっています。`,
        fixAdvice: 'ステップ4で時間配分を有効にするか、不要な教材を削除してください。',
      });
    }
  }

  // 3. Date checks
  if (plan.goals.examDate && plan.goals.planStartDate) {
    if (new Date(plan.goals.examDate) < new Date(plan.goals.planStartDate)) {
      errors.push({
        id: 'err-date-order',
        type: 'error',
        message: `試験日（${plan.goals.examDate}）が計画開始日（${plan.goals.planStartDate}）より前の日付になっています。`,
        fixAdvice: '試験日または計画開始日の日付を正しく設定してください。',
      });
    }
  }

  // 4. Wake & Bed time contradiction
  if (plan.availability.wakeTime && plan.availability.bedTime) {
    const [wakeH, wakeM] = plan.availability.wakeTime.split(':').map(Number);
    const [bedH, bedM] = plan.availability.bedTime.split(':').map(Number);
    const wakeMins = wakeH * 60 + wakeM;
    const bedMins = bedH * 60 + bedM;

    // Assuming normal day (bed is night, wake is morning)
    if (wakeMins === bedMins) {
      errors.push({
        id: 'err-sleep-time',
        type: 'error',
        message: '起床時間と就寝時間が同じ時刻になっています。',
        fixAdvice: '生活リズムに合わせて起床時刻と就寝時刻を修正してください。',
      });
    }
  }

  // Warnings (非ブロック)
  // W1: Vocab main materials >= 3
  const mainVocabMaterials = plan.materials.filter(
    (m) => (m.skillKey === 'vocab' || m.skillKey === '単語') && m.role === 'main'
  );
  if (mainVocabMaterials.length >= 3) {
    warnings.push({
      id: 'warn-too-many-main-vocab',
      type: 'warning',
      message: `単語帳を${mainVocabMaterials.length}冊、主教材に指定しています。消化不良になる恐れがあります。`,
      fixAdvice: '主教材は1〜2冊に絞り、残りは補助教材へ切り替えることを推奨します。',
    });
  }

  // W2: Review time not set
  const reviewSkill = plan.englishAllocations.find((a) => a.skillKey === 'review');
  if (!reviewSkill || !reviewSkill.isUsed || reviewSkill.minutesPerDay === 0) {
    warnings.push({
      id: 'warn-no-review-time',
      type: 'warning',
      message: '単独の「復習時間」が配分されていません。',
      fixAdvice: '各教材の勉強法の中に復習プロセスが入っているか確認するか、復習枠を15〜30分確保してください。',
    });
  }

  // W3: Listening needed but 0 mins
  const listeningSkill = plan.englishAllocations.find((a) => a.skillKey === 'listening');
  const needsListening =
    plan.student.qualificationGoal?.includes('英検') ||
    plan.goals.mainGoals.some((g) => g.includes('英検') || g.includes('共通テスト') || g.includes('リスニング'));

  if (needsListening && (!listeningSkill || !listeningSkill.isUsed || listeningSkill.minutesPerDay === 0)) {
    warnings.push({
      id: 'warn-needs-listening',
      type: 'warning',
      message: '目標（英検・共通テスト等）にリスニングが必要ですが、リスニング時間が0分です。',
      fixAdvice: '毎日または週数回のリスニング時間を設定してください。',
    });
  }

  // W4: Eiken goal but no writing
  const summarySkill = plan.englishAllocations.find((a) => a.skillKey === 'summary');
  const essaySkill = plan.englishAllocations.find((a) => a.skillKey === 'essay');
  const isEikenGoal =
    plan.student.qualificationGoal?.includes('英検') ||
    plan.goals.mainGoals.some((g) => g.includes('英検'));

  const hasWritingTime =
    (summarySkill?.isUsed && summarySkill.minutesPerDay > 0) ||
    (essaySkill?.isUsed && essaySkill.minutesPerDay > 0);

  if (isEikenGoal && !hasWritingTime) {
    warnings.push({
      id: 'warn-eiken-no-writing',
      type: 'warning',
      message: '英検合格目標が設定されていますが、ライティング（英文要約・意見英作文）の時間配分がありません。',
      fixAdvice: '新形式英検ではライティングの配分が大きいため、ライティング演習の時間を追加することを推奨します。',
    });
  }

  // W5: Extremely long study time (>= 10 hours)
  if (plan.availability.maxStudyMinutes >= 600) {
    warnings.push({
      id: 'warn-very-long-study',
      type: 'warning',
      message: `一日の勉強時間が${plan.availability.maxStudyMinutes / 60}時間（${plan.availability.maxStudyMinutes}分）と非常に長くなっています。`,
      fixAdvice: '継続可能性を高めるため、十分な睡眠時間と休息時間を確保できているか面談で確認してください。',
    });
  }

  // W6: Minimum day plan missing
  if (!plan.environment.minimumDayPlan.isConfigured || plan.environment.minimumDayPlan.totalMinutes === 0) {
    warnings.push({
      id: 'warn-no-minimum-day-plan',
      type: 'warning',
      message: '計画が崩れた日の「短縮版（防災ルール）」が設定されていません。',
      fixAdvice: '体調不良や急用時に途切れないよう、最低限実施する75分前後の短縮版を設定してください。',
    });
  }

  // W7: Phone rules missing
  const phone = plan.environment.phone;
  const hasPhoneRules =
    phone.keepInOtherRoom ||
    phone.handToFamily ||
    phone.fixedChargingPlace ||
    phone.turnOffNotifications ||
    phone.noSnsInBreaks;

  if (!hasPhoneRules) {
    warnings.push({
      id: 'warn-no-phone-rules',
      type: 'warning',
      message: 'スマートフォン対策ルールがひとつも設定されていません。',
      fixAdvice: '「勉強中は別室に置く」「家族に預ける」などの集中環境ルールを設定してください。',
    });
  }

  // W8: Material missing target location
  const matsMissingTarget = plan.materials.filter((m) => !m.targetLocation || m.targetLocation.trim() === '');
  if (matsMissingTarget.length > 0) {
    warnings.push({
      id: 'warn-material-no-target',
      type: 'warning',
      message: `教材「${matsMissingTarget.map((m) => m.name).join('・')}」の計画終了時ゴール範囲が未入力です。`,
      fixAdvice: '計画終了までにどこまで終わらせるか目標ページ・章番号を入力してください。',
    });
  }

  return {
    errors,
    warnings,
    totalEnglishMinutes,
    totalOtherMinutes,
    totalAllocatedMinutes,
    remainingMinutes,
  };
}
