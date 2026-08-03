import React from 'react';
import { Calendar, Clock, Edit2, ChevronDown, ChevronUp, BookOpen, AlertCircle } from 'lucide-react';
import { PrescriptionPlan } from '../types';

interface CompactWeeklyPlanProps {
  plan: PrescriptionPlan;
  onOpenSettings: () => void;
}

const dayNames = ['月', '火', '水', '木', '金', '土', '日'];

export const CompactWeeklyPlan: React.FC<CompactWeeklyPlanProps> = ({
  plan,
  onOpenSettings,
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

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

  const getShortFocusText = (fullText: string, index: number) => {
    if (!fullText) return `Day ${index + 1}`;
    // Strip prefix like 【単語】
    const clean = fullText.replace(/【[^】]+】/, '').trim();
    return clean.slice(0, 16) + (clean.length > 16 ? '...' : '');
  };

  const getCategoryEmoji = (fullText: string) => {
    if (fullText.includes('単語')) return '📖';
    if (fullText.includes('長文') || fullText.includes('読解')) return '🔍';
    if (fullText.includes('文法')) return '✍️';
    if (fullText.includes('リスニング') || fullText.includes('音読') || fullText.includes('シャドー')) return '🎧';
    if (fullText.includes('過去問') || fullText.includes('模試')) return '📝';
    if (fullText.includes('復習') || fullText.includes('分析')) return '🎯';
    return '📅';
  };

  return (
    <div id="compact-weekly-plan-widget" className="mb-6 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-2xs print:hidden transition-all duration-300">
      {/* Widget Header */}
      <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="bg-sky-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">
            Weekly Temp
          </span>
          <h3 className="text-xs font-black text-slate-800 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-sky-600" />
            <span>週間簡易学習ガイド（シンプル版）</span>
          </h3>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenSettings}
            className="text-[11px] text-sky-700 hover:text-sky-800 font-bold bg-white hover:bg-slate-50 border border-slate-200 rounded px-2.5 py-1 flex items-center gap-1 transition shadow-3xs"
          >
            <Edit2 className="w-3 h-3" />
            <span>設定・印刷 (⚙️)</span>
          </button>
          
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-200 transition"
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="p-4 space-y-3.5">
          {/* Goal & Daily Duration Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 border-b border-slate-150 pb-3">
            <div className="md:col-span-3 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">今週の目標</span>
              <p className="text-xs font-extrabold text-slate-800 bg-white border border-slate-200/60 rounded px-2.5 py-1.5 shadow-3xs">
                {tPlan.weeklyGoal || '未設定'}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">1日の勉強時間</span>
              <div className="text-xs font-extrabold text-slate-800 bg-white border border-slate-200/60 rounded px-2.5 py-1.5 shadow-3xs flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                <span>{tPlan.dailyDurationHours} 時間 / 日</span>
                <span className="text-[10px] text-indigo-500 font-bold">({Math.round(tPlan.dailyDurationHours * 60)}分)</span>
              </div>
            </div>
          </div>

          {/* 7-Day Horizontal Strip */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">日別の学習フォーカス</span>
            <div className="grid grid-cols-2 sm:grid-cols-7 gap-1.5">
              {dayNames.map((dayName, idx) => {
                const presetText = tPlan.selectedMindfulPresets?.[idx] || '';
                const shortFocus = getShortFocusText(presetText, idx);
                const emoji = getCategoryEmoji(presetText);

                return (
                  <div
                    key={idx}
                    className="bg-white border border-slate-200 rounded-lg p-2 flex flex-col justify-between h-[68px] shadow-3xs hover:border-sky-200 hover:bg-sky-50/10 transition"
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 border-b border-slate-100 pb-1">
                      <span>Day {idx + 1} ({dayName})</span>
                      <span className="text-[11px]">{emoji}</span>
                    </div>
                    <p className="text-[10px] text-slate-700 font-bold leading-tight line-clamp-2 mt-1 select-none" title={presetText}>
                      {shortFocus}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Exceptions & notices summary */}
          {(tPlan.advanceNotices || tPlan.mindfulNotes) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-150 text-[11px]">
              {tPlan.mindfulNotes && (
                <div className="flex items-start gap-1.5 bg-amber-50/50 text-amber-900 border border-amber-100/60 rounded px-2.5 py-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-extrabold text-[10px] text-amber-800">💡 勉強中の注意メモ:</span>
                    <p className="font-semibold line-clamp-1">{tPlan.mindfulNotes}</p>
                  </div>
                </div>
              )}
              {tPlan.advanceNotices && (
                <div className="flex items-start gap-1.5 bg-indigo-50/50 text-indigo-950 border border-indigo-100/60 rounded px-2.5 py-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-extrabold text-[10px] text-indigo-800">📢 例外・スケジュール注意:</span>
                    <p className="font-semibold line-clamp-1">{tPlan.advanceNotices}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
