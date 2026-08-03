import React from 'react';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';

interface BottomNavProps {
  currentStep: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  onSave: () => void;
  isSavedNotification: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentStep,
  totalSteps,
  onPrev,
  onNext,
  onSave,
  isSavedNotification,
}) => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-white px-4 py-2.5 flex items-center justify-between sticky bottom-0 z-30 shadow-lg">
      {/* Prev Button */}
      <button
        onClick={onPrev}
        disabled={currentStep === 1}
        className={`px-3.5 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition ${
          currentStep === 1
            ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'
            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
        }`}
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>戻る</span>
      </button>

      {/* Center Progress & Save */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-400 hidden sm:inline font-mono">
          Step <span className="text-sky-400 font-bold">{currentStep}</span> / {totalSteps}
        </span>

        <button
          onClick={onSave}
          className={`px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1 transition ${
            isSavedNotification
              ? 'bg-emerald-600 text-white font-semibold'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
          }`}
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSavedNotification ? '保存完了' : '一時保存'}</span>
        </button>
      </div>

      {/* Next Button */}
      <button
        onClick={onNext}
        disabled={currentStep === totalSteps}
        className={`px-4 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition shadow-sm ${
          currentStep === totalSteps
            ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'
            : 'bg-sky-600 hover:bg-sky-500 text-white'
        }`}
      >
        <span>{currentStep === totalSteps ? '完了' : '次へ'}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </footer>
  );
};
