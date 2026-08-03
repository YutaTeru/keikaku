import React, { useState } from 'react';
import { PrescriptionPlan } from '../../types';
import {
  generateOrderSheetText,
  generateStructuredJson,
  generateChatGptPrompt,
} from '../../utils/promptGenerator';
import { exportPlanAsJson } from '../../utils/storage';
import { FileCheck2, Copy, Download, Check, Code, Sparkles, FileText } from 'lucide-react';

interface Step8Props {
  plan: PrescriptionPlan;
}

export const Step8Output: React.FC<Step8Props> = ({ plan }) => {
  const [activeTab, setActiveTab] = useState<'orderSheet' | 'json' | 'prompt'>('orderSheet');
  const [copiedStatus, setCopiedStatus] = useState<string | null>(null);

  const orderSheetText = generateOrderSheetText(plan);
  const jsonText = generateStructuredJson(plan);
  const promptText = generateChatGptPrompt(plan);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStatus(type);
    setTimeout(() => {
      setCopiedStatus(null);
    }, 2000);
  };

  return (
    <div className="space-y-4">
      {/* Step Header */}
      <div className="border-b border-slate-200 pb-2">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <FileCheck2 className="w-5 h-5 text-sky-600" />
          ステップ8：学習計画注文表＆ChatGPT用プロンプト出力
        </h2>
        <p className="text-xs text-slate-600 mt-0.5">
          面談確定データから人間に読みやすい注文表、システム用JSON、ChatGPTへ投入する完成プロンプトを自動生成しました。
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 gap-2 flex-wrap">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('orderSheet')}
            className={`px-3 py-2 text-xs font-bold border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'orderSheet'
                ? 'border-sky-600 text-sky-700 bg-sky-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>A. 学習計画注文表 (人間読用)</span>
          </button>

          <button
            onClick={() => setActiveTab('prompt')}
            className={`px-3 py-2 text-xs font-bold border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'prompt'
                ? 'border-teal-600 text-teal-700 bg-teal-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>B. ChatGPT投入用プロンプト</span>
          </button>

          <button
            onClick={() => setActiveTab('json')}
            className={`px-3 py-2 text-xs font-bold border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'json'
                ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>C. 構造化JSON</span>
          </button>
        </div>

        {/* Action button for active tab */}
        <div className="py-1">
          {activeTab === 'orderSheet' && (
            <button
              onClick={() => handleCopy(orderSheetText, 'orderSheet')}
              className="bg-slate-800 hover:bg-slate-700 text-white text-xs px-3 py-1.5 rounded font-medium flex items-center gap-1.5 transition shadow-sm"
            >
              {copiedStatus === 'orderSheet' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>注文表をコピーしました！</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>注文表テキストをコピー</span>
                </>
              )}
            </button>
          )}

          {activeTab === 'prompt' && (
            <button
              onClick={() => handleCopy(promptText, 'prompt')}
              className="bg-teal-700 hover:bg-teal-600 text-white text-xs px-3.5 py-1.5 rounded font-bold flex items-center gap-1.5 transition shadow-sm"
            >
              {copiedStatus === 'prompt' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>ChatGPT用プロンプトをコピー！</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>ChatGPT用プロンプトをコピー</span>
                </>
              )}
            </button>
          )}

          {activeTab === 'json' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(jsonText, 'json')}
                className="bg-indigo-700 hover:bg-indigo-600 text-white text-xs px-3 py-1.5 rounded font-medium flex items-center gap-1.5 transition shadow-sm"
              >
                {copiedStatus === 'json' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>JSONコピー完了</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>JSONコピー</span>
                  </>
                )}
              </button>

              <button
                onClick={() => exportPlanAsJson(plan)}
                className="bg-slate-800 hover:bg-slate-700 text-white text-xs px-3 py-1.5 rounded font-medium flex items-center gap-1.5 transition border border-slate-700"
              >
                <Download className="w-3.5 h-3.5" />
                <span>JSONファイル保存</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-slate-950 text-slate-100 rounded-md p-4 font-mono text-xs overflow-x-auto max-h-[500px] border border-slate-800">
        {activeTab === 'orderSheet' && (
          <pre className="whitespace-pre-wrap leading-relaxed font-mono">{orderSheetText}</pre>
        )}

        {activeTab === 'prompt' && (
          <div className="space-y-3">
            <div className="p-2.5 bg-teal-950/80 border border-teal-800 text-teal-200 text-xs rounded font-sans leading-normal">
              💡 <strong>ChatGPTへの投入手順:</strong> 上の「ChatGPT用プロンプトをコピー」を押して、ChatGPT (GPT-4o等) のチャット欄に貼り付けて送信してください。高校生へ配布できる【詳しい学習計画ガイドブック】が生成されます。
            </div>
            <pre className="whitespace-pre-wrap leading-relaxed font-mono text-slate-200">{promptText}</pre>
          </div>
        )}

        {activeTab === 'json' && (
          <pre className="whitespace-pre-wrap leading-relaxed text-sky-300 font-mono">{jsonText}</pre>
        )}
      </div>
    </div>
  );
};
