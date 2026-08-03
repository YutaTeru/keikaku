import React from 'react';
import { PrescriptionPlan } from '../../types';
import { validatePrescriptionPlan } from '../../utils/validation';
import {
  ShieldAlert,
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Trash2,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';

interface Step7Props {
  plan: PrescriptionPlan;
  onUpdatePlan: (updated: PrescriptionPlan) => void;
  onGoToOutputStep: () => void;
}

export const Step7Validation: React.FC<Step7Props> = ({
  plan,
  onUpdatePlan,
  onGoToOutputStep,
}) => {
  const { errors, warnings, totalAllocatedMinutes } = validatePrescriptionPlan(plan);

  const handleAddUncertainty = () => {
    onUpdatePlan({
      ...plan,
      uncertainties: [...plan.uncertainties, ''],
    });
  };

  const handleUpdateUncertainty = (index: number, val: string) => {
    const updated = [...plan.uncertainties];
    updated[index] = val;
    onUpdatePlan({ ...plan, uncertainties: updated });
  };

  const handleDeleteUncertainty = (index: number) => {
    onUpdatePlan({
      ...plan,
      uncertainties: plan.uncertainties.filter((_, i) => i !== index),
    });
  };

  const handleToggleIgnoreWarning = (warningId: string) => {
    const ignored = plan.ignoredWarningIds || [];
    const isIgnored = ignored.includes(warningId);
    const updatedIgnored = isIgnored
      ? ignored.filter((id) => id !== warningId)
      : [...ignored, warningId];

    onUpdatePlan({ ...plan, ignoredWarningIds: updatedIgnored });
  };

  return (
    <div className="space-y-5">
      {/* Step Header */}
      <div className="border-b border-slate-200 pb-2">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-sky-600" />
          ステップ7：矛盾の自動点検と教師確認
        </h2>
        <p className="text-xs text-slate-600 mt-0.5">
          入力された計画に現実的でない設定（時間の超過・教材の抜け漏れ）がないか自動チェックします。
        </p>
      </div>

      {/* Overview status box */}
      <div
        className={`p-4 rounded-md border text-xs flex flex-wrap items-center justify-between gap-3 shadow-sm ${
          errors.length > 0
            ? 'bg-rose-50 border-rose-200 text-rose-900'
            : warnings.length > 0
            ? 'bg-amber-50 border-amber-200 text-amber-900'
            : 'bg-emerald-50 border-emerald-200 text-emerald-900'
        }`}
      >
        <div className="flex items-center gap-3">
          {errors.length > 0 ? (
            <AlertOctagon className="w-6 h-6 text-rose-600 shrink-0" />
          ) : warnings.length > 0 ? (
            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
          ) : (
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          )}

          <div>
            <div className="font-bold text-sm">
              {errors.length > 0
                ? `修正が必要なエラーが ${errors.length} 件あります`
                : warnings.length > 0
                ? `確認推奨の注意項目が ${warnings.length} 件あります`
                : 'すべて設定に矛盾は見られません。素晴らしい計画です！'}
            </div>
            <div className="text-[11px] opacity-90 mt-0.5">
              一日の目標時間: {plan.availability.maxStudyMinutes}分 / 現在の配分合計:{' '}
              {totalAllocatedMinutes}分
            </div>
          </div>
        </div>

        {errors.length === 0 && (
          <button
            onClick={onGoToOutputStep}
            className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-3.5 py-1.5 rounded text-xs flex items-center gap-1.5 shadow transition"
          >
            <span>注文表・プロンプト出力へ</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Mandatory Errors Section */}
      {errors.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
            <AlertOctagon className="w-4 h-4 text-rose-600" />
            <span>【必須修正項目】（計画を正しく成立させるためのエラー）</span>
          </h3>

          <div className="space-y-2">
            {errors.map((err) => (
              <div
                key={err.id}
                className="bg-white border-l-4 border-l-rose-500 border border-slate-200 rounded p-3 text-xs space-y-1 shadow-sm"
              >
                <div className="font-bold text-rose-900">{err.message}</div>
                <div className="text-slate-600 bg-rose-50/60 p-2 rounded border border-rose-100">
                  <span className="font-semibold text-rose-800">💡 修正アドバイス: </span>
                  {err.fixAdvice}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warnings Section */}
      {warnings.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>【注意・確認項目】（面談での判断推奨）</span>
          </h3>

          <div className="space-y-2">
            {warnings.map((warn) => {
              const isIgnored = (plan.ignoredWarningIds || []).includes(warn.id);

              return (
                <div
                  key={warn.id}
                  className={`bg-white border-l-4 rounded p-3 text-xs space-y-2 shadow-sm transition ${
                    isIgnored
                      ? 'border-l-slate-300 border-slate-200 opacity-60'
                      : 'border-l-amber-500 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-bold text-slate-900">{warn.message}</div>
                    <button
                      onClick={() => handleToggleIgnoreWarning(warn.id)}
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold transition shrink-0 ${
                        isIgnored
                          ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                      }`}
                    >
                      {isIgnored ? '判断解除' : '教師判断で続行'}
                    </button>
                  </div>

                  <div className="text-slate-600 bg-amber-50/50 p-2 rounded border border-amber-100">
                    <span className="font-semibold text-amber-900">💡 アードバイス: </span>
                    {warn.fixAdvice}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Section: Pending / Uncertainty Editor (未確定事項) */}
      <div className="bg-slate-50 border border-slate-200 rounded-md p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-sky-600" />
            <span>【未確定事項の明示】面談内で持ち越す決定事項</span>
          </h3>

          <button
            onClick={handleAddUncertainty}
            className="bg-sky-600 hover:bg-sky-500 text-white text-[11px] px-2.5 py-1 rounded font-medium flex items-center gap-1 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>未確定項目を追加</span>
          </button>
        </div>

        <p className="text-[11px] text-slate-600">
          ChatGPTプロンプト生成時、未確定事項は勝手に決定せず「※面談で決定次第追記」として出力されます。
        </p>

        {plan.uncertainties.length === 0 ? (
          <div className="p-2 bg-white border border-slate-200 rounded text-xs text-slate-500 italic">
            現在、未確定事項はありません。すべて確定しています。
          </div>
        ) : (
          <div className="space-y-2">
            {plan.uncertainties.map((unc, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-slate-500 font-mono text-[11px] w-5 text-right">{idx + 1}.</span>
                <input
                  type="text"
                  value={unc}
                  onChange={(e) => handleUpdateUncertainty(idx, e.target.value)}
                  placeholder="例: 英文法教材（ポラリス1 or Vintage）の決定（次回実物を見て確認）"
                  className="flex-1 bg-white border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
                <button
                  onClick={() => handleDeleteUncertainty(idx)}
                  className="text-slate-400 hover:text-rose-600 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
