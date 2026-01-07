export interface Growth {
  mom: number;
  qoq: number;
}

export interface DashboardAdminRes {
  totalCustomers: number;
  totalOrders: number;
  totalProducts: number;
  customerGrowth: Growth;
  productGrowth: Growth;
  orderGrowth: Growth;
  monthRevenue: number;
  todayRevenue: number;
  lastMonthRevenue: number;
  resultByCustomer: ResultByCustomer[];
  productProfit: ProductProfit[];
  MonthlyRevenue: MonthlyRevenueRes[];
}



export interface ResultByCustomer {
  userID: string;
  CustomerName: string;
  PhoneNumber: string;
  TotalAmount: float64;
  CustomerProfile: string;
  TotalOrderComleted: number;
}

export interface ProductProfit {
  ProductID: string;
  Name: string;
  TotalCapital: Float64;
  TotalRevenue: Float64;
}

export interface MonthlyRevenue {
  month: number;
  revenue: number;
}

export interface MonthlyRevenueRes {
  year: number;
  revenues: MonthlyRevenue[];
}

