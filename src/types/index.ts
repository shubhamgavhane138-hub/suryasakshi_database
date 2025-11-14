export type PaymentStatus = 'PENDING' | 'CASH' | 'ONLINE';

export interface SilageSale {
  id: number;
  name_of_buyer: string;
  mob_no: string;
  date_of_perchase: string;
  product: 'SILAGE';
  weight_kg: number;
  rate: number;
  total_amount: number;
  payment_status: PaymentStatus;
  paid_amount: number;
  invoice_no: number;
  address: string;
}

export interface Purchase {
  id: number;
  name_of_seller: string;
  mo_no: string;
  purchase_date: string;
  product: string;
  amount: number;
}

export interface MaizePurchase {
  id: number;
  name_of_farmer: string;
  date_of_purchase: string;
  address: string;
  product: 'MAIZE';
  weight_kg: number;
  rate: number;
  total_amount: number;
  payment_status: 'PAID' | 'PENDING';
}

export interface OtherExpense {
  id: number;
  expense_name: string;
  date_of_expenses: string;
  amount: number;
}

export interface SoybeanPurchase {
    id: number;
    name_of_seller: string;
    date_of_purchase: string;
    product: 'SOYABIN';
    weight_quintal: number;
    rate: number;
    total_price: number;
    payment_status: 'PAID' | 'PENDING';
}

export interface SoybeanSale {
    id: number;
    invoice_no: number;
    name_of_buyer: string;
    date_of_sale: string;
    product: 'SOYABIN SEED';
    quantity: number;
    rate: number;
    total_price: number;
    payment_status: 'PAID' | 'PENDING';
}

export interface ActivityLog {
  id: number;
  user_name: string;
  action: 'created' | 'updated' | 'deleted';
  target: string;
  created_at: string;
}

// Types for inserting new records, where id is not required
export type NewSilageSale = Omit<SilageSale, 'id'>;
export type NewPurchase = Omit<Purchase, 'id'>;
export type NewMaizePurchase = Omit<MaizePurchase, 'id'>;
export type NewOtherExpense = Omit<OtherExpense, 'id'>;
export type NewSoybeanPurchase = Omit<SoybeanPurchase, 'id'>;
export type NewSoybeanSale = Omit<SoybeanSale, 'id'>;
