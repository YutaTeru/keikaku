import React from 'react';
import { Clock, AlertTriangle, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { PrescriptionPlan } from '../types';
import { validatePrescriptionPlan } from '../utils/validation';

interface RightTimeMeterProps {
  plan: PrescriptionPlan;
  onGoToStep7: () => void;
}

export const RightTimeMeter: React.FC<RightTimeMeterProps> = ({ plan, onGoToStep7 }) => {
  const {
    totalEnglishMinutes,
    totalOtherMinutes,
    totalAllocatedMinutes,
    remainingMinutes,
    errors,
    warnings,
  } = validatePrescriptionPlan(plan);

  const maxMins = plan.availability.maxStudyMinutes || 1;
  const englishPercent = Math.min(100, Math.round((totalEnglishMinutes / maxMins) * 100));
  const otherPercent = Math.min(100, Math.round((totalOtherMinutes / maxMins) * 100));
  const isExcess = remainingMinutes < 0;
  const isExact = remainingMinutes === 0;

  return (
    <aside className="w-full lg:w-72 bg-white border-l border-slate-200 p-3 flex flex-col gap-3 shrink-0">
      {/* Real-time Time Gauge Box */}
      <div className="bg-slate-50 border border-slate-200 rounded-md p-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
            <Clock className="w-4 h-4 text-sky-600" />
            <span>時間配分計算メーター</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            可処分: {maxMins}分 ({(maxMins / 60).toFixed(1)}h)
          </span>
        </div>

        {/* Big time summary */}
        <div className="mt-2.5 flex items-baseline justify-between">
          <span className="text-xs text-slate-600 font-medium">現在の合計配分:</span>
          <span className="text-xl font-extrabold font-mono text-slate-900">
            {totalAllocatedMinutes} <span className="text-xs font-normal text-slate-500">分</span>
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mt-2 w-full bg-slate-200 h-3 rounded-full overflow-hidden flex shadow-inner">
          <div
            style={{ width: `${englishPercent}%` }}
            className="bg-sky-600 transition-all duration-300"
            title={`英語: ${totalEnglishMinutes}分`}
          />
          <div
            style={{ width: `${otherPercent}%` }}
            className="bg-indigo-500 transition-all duration-300"
            title={`他教科: ${totalOtherMinutes}分`}
          />
        </div>

        {/* Legend */}
        <div className="mt-2 grid grid-cols-2 gap-1 text-[11px]">
          <div className="flex items-center gap-1 text-slate-700">
            <span className="w-2.5 h-2.5 rounded-sm bg-sky-600 shrink-0" />
            <span>英語: {totalEnglishMinutes}分</span>
          </div>
          <div className="flex items-center gap-1 text-slate-700">
            <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500 shrink-0" />
            <span>他教科: {totalOtherMinutes}分</span>
          </div>
        </div>

        {/* Time state badge */}
        <div className="mt-3">
          {isExcess ? (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs px-2.5 py-1.5 rounded flex items-center justify-between font-semibold">
              <span className="flex items-center gap-1">
                <AlertOctagon className="w-3.5 h-3.5 text-rose-600" /> 時間超過:
              </span>
              <span className="font-mono text-sm">{Math.abs(remainingMinutes)}分オーバー</span>
            </div>
          ) : isExact ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs px-2.5 py-1.5 rounded flex items-center justify-between font-semibold">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> ピッタリ配分:
              </span>
              <span className="font-mono text-sm">残り 0分</span>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs px-2.5 py-1.5 rounded flex items-center justify-between font-semibold">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" /> 未配分あり:
              </span>
              <span className="font-mono text-sm">残り {remainingMinutes}分</span>
            </div>
          )}
        </div>
      </div>

      {/* Validation Alert Box */}
      <div className="bg-white border border-slate-200 rounded-md p-3 flex-1 flex flex-col">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            自動チェック状況
          </span>
          <button
            onClick={onGoToStep7}
            className="text-[11px] text-sky-700 font-medium hover:underline flex items-center gap-0.5"
          >
            ステップ7で確認 ➔
          </button>
        </div>

        <div className="mt-2 space-y-2 text-xs overflow-y-auto max-h-[200px] flex-1">
          {errors.length === 0 && warnings.length === 0 ? (
            <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded border border-emerald-100 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="leading-tight">エラーや矛盾は見つかりませんでした。順調です！</span>
            </div>
          ) : (
            <>
              {errors.map((e) => (
                <div key={e.id} className="p-2 bg-rose-50 border border-rose-200 text-rose-800 rounded text-[11px] leading-tight">
                  <div className="font-bold flex items-center gap-1 text-rose-700">
                    <AlertOctagon className="w-3 h-3 text-rose-600 shrink-0" /> [エラー]
                  </div>
                  <div className="mt-0.5 text-rose-900">{e.message}</div>
                </div>
              ))}
              {warnings.map((w) => (
                <div key={w.id} className="p-2 bg-amber-50 border border-amber-200 text-amber-900 rounded text-[11px] leading-tight">
                  <div className="font-bold flex items-center gap-1 text-amber-800">
                    <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" /> [注意]
                  </div>
                  <div className="mt-0.5 text-amber-950">{w.message}</div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </aside>
  );
};
