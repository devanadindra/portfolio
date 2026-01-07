import type { PaymentStatus } from "../../types/payment";

export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

export const getStatusBadge = (status: PaymentStatus) => {
  let classes = "";
  let text = status.toUpperCase().replace(/_/g, " ");

  switch (status) {
    case "settlement":
    case "capture":
      classes = "bg-green-600 text-white";
      break;
    case "pending":
    case "authorize":
      classes = "bg-yellow-500 text-white";
      break;
    case "expire":
    case "cancel":
    case "deny":
      classes = "bg-red-600 text-white";
      break;
    case "refund":
    default:
      classes = "bg-gray-500 text-white";
  }

  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${classes}`}>
      {text}
    </span>
  );
};

export const formatDisplayedId = (id: string | undefined): string => {
  if (!id) return "N/A";
  const upperId = id.toUpperCase();

  if (upperId.length <= 12) {
    return upperId;
  }

  // Mempertahankan format 8 karakter awal + 4 karakter akhir
  return `${upperId.substring(0, 8)}${upperId.substring(
    upperId.length - 4
  )}`;
};

// Varian Animasi untuk Detail Row
export const detailVariants = {
  hidden: { opacity: 0, height: 0, padding: 0, transition: { duration: 0.3 } },
  visible: {
    opacity: 1,
    height: "auto",
    padding: "1rem",
    transition: {
      duration: 0.5,
      opacity: { duration: 0.3, delay: 0.1 },
    },
  },
};

// Varian Animasi untuk Row Utama
export const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.05 },
  }),
};