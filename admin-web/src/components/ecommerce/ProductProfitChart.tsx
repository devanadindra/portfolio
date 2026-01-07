import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
// import { Dropdown } from "../ui/dropdown/Dropdown";
// import { DropdownItem } from "../ui/dropdown/DropdownItem";
// import { MoreDotIcon } from "../../icons";
import { useMemo } from "react";
import { ProductProfit } from "../../response/DashboardAdminResponse";

interface Props {
  data: ProductProfit[];
}

export default function ProductProfitChart({ data }: Props) {
  // const [isOpen, setIsOpen] = useState(false);

  // function toggleDropdown() {
  //   setIsOpen(!isOpen);
  // }

  // function closeDropdown() {
  //   setIsOpen(false);
  // }

  // 1. MEMPROSES DATA UNTUK CHART
  const chartData = useMemo(() => {
    const categories: string[] = [];
    const fullCategories: string[] = []; // Nama lengkap untuk Tooltip
    const totalCapital: number[] = [];
    const totalRevenue: number[] = [];

    data.forEach((item) => {
      // Nama pendek untuk X-axis (dipotong)
      categories.push(
        item.Name.substring(0, 15) + (item.Name.length > 15 ? "..." : "")
      );

      // Nama lengkap disimpan untuk Tooltip
      fullCategories.push(item.Name);

      totalCapital.push(item.TotalCapital);
      totalRevenue.push(item.TotalRevenue);
    });

    return { categories, fullCategories, totalCapital, totalRevenue };
  }, [data]);

  // 2. SERIES CHART
  const series = [
    {
      name: "Total Capital",
      data: chartData.totalCapital,
    },
    {
      name: "Total Revenue",
      data: chartData.totalRevenue,
    },
  ];

  // =========================================================
  // LOGIKA LEBAR CHART DINAMIS (OPSIONAL, NAMUN DISARANKAN)
  // =========================================================
  // Hitung lebar minimum berdasarkan jumlah data.
  // Misalnya, setiap bar membutuhkan 50px (termasuk padding/margin).
  const minChartWidth = Math.max(
    300, // Lebar minimum dasar
    chartData.categories.length * 50
  );
  
  // Jika jumlah data sedikit (< 6), gunakan 100% lebar (atau 300px)
  const dynamicWidth = chartData.categories.length > 6 ? minChartWidth : '100%';

  // 3. OPTIONS CHART - Perbaikan untuk Scroll Horizontal
  const options: ApexOptions = {
    colors: ["#ef4444", "#22c55e"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 350,
      // PERBAIKAN 1: Set lebar chart ke nilai statis (atau dinamis)
      width: dynamicWidth, 
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "25%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["#ef4444", "#22c55e"],
    },
    xaxis: {
      categories: chartData.categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: "#6b7280",
        },
        rotate: -45,
        trim: true,
        // Hapus hideOverlappingLabels jika ingin semua label terlihat saat scroll
        hideOverlappingLabels: false, 
      },
    },
    yaxis: {
      title: {
        text: "Amount (Rp)",
        style: {
          color: "#6b7280",
        },
      },
      labels: {
        formatter: (val: number) => `Rp ${val.toLocaleString("id-ID")}`,
        style: {
          colors: "#6b7280",
        },
      },
    },
    grid: {
      show: true,
      borderColor: "#e5e7eb",
      strokeDashArray: 4,
      position: "back",
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        left: 0,
        right: 0,
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      x: {
        show: true,
        formatter: (_val: number, opts?: any) => {
          const dataPointIndex = opts?.dataPointIndex ?? 0;
          return chartData.fullCategories[dataPointIndex];
        },
      },
      y: {
        formatter: (val: number) => `Rp ${val.toLocaleString("id-ID")}`,
        title: {
          formatter: (seriesName: string) => seriesName,
        },
      },
      style: {
        fontSize: "12px",
        fontFamily: "Outfit, sans-serif",
      },
      marker: {
        show: true,
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "right",
      fontFamily: "Outfit",
      fontSize: "14px",
      markers: {
        size: 10,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 5,
      },
    },
    // Hapus atau sesuaikan bagian responsive yang memaksakan width 100%
    responsive: [
        {
          // Contoh: di layar kecil, Anda mungkin tetap ingin chartnya lebar
          breakpoint: 768,
          options: {
            chart: {
              height: 300,
              // width: '100%', // HAPUS/OVERRIDE jika Anda ingin scroll di breakpoint ini
            },
            plotOptions: {
              bar: {
                columnWidth: "50%",
              },
            },
            xaxis: {
              labels: {
                rotate: -30,
                hideOverlappingLabels: false, // Penting: Jangan sembunyikan label
              },
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    noData: {
      text: "No product profit data available yet.",
      align: "center",
      verticalAlign: "middle",
      offsetY: 0,
      style: {
        color: "#6b7280",
        fontSize: "14px",
      },
    },
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Product Capital vs Revenue
        </h3>
        {/* ... Dropdown (Tidak Ada Perubahan) ... */}
        {/* <div className="relative inline-block">
          <button className="dropdown-toggle" onClick={toggleDropdown}>
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
          </button>
          <Dropdown
            isOpen={isOpen}
            onClose={closeDropdown}
            className="w-40 p-2"
          >
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              View More
            </DropdownItem>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Delete
            </DropdownItem>
          </Dropdown>
        </div> */}
      </div>

      {/* PERBAIKAN 2: Tambahkan overflow-x-auto pada wadah chart */}
      <div className="max-w-full overflow-x-auto">
        <div className="w-full h-[350px] md:h-[350px]"> {/* Tinggi chart di-set 350px */}
          {/* Chart sekarang akan menggunakan lebar 'dynamicWidth' */}
          <Chart options={options} series={series} type="bar" height="100%" />
        </div>
      </div>
    </div>
  );
}