import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { PaymentDetails } from "../../types/payment";
import {
  formatRupiah,
  getStatusBadge,
  formatDisplayedId,
  detailVariants,
  rowVariants,
} from "./PaymentUtils"; // Importing utilities
import { ChevronDownIcon, ChevronUpIcon } from "../../icons";
import { RiBankCardLine } from "react-icons/ri";
import { FaRegClock } from "react-icons/fa6";
import { BsQrCode } from "react-icons/bs";
import { PiBankLight } from "react-icons/pi";
import { FaRegCopy } from "react-icons/fa";

const handleCopy = (text: string, type: string, setCopyMessage: React.Dispatch<React.SetStateAction<string>>) => {
    if (!text) {
      setCopyMessage(`No ${type} to copy.`);
      setTimeout(() => setCopyMessage(""), 3000);
      return;
    }

    const tempElement = document.createElement("textarea");
    tempElement.value = text;
    document.body.appendChild(tempElement);
    tempElement.select();

    try {
      document.execCommand("copy");
      setCopyMessage(`${type} successfully copied!`);
      setTimeout(() => setCopyMessage(""), 3000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      setCopyMessage("Failed to copy, please copy manually.");
      setTimeout(() => setCopyMessage(""), 5000);
    }
    document.body.removeChild(tempElement);
  };

const PaymentRow = ({
  payment,
  index,
}: {
  payment: PaymentDetails;
  index: number;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");

  const isBankTransfer = payment.payment_type === "bank_transfer";
  const isQRIS = payment.payment_type === "qris";

  const expiryDate = new Date(payment.expiry_time).toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <React.Fragment>
      <motion.tr
        custom={index}
        initial="hidden"
        animate="visible"
        variants={rowVariants}
        className="cursor-pointer transition-colors duration-200 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700/50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* 1. Transaction ID (ALWAYS VISIBLE) */}
        <td
          className="p-4 whitespace-nowrap text-xs font-medium text-gray-900 dark:text-white/90 w-[15%]"
          title={payment.transaction_id}
        >
          {formatDisplayedId(payment.transaction_id)}
        </td>

        {/* 2. Order ID (ALWAYS VISIBLE) */}
        <td
          className="p-4 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400 w-[15%]"
          title={payment.order_id}
        >
          {formatDisplayedId(payment.order_id)}
        </td>

        {/* 3. Amount (Hidden on mobile, visible from sm) */}
        <td className="hidden sm:table-cell p-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white/90">
          {formatRupiah(payment.gross_amount)}
        </td>

        {/* 4. Payment Type (Hidden on mobile, visible from sm) */}
        <td className="hidden sm:table-cell p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 capitalize">
          <div className="flex items-center">
            {isBankTransfer && (
              <PiBankLight className="mr-2 w-4 h-4 text-blue-500" />
            )}
            {isQRIS && <BsQrCode className="mr-2 w-4 h-4 text-green-500" />}
            {payment.payment_type.replace(/_/g, " ")}
          </div>
        </td>

        {/* 5. Status (Hidden on mobile & small tablet, visible from md) */}
        <td className="hidden md:table-cell p-4 whitespace-nowrap text-sm">
          {getStatusBadge(payment.transaction_status)}
        </td>

        {/* 6. Expiry Time (Hidden on mobile & tablet, visible from lg) */}
        <td className="hidden lg:table-cell p-4 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <FaRegClock className="mr-1 w-3 h-3 text-red-400" />
            {expiryDate}
          </div>
        </td>

        {/* 7. Toggle Button (ALWAYS VISIBLE) */}
        <td className="p-4 whitespace-nowrap text-right w-[10%]">
          <button
            className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-transform duration-300 transform"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? "Hide details" : "Show details"}
          >
            {isExpanded ? (
              <ChevronUpIcon className="w-4 h-4" />
            ) : (
              <ChevronDownIcon className="w-4 h-4" />
            )}
          </button>
        </td>
      </motion.tr>

      {/* Expandable Detail Row (Full details in dropdown) */}
      <tr className="relative">
        <td colSpan={7} className="p-0 border-none">
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                key={`detail-${payment.ID}`}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={detailVariants}
                className="bg-blue-50 dark:bg-gray-800/80 p-4 border-b border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 py-3">
                  {/* Column 1: Transaction Details */}
                  <div className="space-y-3">
                    <h5 className="flex items-center text-md font-semibold text-gray-900 dark:text-white mb-3">
                      <RiBankCardLine className="w-4 h-4 mr-2 text-blue-600" />{" "}
                      Payment Details
                    </h5>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Gross Amount:</span>{" "}
                      {formatRupiah(payment.gross_amount)}
                    </p>
                    {/* Full Order ID is displayed here: */}
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Order ID:</span>{" "}
                      <span className="font-mono text-xs break-all">
                        {payment.order_id}
                      </span>
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Midtrans ID:</span>{" "}
                      <span className="font-mono text-xs break-all">
                        {payment.transaction_id}
                      </span>
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Midtrans Payment ID:</span>{" "}
                      <span className="font-mono text-xs break-all">
                        {payment.ID}
                      </span>
                    </p>
                    {/* Additional details hidden in the main row */}
                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700 space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium">Payment Type:</span>{" "}
                        <div className="flex items-center text-gray-600 dark:text-gray-400 capitalize">
                          {isBankTransfer && (
                            <PiBankLight className="mr-2 w-4 h-4 text-blue-500" />
                          )}
                          {isQRIS && (
                            <BsQrCode className="mr-2 w-4 h-4 text-green-500" />
                          )}
                          {payment.payment_type.replace(/_/g, " ")}
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium">Status:</span>{" "}
                        {getStatusBadge(payment.transaction_status)}
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium">Expiry:</span>{" "}
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <FaRegClock className="mr-1 w-3 h-3 text-red-400" />
                          {expiryDate}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Column 2: Specific Payment Methods (VA / QRIS) */}
                  <div className="space-y-3 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700 md:pl-6">
                    {isBankTransfer &&
                      payment.va_numbers &&
                      payment.va_numbers.length > 0 && (
                        <>
                          <h5 className="flex items-center text-md font-semibold text-gray-900 dark:text-white mb-3">
                            <PiBankLight className="w-4 h-4 mr-2 text-blue-600" />{" "}
                            Virtual Account
                          </h5>
                          {payment.va_numbers.map((va) => (
                            <div
                              key={va.ID}
                              className="bg-white dark:bg-gray-900 p-3 rounded-md flex justify-between items-center shadow-md transition-shadow hover:shadow-lg"
                            >
                              <div>
                                <p className="text-sm font-medium dark:text-white capitalize">
                                  {va.Bank.toUpperCase()}
                                </p>
                                {/* VA Number uses text-sm for mobile, sm:text-lg for larger screens */}
                                <p className="text-sm sm:text-lg font-mono text-blue-600 dark:text-blue-400 select-text">
                                  {va.VANumber}
                                </p>
                              </div>
                              <motion.button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopy(va.VANumber, "VA Number", setCopyMessage);
                                }}
                                className="text-gray-400 hover:text-blue-600 transition p-2 rounded-full bg-gray-100 dark:bg-gray-800"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                title="Copy VA Number"
                              >
                                <FaRegCopy className="w-5 h-5" />
                              </motion.button>
                            </div>
                          ))}
                        </>
                      )}

                    {isQRIS && (
                      <>
                        <h5 className="flex items-center text-md font-semibold text-gray-900 dark:text-white mb-3">
                          <BsQrCode className="w-4 h-4 mr-2 text-green-600" />{" "}
                          QRIS Details
                        </h5>

                        {payment.qr_actions &&
                          payment.qr_actions.map((action) => (
                            <a
                              key={action.ID}
                              href={action.Url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block w-full text-center bg-green-500 text-white p-3 rounded-lg font-semibold hover:bg-green-600 transition shadow-lg hover:shadow-xl"
                            >
                              View QR Code ({action.Name.replace(/-/g, " ")})
                            </a>
                          ))}

                        {payment.qr_string && (
                          <div className="bg-white dark:bg-gray-900 p-3 rounded-md shadow-md">
                            <p className="text-sm font-medium dark:text-white mb-1">
                              QR String (Code)
                            </p>
                            <div className="flex justify-between items-start">
                              <span className="text-xs font-mono text-gray-600 dark:text-gray-400 break-words select-all max-w-[85%] overflow-hidden">
                                {payment.qr_string.substring(0, 50)}
                              </span>
                              <motion.button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopy(
                                    payment.qr_string || "",
                                    "QR String",
                                    setCopyMessage
                                  );
                                }}
                                className="text-gray-400 hover:text-blue-600 transition ml-2 p-2 rounded-full bg-gray-100 dark:bg-gray-800"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                title="Copy QR String"
                              >
                                <FaRegCopy className="w-5 h-5" />
                              </motion.button>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </td>
      </tr>
      {/* Global Copy Status Message per Row */}
      <AnimatePresence>
        {copyMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-4 right-4 bg-gray-900 text-white text-sm px-4 py-2 rounded-lg shadow-xl z-50"
          >
            {copyMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </React.Fragment>
  );
};

export default PaymentRow;
