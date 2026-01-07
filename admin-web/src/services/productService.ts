// src/services/productService.ts
import type { Product } from "../types/product";
import { API_BASE } from "../utils/constants";
import type { ProductLikeReq } from "../request/productReq";
import type { AddProductReq, UpdateProductReq } from "../request/productReq";
import type { ProductRes } from "../response/ProductResponse";

export const fetchProducts = async (
  category: string,
  limit: string,
  page: string,
  keyword: string
): Promise<{ data: Product[]; total: number }> => {
  try {
    const res = await fetch(
      `${API_BASE}/product?category=${encodeURIComponent(
        category
      )}&limit=${limit}&page=${page}&keyword=${encodeURIComponent(keyword)}`,
      {
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

export const fetchDetailProducts = async (
  id: string
): Promise<{ data: ProductRes | null }> => {
  try {
    const res = await fetch(`${API_BASE}/product/detail/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Frontend": "admin",
      },
      credentials: "include",
    });

    const result = await res.json();
    return {
      data: result?.data || null,
    };
  } catch (error) {
    return { data: null };
  }
};

export const productLike = async (formData: ProductLikeReq) => {
  if (formData.Update === undefined) formData.Update = false;

  const res = await fetch(`${API_BASE}/product/like`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Frontend": "admin",
    },
    credentials: "include",
    body: JSON.stringify(formData),
  });

  return await res.json();
};

export const addProduct = async (productData: AddProductReq) => {
  const formData = new FormData();
  const cleanNumber = (value: string) => value.replace(/[.,]/g, "");

  formData.append("name", productData.name);
  formData.append("description", productData.description);
  formData.append("price", cleanNumber(productData.price));
  formData.append("capital", cleanNumber(productData.capital));
  formData.append("weight", cleanNumber(productData.weight));
  formData.append("department", productData.department);
  formData.append("category", productData.category);
  formData.append("link", productData.link);

  if (productData.images.length > 0) {
    for (const [index, img] of productData.images.entries()) {
      formData.append(
        "images",
        img.file || img,
        img.fileName || `image${index}.jpg`
      );
    }
  }

  const stockDetails = productData.sizes.map((item) => ({
    size: item.size,
    stock: Number(item.stock) || 0,
  }));

  formData.append("stock_details", JSON.stringify(stockDetails));

  const res = await fetch(`${API_BASE}/product/`, {
    method: "POST",
    headers: {
      "X-Frontend": "admin",
    },
    credentials: "include",
    body: formData,
  });

  return await res.json();
};

export const deleteProduct = async (productId: string) => {
  const res = await fetch(`${API_BASE}/product/${productId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "X-Frontend": "admin",
    },
    credentials: "include",
  });

  return await res.json();
};

export const updateProduct = async (productData: UpdateProductReq) => {
  const formData = new FormData();

  formData.append("name", productData.name);
  formData.append("description", productData.description);
  formData.append("price", productData.price);
  formData.append("capital", productData.capital);
  formData.append("link", productData.link || "");
  formData.append("weight", productData.weight);
  formData.append("department", productData.department);
  formData.append("category", productData.category);

  if (productData.images.length > 0) {
    for (const [index, img] of productData.images.entries()) {
      formData.append(
        "images",
        img.file || img,
        img.fileName || `image${index}.jpg`
      );
    }
  }

  if (productData.removedImages) {
    formData.append(
      "removed_images",
      JSON.stringify(productData.removedImages)
    );
  }

  const stockDetails = productData.sizes.map((item) => ({
    size: item.size,
    stock: Number(item.stock) || 0,
  }));

  formData.append("stock_details", JSON.stringify(stockDetails));

  const res = await fetch(
    `${API_BASE}/product/update/${productData.productId}`,
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "X-Frontend": "admin",
      },
      body: formData,
    }
  );

  return await res.json();
};
