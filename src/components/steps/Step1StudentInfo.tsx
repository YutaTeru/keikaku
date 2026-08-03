import React, { useState } from 'react';
import { StudentInfo } from '../../types';
import { QUICK_PRESETS } from '../../data/presets';
import { User, GraduationCap, Building2, BookCheck, StickyNote, Sparkles, Check } from 'lucide-react';

const UNIVERSITY_PRESETS = [
  { name: '九州大学', kana: 'きゅうしゅうだいがく', romaji: 'kyushu', displayName: '九州大学 (九大)' },
  { name: '九州工業大学', kana: 'きゅうしゅうこうぎょうだいがく', romaji: 'kyushukogyo kyushu', displayName: '九州工業大学 (九工大)' },
  { name: '北九州市立大学', kana: 'きたきゅうしゅうしりつだいがく', romaji: 'kitakyushu kyushu', displayName: '北九州市立大学' },
  { name: '福岡大学', kana: 'ふくおかだいがく', romaji: 'fukuoka', displayName: '福岡大学 (福大)' },
  { name: '西南学院大学', kana: 'せいなんがくいんだいがく', romaji: 'seinan', displayName: '西南学院大学' },
  { name: '東京大学', kana: 'とうきょうだいがく', romaji: 'tokyo', displayName: '東京大学 (東大)' },
  { name: '京都大学', kana: 'きょうとだいがく', romaji: 'kyoto', displayName: '京都大学 (京大)' },
  { name: '早稲田大学', kana: 'わせだだいがく', romaji: 'waseda', displayName: '早稲田大学 (早大)' },
  { name: '慶應義塾大学', kana: 'けいおうぎじゅくだいがく', romaji: 'keio', displayName: '慶應義塾大学 (慶応)' },
  { name: '明治大学', kana: 'めいじだいがく', romaji: 'meiji', displayName: '明治大学 (明大)' },
  { name: '青山学院大学', kana: 'あおやまがくいんだいがく', romaji: 'aoyama', displayName: '青山学院大学 (青学)' },
  { name: '立教大学', kana: 'りっきょうだいがく', romaji: 'rikkyo', displayName: '立教大学 (立大)' },
  { name: '中央大学', kana: 'ちゅうおうだいがく', romaji: 'chuo', displayName: '中央大学 (中大)' },
  { name: '法政大学', kana: 'ほうせいだいがく', romaji: 'hosei', displayName: '法政大学 (法大)' },
  { name: '同志社大学', kana: 'どうししゃだいがく', romaji: 'doshisha', displayName: '同志社大学' },
  { name: '立命館大学', kana: 'りつめいかんだいがく', romaji: 'ritsumeikan', displayName: '立命館大学 (立命)' },
];

interface Step1Props {
  student: StudentInfo;
  onChange: (updated: StudentInfo) => void;
}

