// src/services/userService.ts
import type {
  UserReq,
  UpdateUserReq,
  UpdatePasswordReq,
} from "../request/userReq";
import { API_BASE } from "../utils/constants";
import type { LoginRes, DashboardRes } from "../response/userResponse";

export const registerUser = async (formData: UserReq) => {
  const res = await fetch(`${API_BASE}/user/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Frontend": "admin",
      Authorization: "Basic " + btoa(import.meta.env.VITE_BASIC_AUTH),
    },
    body: JSON.stringify(formData),
  });

  return res.json();
};

export const logoutUser = async () => {
  try {
    const response = await fetch(`${API_BASE}/user/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-Frontend": "admin",
      },
    });

    return await response.json();
  } catch (error) {
    return { data: null };
  }
};

export const loginAdmin = async (formData: {
  Username: string;
  Password: string;
  Role: string;
}): Promise<LoginRes> => {
  const res = await fetch(`${API_BASE}/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Frontend": "admin",
      Authorization: "Basic " + btoa(import.meta.env.VITE_BASIC_AUTH),
    },
    credentials: "include",
    body: JSON.stringify(formData),
  });

  return res.json();
};

export const checkJWT = async () => {
  const res = await fetch(`${API_BASE}/user/check-jwt`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-Frontend": "admin",
    },
  });

  return await res.json();
};

export const getDashboard = async (): Promise<DashboardRes> => {
  const res = await fetch(`${API_BASE}/user/get-personal`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-Frontend": "admin",
    },
  });

  return (await res.json()) as DashboardRes;
};

export const addAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append("AvatarUrl", file);

  const res = await fetch(`${API_BASE}/user/avatar`, {
    method: "POST",
    credentials: "include",
    headers: {
      "X-Frontend": "admin",
    },
    body: formData,
  });

  return res.json();
};

export const updateUser = async (formData: UpdateUserReq) => {
  const res = await fetch(`${API_BASE}/user/updateUser`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "X-Frontend": "admin",
    },
    credentials: "include",
    body: JSON.stringify(formData),
  });

  return res.json();
};

export const updatePassword = async (formData: UpdatePasswordReq) => {
  const res = await fetch(`${API_BASE}/user/password`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "X-Frontend": "admin",
    },
    credentials: "include",
    body: JSON.stringify(formData),
  });
  return res.json();
};

export const resetPasswordReq = async (FormData: {
  Data: string;
  Role: string;
}) => {
  const res = await fetch(`${API_BASE}/user/reset-req`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-Frontend": "admin",
      Authorization: "Basic " + btoa(import.meta.env.VITE_BASIC_AUTH),
    },
    body: JSON.stringify(FormData),
  });
  return res.json();
};

export const resetPasswordSubmit = async (formData: {
  Username: string;
  NewPassword: string;
  Role: string;
}) => {
  const res = await fetch(`${API_BASE}/user/reset-submit`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-Frontend": "admin",
      Authorization: "Basic " + btoa(import.meta.env.VITE_BASIC_AUTH),
    },
    body: JSON.stringify(formData),
  });
  return res.json();
};

export const register = async (formData: UserReq) => {
  const res = await fetch(`${API_BASE}/user/registerAdmin`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-Frontend": "admin",
    },
    body: JSON.stringify({
      name: formData.Name,
      username: formData.Username,
      password: formData.Password,
      phoneNumber: formData.PhoneNumber,
    }),
  });
  return res.json();
};
