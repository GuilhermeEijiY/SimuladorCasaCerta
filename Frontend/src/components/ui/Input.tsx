import { InputHTMLAttributes, useId } from "react";
import React from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({
  label,
  error,
  className = "",
  id,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
          error ? "border-red-500 focus:ring-red-500" : "border-gray-300"
        } ${className}`}
        onFocus={(e) => {
          e.target.select(); // Seleciona o texto todo ao clicar!
          if (props.onFocus) props.onFocus(e);
        }}
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
