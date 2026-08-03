import React, { useState } from 'react';
import { EnvironmentRules } from '../../types';
import { Smartphone, Bot, Clock, ShieldCheck, Flame, Plus, Trash2, Sparkles, Volume2, Play, Check, Settings, Layers, ListFilter } from 'lucide-react';

interface Step6Props {
  environment: EnvironmentRules;
  onChange: (updated: EnvironmentRules) => void;
}

export const Step6EnvironmentPhoneAI: React.FC<Step6Props> = ({ environment, onChange }) => {
  const [selectedModelDropdown, setSelectedModelDropdown] = useState('Gemini 1.5 Flash');
  const [selectedCategoryDropdown, setSelectedCategoryDropdown] = useState('英単語・例文発音');
  const [customPresetName, setCustomPresetName] = useState('');
  const [isPlayingTest, setIsPlayingTest] = useState(false);

  // Initialize from parent environment or safe default
  const tts = environment.ttsSettings || {
    selectedModels: ['Gemini 1.5 Flash', 'GPT-4o'],
    selectedCategories: ['英単語・例文発音', '英語長文（音読用）'],
    template: 'default',
    voice: 'en-US-Emma (女性)',
    speed: 1.0,
    pitch: 1.0,
    isCustom: false,
    customPresets: [
      { name: 'ナチュラル女子 (Emma)', voice: 'en-US-Emma (女性)', speed: 1.0, pitch: 1.0 },
      { name: '高速特訓 (Charles)', voice: 'en-GB-Charles (男性)', speed: 1.3, pitch: 0.95 },
    ],
  };

  const updateTts = (updatedFields: Partial<typeof tts>) => {
    onChange({
      ...environment,
      ttsSettings: {
        ...tts,
        ...updatedFields,
      },
    });
  };

  const applyPresetRules = (type: 'strict' | 'balanced' | 'aiSupported') => {
    if (type === 'strict') {
      onChange({
        lifestyle: {
          fixWakeTime: true,
          fixBedTime: true,
          decideNextDayScope: true,
          startRightAfterBreakfast: true,
          noLateNightCatchup: true,
          setRestDay: true,
          notes: '6:00起床・23:00就寝を死守。生活リズムの崩れは学習効率の敵',
        },
        phone: {
          keepInOtherRoom: true,
          handToFamily: true,
          fixedChargingPlace: true,
          turnOffNotifications: true,
          noSnsInBreaks: true,
          allowedTimeWindow: '21:00-21:30 (報告・連絡のみ)',
          notes: '勉強中は別室の充電器へ。SNS・動画は遮断',
        },
        aiSearch: {
          useQuestionNotebook: true,
          writeDraftOnPaperFirst: true,
          askOneByOne: true,
          closeScreenAfterAnswer: true,
          solveBySelfAgain: true,
          noDirectSubmission: true,
          fixedAiTimeSlots: ['17:00', '21:00'],
        },
        reporting: {
          reportToTeacher: true,
          reportToParents: true,
          recordOnStudyplus: true,
          sendPhotoOfRecordSheet: true,
          reportToFriend: false,
          reportTimeSlot: '21:30',
          notes: '本日の完了チェック表の写真をLINEで送信',
        },
        minimumDayPlan: {
          isConfigured: true,
          totalMinutes: 30,
          breakdown: [
            { skillName: '単語', minutes: 20, materialName: 'システム英単語' },
            { skillName: '音読', minutes: 10, materialName: '速読英単語' },
          ],
          notes: '体調不良や急用の日もこれだけは死守。継続記録を切らさない',
        },
      });
    } else if (type === 'balanced') {
      onChange({
        lifestyle: {
          fixWakeTime: true,
          fixBedTime: true,
          decideNextDayScope: true,
          startRightAfterBreakfast: false,
          noLateNightCatchup: true,
          setRestDay: true,
          notes: '週末に1日リフレッシュ日を設ける',
        },
        phone: {
          keepInOtherRoom: false,
          handToFamily: false,
          fixedChargingPlace: true,
          turnOffNotifications: true,
          noSnsInBreaks: true,
          allowedTimeWindow: '適宜（勉強時間外）',
          notes: '机の上の充電器ではなく棚の上に置く',
        },
        aiSearch: {
          useQuestionNotebook: true,
          writeDraftOnPaperFirst: true,
          askOneByOne: true,
          closeScreenAfterAnswer: true,
          solveBySelfAgain: true,
          noDirectSubmission: true,
          fixedAiTimeSlots: ['18:00', '21:00'],
        },
        reporting: {
          reportToTeacher: true,
          reportToParents: false,
          recordOnStudyplus: true,
          sendPhotoOfRecordSheet: false,
          reportToFriend: false,
          reportTimeSlot: '21:00',
          notes: 'Studyplusへの記録で代替',
        },
        minimumDayPlan: {
          isConfigured: true,
          totalMinutes: 20,
          breakdown: [
            { skillName: '単語', minutes: 15, materialName: 'ターゲット1900' },
            { skillName: '文法確認', minutes: 5, materialName: 'ポラリス' },
          ],
          notes: '急用時は20分の最低限セットを実行して完了扱いにする',
        },
      });
    }
  };

  const handleLifestyleToggle = (key: keyof EnvironmentRules['lifestyle']) => {
    onChange({
      ...environment,
      lifestyle: {
        ...environment.lifestyle,
        [key]: !environment.lifestyle[key],
      },
    });
  };

  const handlePhoneToggle = (key: keyof EnvironmentRules['phone']) => {
    onChange({
      ...environment,
      phone: {
        ...environment.phone,
        [key]: !environment.phone[key],
      },
    });
  };

  const handleAiToggle = (key: keyof EnvironmentRules['aiSearch']) => {
    onChange({
      ...environment,
      aiSearch: {
        ...environment.aiSearch,
        [key]: !environment.aiSearch[key],
      },
    });
  };

  const handleReportingToggle = (key: keyof EnvironmentRules['reporting']) => {
    onChange({
      ...environment,
      reporting: {
        ...environment.reporting,
        [key]: !environment.reporting[key],
      },
    });
  };

  // Minimum Day Plan breakdown controls
  const handleAddMinimumBreakdown = () => {
    const updated = {
      ...environment.minimumDayPlan,
      breakdown: [
        ...environment.minimumDayPlan.breakdown,
        { skillName: '単語', minutes: 20, materialName: '単語帳' },
      ],
    };
    onChange({ ...environment, minimumDayPlan: updated });
  };

  const handleUpdateMinimumBreakdown = (index: number, field: string, val: any) => {
    const breakdown = [...environment.minimumDayPlan.breakdown];
    breakdown[index] = { ...breakdown[index], [field]: val };
    const totalMins = breakdown.reduce((sum, b) => sum + (Number(b.minutes) || 0), 0);

    onChange({
      ...environment,
      minimumDayPlan: {
        ...environment.minimumDayPlan,
        totalMinutes: totalMins,
        breakdown,
      },
    });
  };

  const handleDeleteMinimumBreakdown = (index: number) => {
    const breakdown = environment.minimumDayPlan.breakdown.filter((_, i) => i !== index);
    const totalMins = breakdown.reduce((sum, b) => sum + (Number(b.minutes) || 0), 0);

    onChange({
      ...environment,
      minimumDayPlan: {
        ...environment.minimumDayPlan,
        totalMinutes: totalMins,
        breakdown,
      },
    });
  };

  return (
    <div className="space-y-4">
      {/* Step Header */}
      <div className="border-b border-slate-200 pb-2">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-sky-600" />
          ステップ6：環境・スマホ・AI・防災ルール
        </h2>
        <p className="text-xs text-slate-600 mt-0.5">
          習慣化を妨げる誘惑（スマホ・夜更かし）を仕組みで防ぎ、体調不良や予定押しの日の「短縮版（防災ルール）」を設定します。
        </p>
      </div>

      {/* Preset Rules Quick Apply */}
      <div className="bg-sky-50 border border-sky-200 rounded-md p-3 space-y-1 text-xs">
        <div className="font-bold text-sky-950 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-sky-600" />
          <span>環境・ルール一括自動設定（1タップ適用）</span>
        </div>
        <div className="flex items-center gap-2 pt-1 flex-wrap">
          <button
            type="button"
            onClick={() => applyPresetRules('strict')}
            className="bg-white hover:bg-sky-100 border border-sky-300 text-sky-900 font-bold px-3 py-1.5 rounded transition shadow-2xs"
          >
            🔥 受験生徹底モード（スマホ別室＋全報告＋30分防災）
          </button>
          <button
            type="button"
            onClick={() => applyPresetRules('balanced')}
            className="bg-white hover:bg-sky-100 border border-sky-300 text-sky-900 font-bold px-3 py-1.5 rounded transition shadow-2xs"
          >
            🌱 標準学習習慣モード（固定充電場所＋Studyplus＋20分防災）
          </button>
        </div>
      </div>

      <div className="space-y-4 text-xs">
        {/* Section 1: Lifestyle Rules */}
        <div className="bg-white border border-slate-200 rounded-md p-3 space-y-2">
          <h3 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>【生活習慣ルール】就寝・起床・スタートの固定</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {[
              { key: 'fixWakeTime', label: '起床時間を固定する' },
              { key: 'fixBedTime', label: '就寝時間を固定する' },
              { key: 'decideNextDayScope', label: '前日に最初の教材とページを決める' },
              { key: 'startRightAfterBreakfast', label: '朝食後すぐ勉強を始める' },
              { key: 'noLateNightCatchup', label: '夜更かしして遅れを取り返さない' },
              { key: 'setRestDay', label: '週1日のリフレッシュ/予備日を設定' },
            ].map((item) => (
              <label
                key={item.key}
                className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded hover:bg-slate-100 cursor-pointer transition"
              >
                <input
                  type="checkbox"
                  checked={(environment.lifestyle as any)[item.key]}
                  onChange={() => handleLifestyleToggle(item.key as any)}
                  className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500 cursor-pointer"
                />
                <span className="font-medium text-slate-800">{item.label}</span>
              </label>
            ))}
          </div>

          <input
            type="text"
            value={environment.lifestyle.notes}
            onChange={(e) =>
              onChange({
                ...environment,
                lifestyle: { ...environment.lifestyle, notes: e.target.value },
              })
            }
            placeholder="生活ルールに関する補足指示メモ (例: 6:00起床・22:00就寝を厳守)"
            className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-slate-700 italic"
          />
        </div>

        {/* Section 2: Smartphone Rules */}
        <div className="bg-white border border-slate-200 rounded-md p-3 space-y-2">
          <h3 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
            <Smartphone className="w-4 h-4 text-rose-600" />
            <span>【スマホ対策】誘惑の物理的遮断</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {[
              { key: 'keepInOtherRoom', label: '勉強中は別室へ置く' },
              { key: 'handToFamily', label: '家族へ預ける' },
              { key: 'fixedChargingPlace', label: '固定の充電場所（机から離れた場所）へ置く' },
              { key: 'turnOffNotifications', label: '勉強中は通知を完全にオフにする' },
              { key: 'noSnsInBreaks', label: '休憩中もSNSや短い動画を開かない' },
            ].map((item) => (
              <label
                key={item.key}
                className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded hover:bg-slate-100 cursor-pointer transition"
              >
                <input
                  type="checkbox"
                  checked={(environment.phone as any)[item.key]}
                  onChange={() => handlePhoneToggle(item.key as any)}
                  className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500 cursor-pointer"
                />
                <span className="font-medium text-slate-800">{item.label}</span>
              </label>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-semibold text-slate-600">
                スマホ利用可能時間帯（指定する場合）
              </label>
              <input
                type="text"
                value={environment.phone.allowedTimeWindow}
                onChange={(e) =>
                  onChange({
                    ...environment,
                    phone: { ...environment.phone, allowedTimeWindow: e.target.value },
                  })
                }
                placeholder="例: 17:15-17:25 (報告時のみ)"
                className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-slate-900"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-600">補足メモ</label>
              <input
                type="text"
                value={environment.phone.notes}
                onChange={(e) =>
                  onChange({
                    ...environment,
                    phone: { ...environment.phone, notes: e.target.value },
                  })
                }
                placeholder="例: リビングの充電器に置いておく"
                className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Section 3: AI & Search Rules */}
        <div className="bg-white border border-slate-200 rounded-md p-3 space-y-2">
          <h3 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
            <Bot className="w-4 h-4 text-sky-600" />
            <span>【AI・検索の利用ルール】依存を防ぎ学習精度を上げる</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {[
              { key: 'useQuestionNotebook', label: '分からないことはまず「質問メモ」へ書く' },
              { key: 'writeDraftOnPaperFirst', label: '自分の答えや訳を先に紙へ書く' },
              { key: 'askOneByOne', label: 'AIへは一度に一問だけ質問する' },
              { key: 'closeScreenAfterAnswer', label: '回答を見たらすぐ画面を閉じる' },
              { key: 'solveBySelfAgain', label: '自分でもう一度解き直す' },
              { key: 'noDirectSubmission', label: 'AIの文章をそのまま提出・丸写ししない' },
            ].map((item) => (
              <label
                key={item.key}
                className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded hover:bg-slate-100 cursor-pointer transition"
              >
                <input
                  type="checkbox"
                  checked={(environment.aiSearch as any)[item.key]}
                  onChange={() => handleAiToggle(item.key as any)}
                  className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500 cursor-pointer"
                />
                <span className="font-medium text-slate-800">{item.label}</span>
              </label>
            ))}
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600">
              AI利用固定時刻（例: 1日1〜2回の枠）
            </label>
            <input
              type="text"
              value={environment.aiSearch.fixedAiTimeSlots.join(', ')}
              onChange={(e) =>
                onChange({
                  ...environment,
                  aiSearch: {
                    ...environment.aiSearch,
                    fixedAiTimeSlots: e.target.value.split(',').map((s) => s.trim()),
                  },
                })
              }
              placeholder="例: 11:25, 17:15"
              className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-slate-900"
            />
          </div>
        </div>

        {/* Section 3.5: AI Voice Reading & Model Configuration */}
        <div className="bg-white border border-slate-200 rounded-md p-3.5 space-y-4">
          <div className="border-b border-slate-100 pb-2 flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
              <Volume2 className="w-4 h-4 text-sky-600" />
              <span>【AI音読・リスニング・AI音声モデル設定】</span>
            </h3>
            <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-medium">
              音読・リスニングテンプレート: {tts.template === 'default' ? '標準設定 (Default)' : 'カスタム設定'}
            </span>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            ※ 本セクションにリストアップされた語彙や音読テキストは、1語ずつ個別に手動登録する必要はありません。
            分類カテゴリや音声モデルを指定し、お好みのスピード・ピッチを調節するだけで高効率なトレーニング環境を構築できます。
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {/* Left Column: Model & Category Selection */}
            <div className="space-y-4">
              {/* Language Model Selector */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                    <Settings className="w-3.5 h-3.5 text-slate-500" />
                    <span>AI言語モデル (Language Models)</span>
                  </label>
                  <div className="flex items-center gap-1">
                    <select
                      value={selectedModelDropdown}
                      onChange={(e) => setSelectedModelDropdown(e.target.value)}
                      className="bg-white border border-slate-300 rounded px-2 py-1 text-[11px] text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-sky-500 shadow-2xs"
                    >
                      {['Gemini 1.5 Flash', 'Gemini 1.5 Pro', 'GPT-4o', 'Claude 3.5 Sonnet', 'Llama 3'].map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => {
                        if (!tts.selectedModels.includes(selectedModelDropdown)) {
                          updateTts({ selectedModels: [...tts.selectedModels, selectedModelDropdown] });
                        }
                      }}
                      className="bg-sky-600 hover:bg-sky-700 text-white text-[11px] px-2.5 py-1 rounded font-bold transition shadow-2xs shrink-0"
                    >
                      選択
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded p-2 min-h-[44px]">
                  <span className="text-[9px] text-slate-400 block mb-1">選択中のAIモデル (クリックで切替・解除できます):</span>
                  <div className="flex flex-wrap gap-1">
                    {tts.selectedModels.length === 0 ? (
                      <span className="text-[10px] text-slate-400 italic">モデルが選択されていません。右のプルダウンから追加してください。</span>
                    ) : (
                      tts.selectedModels.map(m => (
                        <button
                          type="button"
                          key={m}
                          onClick={() => {
                            updateTts({
                              selectedModels: tts.selectedModels.filter(item => item !== m)
                            });
                          }}
                          className="bg-sky-50 hover:bg-rose-50 text-sky-800 hover:text-rose-800 border border-sky-200 hover:border-rose-300 px-2 py-0.5 rounded text-[10px] font-bold transition flex items-center gap-1"
                        >
                          <span>{m}</span>
                          <span className="text-[9px] opacity-60">×</span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Category Selector */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                    <ListFilter className="w-3.5 h-3.5 text-slate-500" />
                    <span>音読・リスニング対象カテゴリ</span>
                  </label>
                  <div className="flex items-center gap-1">
                    <select
                      value={selectedCategoryDropdown}
                      onChange={(e) => setSelectedCategoryDropdown(e.target.value)}
                      className="bg-white border border-slate-300 rounded px-2 py-1 text-[11px] text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-sky-500 shadow-2xs"
                    >
                      {['英単語・例文発音', '文法基本例文', '英語長文（音読用）', '共通テスト・リスニング', '英検二次面接対策', '時事英語ニュース'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => {
                        if (!tts.selectedCategories.includes(selectedCategoryDropdown)) {
                          updateTts({ selectedCategories: [...tts.selectedCategories, selectedCategoryDropdown] });
                        }
                      }}
                      className="bg-sky-600 hover:bg-sky-700 text-white text-[11px] px-2.5 py-1 rounded font-bold transition shadow-2xs shrink-0"
                    >
                      選択
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded p-2 min-h-[44px]">
                  <span className="text-[9px] text-slate-400 block mb-1">選択中の学習カテゴリ (複数選択可能・クリックで切替):</span>
                  <div className="flex flex-wrap gap-1">
                    {tts.selectedCategories.length === 0 ? (
                      <span className="text-[10px] text-slate-400 italic">カテゴリが選択されていません。右のプルダウンから追加してください。</span>
                    ) : (
                      tts.selectedCategories.map(c => (
                        <button
                          type="button"
                          key={c}
                          onClick={() => {
                            updateTts({
                              selectedCategories: tts.selectedCategories.filter(item => item !== c)
                            });
                          }}
                          className="bg-teal-50 hover:bg-rose-50 text-teal-800 hover:text-rose-800 border border-teal-200 hover:border-rose-300 px-2 py-0.5 rounded text-[10px] font-bold transition flex items-center gap-1"
                        >
                          <span>{c}</span>
                          <span className="text-[9px] opacity-60">×</span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Voice Controls & Presets */}
            <div className="space-y-3 bg-slate-50/70 border border-slate-100 rounded-lg p-3">
              <div className="text-[11px] font-bold text-slate-800 flex items-center gap-1 border-b border-slate-200/60 pb-1">
                <Volume2 className="w-3.5 h-3.5 text-sky-600" />
                <span>音声調整 (Voice, Speed & Pitch Settings)</span>
              </div>

              {/* Voice Actor Select */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">声質 / Voice Type</label>
                  <select
                    value={tts.voice}
                    onChange={(e) => updateTts({ voice: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-[11px] text-slate-800 font-medium focus:outline-none"
                  >
                    <option value="en-US-Emma (女性)">Emma (女性・米音)</option>
                    <option value="en-US-Steve (男性)">Steve (男性・米音)</option>
                    <option value="en-GB-Charles (男性)">Charles (男性・英音)</option>
                    <option value="en-IN-Nisha (女性)">Nisha (女性・印音)</option>
                    <option value="ja-JP-Nanami (女性)">Japanese Accent (日本人女性)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">音読用テンプレート</label>
                  <select
                    value={tts.template}
                    onChange={(e) => updateTts({ template: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-[11px] text-slate-800 font-medium focus:outline-none"
                  >
                    <option value="default">標準設定 (Default)</option>
                    <option value="dictation">ディクテーション用 (1.5x間隔)</option>
                    <option value="shadowing">シャドーイング用 (0.9x低速開始)</option>
                  </select>
                </div>
              </div>

              {/* Speed Slider */}
              <div className="space-y-0.5">
                <div className="flex items-center justify-between text-[10px] text-slate-600">
                  <span className="font-semibold">発音スピード (Speed):</span>
                  <span className="font-mono font-bold text-sky-700">{tts.speed.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={tts.speed}
                  onChange={(e) => updateTts({ speed: parseFloat(e.target.value) })}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                />
              </div>

              {/* Pitch Slider */}
              <div className="space-y-0.5">
                <div className="flex items-center justify-between text-[10px] text-slate-600">
                  <span className="font-semibold">声の高さ/ピッチ (Pitch):</span>
                  <span className="font-mono font-bold text-sky-700">{tts.pitch.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.1"
                  value={tts.pitch}
                  onChange={(e) => updateTts({ pitch: parseFloat(e.target.value) })}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                />
              </div>

              {/* Save Custom Preset Row */}
              <div className="pt-1.5 border-t border-slate-200/60 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-600 block">カスタム設定の保存 (Create Custom Settings):</span>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={customPresetName}
                    onChange={(e) => setCustomPresetName(e.target.value)}
                    placeholder="例: マイ速読シャドーイング"
                    className="bg-white border border-slate-200 rounded px-2 py-1 text-xs text-slate-800 flex-1 placeholder-slate-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!customPresetName.trim()) return;
                      const newPreset = {
                        name: customPresetName.trim(),
                        voice: tts.voice,
                        speed: tts.speed,
                        pitch: tts.pitch,
                      };
                      updateTts({
                        customPresets: [...tts.customPresets, newPreset],
                      });
                      setCustomPresetName('');
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] px-2.5 py-1 rounded font-bold transition shrink-0 shadow-2xs"
                  >
                    保存する
                  </button>
                </div>

                {/* Preset Chips */}
                {tts.customPresets.length > 0 && (
                  <div className="pt-1">
                    <span className="text-[9px] text-slate-400 block mb-1">保存済みプリセット:</span>
                    <div className="flex flex-wrap gap-1">
                      {tts.customPresets.map((p, idx) => (
                        <div
                          key={p.name}
                          className="bg-white border border-slate-200 rounded pl-2 pr-1 py-0.5 flex items-center gap-1.5 group shadow-3xs"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              updateTts({
                                voice: p.voice,
                                speed: p.speed,
                                pitch: p.pitch,
                              });
                            }}
                            className="text-[9px] font-bold text-slate-700 hover:text-sky-700 transition"
                          >
                            {p.name} ({p.speed}x)
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              updateTts({
                                customPresets: tts.customPresets.filter((_, i) => i !== idx)
                              });
                            }}
                            className="text-[9px] text-slate-400 hover:text-rose-600 px-0.5"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Live Web speech test buttons */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    if ('speechSynthesis' in window) {
                      window.speechSynthesis.cancel();
                      setIsPlayingTest(true);
                      const text = "Perfect! Practice reading aloud every single day to master the rhythm.";
                      const utterance = new SpeechSynthesisUtterance(text);
                      utterance.rate = tts.speed;
                      utterance.pitch = tts.pitch;
                      utterance.onend = () => setIsPlayingTest(false);
                      utterance.onerror = () => setIsPlayingTest(false);
                      window.speechSynthesis.speak(utterance);
                    } else {
                      alert('ご利用のブラウザは音声読み上げに対応していません。');
                    }
                  }}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white text-[11px] py-1 px-2.5 rounded font-bold flex items-center justify-center gap-1.5 transition shadow-2xs"
                >
                  <Play className={`w-3.5 h-3.5 ${isPlayingTest ? 'animate-pulse text-emerald-400' : ''}`} />
                  <span>{isPlayingTest ? '音声をテスト中...' : 'テスト音声を聴く (Speak Test Audio)'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Reporting Rules */}
        <div className="bg-white border border-slate-200 rounded-md p-3 space-y-2">
          <h3 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>【報告・記録方法】振り返りの習慣化</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {[
              { key: 'reportToTeacher', label: '教師へ報告する' },
              { key: 'reportToParents', label: '保護者へ報告する' },
              { key: 'recordOnStudyplus', label: 'Studyplusへ記録する' },
              { key: 'sendPhotoOfRecordSheet', label: '記録用紙の写真を送る' },
              { key: 'reportToFriend', label: '勉強仲間・友達へ報告する' },
            ].map((item) => (
              <label
                key={item.key}
                className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded hover:bg-slate-100 cursor-pointer transition"
              >
                <input
                  type="checkbox"
                  checked={(environment.reporting as any)[item.key]}
                  onChange={() => handleReportingToggle(item.key as any)}
                  className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500 cursor-pointer"
                />
                <span className="font-medium text-slate-800">{item.label}</span>
              </label>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-semibold text-slate-600">報告時刻</label>
              <input
                type="text"
                value={environment.reporting.reportTimeSlot}
                onChange={(e) =>
                  onChange({
                    ...environment,
                    reporting: { ...environment.reporting, reportTimeSlot: e.target.value },
                  })
                }
                placeholder="例: 17:15〜17:25"
                className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-slate-900"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-600">報告の補足</label>
              <input
                type="text"
                value={environment.reporting.notes}
                onChange={(e) =>
                  onChange({
                    ...environment,
                    reporting: { ...environment.reporting, notes: e.target.value },
                  })
                }
                placeholder="例: 写真でグループLINEへ送信"
                className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Minimum Day Plan (崩れた日の短縮版) */}
        <div className="bg-amber-50/70 border border-amber-200 rounded-md p-3.5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200 pb-2">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-600" />
              <span className="font-bold text-slate-900 text-xs">
                【崩れた日の短縮版（防災用最低限学習プラン）】
              </span>
            </div>

            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={environment.minimumDayPlan.isConfigured}
                  onChange={(e) =>
                    onChange({
                      ...environment,
                      minimumDayPlan: {
                        ...environment.minimumDayPlan,
                        isConfigured: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500 border-slate-300"
                />
                <span className="font-bold text-amber-900 text-xs">短縮版プランを有効化</span>
              </label>
              <button
                onClick={handleAddMinimumBreakdown}
                className="bg-amber-700 hover:bg-amber-600 text-white text-[11px] px-2 py-0.5 rounded font-medium flex items-center gap-1 transition"
              >
                <Plus className="w-3 h-3" />
                <span>技能追加</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] text-amber-900 font-medium">
              <span>急用・体調不良時でも途切れさせない最低限のセット</span>
              <span className="font-mono font-bold">
                短縮版合計: {environment.minimumDayPlan.totalMinutes}分
              </span>
            </div>

            <div className="space-y-1.5">
              {environment.minimumDayPlan.breakdown.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-white border border-amber-200 rounded p-1.5"
                >
                  <input
                    type="text"
                    value={item.skillName}
                    onChange={(e) =>
                      handleUpdateMinimumBreakdown(idx, 'skillName', e.target.value)
                    }
                    placeholder="技能 (例: 単語)"
                    className="w-24 bg-slate-50 border border-slate-200 rounded px-2 py-0.5 text-xs text-slate-900"
                  />

                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min={0}
                      max={240}
                      step={5}
                      value={item.minutes}
                      onChange={(e) =>
                        handleUpdateMinimumBreakdown(
                          idx,
                          'minutes',
                          parseInt(e.target.value || '0', 10)
                        )
                      }
                      className="w-16 bg-slate-50 border border-slate-200 rounded px-1 text-center font-mono font-bold text-slate-900 text-xs"
                    />
                    <span className="text-slate-600 text-[11px]">分</span>
                  </div>

                  <input
                    type="text"
                    value={item.materialName}
                    onChange={(e) =>
                      handleUpdateMinimumBreakdown(idx, 'materialName', e.target.value)
                    }
                    placeholder="使用教材 (例: ユメタン)"
                    className="flex-1 bg-slate-50 border border-slate-200 rounded px-2 py-0.5 text-xs text-slate-900"
                  />

                  <button
                    onClick={() => handleDeleteMinimumBreakdown(idx)}
                    className="text-slate-400 hover:text-rose-600 p-0.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <input
              type="text"
              value={environment.minimumDayPlan.notes}
              onChange={(e) =>
                onChange({
                  ...environment,
                  minimumDayPlan: {
                    ...environment.minimumDayPlan,
                    notes: e.target.value,
                  },
                })
              }
              placeholder="短縮版の運用メモ (例: 短縮版を実行した日は失敗ではなく計画通りの対応として褒める)"
              className="w-full bg-white border border-amber-200 rounded px-2 py-1 text-xs text-slate-800 italic"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
