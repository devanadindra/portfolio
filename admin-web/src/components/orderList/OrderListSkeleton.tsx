import { motion, AnimatePresence } from "framer-motion";

const OrderListSkeleton = ({ rowCount = 8 }: { rowCount?: number }) => (
  <AnimatePresence>
    {[...Array(rowCount)].map((_, index) => (
      <motion.tr
        key={index}
        className="border-t dark:border-gray-700 darak:bg-gray-800"
        custom={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
      >
        {/* Kolom 1: Order ID (SELALU TAMPIL) */}
        <td className="p-4">
            <motion.div
                className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"
                style={{ width: "80%" }}
            />
        </td>
        {/* Kolom 2: User ID (SEMBUNYIKAN DI MOBILE) */}
        <td className="hidden md:table-cell p-4">
            <motion.div
                className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"
                style={{ width: "60%" }}
            />
        </td>
        {/* Kolom 3: Total Amount (SELALU TAMPIL) */}
        <td className="p-4">
            <motion.div
                className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"
                style={{ width: "40%" }}
            />
        </td>
        {/* Kolom 4: Recipient Name (SEMBUNYIKAN DI MOBILE dan MD) */}
        <td className="hidden lg:table-cell p-4">
            <motion.div
                className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"
                style={{ width: "70%" }}
            />
        </td>
        {/* Kolom 5: Phone Number (SEMBUNYIKAN DI MOBILE dan MD) */}
        <td className="hidden lg:table-cell p-4">
            <motion.div
                className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"
                style={{ width: "60%" }}
            />
        </td>
        {/* Kolom 6: Status (SEMBUNYIKAN DI MOBILE) */}
        <td className="hidden md:table-cell p-4">
            <motion.div
                className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"
                style={{ width: "50%" }}
            />
        </td>
        {/* Kolom 7: Detail Button (SELALU TAMPIL, tapi kosongkan isinya untuk skeleton) */}
        <td className="p-4 text-right">
             <motion.div
                className="h-4 w-4 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse float-right"
            />
        </td>
      </motion.tr>
    ))}
  </AnimatePresence>
);

export default OrderListSkeleton;