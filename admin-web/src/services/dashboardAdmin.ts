import { API_BASE } from "../utils/constants";
import type { dashboardAdminRes } from "../response/DashboardAdminResponse";

export const fetchDashboard = async (): Promise<{
  data: dashboardAdminRes | null;
}> => {
  try {
    const res = await fetch(`${API_BASE}/dashboardadmin`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-Frontend": "admin",
      },
    });

    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`);
    }

    const result = await res.json();

    return {
      data: result?.data || null,
    };
  } catch (error) {
    console.error("fetchDashboard error:", error);
    return { data: null };
  }
};
