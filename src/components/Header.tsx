import React, { useState } from 'react';
import {
  FileText,
  Save,
  FolderOpen,
  Plus,
  RotateCcw,
  Sparkles,
  Download,
  Upload,
  CheckCircle2,
  Settings,
} from 'lucide-react';
import { PrescriptionPlan } from '../types';
import { YAMAGATA_SAMPLE_PLAN } from '../data/sampleData';

interface HeaderProps {
  plan: PrescriptionPlan;
  onUpdatePlanTitle: (title: string) => void;
  onLoadYamagataSample: () => void;
  onSave: () => void;
  onNew: () => void;
  onOpenSavedModal: () => void;
  onExportJson: () => void;
  onImportJson: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetConfirm: () => void;
  isSavedNotification: boolean;
  onOpenWeeklyTempModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  plan,
  onUpdatePlanTitle,
  onLoadYamagataSample,
  onSave,
  onNew,
  onOpenSavedModal,
  onExportJson,
  onImportJson,
  onResetConfirm,
  isSavedNotification,
  onOpenWeeklyTempModal,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-30">
      {/* Brand & App Title */}
      <div className="flex items-center gap-3">
        <div className="bg-sky-500 text-slate-950 font-bold px-2.5 py-1 rounded text-xs tracking-wide uppercase flex items-center gap-1.5 shadow-sm">
          <FileText className="w-4 h-4" />
          <span>TG 学習処方箋ビルダー</span>
        </div>

        {/* Plan Title Editable */}
        <div className="flex items-center gap-2">
          {isEditingTitle ? (
            <input
              type="text"
              value={plan.planTitle}
              onChange={(e) => onUpdatePlanTitle(e.target.value)}
              onBlur={() => setIsEditingTitle(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
              autoFocus
              className="bg-slate-800 border border-sky-400 rounded px-2 py-0.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-sky-400"
            />
          ) : (
            <button
              onClick={() => setIsEditingTitle(true)}
              title="クリックして計画タイトルを変更"
              className="text-sm font-medium text-slate-200 hover:text-white hover:bg-slate-800/80 px-2 py-0.5 rounded transition flex items-center gap-1.5 max-w-[240px] sm:max-w-[360px] truncate"
            >
              <span className="truncate">{plan.planTitle || '無題の学習計画書'}</span>
              <span className="text-xs text-slate-400">✏️</span>
            </button>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Sample Yamagata Loader */}
        <button
          onClick={onLoadYamagataSample}
          className="bg-teal-700 hover:bg-teal-600 text-white text-xs px-2.5 py-1.5 rounded font-medium flex items-center gap-1.5 transition shadow-sm"
          title="山形さんの動作検証サンプルデータを一括読込"
        >
          <Sparkles className="w-3.5 h-3.5 text-teal-200" />
          <span>山形さんサンプル読込</span>
        </button>

        {/* Save */}
        <button
          onClick={onSave}
          className={`text-xs px-2.5 py-1.5 rounded font-medium flex items-center gap-1 transition shadow-sm ${
            isSavedNotification
              ? 'bg-emerald-600 text-white'
              : 'bg-sky-600 hover:bg-sky-500 text-white'
          }`}
        >
          {isSavedNotification ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>保存完了</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              <span>一時保存</span>
            </>
          )}
        </button>

        {/* Load Modal */}
        <button
          onClick={onOpenSavedModal}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-2.5 py-1.5 rounded font-medium flex items-center gap-1 transition border border-slate-700"
          title="保存済み計画一覧を開く"
        >
          <FolderOpen className="w-3.5 h-3.5" />
          <span>一覧</span>
        </button>

        {/* New Plan */}
        <button
          onClick={onNew}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-2.5 py-1.5 rounded font-medium flex items-center gap-1 transition border border-slate-700"
          title="新規計画を作成"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>新規</span>
        </button>

        {/* Import JSON */}
        <label className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-2 py-1.5 rounded font-medium flex items-center gap-1 cursor-pointer transition border border-slate-700">
          <Upload className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">インポート</span>
          <input
            type="file"
            accept=".json"
            onChange={onImportJson}
            className="hidden"
          />
        </label>

        {/* Export JSON */}
        <button
          onClick={onExportJson}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-2 py-1.5 rounded font-medium flex items-center gap-1 transition border border-slate-700"
          title="JSONをダウンロード"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">JSON</span>
        </button>

        {/* Reset */}
        <button
          onClick={onResetConfirm}
          className="bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-200 text-xs px-2 py-1.5 rounded transition border border-slate-700"
          title="入力内容を初期化"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Weekly Temporary Plan Gear Settings Button */}
        <button
          onClick={onOpenWeeklyTempModal}
          className="bg-sky-600 hover:bg-sky-500 text-white text-xs px-3 py-1.5 rounded-lg font-extrabold flex items-center gap-1.5 transition shadow-sm border border-sky-500 hover:border-sky-400"
          title="週間簡易版（テンポラリ）計画の設定と印刷"
        >
          <Settings className="w-3.5 h-3.5 animate-spin-hover" />
          <span>⚙️ 週間簡易版</span>
        </button>
      </div>
    </header>
  );
};
