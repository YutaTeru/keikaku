import React from 'react';
import {
  EnglishSkillAllocation,
  OtherSubjectAllocation,
  TimeAvailability,
} from '../../types';
import { QUICK_PRESETS } from '../../data/presets';
import { PieChart, Clock, Layers, Sparkles } from 'lucide-react';

interface Step4Props {
  englishAllocations: EnglishSkillAllocation[];
  otherAllocations: OtherSubjectAllocation[];
  availability: TimeAvailability;
  onUpdateEnglish: (updated: EnglishSkillAllocation[]) => void;
  onUpdateOther: (updated: OtherSubjectAllocation[]) => void;
}

export const Step4Allocations: React.FC<Step4Props> = ({
  englishAllocations,
  otherAllocations,
  availability,
  onUpdateEnglish,
  onUpdateOther,
}) => {
  const handleEnglishChange = (index: number, field: keyof EnglishSkillAllocation, value: any) => {
    const updated = [...englishAllocations];
    updated[index] = { ...updated[index], [field]: value };
    onUpdateEnglish(updated);
  };

  const handleOtherChange = (index: number, field: keyof OtherSubjectAllocation, value: any) => {
    const updated = [...otherAllocations];
    updated[index] = { ...updated[index], [field]: value };
    onUpdateOther(updated);
  };

  const applyAllocationPreset = (presetIndex: number) => {
    const preset = QUICK_PRESETS.allocationPresets[presetIndex];
    if (!preset) return;

    // Apply English allocations
    const updatedEnglish = englishAllocations.map((eng) => {
      const match = preset.english.find((e) => e.skillKey === eng.skillKey);
      if (match) {
        return {
          ...eng,
          isUsed: match.isUsed,
          minutesPerDay: match.minutes,
          priority: (match.priority as any) || eng.priority,
          timesPerWeek: match.timesPerWeek || eng.timesPerWeek,
          splitCount: match.splitCount || eng.splitCount,
          preferredTimeSlot: match.preferredTimeSlot || eng.preferredTimeSlot,
        };
      }
      return { ...eng, isUsed: false, minutesPerDay: 0 };
    });

    // Apply Other allocations
    const updatedOther = otherAllocations.map((oth) => {
      const match = preset.other.find((o) => o.subjectKey === oth.subjectKey);
      if (match) {
        return {
          ...oth,
          isUsed: match.isUsed,
          minutesPerDay: match.minutes,
        };
      }
      return { ...oth, isUsed: false, minutesPerDay: 0 };
    });

    onUpdateEnglish(updatedEnglish);
    onUpdateOther(updatedOther);
  };

  const totalEnglish = englishAllocations.reduce(
    (sum, a) => (a.isUsed ? sum + (Number(a.minutesPerDay) || 0) : sum),
    0
  );
  const totalOther = otherAllocations.reduce(
    (sum, a) => (a.isUsed ? sum + (Number(a.minutesPerDay) || 0) : sum),
    0
  );
  const grandTotal = totalEnglish + totalOther;
  const remaining = availability.maxStudyMinutes - grandTotal;

  return (
    <div className="space-y-4">
      {/* Step Header */}
      <div className="border-b border-slate-200 pb-2">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <PieChart className="w-5 h-5 text-sky-600" />
          ステップ4：教科・技能の時間配分
        </h2>
        <p className="text-xs text-slate-600 mt-0.5">
          まず英語の技能別内訳（単語・文法・精読・リスニング等）を設定し、次に他教科の時間を割り当てます。プリセットボタンで一括自動割り当ても可能です。
        </p>
      </div>

      {/* Preset Allocations Banner */}
      <div className="bg-sky-50 border border-sky-200 rounded-md p-3 space-y-1.5 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-sky-900">
          <Sparkles className="w-4 h-4 text-sky-600" />
          <span>志望校・タイプ別 配分モデル（ワンタップ一括適用）</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {QUICK_PRESETS.allocationPresets.map((preset, idx) => (
            <button
              key={preset.title}
              type="button"
              onClick={() => applyAllocationPreset(idx)}
              className="text-left bg-white hover:bg-sky-100/70 border border-sky-200 p-2 rounded transition shadow-xs group"
            >
              <div className="font-bold text-sky-950 group-hover:text-sky-700">{preset.title}</div>
              <div className="text-[10px] text-slate-600 line-clamp-1">{preset.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Real-time Time Bar Banner */}
      <div className="bg-slate-900 text-white rounded-md p-3 flex flex-wrap items-center justify-between gap-3 text-xs shadow-sm">
        <div className="flex items-center gap-3">
          <div>
            <div className="text-[10px] text-slate-400">一日の利用可能</div>
            <div className="font-mono text-sm font-bold">{availability.maxStudyMinutes}分</div>
          </div>
          <div className="text-slate-600">|</div>
          <div>
            <div className="text-[10px] text-slate-400">英語合計</div>
            <div className="font-mono text-sm font-bold text-sky-400">{totalEnglish}分</div>
          </div>
          <div className="text-slate-600">|</div>
          <div>
            <div className="text-[10px] text-slate-400">他教科合計</div>
            <div className="font-mono text-sm font-bold text-indigo-300">{totalOther}分</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="text-[10px] text-slate-400">割り当て合計</div>
            <div className="font-mono text-base font-extrabold">{grandTotal}分</div>
          </div>

          <div
            className={`px-2.5 py-1 rounded text-xs font-bold font-mono ${
              remaining < 0
                ? 'bg-rose-500 text-white'
                : remaining === 0
                ? 'bg-emerald-500 text-white'
                : 'bg-amber-500 text-slate-950'
            }`}
          >
            {remaining < 0
              ? `超過 ${Math.abs(remaining)}分`
              : remaining === 0
              ? 'ちょうど'
              : `残り ${remaining}分`}
          </div>
        </div>
      </div>

      {/* Section A: English Skills Detailed Allocation */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-sky-600" />
            <span>【英語】技能・作業別の詳細配分（11項目）</span>
          </h3>
          <span className="text-xs text-slate-500 font-mono">小計: {totalEnglish}分</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-md divide-y divide-slate-200 text-xs overflow-x-auto">
          {englishAllocations.map((item, idx) => (
            <div
              key={item.skillKey}
              className={`p-2.5 flex flex-wrap md:flex-nowrap items-center gap-2 transition ${
                item.isUsed ? 'bg-white' : 'bg-slate-50/70 opacity-60'
              }`}
            >
              {/* Toggle checkbox */}
              <div className="w-28 shrink-0 flex items-center gap-1.5 font-bold text-slate-900">
                <input
                  type="checkbox"
                  checked={item.isUsed}
                  onChange={(e) => handleEnglishChange(idx, 'isUsed', e.target.checked)}
                  className="w-4 h-4 text-sky-600 rounded focus:ring-sky-500 border-slate-300 cursor-pointer"
                />
                <span>{item.skillName}</span>
              </div>

              {/* Mins per day */}
              <div className="w-28 shrink-0 flex items-center gap-1">
                <input
                  type="number"
                  min={0}
                  max={600}
                  step={5}
                  disabled={!item.isUsed}
                  value={item.minutesPerDay}
                  onChange={(e) =>
                    handleEnglishChange(idx, 'minutesPerDay', parseInt(e.target.value || '0', 10))
                  }
                  className="w-16 bg-white border border-slate-300 rounded px-1.5 py-1 text-center font-mono font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500 disabled:bg-slate-100"
                />
                <span className="text-slate-600">分/日</span>
              </div>

              {/* Split count */}
              <div className="w-28 shrink-0 flex items-center gap-1">
                <span className="text-slate-500 text-[11px]">分割:</span>
                <select
                  disabled={!item.isUsed}
                  value={item.splitCount}
                  onChange={(e) =>
                    handleEnglishChange(idx, 'splitCount', parseInt(e.target.value, 10))
                  }
                  className="bg-white border border-slate-300 rounded px-1 py-1 text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500 disabled:bg-slate-100"
                >
                  <option value={1}>1回</option>
                  <option value={2}>2分割</option>
                  <option value={3}>3分割</option>
                  <option value={4}>4分割</option>
                </select>
              </div>

              {/* Times per week */}
              <div className="w-24 shrink-0 flex items-center gap-1">
                <select
                  disabled={!item.isUsed}
                  value={item.timesPerWeek}
                  onChange={(e) =>
                    handleEnglishChange(idx, 'timesPerWeek', parseInt(e.target.value, 10))
                  }
                  className="bg-white border border-slate-300 rounded px-1 py-1 text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500 disabled:bg-slate-100"
                >
                  <option value={7}>週7日</option>
                  <option value={6}>週6日</option>
                  <option value={5}>週5日</option>
                  <option value={4}>週4日</option>
                  <option value={3}>週3日</option>
                  <option value={2}>週2日</option>
                  <option value={1}>週1日</option>
                </select>
              </div>

              {/* Priority */}
              <div className="w-20 shrink-0">
                <select
                  disabled={!item.isUsed}
                  value={item.priority}
                  onChange={(e) => handleEnglishChange(idx, 'priority', e.target.value as any)}
                  className={`bg-white border border-slate-300 rounded px-1 py-1 text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500 disabled:bg-slate-100 ${
                    item.priority === 'high'
                      ? 'text-rose-700 font-bold'
                      : item.priority === 'medium'
                      ? 'text-sky-700 font-semibold'
                      : 'text-slate-600'
                  }`}
                >
                  <option value="high">優先:高</option>
                  <option value="medium">優先:中</option>
                  <option value="low">優先:低</option>
                </select>
              </div>

              {/* Preferred Time Slot */}
              <div className="w-28 shrink-0">
                <input
                  type="text"
                  disabled={!item.isUsed}
                  value={item.preferredTimeSlot}
                  onChange={(e) => handleEnglishChange(idx, 'preferredTimeSlot', e.target.value)}
                  placeholder="時間帯(朝/昼/夜)"
                  className="w-full bg-white border border-slate-300 rounded px-1.5 py-1 text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500 disabled:bg-slate-100"
                />
              </div>

              {/* Teacher Memo */}
              <div className="flex-1 min-w-[140px]">
                <input
                  type="text"
                  disabled={!item.isUsed}
                  value={item.teacherMemo}
                  onChange={(e) => handleEnglishChange(idx, 'teacherMemo', e.target.value)}
                  placeholder="指示メモ (例: 20分×3回に分割)"
                  className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500 disabled:bg-slate-100"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section B: Other Subjects Allocation */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-indigo-600" />
            <span>【英語以外の教科】時間配分</span>
          </h3>
          <span className="text-xs text-slate-500 font-mono">小計: {totalOther}分</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-md divide-y divide-slate-200 text-xs overflow-x-auto">
          {otherAllocations.map((item, idx) => (
            <div
              key={item.subjectKey}
              className={`p-2.5 flex items-center gap-3 transition ${
                item.isUsed ? 'bg-white' : 'bg-slate-50/70 opacity-60'
              }`}
            >
              {/* Checkbox & Name */}
              <div className="w-36 shrink-0 flex items-center gap-1.5 font-bold text-slate-900">
                <input
                  type="checkbox"
                  checked={item.isUsed}
                  onChange={(e) => handleOtherChange(idx, 'isUsed', e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 border-slate-300 cursor-pointer"
                />
                <span>{item.subjectName}</span>
              </div>

              {/* Mins per day */}
              <div className="w-32 shrink-0 flex items-center gap-1">
                <input
                  type="number"
                  min={0}
                  max={600}
                  step={10}
                  disabled={!item.isUsed}
                  value={item.minutesPerDay}
                  onChange={(e) =>
                    handleOtherChange(idx, 'minutesPerDay', parseInt(e.target.value || '0', 10))
                  }
                  className="w-16 bg-white border border-slate-300 rounded px-1.5 py-1 text-center font-mono font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-100"
                />
                <span className="text-slate-600">分/日</span>
              </div>

              {/* Teacher Memo */}
              <div className="flex-1">
                <input
                  type="text"
                  disabled={!item.isUsed}
                  value={item.teacherMemo}
                  onChange={(e) => handleOtherChange(idx, 'teacherMemo', e.target.value)}
                  placeholder="教師メモ (例: 通史の把握と用語整理)"
                  className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-100"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
