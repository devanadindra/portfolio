import React from "react";

interface TextAreaHTMLProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean; // Untuk styling error
  hint?: string;   // Hint text di bawah textarea
}

const TextAreaHTML: React.FC<TextAreaHTMLProps> = ({
  error = false,
  hint = "",
  className = "",
  disabled = false,
  ...rest // menampung semua props HTML standar seperti id, value, onChange, rows, required, placeholder, dll
}) => {
  let textareaClasses = `w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden ${className} `;

  if (disabled) {
    textareaClasses += ` bg-gray-100 opacity-50 text-gray-500 border-gray-300 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700`;
  } else if (error) {
    textareaClasses += ` bg-transparent border-gray-300 focus:border-error-300 focus:ring-3 focus:ring-error-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-error-800`;
  } else {
    textareaClasses += ` bg-transparent text-gray-900 dark:text-gray-300 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800`;
  }

  return (
    <div className="relative">
      <textarea
        disabled={disabled}
        className={textareaClasses}
        {...rest} // pakai semua props HTML standar
      />
      {hint && (
        <p className={`mt-2 text-sm ${error ? "text-error-500" : "text-gray-500 dark:text-gray-400"}`}>
          {hint}
        </p>
      )}
    </div>
  );
};

export default TextAreaHTML;
