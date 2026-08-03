import React, { useState } from 'react';
import { Material, StudyMethodTemplate, EnglishSkillAllocation } from '../../types';
import { RICH_PRESET_MATERIALS, DetailedPresetMaterial } from '../../data/presets';
import { BookOpen, Plus, Trash2, Edit3, Check, ChevronDown, Sparkles, BookCheck } from 'lucide-react';

interface Step5Props {
  materials: Material[];
  studyMethods: StudyMethodTemplate[];
  englishAllocations: EnglishSkillAllocation[];
  onUpdateMaterials: (mats: Material[]) => void;
  onUpdateStudyMethods: (methods: StudyMethodTemplate[]) => void;
}

export const Step5MaterialsMethods: React.FC<Step5Props> = ({
  materials,
  studyMethods,
  englishAllocations,
  onUpdateMaterials,
  onUpdateStudyMethods,
}) => {
  const [selectedSkillForMaterial, setSelectedSkillForMaterial] = useState<string>('vocab');

  // Add rich preset material
  const handleAddRichPresetMaterial = (preset: DetailedPresetMaterial, skillKey: string) => {
    const newMat: Material = {
      id: `mat-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      skillKey: skillKey,
      name: preset.name,
      publisher: preset.publisher,
      targetLevel: preset.targetLevel,
      role: preset.role,
      currentLocation: preset.currentLocation,
      targetLocation: preset.targetLocation,
      dailyRange: preset.dailyRange,
      weeklyRange: preset.weeklyRange,
      purpose: preset.purpose,
      teacherMemo: preset.teacherMemo,
    };
    onUpdateMaterials([...materials, newMat]);
  };

  // Add empty custom material
  const handleAddCustomMaterial = () => {
    const newMat: Material = {
      id: `mat-${Date.now()}`,
      skillKey: selectedSkillForMaterial,
      name: '新規市販/学校テキスト',
      publisher: '',
      targetLevel: '標準',
      role: 'main',
      currentLocation: '第1章 / p.1',
      targetLocation: '全範囲修得',
      dailyRange: '適宜設定',
      weeklyRange: '適宜設定',
      purpose: '基礎力定着',
      teacherMemo: '',
    };
    onUpdateMaterials([...materials, newMat]);
  };

  const handleUpdateMaterial = (id: string, field: keyof Material, value: any) => {
    const updated = materials.map((m) => (m.id === id ? { ...m, [field]: value } : m));
    onUpdateMaterials(updated);
  };

  const handleDeleteMaterial = (id: string) => {
    onUpdateMaterials(materials.filter((m) => m.id !== id));
  };

  // Add default method template if missing
  const handleEnsureMethod = (skillKey: string, skillName: string) => {
    const existing = studyMethods.find((sm) => sm.skillKey === skillKey);
    if (!existing) {
      const newMethod: StudyMethodTemplate = {
        skillKey,
        skillName,
        title: `${skillName}基本学習手順`,
        steps: [
          'ステップ1：問題解きまたは意味確認（制限時間・自力解法）',
          'ステップ2：解説確認・根拠と言い換えの言語化',
          'ステップ3：音読または即答再テストによる完全定着',
        ],
        timePerSession: 30,
        dailyFrequency: 1,
        reviewDays: '翌日および週末',
        completionCriteria: '自力で解法・理由を再現できること',
        fallbackAction: '理解が曖昧な場合は解説を再読し質問メモに残す',
        teacherAdditionalNotes: '',
      };
      onUpdateStudyMethods([...studyMethods, newMethod]);
    }
  };

  const handleUpdateMethod = (skillKey: string, field: keyof StudyMethodTemplate, value: any) => {
    const updated = studyMethods.map((sm) =>
      sm.skillKey === skillKey ? { ...sm, [field]: value } : sm
    );
    onUpdateStudyMethods(updated);
  };

  const handleAddStepToMethod = (skillKey: string) => {
    const updated = studyMethods.map((sm) => {
      if (sm.skillKey === skillKey) {
        return { ...sm, steps: [...sm.steps, '新しいステップ手順'] };
      }
      return sm;
    });
    onUpdateStudyMethods(updated);
  };

  const handleUpdateStep = (skillKey: string, stepIndex: number, text: string) => {
    const updated = studyMethods.map((sm) => {
      if (sm.skillKey === skillKey) {
        const steps = [...sm.steps];
        steps[stepIndex] = text;
        return { ...sm, steps };
      }
      return sm;
    });
    onUpdateStudyMethods(updated);
  };

  const handleDeleteStep = (skillKey: string, stepIndex: number) => {
    const updated = studyMethods.map((sm) => {
      if (sm.skillKey === skillKey) {
        const steps = sm.steps.filter((_, i) => i !== stepIndex);
        return { ...sm, steps };
      }
      return sm;
    });
    onUpdateStudyMethods(updated);
  };

  const usedEnglishSkills = englishAllocations.filter((a) => a.isUsed && a.minutesPerDay > 0);

  const availableRichPresets = RICH_PRESET_MATERIALS[selectedSkillForMaterial] || [];

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="border-b border-slate-200 pb-2">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-sky-600" />
          ステップ5：教材と勉強法（市販定番参考書プリセットと行動手順）
        </h2>
        <p className="text-xs text-slate-600 mt-0.5">
          受験生の定番市販テキスト（システム英単語・ポラリス・ターゲット・ネクステ等）を選択すると、出版社・進度・目的が全自動補完されます。
        </p>
      </div>

      {/* Part A: Material Registration */}
      <div className="space-y-3">
        <div className="bg-sky-50 border border-sky-200 rounded-md p-3.5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-xs font-bold text-sky-950 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-sky-600" />
              <span>定番市販参考書の選択＆自動補完（1タップ追加）</span>
            </h3>

            {/* Skill Selector */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-700">分類:</span>
              <select
                value={selectedSkillForMaterial}
                onChange={(e) => setSelectedSkillForMaterial(e.target.value)}
                className="bg-white border border-sky-300 rounded px-2 py-1 text-xs text-slate-900 font-bold focus:outline-none focus:ring-1 focus:ring-sky-500 shadow-xs"
              >
                <option value="vocab">英単語</option>
                <option value="grammar">英文法・構文</option>
                <option value="intensiveReading">英語長文精読</option>
                <option value="readingPractice">長文演習・共通テスト</option>
                <option value="listening">リスニング</option>
                <option value="essay">英作文・要約</option>
              </select>

              <button
                type="button"
                onClick={handleAddCustomMaterial}
                className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs px-2.5 py-1 rounded font-medium flex items-center gap-1 transition shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 text-slate-600" />
                <span>手動で自由入力追加</span>
              </button>
            </div>
          </div>

          {/* Rich Preset Cards Carousel / Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1">
            {availableRichPresets.map((preset) => (
              <div
                key={preset.name}
                className="bg-white border border-sky-200 hover:border-sky-400 rounded p-2.5 space-y-1.5 transition text-xs shadow-2xs group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-1">
                    <span className="font-bold text-slate-900 group-hover:text-sky-700 leading-snug">
                      {preset.name}
                    </span>
                    <span className="text-[9px] bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded font-mono shrink-0">
                      {preset.publisher}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                    {preset.targetLevel} | {preset.dailyRange}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleAddRichPresetMaterial(preset, selectedSkillForMaterial)}
                  className="w-full mt-2 bg-sky-600 hover:bg-sky-500 text-white text-[11px] font-bold py-1 px-2 rounded flex items-center justify-center gap-1 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>処方箋に追加する</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Registered Materials List Cards */}
        {materials.length === 0 ? (
          <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded text-xs text-center">
            まだ教材が追加されていません。上のプリセットからテキストを追加してください。
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-800 flex items-center gap-1 pt-2">
              <BookCheck className="w-4 h-4 text-emerald-600" />
              <span>処方箋に登録済みの教材一覧（{materials.length}冊）</span>
            </div>

            {materials.map((mat) => (
              <div
                key={mat.id}
                className="bg-white border border-slate-200 rounded-md p-3 space-y-2 text-xs hover:border-sky-300 transition shadow-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2 flex-1">
                    {/* Role selector */}
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateMaterial(mat.id, 'role', mat.role === 'main' ? 'sub' : 'main')
                      }
                      className={`text-[10px] font-bold px-2 py-0.5 rounded transition ${
                        mat.role === 'main'
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : 'bg-slate-100 text-slate-700 border border-slate-300'
                      }`}
                    >
                      {mat.role === 'main' ? '主教材' : '補助教材'}
                    </button>

                    {/* Material Name */}
                    <input
                      type="text"
                      value={mat.name}
                      onChange={(e) => handleUpdateMaterial(mat.id, 'name', e.target.value)}
                      placeholder="教材名"
                      className="font-bold text-sm text-slate-900 bg-transparent border-b border-slate-200 hover:border-slate-400 focus:border-sky-500 focus:outline-none px-1 py-0.5 flex-1 min-w-[180px]"
                    />

                    {/* Skill Tag */}
                    <select
                      value={mat.skillKey}
                      onChange={(e) => handleUpdateMaterial(mat.id, 'skillKey', e.target.value)}
                      className="text-[11px] bg-slate-100 border border-slate-300 rounded px-1.5 py-0.5 text-slate-700 font-medium"
                    >
                      <option value="vocab">単語</option>
                      <option value="grammar">文法</option>
                      <option value="intensiveReading">精読</option>
                      <option value="readingPractice">長文演習</option>
                      <option value="listening">リスニング</option>
                      <option value="essay">ライティング</option>
                      <option value="other">その他</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteMaterial(mat.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded transition"
                    title="教材を削除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Form fields grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500">出版社</label>
                    <input
                      type="text"
                      value={mat.publisher}
                      onChange={(e) => handleUpdateMaterial(mat.id, 'publisher', e.target.value)}
                      placeholder="出版社(任意)"
                      className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-slate-500">対象</label>
                    <input
                      type="text"
                      value={mat.targetLevel}
                      onChange={(e) => handleUpdateMaterial(mat.id, 'targetLevel', e.target.value)}
                      placeholder="例: 共通テスト〜難関"
                      className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-slate-500">現在位置</label>
                    <input
                      type="text"
                      value={mat.currentLocation}
                      onChange={(e) =>
                        handleUpdateMaterial(mat.id, 'currentLocation', e.target.value)
                      }
                      placeholder="例: Unit 1 / p.10"
                      className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-slate-500">目標ゴール位置</label>
                    <input
                      type="text"
                      value={mat.targetLocation}
                      onChange={(e) =>
                        handleUpdateMaterial(mat.id, 'targetLocation', e.target.value)
                      }
                      placeholder="例: Unit 10完遂 / p.120"
                      className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-slate-500">一日の範囲</label>
                    <input
                      type="text"
                      value={mat.dailyRange}
                      onChange={(e) => handleUpdateMaterial(mat.id, 'dailyRange', e.target.value)}
                      placeholder="例: 100語 / 2章"
                      className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-slate-500">一週間の範囲</label>
                    <input
                      type="text"
                      value={mat.weeklyRange}
                      onChange={(e) => handleUpdateMaterial(mat.id, 'weeklyRange', e.target.value)}
                      placeholder="例: 500語ブロック"
                      className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-900"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-semibold text-slate-500">教材の目的・用途</label>
                    <input
                      type="text"
                      value={mat.purpose}
                      onChange={(e) => handleUpdateMaterial(mat.id, 'purpose', e.target.value)}
                      placeholder="例: 頻出語彙の秒即答化・速読力の底上げ"
                      className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    value={mat.teacherMemo}
                    onChange={(e) => handleUpdateMaterial(mat.id, 'teacherMemo', e.target.value)}
                    placeholder="教師メモ (例: 付属CDの音声を必ず聞きながら発声する)"
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-700 italic"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Part B: Editable Study Method Templates */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-sky-600" />
            <span>【勉強法テンプレート】技能・教材ごとの具体的手順設定</span>
          </h3>
        </div>

        <div className="space-y-4">
          {usedEnglishSkills.map((usedSkill) => {
            const method = studyMethods.find((sm) => sm.skillKey === usedSkill.skillKey);

            if (!method) {
              return (
                <div
                  key={usedSkill.skillKey}
                  className="bg-slate-50 border border-slate-200 rounded-md p-3 flex items-center justify-between text-xs"
                >
                  <span className="font-bold text-slate-800">
                    「{usedSkill.skillName}」の勉強法テンプレートが未設定です
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleEnsureMethod(usedSkill.skillKey, usedSkill.skillName)
                    }
                    className="bg-sky-600 hover:bg-sky-500 text-white text-xs px-2.5 py-1 rounded font-medium transition"
                  >
                    テンプレートを追加
                  </button>
                </div>
              );
            }

            return (
              <div
                key={method.skillKey}
                className="bg-white border border-slate-200 rounded-md p-3.5 space-y-3 text-xs shadow-2xs"
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded text-[11px]">
                      {method.skillName}
                    </span>
                    <input
                      type="text"
                      value={method.title}
                      onChange={(e) =>
                        handleUpdateMethod(method.skillKey, 'title', e.target.value)
                      }
                      placeholder="テンプレート名"
                      className="font-bold text-slate-900 text-xs bg-transparent border-b border-transparent hover:border-slate-300 focus:border-sky-500 focus:outline-none px-1"
                    />
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-600 font-medium">
                    <div className="flex items-center gap-1">
                      <span>1回:</span>
                      <input
                        type="number"
                        min={5}
                        max={180}
                        step={5}
                        value={method.timePerSession}
                        onChange={(e) =>
                          handleUpdateMethod(
                            method.skillKey,
                            'timePerSession',
                            parseInt(e.target.value || '0', 10)
                          )
                        }
                        className="w-14 bg-slate-50 border border-slate-300 rounded px-1 text-center font-mono font-bold"
                      />
                      <span>分</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span>1日:</span>
                      <input
                        type="number"
                        min={1}
                        max={6}
                        value={method.dailyFrequency}
                        onChange={(e) =>
                          handleUpdateMethod(
                            method.skillKey,
                            'dailyFrequency',
                            parseInt(e.target.value || '1', 10)
                          )
                        }
                        className="w-12 bg-slate-50 border border-slate-300 rounded px-1 text-center font-mono font-bold"
                      />
                      <span>回</span>
                    </div>
                  </div>
                </div>

                {/* Steps List */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-slate-800 text-[11px]">
                      勉強手順ステップ（実行用ブレイクダウン）
                    </label>
                    <button
                      type="button"
                      onClick={() => handleAddStepToMethod(method.skillKey)}
                      className="text-[10px] text-sky-700 hover:underline flex items-center gap-0.5"
                    >
                      <Plus className="w-3 h-3" /> ステップを追加
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    {method.steps.map((stepText, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-slate-400 w-4 text-right">
                          {sIdx + 1}.
                        </span>
                        <input
                          type="text"
                          value={stepText}
                          onChange={(e) =>
                            handleUpdateStep(method.skillKey, sIdx, e.target.value)
                          }
                          className="flex-1 bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
                        />
                        {method.steps.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleDeleteStep(method.skillKey, sIdx)}
                            className="text-slate-400 hover:text-rose-600 p-0.5"
                            title="ステップ削除"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Template Fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2 border-t border-slate-100">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500">復習実施タイミング</label>
                    <input
                      type="text"
                      value={method.reviewDays}
                      onChange={(e) =>
                        handleUpdateMethod(method.skillKey, 'reviewDays', e.target.value)
                      }
                      placeholder="例: 当日、翌日、3日後、1週間後"
                      className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-slate-500">完了と判断する条件</label>
                    <input
                      type="text"
                      value={method.completionCriteria}
                      onChange={(e) =>
                        handleUpdateMethod(method.skillKey, 'completionCriteria', e.target.value)
                      }
                      placeholder="例: 見たら3秒以内に即答できること"
                      className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-slate-500">うまくいかない場合の対処</label>
                    <input
                      type="text"
                      value={method.fallbackAction}
                      onChange={(e) =>
                        handleUpdateMethod(method.skillKey, 'fallbackAction', e.target.value)
                      }
                      placeholder="例: 正解理由が曖昧なら解説を熟読"
                      className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-900"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="text-[10px] font-semibold text-slate-500">教師による追加特別指示</label>
                    <input
                      type="text"
                      value={method.teacherAdditionalNotes}
                      onChange={(e) =>
                        handleUpdateMethod(
                          method.skillKey,
                          'teacherAdditionalNotes',
                          e.target.value
                        )
                      }
                      placeholder="例: 質問メモに疑問点を書いてAIまたは次回面談で確認"
                      className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-700 italic"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
