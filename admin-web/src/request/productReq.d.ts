export interface ProductLikeReq {
    ProductID: string
    Update?: boolean
}

export interface AddProductReq {
  name: string;
  description: string;
  price: string;
  capital: string;
  weight: string;
  department: string;
  category: string;
  link: string;
  sizes: { size: string; stock: number }[];
  images: any[];
}

export interface UpdateProductReq {
  productId: string;
  name: string;
  description: string;
  price: string;
  capital: string;
  weight: string;
  department: string;
  category: string;
  link: string;
  sizes: { size: string; stock: number }[];
  images: any[];
  removedImages: { productID: string; url: string }[];
}