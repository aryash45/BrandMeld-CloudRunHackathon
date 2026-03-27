
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
    <div className="w-full space-y-3">
      <label htmlFor={id} className="block font-display text-xl font-semibold tracking-tight text-white">
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className="neon-input neon-scroll resize-y px-5 py-4 text-[15px] leading-relaxed disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  );
};

export default TextInput;
