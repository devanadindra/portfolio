import { API_BASE } from "../utils/constants";
import type { PaymentDetails } from "../types/payment";

export const fetchPayments = async (
  limit: string,
  page: string
): Promise<{ data: PaymentDetails[]; total: number }> => {
  try {
    const res = await fetch(
      `${API_BASE}/payment?limit=${limit}&page=${page}`,
      {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-Frontend": "admin",
        },
      }
    );

    const result = await res.json();
    return {
      data: result?.data?.data || [],
      total: result?.data?.total || 0,
    };
  } catch (error) {
    return { data: [], total: 0 };
  }
};