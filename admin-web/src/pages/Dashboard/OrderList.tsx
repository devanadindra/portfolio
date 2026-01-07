import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { FaSearch } from "react-icons/fa";
import type { Order } from "../../types/Transaction";
import { fetchOrders } from "../../services/transactionService";
import OrderRow from "../../components/orderList/OrderRow";
import OrderListSkeleton from "../../components/orderList/OrderListSkeleton";
import PaginationComponent from "../../components/pagination/PaginationComponent";

const tableVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function OrderList() {
  const [loadingTable, setLoadingTable] = useState(false);

  const [limit] = useState(8);
  const [totalOrders, setTotalOrders] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState<Order[]>([]);

  const totalPages = Math.ceil(totalOrders / limit);

  const loadData = async (page: number) => {
    if (page < 1 || (totalPages > 0 && page > totalPages)) return;

    setLoadingTable(true);
    // Catat waktu mulai untuk memastikan animasi loading minimal (debounce)
    const start = Date.now();

    try {
      setOrders([]);

      // Memuat data dari backend
      const { data, total } = await fetchOrders(String(limit), String(page));
      setOrders(data);
      setTotalOrders(total);
      setCurrentPage(page);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setOrders([]);
    } finally {
      // Pastikan loading minimal 500ms untuk menghindari kedipan cepat
      const delay = 500 - (Date.now() - start);
      setTimeout(() => {
        setLoadingTable(false);
      }, Math.max(0, delay));
    }
  };

  useEffect(() => {
    // Memuat data saat komponen pertama kali di-mount atau currentPage berubah
    loadData(currentPage);
  }, [currentPage]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Order List
      </h2>

      {/* Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search is currently disabled..."
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition duration-200"
            disabled
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-400" />
        </div>
      </div>

      {/* Table Section */}
      <motion.div
        className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800"
        initial="hidden"
        animate="visible"
        variants={tableVariants}
      >
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {/* KOLOM 1: ORDER ID (Selalu Tampil) */}
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                ID
              </th>
              {/* KOLOM 2: USER ID (Sembunyi di Mobile, Tampil di MD ke atas) */}
              <th className="hidden md:table-cell p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-auto">
                User ID
              </th>
              {/* KOLOM 3: TOTAL AMOUNT (Selalu Tampil) */}
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                Total
              </th>
              {/* KOLOM 4: RECIPIENT (Sembunyi di Mobile dan MD, Tampil di LG ke atas) */}
              <th className="hidden lg:table-cell p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-auto">
                Recipient
              </th>
              {/* KOLOM 5: PHONE (Sembunyi di Mobile dan MD, Tampil di LG ke atas) */}
              <th className="hidden lg:table-cell p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-auto">
                Phone
              </th>
              {/* KOLOM 6: STATUS (Sembunyi di Mobile, Tampil di MD ke atas) */}
              <th className="hidden md:table-cell p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-auto">
                Status
              </th>
              {/* KOLOM 7: DETAIL (Selalu Tampil) */}
              <th className="p-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                Detail
              </th>
            </tr>
          </thead>
          {/* Mengganti dark:bg-gray-900 menjadi dark:bg-gray-800 untuk kontras yang lebih baik dengan div utama */}
          <tbody className="bg-white divide-y divide-gray-100 dark:bg-gray-800 dark:divide-gray-700">
            <AnimatePresence>
              {loadingTable ? (
                // Menggunakan OrderListSkeleton
                <OrderListSkeleton key="skeleton" rowCount={limit} />
              ) : orders.length > 0 ? (
                // Menggunakan OrderRow
                orders.map((order, index) => (
                  <OrderRow key={order.ID} order={order} index={index} />
                ))
              ) : (
                <motion.tr
                  key="no-data"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <td
                    colSpan={7} 
                    className="text-center dark:text-gray-400 py-4 bg-gray-50 dark:bg-gray-700" // Mengganti dark:bg-gray-800/70 menjadi dark:bg-gray-700
                  >
                    No order data available.
                  </td>
                </motion.tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </motion.div>

      {/* Pagination Section */}
      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        totalOrders={totalOrders}
        limit={limit}
        onPageChange={loadData}
        loadingTable={loadingTable}
      />
    </div>
  );
}
