import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaChevronDown,
  FaChevronUp,
  FaBoxes,
  FaMapMarkerAlt,
  FaUser,
  FaShippingFast,
  FaPhone,
  FaUserTie,
  FaCreditCard,
  FaTasks,
  FaHouseDamage,
} from "react-icons/fa";
import type { Order, TransactionStatus } from "../../types/Transaction";
// Pastikan path dan nama fungsi di sini benar (getStatusBadge, detailVariants)
import { formatRupiah, getStatusBadge, detailVariants } from "./utils.tsx";
import { handleStatusChange } from "../../services/transactionService.ts";

// --- Konstanta Status yang Dapat Dipilih oleh Admin ---
const SELECT_STATUSES: TransactionStatus[] = [
  "process",
  "delivered",
  "cancelled",
  "completed",
];

const BEGIN_STATUSES: TransactionStatus[] = ["pending", "draft"];

const FINAL_STATUSES: TransactionStatus[] = [
  "completed",
  "payment_expire",
  "payment_failed",
  "cancelled",
];

// ----------------------------------------------------

// --- Helper untuk memformat Order ID yang DITAMPILKAN di tabel (singkatan) ---
const formatDisplayedOrderId = (id: string): string => {
  if (!id || id.length < 12) {
    return id.toUpperCase();
  }

  const upperId = id.toUpperCase();
  const start = upperId.substring(0, 8);
  const end = upperId.substring(upperId.length - 4);

  return `${start}${end}`;
};
// -----------------------------------------------------------------------------

const formatStatusText = (status: TransactionStatus) => {
  return status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, " ");
};

