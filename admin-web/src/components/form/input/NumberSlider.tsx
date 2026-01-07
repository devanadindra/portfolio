// StockSlider.tsx (atau ganti isi NumberPicker.tsx Anda dengan ini)

import React from "react";

interface StockSliderProps {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  size: string; // Tambahkan prop size untuk label
}

const StockSlider: React.FC<StockSliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 100, // Menetapkan batas maksimum default yang lebih realistis untuk stok
  size,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm font-medium text-gray-700 dark:text-gray-300">
        <label>Size: {size}</label>
        {/* Menampilkan nilai stok saat ini */}
        <span className="font-semibold text-blue-600 dark:text-blue-400">
          {value}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg dark:bg-gray-700 accent-blue-600"
        // Anda bisa menambahkan styling kustom (misalnya menggunakan Tailwind JIT utilities)
        // untuk memastikan tampilan yang konsisten di berbagai browser.
      />
    </div>
  );
};

export default StockSlider;