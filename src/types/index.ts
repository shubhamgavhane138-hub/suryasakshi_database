export type PaymentStatus = 'PENDING' | 'CASH' | 'ONLINE' | 'PAID';

export interface SilageSale {
  S_NO: number;
  NAME_OF_BUYER: string;
  MOB_NO: string;
  DATE_OF_PERCHASE: Date;
  PRODUCT: 'SILAGE';
  WEIGHT_KG: number;
  RATE: number;
  TOTAL_AMOUNT: number;
  PAYMENT_STATUS: PaymentStatus;
  PAID_AMOUNT: number;
  INVOICE_NO: number;
  ADDRESS: string;
}

export interface Purchase {
  S_NO: number;
  NAME_OF_SELLER: string;
  MO_NO: string;
  PURCHASE_DATE: Date;
  PRODUCT: string;
  AMOUNT: number;
}

export interface MaizePurchase {
  S_NO: number;
  NAME_OF_FARMER: string;
  DATE_OF_PURCHASE: Date;
  ADDRESS: string;
  PRODUCT: 'MAIZE';
  WEIGHT_KG: number;
  RATE_MAIZE: number;
  TOTAL_AMOUNT: number;
  PAYMENT_STATUS: 'PAID' | 'PENDING';
}

export interface OtherExpense {
  S_NO: number;
  EXPENSE_NAME: string;
  DATE_OF_EXPENSES: Date;
  AMOUNT: number;
}

export interface User {
  user_id: number;
  username: string;
  role: 'Admin' | 'Manager' | 'EMPLOYEE';
}

export interface SoybeanPurchase {
    S_NO: number;
    NAME_0F_SALER: string;
    DATE_OF_PURCHASE: Date;
    PRODUCT: 'SOYABIN';
    WEIGHT_QUINTAL: number;
    RATE: number;
    TOTAL_PRICE: number;
    PAYMENT_STATUS: 'PAID' | 'PENDING';
}

export interface SoybeanSale {
    S_NO: number;
    NAME_0F_BUYER: string;
    DATE_OF_SALE: Date;
    PRODUCT: 'SOYABIN SEED';
    QUANTITY: number;
    RATE: number;
    TOTAL_PRICE: number;
    PAYMENT_STATUS: 'PAID' | 'PENDING';
}