export const Step1StudentInfo: React.FC<Step1Props> = ({ student, onChange }) => {
  const [showUniSuggestions, setShowUniSuggestions] = useState(false);

  const handleChange = (field: keyof StudentInfo, value: string) => {
    onChange({ ...student, [field]: value });
  };

  const query = (student.targetUniversity || '').toLowerCase().trim();
  const filteredUniversities = query
    ? UNIVERSITY_PRESETS.filter(
        (uni) =>
          uni.name.toLowerCase().includes(query) ||
          uni.kana.toLowerCase().includes(query) ||
          uni.romaji.toLowerCase().includes(query) ||
          uni.displayName.toLowerCase().includes(query)
      )
    : UNIVERSITY_PRESETS;

  const handleEikenGradeClick = (grade: string) => {
    const isCbt = student.qualificationGoal.includes('S-CBT') || student.qualificationGoal.includes('SBT');
    const cbtText = isCbt ? ' (S-CBT)' : ' (従来型)';
    handleChange('qualificationGoal', `英検${grade}${cbtText}`);
  };

  const handleEikenTypeClick = (type: 's-cbt' | 'paper') => {
    let grade = '準1級';
    for (const g of ['準1級', '1級', '準2級', '2級', '3級']) {
      if (student.qualificationGoal.includes(g)) {
        grade = g;
        break;
      }
    }
    const cbtText = type === 's-cbt' ? ' (S-CBT)' : ' (従来型)';
    handleChange('qualificationGoal', `英検${grade}${cbtText}`);
  };

  return (
    <div className="space-y-4">
      {/* Step Header */}
      <div className="border-b border-slate-200 pb-2">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <User className="w-5 h-5 text-sky-600" />
          ステップ1：生徒情報（指導基本プロファイル）
        </h2>
        <p className="text-xs text-slate-600 mt-0.5">
          生徒と対話しながら入力してください。選択肢チップを押すだけで簡単に入力できます。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Name / Nickname */}
        <div className="space-y-1">
          <label className="font-semibold text-slate-800 flex items-center gap-1">
            <span>生徒名または管理用呼び名</span>
            <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={student.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="例: 山形さん / Y.K.生徒"
            className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>

        {/* Grade */}
        <div className="space-y-1">
          <label className="font-semibold text-slate-800 flex items-center gap-1">
            <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
            <span>学年</span>
          </label>
          <select
            value={student.grade}
            onChange={(e) => handleChange('grade', e.target.value)}
            className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500 font-medium"
          >
            <option value="高1">高校1年生 (高1)</option>
            <option value="高2">高校2年生 (高2)</option>
            <option value="高3">高校3年生 (高3)</option>
            <option value="既卒">既卒生 (浪人生)</option>
            <option value="中3">中学3年生 (中3)</option>
            <option value="その他">その他</option>
          </select>
        </div>

        {/* Exam Type */}
        <div className="space-y-1 md:col-span-2">
          <label className="font-semibold text-slate-800">入試方式</label>
          <select
            value={student.examType}
            onChange={(e) => handleChange('examType', e.target.value)}
            className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500 font-medium"
          >
            <option value="一般選抜">一般選抜 (国公立・私大一般)</option>
            <option value="共通テスト利用・併用">共通テスト利用・併用</option>
            <option value="総合型選抜 (旧AO)">総合型選抜 (旧AO)</option>
            <option value="学校推薦型選抜 (公募/指定校)">学校推薦型選抜 (公募/指定校)</option>
            <option value="内部進学・外部資格">内部進学・外部資格利用</option>
            <option value="その他">その他</option>
          </select>
        </div>

        {/* School Name (Optional) */}
        <div className="space-y-1 md:col-span-2">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-slate-800 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              <span>学校名（高校名・任意）</span>
            </label>
            <span className="text-[10px] text-slate-500 flex items-center gap-0.5">
              <Sparkles className="w-3 h-3 text-sky-600" /> 北九州の主要高校 1タップ選択可
            </span>
          </div>
          <input
            type="text"
            value={student.school}
            onChange={(e) => handleChange('school', e.target.value)}
            placeholder="例: 県立東筑高校 / 自由ケ丘高校"
            className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
          <div className="flex flex-wrap gap-1 pt-1">
            {(QUICK_PRESETS as any).highSchools?.map((sch: string) => (
              <button
                key={sch}
                type="button"
                onClick={() => handleChange('school', sch)}
                className={`text-[10px] px-2 py-0.5 rounded border transition ${
                  student.school === sch
                    ? 'bg-sky-600 text-white border-sky-600 font-bold'
                    : 'bg-slate-50 hover:bg-sky-50 text-slate-700 border-slate-200 hover:border-sky-300'
                }`}
              >
                {sch}
              </button>
            ))}
          </div>
        </div>

        {/* Target University */}
        <div className="space-y-1 md:col-span-2 relative">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-slate-800">志望大学</label>
            <span className="text-[10px] text-slate-500 flex items-center gap-0.5">
              <Sparkles className="w-3 h-3 text-sky-600" /> ひらがな・ローマ字候補検索対応
            </span>
          </div>
          <input
            type="text"
            value={student.targetUniversity}
            onChange={(e) => handleChange('targetUniversity', e.target.value)}
            onFocus={() => setShowUniSuggestions(true)}
            onBlur={() => setTimeout(() => setShowUniSuggestions(false), 200)}
            placeholder="例: 慶應義塾大学 / 九州工業大学 / 九州大学 (hiragana入力対応)"
            className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />

          {/* Floating Suggestion Dropdown */}
          {showUniSuggestions && filteredUniversities.length > 0 && (
            <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
              <div className="p-1.5 bg-slate-50 text-[10px] font-bold text-slate-500 border-b border-slate-100">
                検索候補 (Matching Universities)
              </div>
              {filteredUniversities.map((uni) => (
                <button
                  key={uni.name}
                  type="button"
                  onMouseDown={() => {
                    handleChange('targetUniversity', uni.name);
                    setShowUniSuggestions(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-sky-50 hover:text-sky-950 border-b border-slate-50 last:border-b-0 transition text-slate-800 font-medium flex items-center justify-between"
                >
                  <span>{uni.displayName}</span>
                  {student.targetUniversity === uni.name && (
                    <Check className="w-3.5 h-3.5 text-sky-600" />
                  )}
                </button>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-1 pt-1">
            {QUICK_PRESETS.universities.map((uni) => (
              <button
                key={uni}
                type="button"
                onClick={() => handleChange('targetUniversity', uni)}
                className={`text-[10px] px-2 py-0.5 rounded border transition ${
                  student.targetUniversity === uni
                    ? 'bg-sky-600 text-white border-sky-600 font-bold'
                    : 'bg-slate-50 hover:bg-sky-50 text-slate-700 border-slate-200 hover:border-sky-300'
                }`}
              >
                {uni}
              </button>
            ))}
          </div>
        </div>

        {/* Target Faculty */}
        <div className="space-y-1 md:col-span-2">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-slate-800">志望学部</label>
            <span className="text-[10px] text-slate-500 flex items-center gap-0.5">
              <Sparkles className="w-3 h-3 text-sky-600" /> 1タップ選択可
            </span>
          </div>
          <input
            type="text"
            value={student.targetFaculty}
            onChange={(e) => handleChange('targetFaculty', e.target.value)}
            placeholder="例: 文学部 / 法学部 / 理工学部"
            className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
          <div className="flex flex-wrap gap-1 pt-1">
            {QUICK_PRESETS.faculties.map((fac) => (
              <button
                key={fac}
                type="button"
                onClick={() => handleChange('targetFaculty', fac)}
                className={`text-[10px] px-2 py-0.5 rounded border transition ${
                  student.targetFaculty === fac
                    ? 'bg-sky-600 text-white border-sky-600 font-bold'
                    : 'bg-slate-50 hover:bg-sky-50 text-slate-700 border-slate-200 hover:border-sky-300'
                }`}
              >
                {fac}
              </button>
            ))}
          </div>
        </div>

        {/* Qualification Goal */}
        <div className="space-y-1 md:col-span-2">
          <label className="font-semibold text-slate-800 flex items-center gap-1">
            <BookCheck className="w-3.5 h-3.5 text-slate-500" />
            <span>英検などの資格目標</span>
          </label>
          <input
            type="text"
            value={student.qualificationGoal}
            onChange={(e) => handleChange('qualificationGoal', e.target.value)}
            placeholder="例: 英検準1級（2026年度第2回） / TOEFL 80点 / TOEIC 700点"
            className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />

          {/* Premium Eiken Grade and Type Selection Panel */}
          <div className="bg-sky-50/50 border border-sky-100 rounded p-2.5 space-y-2 mt-1.5">
            <div className="text-[10px] font-bold text-sky-900 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-sky-600" />
              <span>英検設定 (Eiken Grade Selection & SBT Toggle)</span>
            </div>
            
            <div className="space-y-2">
              <div>
                <span className="text-[10px] text-slate-500 block mb-1">英検級の選択:</span>
                <div className="flex flex-wrap gap-1">
                  {[
                    { key: '1級', label: '1st Grade (1級)' },
                    { key: '準1級', label: 'Pre-1st Grade (準1級)' },
                    { key: '2級', label: '2nd Grade (2級)' },
                    { key: '準2級', label: 'Pre-2nd Grade (準2級)' },
                    { key: '3級', label: '3rd Grade (3級)' },
                  ].map((g) => {
                    const isActive = student.qualificationGoal.includes(g.key);
                    return (
                      <button
                        key={g.key}
                        type="button"
                        onClick={() => handleEikenGradeClick(g.key)}
                        className={`text-[10px] px-2 py-1 rounded border transition font-medium ${
                          isActive
                            ? 'bg-sky-600 text-white border-sky-600 font-bold shadow-2xs'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {g.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 block mb-1">試験形式:</span>
                <div className="flex gap-1.5">
                  {[
                    { key: 's-cbt', label: 'S-CBT (SBT受検)' },
                    { key: 'paper', label: '従来型 (Paper受検)' },
                  ].map((t) => {
                    const isSCBT = student.qualificationGoal.includes('S-CBT') || student.qualificationGoal.includes('SBT');
                    const hasEiken = student.qualificationGoal.includes('英検');
                    const isActive = hasEiken && (t.key === 's-cbt' ? isSCBT : !isSCBT);
                    return (
                      <button
                        key={t.key}
                        type="button"
                        onClick={() => handleEikenTypeClick(t.key as any)}
                        className={`text-[10px] px-3 py-1 rounded border transition font-medium ${
                          isActive
                            ? 'bg-sky-600 text-white border-sky-600 font-bold shadow-2xs'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 pt-1">
            {QUICK_PRESETS.qualifications.map((qual) => (
              <button
                key={qual}
                type="button"
                onClick={() => handleChange('qualificationGoal', qual)}
                className={`text-[10px] px-2 py-0.5 rounded border transition ${
                  student.qualificationGoal === qual
                    ? 'bg-sky-600 text-white border-sky-600 font-bold'
                    : 'bg-slate-50 hover:bg-sky-50 text-slate-700 border-slate-200 hover:border-sky-300'
                }`}
              >
                {qual}
              </button>
            ))}
          </div>
        </div>

        {/* Teacher Memo */}
        <div className="space-y-1 md:col-span-2">
          <label className="font-semibold text-slate-800 flex items-center gap-1">
            <StickyNote className="w-3.5 h-3.5 text-slate-500" />
            <span>教師の指導自由メモ（指導方針や性格など）</span>
          </label>
          <textarea
            value={student.teacherMemo}
            onChange={(e) => handleChange('teacherMemo', e.target.value)}
            rows={3}
            placeholder="例: 素直でやる気はあるが長文精読の体力が不足。単語の暗記スピードは速いので、前半で高回転テストを徹底する。"
            className="w-full bg-white border border-slate-300 rounded p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500 resize-y"
          />
        </div>
      </div>
    </div>
  );
};

