import React from 'react';
import {
  User,
  Target,
  Clock,
  PieChart,
  BookOpen,
  Smartphone,
  ShieldAlert,
  FileCheck2,
} from 'lucide-react';

export interface StepItem {
  id: number;
  title: string;
  icon: React.ReactNode;
  subtitle: string;
}

export const STEPS: StepItem[] = [
  { id: 1, title: '1. 生徒情報', subtitle: '基本プロファイル', icon: <User className="w-4 h-4" /> },
  { id: 2, title: '2. 目標と期限', subtitle: '志望校・偏差値・試練', icon: <Target className="w-4 h-4" /> },
  { id: 3, title: '3. 学習可能時間', subtitle: '生活リズム・可処分時間', icon: <Clock className="w-4 h-4" /> },
  { id: 4, title: '4. 教科・技能配分', subtitle: '英語技能別・他教科時間', icon: <PieChart className="w-4 h-4" /> },
  { id: 5, title: '5. 教材と勉強法', subtitle: '参考書・手順ステップ', icon: <BookOpen className="w-4 h-4" /> },
  { id: 6, title: '6. 環境・スマホ・AI', subtitle: '生活習慣・ルール・短縮版', icon: <Smartphone className="w-4 h-4" /> },
  { id: 7, title: '7. 確認と警告', subtitle: '自動矛盾検証チェック', icon: <ShieldAlert className="w-4 h-4" /> },
  { id: 8, title: '8. 注文表・AIプロンプト', subtitle: '出力＆ChatGPTプロンプト', icon: <FileCheck2 className="w-4 h-4" /> },
];

interface SidebarProps {
  currentStep: number;
  onSelectStep: (stepId: number) => void;
  errorCount: number;
  warningCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentStep,
  onSelectStep,
  errorCount,
  warningCount,
}) => {
  return (
    <aside className="w-full md:w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col shrink-0">
      <div className="p-3 border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400 flex justify-between items-center">
        <span>面談ステップ一覧</span>
        <span className="text-[11px] text-sky-400 font-normal">全8ステップ</span>
      </div>

      {/* Nav steps */}
      <nav className="p-2 space-y-1 overflow-y-auto max-h-[220px] md:max-h-none flex-1">
        {STEPS.map((step) => {
          const isActive = currentStep === step.id;
          const isStep7 = step.id === 7;

          return (
            <button
              key={step.id}
              onClick={() => onSelectStep(step.id)}
              className={`w-full text-left px-3 py-2 rounded-md transition flex items-center justify-between group ${
                isActive
                  ? 'bg-sky-600 text-white font-medium shadow-sm'
                  : 'hover:bg-slate-800/80 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className={`${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-sky-400'
                  }`}
                >
                  {step.icon}
                </span>
                <div className="truncate">
                  <div className="text-xs font-medium truncate">{step.title}</div>
                  <div
                    className={`text-[10px] truncate ${
                      isActive ? 'text-sky-100' : 'text-slate-500'
                    }`}
                  >
                    {step.subtitle}
                  </div>
                </div>
              </div>

              {/* Badge for Step 7 */}
              {isStep7 && (errorCount > 0 || warningCount > 0) && (
                <div className="flex items-center gap-1 shrink-0 ml-1">
                  {errorCount > 0 && (
                    <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded font-bold">
                      {errorCount}
                    </span>
                  )}
                  {warningCount > 0 && (
                    <span className="bg-amber-500 text-slate-950 text-[10px] px-1.5 py-0.2 rounded font-bold">
                      {warningCount}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Teacher hint footer */}
      <div className="p-3 bg-slate-950/60 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
        <div className="font-semibold text-slate-300">💡 面談のコツ</div>
        <p className="leading-tight text-slate-400">
          生徒と一緒に選択肢を選び、無理のない可処分時間を組み立ててください。
        </p>
      </div>
    </aside>
  );
};
