export type PaymentStatus =
  | "pending"
  | "settlement"
  | "expire"
  | "cancel"
  | "deny"
  | "authorize"
  | "capture"
  | "refund";

export type Payment = {
    ID: string;
    OrderID: string;
    UserID: string;
    Name: string;
    Email: string;
    PhoneNumber: string;
    Amount: number;
    TotalWithFee: number;
    PaymentMethod: string;
    Status: PaymentStatus;
    CancelType: string | null;
    CreatedAt: string;
    UpdatedAt: string;
};

interface PaymentDetails {
    ID: string;
    transaction_id: string;
    order_id: string;
    gross_amount: number;
    payment_type: PaymentType;
    transaction_status: TransactionStatus;
    expiry_time: string;
    va_numbers?: VANumber[];
    qr_string?: string;
    qr_actions?: QRAction[];
}

interface VANumber {
    ID: string;
    PaymentID: string;
    Bank: string;
    VANumber: string;
}

interface QRAction {
    ID: string;
    PaymentID: string;
    Name: string;
    Url: string;
}