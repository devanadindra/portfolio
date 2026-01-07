import { API_BASE } from "../utils/constants";
import type { Order } from "../types/Transaction";
import type { TransactionStatus } from "../types/Transaction";

export const fetchOrders = async (
  limit: string,
  page: string
): Promise<{ data: Order[]; total: number }> => {
  try {
    const res = await fetch(
      `${API_BASE}/transaction/all?limit=${limit}&page=${page}`,
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

export const handleStatusChange = async (
  newStatus: TransactionStatus,
  TransactionId: string
): Promise<any> => {
  const updateStatus = `${API_BASE}/transaction/status`;

  const res = await fetch(updateStatus, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-Frontend": "admin",
    },
    body: JSON.stringify({
      transaction_id: TransactionId,
      status: newStatus,
    }),
  });

  return await res.json();
};
