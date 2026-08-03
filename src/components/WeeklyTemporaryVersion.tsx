import React, { useState } from 'react';
import { 
  Calendar, 
  CheckSquare, 
  Clock, 
  FileText, 
  BookOpen, 
  Sparkles, 
  AlertTriangle, 
  Printer, 
  Copy, 
  Check, 
  Lightbulb, 
  ArrowLeft, 
  ChevronRight,
  Info,
  HelpCircle
} from 'lucide-react';
import { PrescriptionPlan } from '../types';

interface WeeklyTemporaryVersionProps {
  plan: PrescriptionPlan;
  onUpdatePlan: (updated: PrescriptionPlan) => void;
  onClose: () => void;
}

const dailyPresetsByDay = [
  {
    day: 1,
    title: 'Day 1: 単語学習の注意点 (Vocabulary Study)',
    options: [
      { label: '単語高回転', text: '【単語】1単語に時間をかけず、高回転で何度も繰り返して目の接触回数を増やす。' },
      { label: '発音重視', text: '【単語】スペルを黙読するだけでなく、音声を聴きながら声に出して五感で覚える。' },
      { label: '例文暗記', text: '【単語】単語単体ではなく、短いフレーズや例文の文脈に紐づけて意味を思い出す。' },
    ]
  },
  {
    day: 2,
    title: 'Day 2: 長文読解の注意点 (Reading Comprehension)',
    options: [
      { label: '直読直解', text: '【長文】一文一文の主語・動詞(S・V)を明確にし、返り読みをせずに頭から直訳していく。' },
      { label: '段落要約', text: '【長文】各パラグラフを読み終えるごとに、筆者の主張や重要ポイントを頭の中で1行要約する。' },
      { label: '構文把握', text: '【長文】曖昧なまま流さず、thatや関係代名詞の修飾構造がどこにかかっているか正確に見抜く。' },
    ]
  },
  {
    day: 3,
    title: 'Day 3: 文法学習の注意点 (Grammar Study)',
    options: [
      { label: '理由説明', text: '【文法】文法規則の丸暗記を避け、なぜその選択肢が正解になるのか理由を説明できるように意識する。' },
      { label: '例文暗唱', text: '【文法】各重要構文の基本例文を1つずつ、何も見ずにスラっと暗唱できるまで唱える。' },
      { label: '弱点潰し', text: '【文法】間違えた単元は文法解説書に戻り、基礎ルールや品詞の働きを根本から学び直す。' },
    ]
  },
  {
    day: 4,
    title: 'Day 4: リスニング・音読の注意点 (Listening & Speaking)',
    options: [
      { label: '完全模倣', text: '【リスニング】音読しながらネイティブの音声スピード、リンキング、イントネーションを徹底的に真似する。' },
      { label: 'シャドーイング', text: '【リスニング】テキストを見ずに耳から聴こえてくる音を0.5秒遅れでそっくりそのまま発音する。' },
      { label: 'ディクテーション', text: '【リスニング】短文を一文ずつ聞き取り、スペルを書き起こして聞こえない音の弱点を浮き彫りにする。' },
    ]
  },
  {
    day: 5,
    title: 'Day 5: 過去問・実戦・速読の注意点 (Speed Reading & Exams)',
    options: [
      { label: '時間配分', text: '【過去問】タイマーを必ずセットし、本番の試験時間より5分短いペース配分で焦らず解く練習をする。' },
      { label: '速読練習', text: '【速読】視野を広く保ち、一語一語を追うのではなく塊（チャンク）ごとに左から右へ目を滑らせる。' },
      { label: '設問先読み', text: '【実戦】長文を読み始める前に、設問（質問文のみ）を先読みして何を聞かれるか頭に入れてから読む。' },
    ]
  },
  {
    day: 6,
    title: 'Day 6: 弱点分析・ミス復習の注意点 (Weakness Review)',
    options: [
      { label: 'ミスノート化', text: '【復習】間違えた問題の原因（単語力不足、構文解釈ミスなど）をミスノートへ具体的にメモする。' },
      { label: '類題演習', text: '【復習】間違えた問題と同じ文法パターンや難易度の類題を解き、本質的に理解できたか試す。' },
      { label: '自力解き直し', text: '【復習】解説を読んで理解した気にならず、白紙の状態で最初から最後まで自力で解答を再現する。' },
    ]
  },
  {
    day: 7,
    title: 'Day 7: 習慣化・総括の注意点 (Reflection & Health)',
    options: [
      { label: '進捗総括', text: '【総括】1週間の進捗率を測定し、達成できた点と翌週への改善点をノートに1行で記録する。' },
      { label: '睡眠最優先', text: '【健康】翌週のパフォーマンスを維持するため、7時間以上の十分な睡眠をとり、体調をリセットする。' },
      { label: '学習環境整理', text: '【環境】机の上の不要な参考書や片付けを行い、次の月曜日に最高の状態でスタートできるようにする。' },
    ]
  }
];

