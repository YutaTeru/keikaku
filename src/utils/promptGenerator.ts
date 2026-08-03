import { PrescriptionPlan } from '../types';
import { validatePrescriptionPlan } from './validation';

/**
 * A. Human-Readable Order Sheet (学習計画注文表)
 */
export function generateOrderSheetText(plan: PrescriptionPlan): string {
  const { totalEnglishMinutes, totalOtherMinutes, totalAllocatedMinutes, remainingMinutes, warnings, errors } =
    validatePrescriptionPlan(plan);

  let text = `==================================================\n`;
  text += `        TG 学習処方箋 注文表（面談確定データ）\n`;
  text += `==================================================\n`;
  text += `作成日: ${new Date(plan.updatedAt).toLocaleDateString('ja-JP')} \n\n`;

  text += `【1. 生徒基本情報】\n`;
  text += `・生徒名 / 管理名: ${plan.student.name || '未設定'}\n`;
  text += `・学年: ${plan.student.grade || '未設定'} / 学校名: ${plan.student.school || '任意'}\n`;
  text += `・志望大学・学部: ${plan.student.targetUniversity || '未設定'} ${plan.student.targetFaculty || ''}\n`;
  text += `・入試方式: ${plan.student.examType || '未設定'}\n`;
  text += `・資格目標: ${plan.student.qualificationGoal || 'なし'}\n`;
  if (plan.student.teacherMemo) {
    text += `・指導メモ: ${plan.student.teacherMemo}\n`;
  }
  text += `\n`;

  text += `【2. 目標・期限・現状】\n`;
  text += `・最終目標:\n${plan.goals.mainGoals.map((g) => `  - ${g}`).join('\n')}\n`;
  text += `・短期目標: ${plan.goals.shortTermGoals || '未設定'}\n`;
  text += `・計画期間: ${plan.goals.planStartDate || '未設定'} 〜 ${plan.goals.planEndDate || '未設定'} (試験日: ${plan.goals.examDate || '未設定'})\n`;
  text += `・現在の学力: 偏差値 [ ${plan.goals.currentDevScore || '未入力'} ] / 英検 [ ${plan.goals.currentEikenScore || '未入力'} ]\n`;
  text += `・得意技能: ${plan.goals.strongSkills || '特になし'} / 苦手技能: ${plan.goals.weakSkills || '特になし'}\n`;
  text += `・過去挫折の理由: ${plan.goals.pastFailureReason || '未記入'}\n`;
  text += `・最優先課題: ${plan.goals.topPriorityTask || '未記入'}\n\n`;

  text += `【3. 学習可能時間＆配分状況】\n`;
  text += `・生活リズム: 起床 ${plan.availability.wakeTime} / 就寝 ${plan.availability.bedTime}\n`;
  text += `・一日の最大勉強可能時間: ${plan.availability.maxStudyMinutes}分 (${(plan.availability.maxStudyMinutes / 60).toFixed(1)}時間)\n`;
  text += `・配分内訳: 英語 ${totalEnglishMinutes}分 + 他教科 ${totalOtherMinutes}分 = 合計 ${totalAllocatedMinutes}分\n`;
  text += `・時間状態: ${remainingMinutes >= 0 ? `残り可処分時間 ${remainingMinutes}分` : `時間超過 ${Math.abs(remainingMinutes)}分 (要調整)`}\n`;
  text += `・部活・補足: ${plan.availability.clubActivity || 'なし'} / ${plan.availability.weekdayWeekendDiff || ''}\n\n`;

  text += `【4. 教科・英語技能別時間配分】\n`;
  text += `[英語 技能別内訳 (計 ${totalEnglishMinutes}分)]\n`;
  plan.englishAllocations
    .filter((a) => a.isUsed && a.minutesPerDay > 0)
    .forEach((a) => {
      text += `・${a.skillName}: ${a.minutesPerDay}分/日 (優先度: ${a.priority}, 分割: ${a.splitCount}回, 時間帯: ${a.preferredTimeSlot || '指定なし'})\n`;
      if (a.teacherMemo) text += `   メモ: ${a.teacherMemo}\n`;
    });

  text += `\n[他教科 内訳 (計 ${totalOtherMinutes}分)]\n`;
  plan.otherSubjectAllocations
    .filter((a) => a.isUsed && a.minutesPerDay > 0)
    .forEach((a) => {
      text += `・${a.subjectName}: ${a.minutesPerDay}分/日 ${a.teacherMemo ? `(${a.teacherMemo})` : ''}\n`;
    });
  text += `\n`;

  text += `【5. 使用教材・役割・ゴール】\n`;
  if (plan.materials.length === 0) {
    text += `(教材未登録)\n`;
  } else {
    plan.materials.forEach((m, idx) => {
      text += `${idx + 1}. [${m.role === 'main' ? '主教材' : '補助教材'}] ${m.name} (${m.publisher || '出版社任意'})\n`;
      text += `   対象技能: ${m.skillKey} / レベル: ${m.targetLevel || '未指定'}\n`;
      text += `   進行範囲: ${m.currentLocation || '起点未設定'} ➔ ${m.targetLocation || 'ゴール未設定'} (1日: ${m.dailyRange || '未定'})\n`;
      text += `   目的: ${m.purpose || '特になし'} ${m.teacherMemo ? `/ 指示: ${m.teacherMemo}` : ''}\n`;
    });
  }
  text += `\n`;

  text += `【6. 教材ごとの勉強法手順】\n`;
  if (plan.studyMethods.length === 0) {
    text += `(勉強法未登録)\n`;
  } else {
    plan.studyMethods.forEach((sm) => {
      text += `■ ${sm.skillName}: ${sm.title} (1回${sm.timePerSession}分 × 1日${sm.dailyFrequency}回)\n`;
      sm.steps.forEach((st, sIdx) => {
        text += `   ステップ${sIdx + 1}: ${st}\n`;
      });
      text += `   完了基準: ${sm.completionCriteria || '未指定'}\n`;
      text += `   詰まった時の対処: ${sm.fallbackAction || '未指定'}\n`;
      if (sm.teacherAdditionalNotes) text += `   教師追加指示: ${sm.teacherAdditionalNotes}\n`;
    });
  }
  text += `\n`;

  text += `【7. 生活・スマホ・AI・報告ルール】\n`;
  text += `・生活ルール: 固定起床(${plan.environment.lifestyle.fixWakeTime ? '〇' : '×'}) / 固定就寝(${plan.environment.lifestyle.fixBedTime ? '〇' : '×'}) / 前日準備(${plan.environment.lifestyle.fixWakeTime ? '〇' : '×'}) / 夜更かし禁止(${plan.environment.lifestyle.noLateNightCatchup ? '〇' : '×'})\n`;
  text += `・スマホルール: 充電場所(${plan.environment.phone.fixedChargingPlace ? '〇' : '×'}) / 家族へ預ける(${plan.environment.phone.handToFamily ? '〇' : '×'}) / 休憩時SNS禁止(${plan.environment.phone.noSnsInBreaks ? '〇' : '×'})\n`;
  text += `・AI利用ルール: 質問メモ活用(${plan.environment.aiSearch.useQuestionNotebook ? '〇' : '×'}) / 利用時間制限(${plan.environment.aiSearch.fixedAiTimeSlots.join(',') || 'なし'}) / 1問ずつ(${plan.environment.aiSearch.askOneByOne ? '〇' : '×'})\n`;
  text += `・報告ルール: 報告先(${plan.environment.reporting.reportToTeacher ? '教師 ' : ''}${plan.environment.reporting.reportToParents ? '保護者 ' : ''}) / 時刻: ${plan.environment.reporting.reportTimeSlot || '未定'}\n`;
  text += `\n`;

  text += `【8. 崩れた日の短縮版 (防災用計画)】\n`;
  if (plan.environment.minimumDayPlan.isConfigured) {
    text += `・合計所要時間: ${plan.environment.minimumDayPlan.totalMinutes}分\n`;
    plan.environment.minimumDayPlan.breakdown.forEach((b) => {
      text += `   - ${b.skillName}: ${b.minutes}分 (${b.materialName})\n`;
    });
    text += `・運用ルール: ${plan.environment.minimumDayPlan.rules.join(' / ')}\n`;
  } else {
    text += `(未設定)\n`;
  }
  text += `\n`;

  text += `【9. 未確定事項＆指示メモ】\n`;
  if (plan.uncertainties.length > 0) {
    plan.uncertainties.forEach((u) => (text += `・未確定: ${u}\n`));
  } else {
    text += `・特になし\n`;
  }
  if (plan.teacherGeneralNotes) {
    text += `・教師全体メモ: ${plan.teacherGeneralNotes}\n`;
  }
  text += `\n`;

  if (errors.length > 0 || warnings.length > 0) {
    text += `【システム自動チェック項目】\n`;
    errors.forEach((e) => (text += `[エラー] ${e.message}\n`));
    warnings.forEach((w) => (text += `[注意] ${w.message}\n`));
  }

  return text;
}

