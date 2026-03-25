import React from 'react';
import { EditCommand } from '../services/apiService';

interface EditToolbarProps {
  isEditing: boolean;
  activeCommand: EditCommand | null;
  onEdit: (command: EditCommand) => void;
  onUndo: () => void;
  canUndo: boolean;
  disabled?: boolean;
}

const EDIT_BUTTONS: { command: EditCommand; label: string; description: string }[] = [
  { command: 'shorter',  label: '✂ Shorter',    description: 'Cut to the essential' },
  { command: 'longer',   label: '↕ Expand',     description: 'Add more depth' },
  { command: 'casual',   label: '💬 Casual',    description: 'Sound more human' },
  { command: 'formal',   label: '🎩 Formal',    description: 'More polished tone' },
  { command: 'hook',     label: '🎣 Add Hook',  description: 'Rewrite the opening' },
  { command: 'punchy',   label: '⚡ Punchier',  description: 'Shorter, stronger sentences' },
];

const Spinner: React.FC = () => (
  <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
);

const EditToolbar: React.FC<EditToolbarProps> = ({
  isEditing,
  activeCommand,
  onEdit,
  onUndo,
  canUndo,
  disabled,
}) => {
  return (
    <div className="mt-4 pt-4 border-t border-slate-700/50">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Refine Draft</span>
        {canUndo && (
          <button
            onClick={onUndo}
            disabled={isEditing}
            className="text-xs text-slate-500 hover:text-amber-400 transition-colors flex items-center gap-1"
          >
            ↩ Undo
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {EDIT_BUTTONS.map(({ command, label }) => {
          const isActive = isEditing && activeCommand === command;
          const isOtherLoading = isEditing && activeCommand !== command;
          return (
            <button
              key={command}
              onClick={() => onEdit(command)}
              disabled={disabled || isEditing}
              title={EDIT_BUTTONS.find((b) => b.command === command)?.description}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border
                transition-all duration-150
                ${isActive
                  ? 'bg-teal-500/25 border-teal-500/50 text-teal-300'
                  : isOtherLoading || disabled
                    ? 'opacity-40 cursor-not-allowed bg-slate-800/30 border-slate-700 text-slate-500'
                    : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-100 hover:bg-slate-700/50 cursor-pointer'
                }
              `}
            >
              {isActive && <Spinner />}
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default EditToolbar;
