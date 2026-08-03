import React from 'react';
import { TimeAvailability } from '../../types';
import { Clock, Sun, Moon, Calendar, Activity, Sparkles } from 'lucide-react';

interface Step3Props {
  availability: TimeAvailability;
  onChange: (updated: TimeAvailability) => void;
}

export const Step3TimeAvailability: React.FC<Step3Props> = ({ availability, onChange }) => {
  const handleChange = (field: keyof TimeAvailability, value: any) => {
    onChange({ ...availability, [field]: value });
  };

  const setPresetHours = (hours: number) => {
    handleChange('maxStudyMinutes', hours * 60);
  };

  const setSchedulePreset = (wake: string, bed: string, start: string, end: string, hours: number) => {
    onChange({
      ...availability,
      wakeTime: wake,
      bedTime: bed,
      preferredStartTime: start,
      preferredEndTime: end,
      maxStudyMinutes: hours * 60,
    });
  };

  const hoursValue = (availability.maxStudyMinutes / 60).toFixed(1);

  return (
    <div className="space-y-4">
      {/* Step Header */}
      <div className="border-b border-slate-200 pb-2">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-sky-600" />
          ステップ3：学習可能時間（生活リズムと実効可処分時間）
        </h2>
        <p className="text-xs text-slate-600 mt-0.5">
          生活リズム・部活・課題などの予定を差し引き、無理のない1日の最大目標勉強時間を設定します。
        </p>
      </div>

      <div className="space-y-4 text-xs">
        {/* Quick Schedule Presets */}
        <div className="bg-sky-50 border border-sky-200 rounded-md p-2.5 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-sky-900">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>生活リズムワンタップ設定プリセット</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setSchedulePreset('06:00', '22:00', '06:30', '21:30', 8)}
              className="text-[11px] bg-white hover:bg-sky-100 text-sky-900 border border-sky-300 px-2.5 py-1 rounded font-medium transition"
            >
              【受験生標準】 06:00起床 - 22:00就寝（最大8時間）
            </button>
            <button
              type="button"
              onClick={() => setSchedulePreset('06:30', '23:00', '07:00', '22:00', 6)}
              className="text-[11px] bg-white hover:bg-sky-100 text-sky-900 border border-sky-300 px-2.5 py-1 rounded font-medium transition"
            >
              【平日学校アリ】 06:30起床 - 23:00就寝（最大6時間）
            </button>
            <button
              type="button"
              onClick={() => setSchedulePreset('06:00', '22:30', '06:30', '22:00', 10)}
              className="text-[11px] bg-white hover:bg-sky-100 text-sky-900 border border-sky-300 px-2.5 py-1 rounded font-medium transition"
            >
              【休日追い込み】 06:00起床 - 22:30就寝（最大10時間）
            </button>
            <button
              type="button"
              onClick={() => setSchedulePreset('07:00', '23:00', '17:00', '22:30', 4)}
              className="text-[11px] bg-white hover:bg-sky-100 text-sky-900 border border-sky-300 px-2.5 py-1 rounded font-medium transition"
            >
              【部活多忙型】 07:00起床 - 23:00就寝（平日4時間）
            </button>
          </div>
        </div>

        {/* Wake / Bed time */}
        <div className="bg-slate-50 border border-slate-200 rounded-md p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div className="space-y-1">
            <label className="font-semibold text-slate-800 flex items-center gap-1">
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>起床時間</span>
            </label>
            <input
              type="time"
              value={availability.wakeTime}
              onChange={(e) => handleChange('wakeTime', e.target.value)}
              className="w-full bg-white border border-slate-300 rounded px-2 py-1.5 font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-800 flex items-center gap-1">
              <Moon className="w-3.5 h-3.5 text-indigo-500" />
              <span>就寝時間</span>
            </label>
            <input
              type="time"
              value={availability.bedTime}
              onChange={(e) => handleChange('bedTime', e.target.value)}
              className="w-full bg-white border border-slate-300 rounded px-2 py-1.5 font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-800">勉強開始時間希望</label>
            <input
              type="time"
              value={availability.preferredStartTime}
              onChange={(e) => handleChange('preferredStartTime', e.target.value)}
              className="w-full bg-white border border-slate-300 rounded px-2 py-1.5 font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-800">勉強終了時間希望</label>
            <input
              type="time"
              value={availability.preferredEndTime}
              onChange={(e) => handleChange('preferredEndTime', e.target.value)}
              className="w-full bg-white border border-slate-300 rounded px-2 py-1.5 font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>
        </div>

        {/* Max Study Minutes Setting */}
        <div className="bg-sky-50/60 border border-sky-200 rounded-md p-3.5 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-sky-600" />
              <span>一日の最大目標勉強時間（可処分時間）</span>
            </label>
            <div className="flex items-center gap-1">
              {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((h) => (
                <button
                  key={h}
                  onClick={() => setPresetHours(h)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono transition ${
                    availability.maxStudyMinutes === h * 60
                      ? 'bg-sky-700 text-white font-bold'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
                  }`}
                >
                  {h}h
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-700 font-medium">時間指定:</span>
              <input
                type="number"
                min={0}
                max={24}
                step={0.5}
                value={hoursValue}
                onChange={(e) => handleChange('maxStudyMinutes', Math.round(parseFloat(e.target.value || '0') * 60))}
                className="w-20 bg-white border border-slate-300 rounded px-2 py-1 text-center font-mono font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
              <span className="text-slate-600 font-medium">時間</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-700 font-medium">（または分換算）:</span>
              <input
                type="number"
                min={0}
                max={1440}
                step={15}
                value={availability.maxStudyMinutes}
                onChange={(e) => handleChange('maxStudyMinutes', parseInt(e.target.value || '0', 10))}
                className="w-24 bg-white border border-slate-300 rounded px-2 py-1 text-center font-mono font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
              <span className="text-slate-600 font-medium">分</span>
            </div>
          </div>
        </div>

        {/* Schedule & Constraints */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="font-semibold text-slate-800 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>平日と休日の学習可能時間の違い</span>
            </label>
            <input
              type="text"
              value={availability.weekdayWeekendDiff}
              onChange={(e) => handleChange('weekdayWeekendDiff', e.target.value)}
              placeholder="例: 平日は17:00以降で4時間、休日は午前から8時間"
              className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-800 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-slate-500" />
              <span>部活（曜日・終了時刻）</span>
            </label>
            <input
              type="text"
              value={availability.clubActivity}
              onChange={(e) => handleChange('clubActivity', e.target.value)}
              placeholder="例: 陸上部（月・水・金 16:30まで） / なし"
              className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-800">学校の課題・宿題の量</label>
            <input
              type="text"
              value={availability.schoolHomework}
              onChange={(e) => handleChange('schoolHomework', e.target.value)}
              placeholder="例: 毎日1日30分程度（英語・数学）"
              className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-800">休養日・リフレッシュ日</label>
            <input
              type="text"
              value={availability.restDays}
              onChange={(e) => handleChange('restDays', e.target.value)}
              placeholder="例: 日曜夜は軽めの復習のみで休息"
              className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
