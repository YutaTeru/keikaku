import React from 'react';
import { SavedPlanMeta } from '../types';
import { FolderOpen, X, Trash2, Copy, Play } from 'lucide-react';

interface SavedPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  plans: SavedPlanMeta[];
  currentPlanId: string;
  onSelectPlan: (id: string) => void;
  onDuplicatePlan: (id: string) => void;
  onDeletePlan: (id: string) => void;
}

export const SavedPlansModal: React.FC<SavedPlansModalProps> = ({
  isOpen,
  onClose,
  plans,
  currentPlanId,
  onSelectPlan,
  onDuplicatePlan,
  onDeletePlan,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-lg shadow-2xl w-full max-w-lg overflow-hidden flex flex-col text-xs">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-sm">
            <FolderOpen className="w-4 h-4 text-sky-400" />
            <span>保存済み学習計画一覧</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-2 max-h-[380px] overflow-y-auto">
          {plans.length === 0 ? (
            <div className="p-4 text-center text-slate-500">保存された計画はありません。</div>
          ) : (
            plans.map((p) => {
              const isCurrent = p.id === currentPlanId;

              return (
                <div
                  key={p.id}
                  className={`p-3 rounded border flex items-center justify-between gap-2 transition ${
                    isCurrent
                      ? 'bg-sky-50 border-sky-300 ring-1 ring-sky-400'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-slate-900 truncate text-xs">
                      {p.planTitle || '無題の計画'}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>生徒名: {p.studentName || '未設定'}</span>
                      <span>・</span>
                      <span>更新: {new Date(p.updatedAt).toLocaleDateString('ja-JP')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => onSelectPlan(p.id)}
                      className="bg-sky-600 hover:bg-sky-500 text-white px-2.5 py-1 rounded font-semibold text-[11px] flex items-center gap-1 transition"
                    >
                      <Play className="w-3 h-3" />
                      <span>開く</span>
                    </button>

                    <button
                      onClick={() => onDuplicatePlan(p.id)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded font-medium text-[11px] transition"
                      title="複製"
                    >
                      <Copy className="w-3 h-3" />
                    </button>

                    <button
                      onClick={() => onDeletePlan(p.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded transition"
                      title="削除"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-3 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-1.5 rounded text-xs font-semibold transition"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
