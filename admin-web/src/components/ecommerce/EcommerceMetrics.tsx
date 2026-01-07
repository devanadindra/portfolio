import { ArrowDownIcon, ArrowUpIcon } from "../../icons";
import Badge from "../ui/badge/Badge";
import { useState } from "react";
import { motion } from "framer-motion"; // Diperlukan untuk efek transisi tab

// Ikon modern dari react-icons/hi2
import { HiOutlineClipboardDocumentList, HiOutlineUsers, HiOutlineCube } from "react-icons/hi2"; 

// --- Interfaces ---

interface Growth {
  mom: number;
  qoq: number;
}

interface MetricItem {
  title: string;
  total: number;
  Icon: React.ElementType;
  growth: Growth;
}

interface EcommerceMetricsData {
  totalCustomers: number;
  totalProducts: number;
  totalOrders: number;
  customerGrowth: Growth;
  productGrowth: Growth;
  orderGrowth: Growth;
}

interface Props {
  data: EcommerceMetricsData | null;
}

// --- Helper Functions ---

const getIconStyle = (isPositive: boolean) => (
  `flex items-center justify-center w-12 h-12 rounded-xl ` +
  (isPositive 
    ? `bg-green-100 dark:bg-green-900/50` 
    : `bg-red-100 dark:bg-red-900/50`)
);

const getIconColor = (isPositive: boolean) => (
  isPositive 
    ? `text-green-600 dark:text-green-400 size-6` 
    : `text-red-600 dark:text-red-400 size-6`
);

const getGrowthData = (growth: Growth) => ({
  isPositive: growth.mom > 0,
  isNegative: growth.mom < 0,
  isZero: growth.mom === 0,
  percentage: growth.mom.toFixed(2) + '%',
});

// --- Main Component ---

export default function EcommerceMetrics({ data }: Props) {
  const safeData = data ?? {
    totalCustomers: 0,
    totalProducts: 0,
    totalOrders: 0,
    customerGrowth: { mom: 0, qoq: 0 },
    productGrowth: { mom: 0, qoq: 0 },
    orderGrowth: { mom: 0, qoq: 0 },
  };

  const metrics: MetricItem[] = [
    {
      title: "Customers",
      total: safeData.totalCustomers,
      Icon: HiOutlineUsers,
      growth: safeData.customerGrowth,
    },
    {
      title: "Products",
      total: safeData.totalProducts,
      Icon: HiOutlineCube,
      growth: safeData.productGrowth,
    },
    {
      title: "Orders",
      total: safeData.totalOrders,
      Icon: HiOutlineClipboardDocumentList,
      growth: safeData.orderGrowth,
    },
  ];

  // State untuk melacak metrik aktif (hanya digunakan di mobile)
  const [activeMetricIndex, setActiveMetricIndex] = useState(0);
  const activeMetric = metrics[activeMetricIndex];
  const { isPositive, isNegative, isZero, percentage } = getGrowthData(activeMetric.growth);
  const IconComponent = activeMetric.Icon;

  // Warna badge didasarkan pada pertumbuhan negatif atau tidak (positif/nol)
  const badgeColor = isNegative ? "error" : "success";
  // Warna ikon menggunakan or logic: hijau jika positif ATAU nol
  const iconCondition = isPositive || isZero;


  // --- JSX Output ---
  return (
    <>
      {/* ======================================================= */}
      {/* 1. Tampilan Desktop (Grid Card) - Default/sm:grid-cols-3 */}
      {/* ======================================================= */}
      <div className="hidden sm:grid grid-cols-3 gap-4 md:gap-6">
        {metrics.map((metric, index) => {
          const { isPositive, isNegative, isZero, percentage } = getGrowthData(metric.growth);
          const IconComponent = metric.Icon;
          const badgeColor = isNegative ? "error" : "success";
          const iconCondition = isPositive || isZero;

          return (
            <div 
              key={index}
              className="rounded-2xl border border-gray-200 bg-white p-5 transition duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-lg 
                         dark:border-gray-800 dark:bg-white/[0.03] dark:hover:shadow-xl dark:hover:shadow-gray-900/50 md:p-6"
            >
              
              <div className={getIconStyle(iconCondition)}>
                <IconComponent className={getIconColor(iconCondition)} />
              </div>

              <div className="flex items-end justify-between mt-5">
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {metric.title}
                  </span>
                  <h4 className="mt-2 font-extrabold text-gray-800 text-3xl dark:text-white/90">
                    {metric.total.toLocaleString()}
                  </h4>
                </div>

                <Badge color={badgeColor}>
                  {!isZero && (
                    isPositive ? (
                      <ArrowUpIcon className="size-4 mr-0.5" /> 
                    ) : (
                      <ArrowDownIcon className="size-4 mr-0.5" /> 
                    )
                  )}
                  <span className="text-xs font-semibold">{percentage}</span>
                </Badge>
              </div>
              
              <div className="mt-3 text-xs text-gray-400 dark:text-gray-600">
                  QoQ: {metric.growth.qoq.toFixed(2)}%
              </div>
            </div>
          );
        })}
      </div>

      {/* ======================================================= */}
      {/* 2. Tampilan Mobile (Tab Horizontal + Card Konten) */}
      {/* ======================================================= */}
      <div className="sm:hidden">
        
        {/* Navigasi Tabs Mobile */}
        <div className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide">
          {metrics.map((metric, index) => (
            <motion.button
              key={metric.title}
              onClick={() => setActiveMetricIndex(index)}
              className={`
                relative px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap flex-shrink-0
                transition-colors duration-300
                ${
                  index === activeMetricIndex
                    ? "text-white"
                    : "text-gray-400 hover:text-white"
                }
              `}
              whileTap={{ scale: 0.95 }}
            >
              {/* Indikator Latar Belakang Aktif */}
              {index === activeMetricIndex && (
                <motion.span
                  layoutId="metric-active-tab"
                  className="absolute inset-0 bg-indigo-600 rounded-full z-0"
                  transition={{ type: "spring", duration: 0.4 }}
                />
              )}
              
              <span className="relative z-10 flex items-center">
                <metric.Icon className="w-4 h-4 mr-2" />
                {metric.title}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Card Konten Aktif Mobile */}
        <motion.div
            key={activeMetric.title} // Kunci untuk reset animasi
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03] mt-2"
        >
          {/* Ikon */}
          <div className={getIconStyle(iconCondition)}>
            <IconComponent className={getIconColor(iconCondition)} />
          </div>

          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {activeMetric.title}
              </span>
              <h4 className="mt-2 font-extrabold text-gray-800 text-3xl dark:text-white/90">
                {activeMetric.total.toLocaleString()}
              </h4>
            </div>

            {/* Badge Pertumbuhan MoM */}
            <Badge color={badgeColor}>
              {!isZero && (
                isPositive ? (
                  <ArrowUpIcon className="size-4 mr-0.5" /> 
                ) : (
                  <ArrowDownIcon className="size-4 mr-0.5" /> 
                )
              )}
              <span className="text-xs font-semibold">{percentage}</span>
            </Badge>
          </div>
          
          {/* Indikator Pertumbuhan QOQ */}
          <div className="mt-3 text-xs text-gray-400 dark:text-gray-600">
              QoQ: {activeMetric.growth.qoq.toFixed(2)}%
          </div>
        </motion.div>
      </div>

      {/* Style untuk menghilangkan scrollbar (wajib dipertahankan) */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none; 
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}