const vocabItems = [
  { title: 'analyze', subtitle: '分析する' },
  { title: 'significant', subtitle: '重大な' },
  { title: 'alternative', subtitle: '代替の' },
  { title: 'comprehensive', subtitle: '包括的な' },
  { title: 'fundamental', subtitle: '根本的な' },
  { title: 'precise', subtitle: '正確な' },
  { title: 'hypothesis', subtitle: '仮説' },
  { title: 'crucial', subtitle: '極めて重大な' },
  { title: 'primary', subtitle: '主要な' },
  { title: 'visible', subtitle: '目に見える' },
];

const grammarItems = [
  { title: 'Unit 1: 時制', subtitle: 'Tense' },
  { title: 'Unit 2: 助動詞', subtitle: 'Modals' },
  { title: 'Unit 3: 受動態', subtitle: 'Passive' },
  { title: 'Unit 4: 不定詞', subtitle: 'Infinitive' },
  { title: 'Unit 5: 動名詞', subtitle: 'Gerund' },
  { title: 'Unit 6: 分詞', subtitle: 'Participle' },
  { title: 'Unit 7: 関係詞', subtitle: 'Relative' },
  { title: 'Unit 8: 仮定法', subtitle: 'Subjunctive' },
  { title: 'Unit 9: 比較', subtitle: 'Comparison' },
  { title: 'Unit 10: 否定', subtitle: 'Negation' },
];

const readingItems = [
  { title: 'Theme 1: 科学技術', subtitle: 'Science' },
  { title: 'Theme 2: 環境問題', subtitle: 'Environment' },
  { title: 'Theme 3: 異文化理解', subtitle: 'Culture' },
  { title: 'Theme 4: 言語活動', subtitle: 'Language' },
  { title: 'Theme 5: 心理学', subtitle: 'Psychology' },
  { title: 'Theme 6: 社会問題', subtitle: 'Society' },
  { title: 'Theme 7: 医療健康', subtitle: 'Medicine' },
  { title: 'Theme 8: 教育制度', subtitle: 'Education' },
  { title: 'Theme 9: 経済・IT', subtitle: 'Business' },
  { title: 'Theme 10: 歴史伝記', subtitle: 'History' },
];

