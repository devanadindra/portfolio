export interface LoginRes {
  data: {
    token: string;
    total_cart: number;
  };
  message?: string;
  errors?: any;
}

export interface DashboardRes {
  data: DashboardUser;
  errors: string | null;
}
