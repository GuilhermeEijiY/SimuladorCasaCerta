import { InputHTMLAttributes, useId } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, className = "", id, ...props }: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`px-4 py-3 border rounded-lg bg-white text-gray-900 transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent ${
          error
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:ring-brand-500"
        } ${className}`}
        {...props}
      />
      {error && (
        <span id={errorId} className="text-sm text-red-600">
          {error}
        </span>
      )}
    </div>
  );
}