export const WeeklyTemporaryVersion: React.FC<WeeklyTemporaryVersionProps> = ({
  plan,
  onUpdatePlan,
  onClose,
}) => {
  // Safe local defaults or initialized state from the plan
  const tPlan = plan.weeklyTempPlan || {
    enabled: true,
    weeklyGoal: '英検準1級の英単語150語完全暗記と、長文精読のスピードアップ',
    dailyDurationHours: 3.0,
    mindfulNotes: '音読時はお腹から声を出し、リズムを身体に染み込ませること。',
    advanceNotices: '水曜日は学校の特別補習があるため、開始時間を1時間遅らせて集中して取り組む。',
    selectedMindfulPresets: [
      '【単語】1単語に時間をかけず、高回転で何度も繰り返して目の接触回数を増やす。',
      '【長文】一文一文の主語・動詞(S・V)を明確にし、返り読みをせずに頭から直訳していく。',
      '【文法】文法規則の丸暗記を避け、なぜその形になるのか理由を説明できるように意識する。',
      '【リスニング】音読しながらネイティブの音声スピードとイントネーションを徹底的に真似する。',
      '【過去問】タイマーを必ずセットし、本番の試験時間より5分短いペース配分で解く。',
      '【復習】間違えた問題の原因（単語力不足、構文解釈ミスなど）をミスノートへ具体的にメモする。',
      '【総括】1週間の進捗率を測定し、達成できた点と翌週への改善点をノートに1行で記録する。',
    ],
  };

  const [weeklyGoal, setWeeklyGoal] = useState(tPlan.weeklyGoal);
  const [dailyDurationHours, setDailyDurationHours] = useState(tPlan.dailyDurationHours > 6 ? 3.0 : tPlan.dailyDurationHours);
  const [mindfulNotes, setMindfulNotes] = useState(tPlan.mindfulNotes);
  const [advanceNotices, setAdvanceNotices] = useState(tPlan.advanceNotices);
  const [copied, setCopied] = useState(false);

  // Accordion state
  const [goalAccordionOpen, setGoalAccordionOpen] = useState(false);
  const [activeDayAccordionIndex, setActiveDayAccordionIndex] = useState<number | null>(null);

  // Textbook reference selector state
  const [activeTextbookTab, setActiveTextbookTab] = useState<'vocab' | 'grammar' | 'reading'>('vocab');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  // Initialize the 7-day notes
  const [mindfulDays, setMindfulDays] = useState<string[]>(() => {
    if (tPlan.selectedMindfulPresets && tPlan.selectedMindfulPresets.length === 7) {
      // Check if they are the old style presets
      if (tPlan.selectedMindfulPresets[0].includes('[姿勢]')) {
        return dailyPresetsByDay.map(p => p.options[0].text);
      }
      return tPlan.selectedMindfulPresets;
    }
    return dailyPresetsByDay.map(p => p.options[0].text);
  });

  // Reactive state synchronizer helper
  const updateParentPlan = (
    goal: string,
    hours: number,
    mNotes: string,
    advNotices: string,
    mDays: string[]
  ) => {
    onUpdatePlan({
      ...plan,
      weeklyTempPlan: {
        enabled: true,
        weeklyGoal: goal,
        dailyDurationHours: hours,
        mindfulNotes: mNotes,
        advanceNotices: advNotices,
        selectedMindfulPresets: mDays,
      },
    });
  };

  const handleWeeklyGoalChange = (val: string) => {
    setWeeklyGoal(val);
    updateParentPlan(val, dailyDurationHours, mindfulNotes, advanceNotices, mindfulDays);
  };

  const handleDailyDurationChange = (val: number) => {
    setDailyDurationHours(val);
    updateParentPlan(weeklyGoal, val, mindfulNotes, advanceNotices, mindfulDays);
  };

  const handleMindfulNotesChange = (val: string) => {
    setMindfulNotes(val);
    updateParentPlan(weeklyGoal, dailyDurationHours, val, advanceNotices, mindfulDays);
  };

  const handleAdvanceNoticesChange = (val: string) => {
    setAdvanceNotices(val);
    updateParentPlan(weeklyGoal, dailyDurationHours, mindfulNotes, val, mindfulDays);
  };

  const handleMindfulDayChange = (idx: number, val: string) => {
    const updated = [...mindfulDays];
    updated[idx] = val;
    setMindfulDays(updated);
    updateParentPlan(weeklyGoal, dailyDurationHours, mindfulNotes, advanceNotices, updated);
  };

  // Calculate dynamic minutes based on daily duration
  const totalMinutes = Math.round(dailyDurationHours * 60);
  const vocabMinutes = Math.round(totalMinutes * 0.25);
  const readingMinutes = Math.round(totalMinutes * 0.40);
  const grammarMinutes = Math.round(totalMinutes * 0.20);
  const reviewMinutes = totalMinutes - (vocabMinutes + readingMinutes + grammarMinutes);

  // Generate 7 Days tasks list
  const days = [
    { dayNum: 1, name: '月曜日 (Day 1)', focus: '単語暗記/音読/文法インプット/ミス見直し' },
    { dayNum: 2, name: '火曜日 (Day 2)', focus: '単語暗記/音読/文法インプット/ミス見直し' },
    { dayNum: 3, name: '水曜日 (Day 3)', focus: '単語暗記/音読/文法インプット/ミス見直し' },
    { dayNum: 4, name: '木曜日 (Day 4)', focus: '単語暗記/音読/文法インプット/ミス見直し' },
    { dayNum: 5, name: '金曜日 (Day 5)', focus: '単語暗記/音読/文法インプット/ミス見直し' },
    { dayNum: 6, name: '土曜日 (Day 6)', focus: '単語暗記/音読/文法インプット/ミス見直し' },
    { dayNum: 7, name: '日曜日 (Day 7)', focus: '単語暗記/音読/文法インプット/ミス見直し' },
  ];

  const handleCopyMarkdown = () => {
    const markdownText = `### 📅 週間簡易学習計画書 (Weekly Temporary Plan Guide)

**【今週の目標 (Weekly Goal)】**
${weeklyGoal}

**【1日の目標学習時間】**: ${dailyDurationHours}時間 (計 ${totalMinutes}分)
- 単語 (Vocabulary): ${vocabMinutes}分
- 長文読解・音読 (Reading & Listening): ${readingMinutes}分
- 文法・英作文 (Grammar & Writing): ${grammarMinutes}分
- 今日の振り返り (Daily Review): ${reviewMinutes}分

**【勉強中の注意点 (7日間の注意点メニュー)】**
1. ${mindfulDays[0]}
2. ${mindfulDays[1]}
3. ${mindfulDays[2]}
4. ${mindfulDays[3]}
5. ${mindfulDays[4]}
6. ${mindfulDays[5]}
7. ${mindfulDays[6]}

**【事前予告・特記事項 (Advance Notices)】**
${advanceNotices}
${mindfulNotes ? `- 補足: ${mindfulNotes}` : ''}

| 日程 (Day) | 目標時間 | 優先やること (Core Task Menu) | 時間配分 (Breakdown) | 今日の注意点テーマ (Mindful Theme) |
| :--- | :--- | :--- | :--- | :--- |
| **Day 1 (月)** | ${dailyDurationHours}時間 | 単語暗記/音読/文法インプット/ミス見直し | 単語 ${vocabMinutes}分 / 音読 ${readingMinutes}分 / 文法 ${grammarMinutes}分 / 復習 ${reviewMinutes}分 | ${mindfulDays[0]} |
| **Day 2 (火)** | ${dailyDurationHours}時間 | 単語暗記/音読/文法インプット/ミス見直し | 単語 ${vocabMinutes}分 / 音読 ${readingMinutes}分 / 文法 ${grammarMinutes}分 / 復習 ${reviewMinutes}分 | ${mindfulDays[1]} |
| **Day 3 (水)** | ${dailyDurationHours}時間 | 単語暗記/音読/文法インプット/ミス見直し | 単語 ${vocabMinutes}分 / 音読 ${readingMinutes}分 / 文法 ${grammarMinutes}分 / 復習 ${reviewMinutes}分 | ${mindfulDays[2]} |
| **Day 4 (木)** | ${dailyDurationHours}時間 | 単語暗記/音読/文法インプット/ミス見直し | 単語 ${vocabMinutes}分 / 音読 ${readingMinutes}分 / 文法 ${grammarMinutes}分 / 復習 ${reviewMinutes}分 | ${mindfulDays[3]} |
| **Day 5 (金)** | ${dailyDurationHours}時間 | 単語暗記/音読/文法インプット/ミス見直し | 単語 ${vocabMinutes}分 / 音読 ${readingMinutes}分 / 文法 ${grammarMinutes}分 / 復習 ${reviewMinutes}分 | ${mindfulDays[4]} |
| **Day 6 (土)** | ${dailyDurationHours}時間 | 単語暗記/音読/文法インプット/ミス見直し | 単語 ${vocabMinutes}分 / 音読 ${readingMinutes}分 / 文法 ${grammarMinutes}分 / 復習 ${reviewMinutes}分 | ${mindfulDays[5]} |
| **Day 7 (日)** | ${dailyDurationHours}時間 | 単語暗記/音読/文法インプット/ミス見直し | 単語 ${vocabMinutes}分 / 音読 ${readingMinutes}分 / 文法 ${grammarMinutes}分 / 復習 ${reviewMinutes}分 | ${mindfulDays[6]} |

---
※このテーブルをChatGPTに貼り付けることで、さらに詳細な毎日の問題番号やアドバイスを自動生成させることができます。`;

    navigator.clipboard.writeText(markdownText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-20 print:p-0 print:bg-white print:text-black">
      {/* Header Banner - hidden in print */}
      <div className="bg-gradient-to-r from-sky-800 to-indigo-900 text-white rounded-xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-sky-400 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">Temporary Version</span>
            <span className="text-sky-300 font-bold text-xs">📅 1週間進捗ガイド</span>
          </div>
          <h1 className="text-lg sm:text-xl font-extrabold tracking-tight">
            週間簡易版学習計画書 & テーブル作成
          </h1>
          <p className="text-xs text-sky-100/90 leading-relaxed max-w-2xl">
            1週間分の「やること・目標時間・デイリー課題」をシンプルに入力するだけで、A4サイズ1枚に収まる学習ロードマップを即座に生成。最後はChatGPTへコピーして極上テーブルに変換できます。
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            updateParentPlan(weeklyGoal, dailyDurationHours, mindfulNotes, advanceNotices, mindfulDays);
            onClose();
          }}
          className="bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold px-4 py-2 rounded-lg transition shadow-sm shrink-0 flex items-center justify-center gap-1.5 self-start sm:self-center"
        >
          <ArrowLeft className="w-4 h-4 text-slate-600" />
          <span>通常ステップに戻る</span>
        </button>
      </div>

      {/* Input Control Center - hidden in print */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:hidden">
        {/* Left Form: Goal and Duration */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-3xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <CheckSquare className="w-4 h-4 text-sky-600" />
            <h2 className="text-sm font-extrabold text-slate-800">1. 今週の目標・学習時間のシンプル入力</h2>
          </div>

          {/* Weekly Goal Area with Accordion-style select templates */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
              <span>🎯 今週の学習目標 (Weekly Goal)</span>
              <span className="text-rose-500 text-[9px]">*必須</span>
            </label>
            <textarea
              id="weekly-temp-goal-input"
              value={weeklyGoal}
              onChange={(e) => handleWeeklyGoalChange(e.target.value)}
              onFocus={() => setGoalAccordionOpen(true)}
              rows={2}
              placeholder="例: 単語ターゲット1900をセクション1-5完璧にする！長文精読のスピードアップを図る。"
              className="w-full bg-slate-50 hover:bg-slate-50/30 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
            />

            {/* Goal helper accordion */}
            <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50 mt-1">
              <button
                type="button"
                onClick={() => setGoalAccordionOpen(!goalAccordionOpen)}
                className="w-full text-left px-3 py-2 text-[10px] font-extrabold text-slate-700 flex items-center justify-between hover:bg-slate-100 transition"
              >
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-sky-600 animate-pulse" />
                  <span>💡 目標クイック設定アコーディオン (単語・文法・長文・速読を簡単選択)</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${goalAccordionOpen ? 'rotate-90' : ''}`} />
              </button>
              
              {goalAccordionOpen && (
                <div className="p-3 border-t border-slate-200 bg-white space-y-4 text-xs">
                  {/* Category Selection Tabs */}
                  <div className="flex border-b border-slate-200">
                    {[
                      { id: 'vocab', label: '📖 単語・語彙力 (pasta)', color: 'border-amber-500 text-amber-700 hover:bg-amber-50/50' },
                      { id: 'grammar', label: '✍️ 文法・語法 (Polaris)', color: 'border-emerald-500 text-emerald-700 hover:bg-emerald-50/50' },
                      { id: 'reading', label: '🔍 長文・速読 (Polaris)', color: 'border-blue-500 text-blue-700 hover:bg-blue-50/50' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => {
                          setActiveTextbookTab(tab.id as any);
                          setSelectedItems([]);
                        }}
                        className={`flex-1 text-center py-2 font-bold border-b-2 text-[11px] transition ${
                          activeTextbookTab === tab.id
                            ? `${tab.color.split(' ')[0]} text-slate-900 bg-slate-50`
                            : 'border-transparent text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Textbook info & Help */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                      <BookOpen className="w-4 h-4 text-sky-600" />
                      <span>
                        使用テキスト：
                        <strong className="text-slate-900 font-extrabold ml-1">
                          {activeTextbookTab === 'vocab' && 'でる順パス単 準1級 (pasta)'}
                          {activeTextbookTab === 'grammar' && '関正生の英文法ポラリス1'}
                          {activeTextbookTab === 'reading' && '関正生の英語長文ポラリス1 & Speed Reading'}
                        </strong>
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">※クリックして項目を選択</span>
                  </div>

                  {/* 10 Items Display Row */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold text-slate-500 block">
                      【{activeTextbookTab === 'vocab' ? '10つの代表的な重要単語' : activeTextbookTab === 'grammar' ? '10の重要文法ユニット' : '10の長文速読テーマ'}】
                    </span>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {(activeTextbookTab === 'vocab' ? vocabItems : activeTextbookTab === 'grammar' ? grammarItems : readingItems).map((item, idx) => {
                        const isSelected = selectedItems.includes(idx);
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              // Toggle selection
                              let next;
                              if (isSelected) {
                                next = selectedItems.filter(i => i !== idx);
                              } else {
                                next = [...selectedItems, idx];
                              }
                              setSelectedItems(next);
                            }}
                            className={`p-2 rounded-lg text-left border text-[11px] font-semibold transition relative group flex flex-col justify-between h-[52px] ${
                              isSelected
                                ? activeTextbookTab === 'vocab'
                                  ? 'bg-amber-50 border-amber-400 text-amber-950 shadow-3xs'
                                  : activeTextbookTab === 'grammar'
                                  ? 'bg-emerald-50 border-emerald-400 text-emerald-950 shadow-3xs'
                                  : 'bg-blue-50 border-blue-400 text-blue-950 shadow-3xs'
                                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                            }`}
                          >
                            <span className="text-[9px] text-slate-400 block font-bold leading-none mb-1">
                              0{idx + 1}
                            </span>
                            <span className="truncate block font-extrabold leading-tight">
                              {item.title}
                            </span>
                            <span className="text-[9px] text-slate-500 font-medium truncate block leading-none">
                              {item.subtitle}
                            </span>

                            {isSelected && (
                              <span className={`absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] text-white font-black ${
                                activeTextbookTab === 'vocab' ? 'bg-amber-600' : activeTextbookTab === 'grammar' ? 'bg-emerald-600' : 'bg-blue-600'
                              }`}>
                                ✓
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quick Action buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-150">
                    <div className="text-[10px] text-slate-500 font-semibold">
                      選択中: <strong className="text-slate-800 font-extrabold">{selectedItems.length}</strong> 件
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          const currentList = activeTextbookTab === 'vocab' ? vocabItems : activeTextbookTab === 'grammar' ? grammarItems : readingItems;
                          setSelectedItems(currentList.map((_, i) => i));
                        }}
                        className="text-[10px] text-slate-600 hover:text-slate-900 font-bold px-2 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 transition"
                      >
                        全選択
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedItems([])}
                        className="text-[10px] text-slate-600 hover:text-slate-900 font-bold px-2 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 transition"
                      >
                        クリア
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (selectedItems.length === 0) return;
                          const currentList = activeTextbookTab === 'vocab' ? vocabItems : activeTextbookTab === 'grammar' ? grammarItems : readingItems;
                          const textbookName = activeTextbookTab === 'vocab' ? 'でる順パス単(pasta)準1級' : activeTextbookTab === 'grammar' ? '関正生の英文法ポラリス1' : '関正生の英語長文ポラリス1(Speed Reading)';
                          const selectedTitles = selectedItems.map(i => currentList[i].title).join('、');
                          const textToAppend = `使用教材：${textbookName}（選択項目：${selectedTitles}）`;
                          
                          const combined = weeklyGoal ? `${weeklyGoal}\n${textToAppend}` : textToAppend;
                          handleWeeklyGoalChange(combined);
                          setSelectedItems([]);
                        }}
                        disabled={selectedItems.length === 0}
                        className={`text-[10px] font-extrabold px-3 py-1.5 rounded-lg shadow-3xs transition ${
                          selectedItems.length > 0
                            ? activeTextbookTab === 'vocab'
                              ? 'bg-amber-600 text-white hover:bg-amber-700'
                              : activeTextbookTab === 'grammar'
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                        }`}
                      >
                        🎯 選択内容を目標にセット
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Daily Duration Input (Adjusted range and limit) */}
          <div id="weekly-temp-duration-controls" className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                <span>⏱️ 1日の目標学習時間 (Daily Duration)</span>
              </label>
              <span className="text-xs font-mono font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full">
                {dailyDurationHours === 0.5 ? '30分' : `${dailyDurationHours}時間`} ({totalMinutes}分)
              </span>
            </div>
            
            {/* Range Slider - max 6 hours as requested */}
            <input
              type="range"
              min="0.5"
              max="6.0"
              step="0.5"
              value={dailyDurationHours}
              onChange={(e) => handleDailyDurationChange(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
            />

            {/* Quick selector buttons (from 30 mins to 6 hours max as requested) */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[0.5, 1, 1.5, 2, 3, 4, 5, 6].map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => handleDailyDurationChange(h)}
                  className={`text-[10px] px-2.5 py-1 rounded transition border font-bold ${
                    dailyDurationHours === h
                      ? 'bg-sky-600 text-white border-sky-600 shadow-3xs'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {h === 0.5 ? '30分' : `${h}時間`}
                </button>
              ))}
            </div>
          </div>

          {/* Advance Notices & Study Mindful Textboxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700">📣 事前の予告・スケジュール例外</label>
              <textarea
                value={advanceNotices}
                onChange={(e) => handleAdvanceNoticesChange(e.target.value)}
                rows={3}
                placeholder="例: 水曜日は学校の特別補習があるため、開始時間を1時間遅らせて集中して取り組む。"
                className="w-full bg-slate-50 hover:bg-slate-50/30 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700">💡 勉強中の追加補足・その他注意点</label>
              <textarea
                value={mindfulNotes}
                onChange={(e) => handleMindfulNotesChange(e.target.value)}
                rows={3}
                placeholder="例: 音読時はお腹から声を出し、リズムを身体に染み込ませること。"
                className="w-full bg-slate-50 hover:bg-slate-50/30 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
              />
            </div>
          </div>
        </div>

        {/* Right Info Card: 7-Day Mindful Preset Editor & Selector */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-3xs flex flex-col space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-slate-800 font-extrabold text-xs">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>💡 1週間分の注意点・メニュー (7-Day Mindful Editor)</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-normal">
              クリックすると「単語・長文・文法・リスニング・速読」などの最適な注意点テンプレートをアコーディオンから選択できます。直接の編集も可能です。
            </p>
          </div>

          <div className="space-y-3.5 max-h-[420px] overflow-y-auto pr-1">
            {dailyPresetsByDay.map((p, idx) => {
              const currentVal = mindfulDays[idx] || '';
              const isExpanded = activeDayAccordionIndex === idx;

              return (
                <div key={idx} className="border border-slate-150 rounded-lg p-2.5 bg-slate-50/50 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-sky-800 bg-sky-50 px-2 py-0.5 rounded">
                      Day {idx + 1} ({['月', '火', '水', '木', '金', '土', '日'][idx]})
                    </span>
                    <span className="text-[9px] text-slate-400 font-medium">クリックしてアコーディオン表示</span>
                  </div>

                  <input
                    type="text"
                    id={`mindful-day-input-${idx}`}
                    value={currentVal}
                    onFocus={() => setActiveDayAccordionIndex(idx)}
                    onChange={(e) => handleMindfulDayChange(idx, e.target.value)}
                    placeholder={`Day ${idx + 1} の学習上の注意点を入力してください`}
                    className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-[11px] text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-sky-500 transition"
                  />

                  {/* Accordion choices for this day's input */}
                  {isExpanded && (
                    <div className="bg-white border border-slate-200 rounded p-2 text-[10px] space-y-1.5 shadow-2xs">
                      <div className="flex items-center justify-between text-[9px] text-slate-400 font-bold border-b border-slate-100 pb-1">
                        <span>📋 クイック選択テンプレート</span>
                        <button
                          type="button"
                          onClick={() => setActiveDayAccordionIndex(null)}
                          className="text-rose-500 hover:text-rose-700 font-extrabold"
                        >
                          閉じる ×
                        </button>
                      </div>
                      <div className="space-y-1">
                        {p.options.map((opt, oIdx) => (
                          <button
                            key={oIdx}
                            type="button"
                            onClick={() => {
                              handleMindfulDayChange(idx, opt.text);
                              setActiveDayAccordionIndex(null);
                            }}
                            className="w-full text-left px-2 py-1 rounded bg-slate-50 hover:bg-sky-50 hover:text-sky-800 border border-slate-100 transition flex items-start gap-1.5"
                          >
                            <span className="font-extrabold text-sky-600 shrink-0">[{opt.label}]</span>
                            <span className="text-slate-700 leading-tight">{opt.text.replace(/【.*?】/, '')}</span>
                          </button>
                        ))}
                        {/* Custom categories the user explicitly requested: Vocabulary, Grammar, Reading Comprehension */}
                        <div className="grid grid-cols-3 gap-1 pt-1 border-t border-slate-100 mt-1">
                          <button
                            type="button"
                            onClick={() => {
                              handleMindfulDayChange(idx, `【単語】単語帳の重要箇所を見直し、即座に日本語が口から出てくるかチェックする。`);
                              setActiveDayAccordionIndex(null);
                            }}
                            className="text-[9px] px-1 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded text-center font-bold"
                          >
                            📖 単語
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              handleMindfulDayChange(idx, `【文法】間違えやすい助動詞・時制のルールを見直し、文法の根拠を説明できるようにする。`);
                              setActiveDayAccordionIndex(null);
                            }}
                            className="text-[9px] px-1 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded text-center font-bold"
                          >
                            ✍️ 文法
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              handleMindfulDayChange(idx, `【長文】返り読みをせずに左から右へと意味の塊（チャンク）で速読・精読する。`);
                              setActiveDayAccordionIndex(null);
                            }}
                            className="text-[9px] px-1 py-1 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded text-center font-bold"
                          >
                            🔍 長文
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="bg-sky-50 border border-sky-100 rounded-lg p-2.5 text-[10px] text-sky-800 flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
            <div className="leading-tight">
              各日の入力欄をクリックすると、学習内容に応じたアコーディオンが展開し、ワンクリックで設定可能です。
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons Toolbar - hidden in print */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-100 p-3 rounded-lg border border-slate-200 print:hidden">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
          <span className="text-xs font-bold text-slate-700">出力プレビューは自動的に以下に即時反映されています</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Copy Markdown for ChatGPT */}
          <button
            type="button"
            onClick={handleCopyMarkdown}
            className={`text-xs font-bold px-4 py-2 rounded-lg transition flex items-center gap-1.5 shadow-3xs ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>コピーしました！</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-400" />
                <span>ChatGPT用テーブルコードをコピー</span>
              </>
            )}
          </button>

          {/* Print PDF */}
          <button
            type="button"
            onClick={handlePrint}
            className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition flex items-center gap-1.5 shadow-3xs"
          >
            <Printer className="w-4 h-4" />
            <span>A4用紙で印刷 / PDF保存</span>
          </button>
        </div>
      </div>

      {/* Print & View Ready A4 Layout */}
      <div className="bg-white border border-slate-300 rounded-xl p-6 sm:p-8 shadow-sm max-w-[210mm] mx-auto relative overflow-hidden print:border-0 print:shadow-none print:p-0">
        {/* Decorative corner indicators for A4 feel */}
        <div className="absolute top-0 right-0 w-24 h-24 border-t border-r border-slate-200 pointer-events-none print:hidden"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 border-b border-l border-slate-200 pointer-events-none print:hidden"></div>

        {/* Brand / Institution Header */}
        <div className="flex justify-between items-start border-b-2 border-slate-900 pb-3">
          <div>
            <span className="text-[10px] font-bold text-sky-700 uppercase tracking-widest block">TG STUDY PRESCRIPTION - TEMPORARY WEEKLY GUIDE</span>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">1週間簡易進捗ロードマップ (週間計画書)</h2>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-500 font-medium block">作成日: {new Date().toLocaleDateString('ja-JP')}</span>
            <span className="text-xs font-bold text-slate-800">生徒氏名: {plan.student.name || '生徒未入力'} 様</span>
          </div>
        </div>

        {/* Essential Profile row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 py-3 border-b border-slate-200 text-xs bg-slate-50/50 p-2.5 rounded-md mt-3">
          <div>
            <span className="text-slate-400 block text-[9px] uppercase">志望大学</span>
            <strong className="text-slate-900 font-bold">{plan.student.targetUniversity || '未設定'} / {plan.student.targetFaculty || '未設定'}</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[9px] uppercase">英検目標</span>
            <strong className="text-slate-900 font-bold">{plan.student.qualificationGoal || '未設定'}</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[9px] uppercase">今週の学習時間 / 日</span>
            <strong className="text-sky-700 font-extrabold">{dailyDurationHours === 0.5 ? '30分' : `${dailyDurationHours}時間`} ({totalMinutes}分) / 日</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[9px] uppercase">週合計学習目標</span>
            <strong className="text-sky-700 font-extrabold">{(dailyDurationHours * 7).toFixed(1)} 時間 / 週</strong>
          </div>
        </div>

        {/* Weekly Goal callout */}
        <div className="mt-4 bg-sky-50/50 border border-sky-100 rounded-lg p-3.5">
          <div className="text-[11px] font-extrabold text-sky-900 flex items-center gap-1 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>【今週の最優先目標 (Weekly Primary Goal)】</span>
          </div>
          <p className="text-xs text-slate-800 font-bold leading-relaxed whitespace-pre-wrap pl-1">
            {weeklyGoal || '※今週の目標が未入力です。上の入力欄に入力してください。'}
          </p>
        </div>

        {/* Dynamic daily Breakdown and 1-week checklist */}
        <div className="mt-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 border-l-4 border-slate-900 pl-2">
              📅 デイリー学習メニュー & 進捗チェック (1週間タスクシート)
            </h3>
            <span className="text-[9px] text-slate-500">※毎日完了したらチェックボックスを埋めましょう</span>
          </div>

          <div className="border border-slate-300 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-[10px] text-slate-600 uppercase font-bold">
                  <th className="py-2 px-3 w-16">日程</th>
                  <th className="py-2 px-3 w-28">勉強時間配分</th>
                  <th className="py-2 px-3">優先タスク (1週間デイリー課題一覧)</th>
                  <th className="py-2 px-3 w-14 text-center">完了</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {days.map((d, index) => {
                  const dayPreset = mindfulDays[index] || '';
                  const presetTheme = dayPreset.includes(': ') ? dayPreset.split(': ')[1] : dayPreset;

                  return (
                    <tr key={d.dayNum} className="hover:bg-slate-50/50 transition">
                      <td className="py-2.5 px-3 font-bold text-slate-900 border-r border-slate-200">
                        {d.name}
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-200">
                        <div className="space-y-0.5 font-semibold text-[10px] text-slate-700">
                          <div className="flex justify-between"><span>単語:</span> <span className="font-mono text-sky-700">{vocabMinutes}分</span></div>
                          <div className="flex justify-between"><span>長文:</span> <span className="font-mono text-sky-700">{readingMinutes}分</span></div>
                          <div className="flex justify-between"><span>文法:</span> <span className="font-mono text-sky-700">{grammarMinutes}分</span></div>
                          <div className="flex justify-between border-t border-slate-100 pt-0.5"><span>計:</span> <span className="font-mono font-bold text-indigo-700">{totalMinutes}分</span></div>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-200 space-y-1.5">
                        <div className="font-bold text-slate-800 text-[11px] flex items-center gap-1">
                          <BookOpen className="w-3 h-3 text-sky-600" />
                          <span>単語高回転確認・精読・文法基本演習 ＋ ミスノート振り返り</span>
                        </div>
                        
                        {/* Mindful Day Point */}
                        <div className="bg-amber-50/80 border border-amber-100/55 rounded px-2 py-1 text-[10px] text-slate-700 flex items-start gap-1">
                          <span className="font-extrabold text-amber-700 shrink-0">⚠️ 注意点:</span>
                          <span className="font-medium leading-tight">{presetTheme}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <div className="w-5 h-5 border-2 border-slate-400 rounded mx-auto flex items-center justify-center cursor-pointer hover:border-sky-500">
                          {/* Ready to be ticked by student offline */}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Schedule exceptions & Extra Notice */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <span className="text-[10px] text-slate-500 font-extrabold block mb-1">📢 事前予告・スケジュール例外 (Schedule Exceptions)</span>
            <p className="text-xs text-slate-800 leading-relaxed font-medium">
              {advanceNotices || '特になし'}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <span className="text-[10px] text-slate-500 font-extrabold block mb-1">💡 勉強中の追加メモ (Mindful Extras & Notices)</span>
            <p className="text-xs text-slate-800 leading-relaxed font-medium">
              {mindfulNotes || '特になし'}
            </p>
          </div>
        </div>

        {/* Beautiful footer block for the printed page */}
        <div className="mt-6 border-t border-slate-300 pt-3 flex flex-wrap items-center justify-between text-[10px] text-slate-400 font-medium">
          <span>TG STUDY PRESCRIPTION ROADMAP © {new Date().getFullYear()}</span>
          <span>A4 1ページに収めて、机の前に貼って学習のペースメーカーとして使いましょう。</span>
        </div>
      </div>
    </div>
  );
};