const OrderRow: React.FC<{ order: Order; index: number }> = ({
  order,
  index,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  // State untuk mengelola status saat ini (untuk optimistic UI update)
  const [currentStatus, setCurrentStatus] = useState(order.Status);

  if (!order || !order.ID || !order.UserID) {
    return null;
  }

  const isFinalStatus = FINAL_STATUSES.includes(currentStatus);
  const isBeginStatus = BEGIN_STATUSES.includes(currentStatus);
  const isStatusImmutable = isFinalStatus || isBeginStatus; // Status tidak bisa diubah

  const displayedOrderId = formatDisplayedOrderId(order.ID);
  const fullOrderId = order.ID;
  const displayedUserId = order.UserID.substring(0, 8).toUpperCase();
  const fullUserId = order.UserID;
  const payment = order.Payment;

  const handleStatusUpdate = async (
    newStatus: TransactionStatus,
    transactionID: string
  ) => {
    if (isStatusImmutable) return;

    // Only update if the status is actually changing
    if (newStatus === currentStatus) return;

    const originalStatus = currentStatus;
    setCurrentStatus(newStatus);

    try {
      await handleStatusChange(newStatus, transactionID);
    } catch (error) {
      console.error("Failed to update status:", error);
      // Rollback status on failure
      setCurrentStatus(originalStatus);
    }
  };

  const onStatusSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as TransactionStatus;
    // Pengecekan keamanan: jika select didisabled, jangan proses perubahan status
    if (!isStatusImmutable) {
      handleStatusUpdate(newStatus, order.ID);
    }
  };

  /**
   * Fungsi helper untuk merender opsi SELECT.
   * Jika disabled, hanya currentStatus yang dirender.
   * Jika aktif, semua SELECT_STATUSES dirender.
   */
  const renderStatusOptions = () => {
    if (isStatusImmutable) {
      // 💡 Jika disabled, tampilkan HANYA status saat ini
      return (
        <option value={currentStatus}>{formatStatusText(currentStatus)}</option>
      );
    }
    
    return (
      <>
        {currentStatus === "paid" && (
          <option value="paid" disabled>
            {formatStatusText("paid")}
          </option>
        )}

        {SELECT_STATUSES.map((status) => (
          <option key={status} value={status}>
            {formatStatusText(status)}
          </option>
        ))}
      </>
    );
  };

  return (
    <>
      <motion.tr
        className="cursor-pointer transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        // Menggunakan kelas hover Tailwind untuk konsistensi dark mode
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Kolom 1: Order ID */}
        <td className="p-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white/90">
          <span
            className="truncate max-w-[120px] inline-block font-semibold"
            title={fullOrderId}
          >
            {displayedOrderId}
          </span>
        </td>

        {/* Kolom 2: User ID */}
        <td className="hidden md:table-cell p-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
          <span
            className="truncate max-w-[120px] inline-block"
            title={fullUserId}
          >
            {displayedUserId}
          </span>
        </td>

        {/* Kolom 3: Total Amount */}
        <td className="p-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white/90">
          {formatRupiah(order.Payment.TotalWithFee)}
        </td>

        {/* Kolom 4 hingga 7 tetap sama */}
        <td className="hidden lg:table-cell p-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
          {order.ShippingAddress.Name}
        </td>
        <td className="hidden lg:table-cell p-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
          (+62) {order.ShippingAddress.PhoneNumber}
        </td>
        {/* Kolom Status (Menggunakan currentStatus) */}
        <td className="hidden md:table-cell p-4 whitespace-nowrap text-sm">
          {getStatusBadge(currentStatus)}
        </td>
        <td className="p-4 whitespace-nowrap text-sm text-right">
          <button className="text-gray-500 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-transform duration-300">
            {isExpanded ? (
              <FaChevronUp className="w-4 h-4" />
            ) : (
              <FaChevronDown className="w-4 h-4" />
            )}
          </button>
        </td>
      </motion.tr>

      {/* Expandable Detail Row */}
      <tr>
        <td colSpan={7} className="p-0 border-none">
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                key={`detail-${order.ID}`}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={detailVariants}
                // Background yang lebih gelap (gray-700) untuk kontras dengan row (gray-800)
                className="bg-gray-50 dark:bg-gray-700 p-4 border-b border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* DETAIL DATA KHUSUS MOBILE (<MD) */}
                  <div className="md:hidden space-y-3 pb-4 border-b md:border-b-0 border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <FaUser className="w-4 h-4 mr-2 inline text-blue-500" />
                      <span className="font-medium">Order ID:</span>{" "}
                      {/* ID PENUH MOBILE */}
                      <span className="block text-xs font-mono mt-1 p-2 bg-gray-100 dark:bg-gray-800 rounded-md select-all overflow-x-auto break-words">
                        {fullOrderId}
                      </span>
                    </p>
                    {/* User ID Penuh Mobile */}
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <FaUser className="w-4 h-4 mr-2 inline text-blue-500" />
                      <span className="font-medium">User ID:</span>{" "}
                      <span className="block text-xs font-mono mt-1 p-2 bg-gray-100 dark:bg-gray-800 rounded-md select-all overflow-x-auto break-words">
                        {fullUserId}
                      </span>
                    </p>

                    {/* Status Mobile (Badge) */}
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <FaShippingFast className="w-4 h-4 mr-2 inline text-blue-500" />
                      <span className="font-medium">Status:</span>{" "}
                      {getStatusBadge(currentStatus)}
                    </p>

                    {/* STATUS PICKER UNTUK MOBILE */}
                    <div className="mt-4">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
                        Update Status{" "}
                        {isFinalStatus && (
                          <span className="ml-2 text-xs font-semibold text-red-500">
                            (Final Status, Cannot Be Changed)
                          </span>
                        )}
                        {isBeginStatus && (
                          <span className="ml-2 text-xs font-semibold text-green-500">
                            (Begin Status, Cannot Be Changed)
                          </span>
                        )}
                      </label>
                      <select
                        value={currentStatus}
                        onChange={onStatusSelectChange}
                        className={`w-full p-2 border rounded-md text-sm ${
                          isStatusImmutable
                            ? "bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-400 border-gray-400 cursor-not-allowed" // Fixed typo
                            : "bg-white text-gray-900 dark:bg-gray-900 dark:text-white border-gray-300 cursor-pointer"
                        }`}
                        disabled={isStatusImmutable}
                      >
                        {/* 🚀 Menggunakan fungsi helper untuk merender opsi */}
                        {renderStatusOptions()}
                      </select>
                    </div>
                  </div>

                  {/* 1. Shipping Information + Status Picker (Desktop) */}
                  <div className="space-y-3">
                    <h5 className="flex items-center text-md font-semibold text-gray-900 dark:text-white mb-3">
                      <FaMapMarkerAlt className="w-4 h-4 mr-2 text-blue-500" />{" "}
                      Shipping Information
                    </h5>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <FaUserTie className="w-4 h-4 mr-2 inline text-blue-500" />
                      <span className="font-medium">Recipient:</span>{" "}
                      {order.ShippingAddress.Name}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <FaPhone className="w-4 h-4 mr-2 inline text-blue-500" />
                      <span className="font-medium">Phone:</span> (+62){" "}
                      {order.ShippingAddress.PhoneNumber}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                      <FaHouseDamage className="w-4 h-4 mr-2 inline text-blue-500" />
                      <span className="font-medium">Address:</span>{" "}
                      {order.ShippingAddress.Address}
                    </p>

                    <div className="hidden md:block pt-3 border-t border-gray-200 dark:border-gray-700">
                      <h5 className="flex items-center text-md font-semibold text-gray-900 dark:text-white mb-3 mt-4">
                        <FaTasks className="w-4 h-4 mr-2 text-blue-500" />{" "}
                        Update Status
                        {isFinalStatus && (
                          <span className="ml-2 text-xs font-semibold text-red-500">
                            (Final Status, Cannot Be Changed)
                          </span>
                        )}
                        {isBeginStatus && (
                          <span className="ml-2 text-xs font-semibold text-green-500">
                            (Begin Status, Cannot Be Changed)
                          </span>
                        )}
                      </h5>
                      <select
                        value={currentStatus}
                        onChange={onStatusSelectChange}
                        className={`w-full p-2 border rounded-md text-sm ${
                          isStatusImmutable
                            ? "bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-400 border-gray-400 cursor-not-allowed" // Fixed typo
                            : "bg-white text-gray-900 dark:bg-gray-900 dark:text-white border-gray-300 cursor-pointer"
                        }`}
                        disabled={isStatusImmutable}
                      >
                        {/* 🚀 Menggunakan fungsi helper untuk merender opsi */}
                        {renderStatusOptions()}
                      </select>
                    </div>
                  </div>

                  {/* 2. PAYMENT DETAILS & STATUS PICKER (DESKTOP) */}
                  <div className="space-y-4">
                    {payment && (
                      <div>
                        <h5 className="flex items-center text-md font-semibold text-gray-900 dark:text-white mb-3">
                          <FaCreditCard className="w-4 h-4 mr-2 text-blue-500" />{" "}
                          Payment Details
                        </h5>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-1 capitalize">
                          <span className="font-medium">Method:</span>{" "}
                          {(payment.PaymentMethod || "N/A").replace(/_/g, " ")}
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                          <span className="font-medium">
                            Total Amount Products:
                          </span>{" "}
                          {formatRupiah(
                            payment.Amount - order.ShippingAddress.ShippingCost
                          )}
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                          <span className="font-medium">Shipping Cost:</span>{" "}
                          {formatRupiah(order.ShippingAddress.ShippingCost)}
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                          <span className="font-medium">Fee:</span>{" "}
                          {formatRupiah(payment.TotalWithFee - payment.Amount)}
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 font-semibold mt-2">
                          <span className="font-medium">Total Paid:</span>{" "}
                          {formatRupiah(payment.TotalWithFee)}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* 3. Transaction Details */}
                  <div>
                    <h5 className="flex items-center text-md font-semibold text-gray-900 dark:text-white mb-3">
                      <FaBoxes className="w-4 h-4 mr-2 text-blue-500" /> Product
                      Details
                    </h5>
                    {order.TransactionDetails.map((td) => (
                      <div
                        key={td.ID}
                        // Menggunakan dark:bg-gray-900 untuk kontras yang kuat dengan dark:bg-gray-700 di sekitarnya
                        className="mb-2 p-3 bg-white dark:bg-gray-900 rounded-lg shadow-sm"
                      >
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {td.Product.Name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {td.Quantity}x | Size: {td.Size} |{" "}
                          {formatRupiah(td.Product.Price)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </td>
      </tr>
    </>
  );
};

export default OrderRow;