/**
 * B. Structured JSON string
 */
export function generateStructuredJson(plan: PrescriptionPlan): string {
  const { errors, warnings } = validatePrescriptionPlan(plan);

  const payload = {
    student: plan.student,
    goals: plan.goals.mainGoals,
    goalsDetail: {
      shortTerm: plan.goals.shortTermGoals,
      examDate: plan.goals.examDate,
      period: {
        start: plan.goals.planStartDate,
        end: plan.goals.planEndDate,
      },
      currentLevel: {
        devScore: plan.goals.currentDevScore,
        eiken: plan.goals.currentEikenScore,
      },
      skills: {
        strong: plan.goals.strongSkills,
        weak: plan.goals.weakSkills,
      },
      pastFailureReason: plan.goals.pastFailureReason,
      topPriorityTask: plan.goals.topPriorityTask,
    },
    availability: plan.availability,
    subjectAllocations: plan.otherSubjectAllocations.filter((s) => s.isUsed && s.minutesPerDay > 0),
    englishSkillAllocations: plan.englishAllocations.filter((a) => a.isUsed && a.minutesPerDay > 0),
    materials: plan.materials,
    studyMethods: plan.studyMethods,
    environmentRules: plan.environment.lifestyle,
    phoneRules: plan.environment.phone,
    aiRules: plan.environment.aiSearch,
    reportingRules: plan.environment.reporting,
    minimumDayPlan: plan.environment.minimumDayPlan,
    teacherNotes: plan.teacherGeneralNotes,
    uncertainties: plan.uncertainties,
    validationErrors: errors.map((e) => e.message),
    validationWarnings: warnings.map((w) => w.message),
  };

  return JSON.stringify(payload, null, 2);
}

