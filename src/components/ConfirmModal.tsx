import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = '実行する',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-lg shadow-2xl w-full max-w-md overflow-hidden flex flex-col text-xs">
        <div className="bg-rose-900 text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>{title}</span>
          </div>
          <button onClick={onCancel} className="text-slate-300 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-2 text-slate-800 leading-relaxed">
          <p>{message}</p>
        </div>

        <div className="bg-slate-50 border-t border-slate-200 p-3 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-3 py-1.5 rounded font-semibold transition"
          >
            キャンセル
          </button>

          <button
            onClick={onConfirm}
            className="bg-rose-600 hover:bg-rose-500 text-white px-4 py-1.5 rounded font-bold transition shadow-sm"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
