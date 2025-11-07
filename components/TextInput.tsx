
import React from 'react';

interface TextInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  rows?: number;
  disabled?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({ id, label, value, onChange, placeholder, rows = 5, disabled = false }) => {
  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-lg font-semibold mb-3 text-slate-300">
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className="w-full p-4 bg-slate-800 border-2 border-slate-700 rounded-lg text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed resize-y"
      />
    </div>
  );
};

export default TextInput;