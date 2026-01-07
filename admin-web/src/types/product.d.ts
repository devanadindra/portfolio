export interface Product {
  ID: string;
  Name: string;
  TotalStock: number;
  Description: string;
  Price: number;
  Weight: number;
  Department: string;
  Category: string;
  Link: string;
  LastHandleBy: string;
  CreatedAt: string;
  UpdatedAt: string;
  ProductImages: ProductImage[];
  StockDetails: StockDetail[];
  ProductCapital: ProductCapital;
}

export interface ProductImage {
  ID: string;
  ProductID: string;
  URL: string;
  CreatedAt: string;
}

export interface StockDetail {
  ID: string;
  ProductID: string;
  Size: string;
  Stock: number;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface ProductCapital {
  ID: string;
  ProductID: string;
  TotalStock: number;
  CapitalPerItem: number;
  TotalCapital: number;
  CreatedAt: string;
  UpdatedAt: string;
}
