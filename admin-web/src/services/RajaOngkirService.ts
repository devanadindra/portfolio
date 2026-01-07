import { API_BASE } from "../utils/constants";
import type { RajaOngkirRes } from "../response/AddressResponse";

export const searchDestinations = async (
  keyword: string
): Promise<{ data: RajaOngkirRes[] | null }> => {
  const res = await fetch(`${API_BASE}/ongkir/destination/${keyword}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-Frontend": "admin",
    },
  });

  return res.json();
};
