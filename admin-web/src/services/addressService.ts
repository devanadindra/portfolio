import { API_BASE } from "../utils/constants";
import type { addressReq } from "../request/addressReq";
import type { AddressRes } from "../response/AddressResponse";

export const addAddress = async (formData: addressReq) => {
  const res = await fetch(`${API_BASE}/address/`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-Frontend": "admin",
    },
    body: JSON.stringify(formData),
  });

  return res.json();
};

export const fetchAddress = async (): Promise<{ data: AddressRes[] }> => {
  try {
    const res = await fetch(`${API_BASE}/address/`, {
      method: "GET",

      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-Frontend": "admin",
      },
    });

    const result = await res.json();
    return {
      data: result?.data || [],
    };
  } catch (error) {
    return { data: [] };
  }
};

export const updateMainAddress = async (addressId: string) => {
  const res = await fetch(`${API_BASE}/address/${addressId}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-Frontend": "admin",
    },
  });

  return res.json();
};

export const deleteAddress = async (addressId: string) => {
  const res = await fetch(`${API_BASE}/address/${addressId}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-Frontend": "admin",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to delete: ${res.status} ${res.statusText}`);
  }

  return { errors: false };
};

export const updateAddress = async (
  addressId: string,
  formData: addressReq
) => {
  const res = await fetch(`${API_BASE}/address/${addressId}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-Frontend": "admin",
    },
    body: JSON.stringify(formData),
  });

  return res.json();
};
