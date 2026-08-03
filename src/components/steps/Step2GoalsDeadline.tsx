import React from 'react';
import { GoalsAndDeadline } from '../../types';
import { QUICK_PRESETS } from '../../data/presets';
import { Target, Calendar, Award, AlertCircle, Plus, Trash2, Sparkles } from 'lucide-react';

interface Step2Props {
  goals: GoalsAndDeadline;
  onChange: (updated: GoalsAndDeadline) => void;
}

export const Step2GoalsDeadline: React.FC<Step2Props> = ({ goals, onChange }) => {
  const handleChange = (field: keyof GoalsAndDeadline, value: any) => {
    onChange({ ...goals, [field]: value });
  };

  const handleMainGoalChange = (index: number, val: string) => {
    const updated = [...goals.mainGoals];
    updated[index] = val;
    handleChange('mainGoals', updated);
  };

  const handleAddMainGoal = () => {
    handleChange('mainGoals', [...goals.mainGoals, '']);
  };

  const handleRemoveMainGoal = (index: number) => {
    if (goals.mainGoals.length <= 1) return;
    const updated = goals.mainGoals.filter((_, i) => i !== index);
    handleChange('mainGoals', updated);
  };

  return (
    <div className="space-y-4">
      {/* Step Header */}
      <div className="border-b border-slate-200 pb-2">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Target className="w-5 h-5 text-sky-600" />
          ステップ2：目標と期限（ゴールと現在地の確認）
        </h2>
        <p className="text-xs text-slate-600 mt-0.5">
          最終目標（複数可）、短期目標、試験期日、現在の学力、過去の挫折原因を設定します。候補チップを押して簡単に入力可能です。
        </p>
      </div>

      <div className="space-y-4 text-xs">
        {/* Main Goals (Multiple) */}
        <div className="bg-slate-50 border border-slate-200 rounded-md p-3 space-y-2">
          <div className="flex items-center justify-between">
            <label className="font-bold text-slate-800 flex items-center gap-1">
              <span>最終目標設定（複数登録可）</span>
              <span className="text-rose-500">*</span>
            </label>
            <button
              onClick={handleAddMainGoal}
              className="bg-sky-600 hover:bg-sky-500 text-white text-[11px] px-2 py-1 rounded font-medium flex items-center gap-1 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>目標を追加</span>
            </button>
          </div>

          <div className="space-y-2">
            {goals.mainGoals.map((goal, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-slate-500 font-mono text-[11px] w-5 text-right">{idx + 1}.</span>
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => handleMainGoalChange(idx, e.target.value)}
                  placeholder="例: 英検準1級合格 / 慶應文学部へ向けた英語読解基礎力の完成"
                  className="flex-1 bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
                {goals.mainGoals.length > 1 && (
                  <button
                    onClick={() => handleRemoveMainGoal(idx)}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded transition"
                    title="削除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Short Term Goal & Priority Task */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="font-semibold text-slate-800">短期目標（今月〜数週間）</label>
            <input
              type="text"
              value={goals.shortTermGoals}
              onChange={(e) => handleChange('shortTermGoals', e.target.value)}
              placeholder="例: 単語帳1周完了と英検2級長文の精読マスター"
              className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-800 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>教師が考える最優先課題</span>
            </label>
            <input
              type="text"
              value={goals.topPriorityTask}
              onChange={(e) => handleChange('topPriorityTask', e.target.value)}
              placeholder="例: 単語の3分割テスト継続と、リスニングの音変化聞き取り"
              className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
            <div className="flex flex-wrap gap-1 pt-1">
              {QUICK_PRESETS.priorities.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handleChange('topPriorityTask', p)}
                  className="text-[10px] bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 px-2 py-0.5 rounded transition"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Schedule Dates */}
        <div className="bg-white border border-slate-200 rounded-md p-3 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="font-semibold text-slate-800 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-sky-600" />
              <span>計画開始日</span>
            </label>
            <input
              type="date"
              value={goals.planStartDate}
              onChange={(e) => handleChange('planStartDate', e.target.value)}
              className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-800 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-sky-600" />
              <span>計画終了日</span>
            </label>
            <input
              type="date"
              value={goals.planEndDate}
              onChange={(e) => handleChange('planEndDate', e.target.value)}
              className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-800 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-rose-600" />
              <span>本番試験日（本命・目標検定日）</span>
            </label>
            <input
              type="date"
              value={goals.examDate}
              onChange={(e) => handleChange('examDate', e.target.value)}
              className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500 font-mono"
            />
          </div>
        </div>

        {/* Current Academic Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="font-semibold text-slate-800 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-slate-500" />
              <span>現在の模試偏差値</span>
            </label>
            <input
              type="text"
              value={goals.currentDevScore}
              onChange={(e) => handleChange('currentDevScore', e.target.value)}
              placeholder="例: 英語 55.0（全統模試）"
              className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-800 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-slate-500" />
              <span>現在の英検級・スコア</span>
            </label>
            <input
              type="text"
              value={goals.currentEikenScore}
              onChange={(e) => handleChange('currentEikenScore', e.target.value)}
              placeholder="例: 2級合格 (CSE 2150点)"
              className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>
        </div>

        {/* Strong / Weak skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="font-semibold text-slate-800 text-emerald-800">得意技能・本人の強み</label>
            <input
              type="text"
              value={goals.strongSkills}
              onChange={(e) => handleChange('strongSkills', e.target.value)}
              placeholder="例: 単語の暗記力、文法問題の解法スピード"
              className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-800 text-rose-800">苦手技能・弱点</label>
              <span className="text-[10px] text-slate-500 flex items-center gap-0.5">
                <Sparkles className="w-3 h-3 text-sky-600" /> 1タップ選択可
              </span>
            </div>
            <input
              type="text"
              value={goals.weakSkills}
              onChange={(e) => handleChange('weakSkills', e.target.value)}
              placeholder="例: 精読の構文把握、リスニングの音の変化、英文要約"
              className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
            <div className="flex flex-wrap gap-1 pt-1">
              {QUICK_PRESETS.weaknesses.map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => handleChange('weakSkills', w)}
                  className="text-[10px] bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 px-2 py-0.5 rounded transition"
                >
                  {w}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Past Failure Reasons */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-slate-800">これまで勉強が続かなかった理由・パターン</label>
            <span className="text-[10px] text-slate-500 flex items-center gap-0.5">
              <Sparkles className="w-3 h-3 text-sky-600" /> 1タップ選択可
            </span>
          </div>
          <textarea
            value={goals.pastFailureReason}
            onChange={(e) => handleChange('pastFailureReason', e.target.value)}
            rows={2}
            placeholder="例: 計画を高く立てすぎて1日遅れると自己嫌悪で放置していた。夜更かししてスマホを見ることが多かった。"
            className="w-full bg-white border border-slate-300 rounded p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500 resize-y"
          />
          <div className="flex flex-wrap gap-1 pt-1">
            {QUICK_PRESETS.failureReasons.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => handleChange('pastFailureReason', f)}
                className="text-[10px] bg-slate-100 hover:bg-sky-50 text-slate-700 hover:border-sky-300 border border-slate-200 px-2 py-0.5 rounded transition"
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
