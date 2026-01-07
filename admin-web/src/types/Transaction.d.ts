import type { Product } from "./product";
import type { Payment } from "./payment";

export type TransactionStatus =
  | "pending"
  | "paid"
  | "process"
  | "delivered"
  | "cancelled"
  | "draft"
  | "completed"
  | "payment_expire"
  | "payment_failed";

export interface TransactionDetail {
  ID: string;
  OrderID: string;
  ProductID: string;
  Size: string;
  Quantity: number;
  CreatedAt: string;
  UpdatedAt: string;
  Product: Product;
}

export interface ShippingAddress {
  ID: string;
  OrderID: string;
  Name: string;
  PhoneNumber: string;
  Address: string;
  ZipCode: string;
  DestinationLabel: string;
  Courir: string;
  ShippingCost: number;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface Order {
  ID: string;
  UserID: string;
  TotalAmount: number;
  Status: TransactionStatus;
  LastHandleBy: string | null;
  CreatedAt: string;
  UpdatedAt: string;
  CancelType: string | null;
  TransactionDetails: TransactionDetail[];
  ShippingAddress: ShippingAddress;
  Payment: Payment;
}
