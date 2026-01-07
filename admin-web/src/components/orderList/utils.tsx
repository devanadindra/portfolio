import type { Order } from "../../types/Transaction";
import React from "react";
// 💡 SOLUSI: Tambahkan impor 'Variants' dari framer-motion
import type { Variants } from "framer-motion";

/**
 * Memformat angka menjadi format Rupiah (IDR).
 */
export const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

/**
 * Mengembalikan badge status order dengan styling Tailwind CSS.
 */
// 💡 SOLUSI: Pastikan return type adalah React.ReactNode (sudah benar)
export const getStatusBadge = (status: Order["Status"]): React.ReactNode => {
  let classes = "px-3 py-1 text-xs font-semibold rounded-full capitalize ";
  switch (status) {
    case "pending":
    case "payment_expire":
    case "payment_failed":
      classes +=
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300";
      break;
    case "process":
      classes +=
        "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300";
      break;
    case "completed":
    case "delivered":
      classes +=
        "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300";
      break;
    case "cancelled":
      classes += "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300";
      break;
    default:
      classes +=
        "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300";
      break;
  }

  return <span className={classes}>{status.replace("_", " ")}</span>;
};

// Varian Framer Motion untuk detail dropdown
// 💡 SOLUSI: 'Variants' sekarang dikenal karena sudah diimpor.
export const detailVariants: Variants = {
  hidden: {
    maxHeight: 0,
    opacity: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
  visible: {
    maxHeight: 1000,
    opacity: 1,
    transition: { duration: 0.4, ease: "easeInOut" },
  },
};
