import { motion } from "framer-motion";

const PaymentRowSkeleton = ({ index }: { index: number }) => (
  <motion.tr
    custom={index}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{
      duration: 0.8,
      delay: index * 0.1,
      repeat: Infinity,
      repeatType: "reverse",
    }}
    className="border-b border-gray-200 dark:border-gray-700 h-16"
  >
    <td colSpan={7} className="p-4">
      <div className="flex items-center space-x-4 animate-pulse">
        {/* Menggunakan bg-gray-300 untuk light mode default */}
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
        <div className="hidden lg:block h-4 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>

        <div className="flex-grow"></div>

        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
        <div className="hidden sm:block h-6 bg-gray-300 dark:bg-gray-700 rounded-full w-20"></div>
        <div className="hidden md:block h-4 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-4"></div>
      </div>
    </td>
  </motion.tr>
);

export default PaymentRowSkeleton;