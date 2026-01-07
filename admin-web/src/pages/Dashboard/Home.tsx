import { useEffect, useState } from "react";
import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import TopCustomers from "../../components/ecommerce/TopCustomers";
import { fetchDashboard } from "../../services/dashboardAdmin";
import type { DashboardAdminRes } from "../../response/DashboardAdminResponse";
import ProductProfitChart from "../../components/ecommerce/ProductProfitChart";
import MonthlyRevenue from "../../components/ecommerce/MonthlyRevenue";

export default function Home() {
  const [dashboard, setDashboard] = useState<DashboardAdminRes | null>(null);

  const loadData = async () => {
    const res = await fetchDashboard();
    setDashboard(res.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 xl:col-span-7">
          <EcommerceMetrics
            data={
              dashboard
                ? {
                    totalCustomers: dashboard.totalCustomers || 0,
                    totalProducts: dashboard.totalProducts || 0,
                    totalOrders: dashboard.totalOrders || 0,
                    customerGrowth: dashboard.customerGrowth || {
                      mom: 0,
                      qoq: 0,
                    },
                    productGrowth: dashboard.productGrowth || {
                      mom: 0,
                      qoq: 0,
                    },
                    orderGrowth: dashboard.orderGrowth || { mom: 0, qoq: 0 },
                  }
                : null
            }
          />
          <div className="col-span-12 xl:col-span-7 mt-5">
            <ProductProfitChart data={dashboard?.productProfit || []} />
          </div>
        </div>

        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget
            todayRevenue={dashboard?.todayRevenue || 0}
            monthRevenue={dashboard?.monthRevenue || 0}
            lastMonthRevenue={dashboard?.lastMonthRevenue || 0}
          />
        </div>
        <div className="col-span-12">
          <MonthlyRevenue
            data={
              dashboard?.MonthlyRevenue && dashboard.MonthlyRevenue.length > 0
                ? dashboard.MonthlyRevenue[0]
                : null
            }
          />
        </div>

        <div className="col-span-12 xl:col-span-7">
          {" "}
          <TopCustomers resultOrder={dashboard?.resultByCustomer || []} />
        </div>
      </div>
    </>
  );
}
