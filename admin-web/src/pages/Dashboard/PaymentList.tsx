import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { PaymentDetails } from "../../types/payment";
import { fetchPayments } from "../../services/paymentService";
import PaymentRow from "../../components/paymentList/PaymentRow";
import PaymentRowSkeleton from "../../components/paymentList/PaymentRowSkeleton";
import PaginationComponent from "../../components/pagination/PaginationComponent";

const PaymentList = () => {
  const [payments, setPayments] = useState<PaymentDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [limit] = useState(8);
  const [totalOrders, setTotalOrders] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(totalOrders / limit);

  const loadData = useCallback(
    async (page: number) => {
      // Logic ini dipanggil oleh PaginationComponent
      
      setLoading(true);
      const start = Date.now();

      try {
        const { data, total } = await fetchPayments(
          String(limit),
          String(page)
        );
        setPayments(data);
        setTotalOrders(total);
        setCurrentPage(page);
      } catch (err) {
        console.error("Failed to fetch transaction data:", err);
        setPayments([]);
      } finally {
        const delay = 500 - (Date.now() - start);
        setTimeout(() => {
          setLoading(false);
        }, Math.max(0, delay));
      }
    },
    [limit, totalPages]
  );

  useEffect(() => {
    // Panggil loadData saat komponen pertama kali dimuat atau currentPage berubah.
    loadData(currentPage);
  }, [currentPage, loadData]);

  // Menggunakan 'loading' state untuk prop loadingTable
  
  return (
    <motion.div
      // Main page background: light gray in light mode, dark gray in dark mode
      className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100 font-sans"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Main card: white in light mode, dark gray in dark mode */}
      <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center border-b pb-4 border-gray-200 dark:border-gray-700">
          Payment Transactions List
        </h1>

        <div className="rounded-lg border border-gray-300 dark:border-gray-700 overflow-x-auto shadow-xl relative">
          <table className="min-w-full text-left text-sm divide-y divide-gray-200 dark:divide-gray-700">
            {/* Table Header adjusted for Mobile */}
            <thead className="bg-gray-100 dark:bg-gray-700 text-xs uppercase tracking-wider sticky top-0">
              <tr>
                {/* ID - Always visible */}
                <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-300 w-[15%]">
                  ID
                </th>
                {/* Order ID - Always visible */}
                <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-300 w-[15%]">
                  Order ID
                </th>
                {/* Gross Amount - Hidden on mobile, visible from sm */}
                <th className="hidden sm:table-cell px-4 py-3 font-medium text-gray-500 dark:text-gray-300">
                  Gross Amount
                </th>
                {/* Payment Type - Hidden on mobile, visible from sm */}
                <th className="hidden sm:table-cell px-4 py-3 font-medium text-gray-500 dark:text-gray-300">
                  Payment Type
                </th>
                {/* Status - Hidden on mobile & small tablet, visible from md */}
                <th className="hidden md:table-cell px-4 py-3 font-medium text-gray-500 dark:text-gray-300">
                  Status
                </th>
                {/* Expired - Hidden on mobile & tablet, visible from lg */}
                <th className="hidden lg:table-cell px-4 py-3 font-medium text-gray-500 dark:text-gray-300">
                  Expired
                </th>
                {/* Chevron/Toggle - Always visible */}
                <th className="px-4 py-3 w-[10%]"></th>
              </tr>
            </thead>
            {/* Table Body: white in light mode, dark gray in dark mode */}
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <AnimatePresence>
                {" "}
                {/* Removing mode="wait" to avoid warning */}
                {loading ? (
                  // Display Skeleton
                  Array.from({ length: limit }).map((_, index) => (
                    <PaymentRowSkeleton key={index} index={index} />
                  ))
                ) : payments.length > 0 ? (
                  // Display actual data
                  payments.map((payment, index) => (
                    <PaymentRow
                      key={payment.ID}
                      payment={payment}
                      index={index}
                    />
                  ))
                ) : (
                  <tr>
                    {/* Adjusted colspan to 7 for desktop. Minimum colspan is 3 (ID, Order ID, Chevron) on mobile. */}
                    <td
                      colSpan={7}
                      className="text-center p-6 text-gray-500 dark:text-gray-400"
                    >
                      No payments found.
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination menggunakan PaginationComponent yang dibagikan */}
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          totalOrders={totalOrders} // Prop name sesuai dengan komponen
          limit={limit}
          onPageChange={loadData} // Menggunakan loadData untuk memuat halaman baru
          loadingTable={loading} // Menggunakan state 'loading'
        />

      </div>
    </motion.div>
  );
};

export default PaymentList;