/**
 * C. ChatGPT Prompt Generator (3 Independent Sections)
 */
export function generateChatGptPrompt(plan: PrescriptionPlan): string {
  const orderSheet = generateOrderSheetText(plan);

  return `あなたは高校生の個別指導・学習計画作成のプロ指導者です。
以下に、教師が生徒との面談を通じて合意・作成した「学習計画注文表」が入力されています。

この注文表の指示と数値を【厳格かつ正確】に反映し、高校生本人が読んですぐに実践できる【完成版 学習計画ガイドブック】を作成してください。

==================================================
【入力データ：学習計画注文表】
==================================================
${orderSheet}

==================================================
【プロンプト作成・出力ルール】
==================================================
1. 【対象読者とトーン】
   - 高校生本人へ手渡し・説明する文章として書いてください。
   - 頼れる親身な教師が話しかけるような、温かく自然な日本語を使ってください。
   - 抽象的な精神論（「頑張りましょう」「気合で乗り切れ」等）は一切禁止し、具体的・物理的な行動指示に落とし込んでください。
   - 「夢を叶える魔法のメソッド」などのAI独特な大げさな標語や見出しは乱用しないでください。

2. 【独立した3つの章として出力する構造】
   回答は一つのまとまりにせず、必ず以下の【3つの完全独立した見出し・文書】に分けて出力してください。Wordや印刷物に移しやすい構成にしてください。

   ---
   ■ 第1部：【教材別・詳しい勉強の仕方編】
   ・登録されている全教材について、目的・目標到達範囲・1日の取り組む量・時間帯・具体的な勉強手順ステップを徹底解説してください。
   ・単語帳の3分割テストや、精読の構文把握、リスニングの音変化判定・オーバーラッピングなど、注文表にある勉強法手順を高校生が再現できるよう分かりやすく記述してください。

   ■ 第2部：【学習環境・スマホ・AI・一日の進め方編】
   ・起床から就寝までの時間管理ルール、スマホの管理方法、AI・検索の使い方（質問メモ）、報告ルールを具体的に明記してください。
   ・特に「計画が崩れた日の短縮版（75分等）」について、体調不良時に罪悪感なく短縮版へ切り替える運用手順を分かりやすく説明してください。

   ■ 第3部：【計画・記録表・チェックリスト編】
   ・1週間の標準タイムスケジュール（時間帯別のできることリスト）を作成してください。
   ・日々の学習をチェックするためのシンプルなデイリー記録シート用見出し（項目リスト）を書いてください。

3. 【厳格な数値計算と整合性ルール】
   - 注文表にある時間数（英語〇分、数学〇分、合計〇分）を再度計算し、整合性を担保してください。
   - 注文表で「未確定」となっている項目（文法教材など）は、勝手に推測して決めつけず、「※面談で決まり次第追記」と明記してください。
   - 注文表に矛盾や課題（時間がオーバーしている等）があれば、冒頭で高校生に優しく注意点として伝えてください。

上記ルールを厳守し、今すぐ印刷して渡せる品質の出力を開始してください。`;
}
