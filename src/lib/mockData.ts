import { faker } from '@faker-js/faker';
import { DollarSign, ShoppingBag, Wallet, ShoppingCart } from 'lucide-react';
import { Transaction, StatCardData } from './types';
import { SilageSale, MaizePurchase, OtherExpense, SoybeanPurchase, SoybeanSale, Purchase } from '../types';

export const createRandomTransaction = (): Transaction => {
  return {
    invoice: `INV-${faker.string.numeric(4)}`,
    customer: faker.person.fullName(),
    date: faker.date.recent({ days: 30 }).toLocaleDateString('en-IN'),
    amount: parseFloat(faker.finance.amount(500, 10000)),
    status: faker.helpers.arrayElement(['Paid', 'Pending', 'Overdue']),
  };
};

export const recentTransactions: Transaction[] = Array.from({ length: 8 }, createRandomTransaction);

export const dashboardStats: StatCardData[] = [
  {
    title: 'Total Revenue',
    value: '₹4,52,318.89',
    change: '+20.1% from last month',
    changeType: 'increase',
    icon: DollarSign,
  },
  {
    title: 'Total Sales',
    value: '+12,234',
    change: '+180.1% from last month',
    changeType: 'increase',
    icon: ShoppingBag,
  },
  {
    title: 'Total Purchases',
    value: '+2,350',
    change: '+19% from last month',
    changeType: 'increase',
    icon: ShoppingCart,
  },
  {
    title: 'Total Expenses',
    value: '₹89,121.34',
    change: '-2.4% from last month',
    changeType: 'decrease',
    icon: Wallet,
  },
];

export const overviewData = [
  { name: 'Jan', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Feb', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Mar', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Apr', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'May', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Jun', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Jul', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Aug', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Sep', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Oct', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Nov', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Dec', total: Math.floor(Math.random() * 5000) + 1000 },
];

export const salesByProductData = [
    { name: 'Silage', value: 400 },
    { name: 'Soybean Seed', value: 300 },
    { name: 'Maize', value: 300 },
    { name: 'Other', value: 200 },
];


// --- Mock Data for Silage Sales ---
export const createRandomSilageSale = (): SilageSale => {
  const weight = faker.number.float({ min: 50, max: 500, precision: 2 });
  const rate = faker.number.float({ min: 2, max: 5, precision: 2 });
  const totalAmount = weight * rate;
  const paymentStatus = faker.helpers.arrayElement(['PENDING', 'CASH', 'ONLINE'] as const);
  
  return {
    S_NO: faker.number.int({ min: 1, max: 10000 }),
    NAME_OF_BUYER: faker.person.fullName(),
    MOB_NO: faker.phone.number(),
    DATE_OF_PERCHASE: faker.date.recent({ days: 90 }),
    PRODUCT: 'SILAGE',
    WEIGHT_KG: weight,
    RATE: rate,
    TOTAL_AMOUNT: totalAmount,
    PAYMENT_STATUS: paymentStatus,
    PAID_AMOUNT: paymentStatus === 'PENDING' ? 0 : totalAmount,
    INVOICE_NO: faker.number.int({ min: 1000, max: 9999 }),
    ADDRESS: faker.location.streetAddress(),
  };
};

export const mockSilageSales: SilageSale[] = Array.from({ length: 15 }, createRandomSilageSale);

// --- Mock Data for Maize Purchase ---
export const createRandomMaizePurchase = (): MaizePurchase => {
  const weight = faker.number.float({ min: 100, max: 1000, precision: 2 });
  const rate = faker.number.float({ min: 1.5, max: 3, precision: 2 });
  
  return {
    S_NO: faker.number.int({ min: 1, max: 10000 }),
    NAME_OF_FARMER: faker.person.fullName(),
    DATE_OF_PURCHASE: faker.date.recent({ days: 90 }),
    ADDRESS: faker.location.streetAddress(),
    PRODUCT: 'MAIZE',
    WEIGHT_KG: weight,
    RATE_MAIZE: rate,
    TOTAL_AMOUNT: weight * rate,
    PAYMENT_STATUS: faker.helpers.arrayElement(['PAID', 'PENDING'] as const),
  };
};

export const mockMaizePurchases: MaizePurchase[] = Array.from({ length: 12 }, createRandomMaizePurchase);


// --- Mock Data for Other Expenses ---
export const createRandomOtherExpense = (): OtherExpense => {
    return {
        S_NO: faker.number.int({ min: 1, max: 10000 }),
        EXPENSE_NAME: faker.commerce.productName(),
        DATE_OF_EXPENSES: faker.date.recent({ days: 90 }),
        AMOUNT: faker.number.float({ min: 100, max: 5000, precision: 2 }),
    };
};
export const mockOtherExpenses: OtherExpense[] = Array.from({ length: 10 }, createRandomOtherExpense);


// --- Mock Data for Soybean Purchase ---
export const createRandomSoybeanPurchase = (): SoybeanPurchase => {
    const weight = faker.number.float({ min: 1, max: 10, precision: 2 });
    const rate = faker.number.int({ min: 4000, max: 6000 });
    return {
        S_NO: faker.number.int({ min: 1, max: 10000 }),
        NAME_0F_SALER: faker.person.fullName(),
        DATE_OF_PURCHASE: faker.date.recent({ days: 90 }),
        PRODUCT: 'SOYABIN',
        WEIGHT_QUINTAL: weight,
        RATE: rate,
        TOTAL_PRICE: weight * rate,
        PAYMENT_STATUS: faker.helpers.arrayElement(['PAID', 'PENDING'] as const),
    };
};
export const mockSoybeanPurchases: SoybeanPurchase[] = Array.from({ length: 8 }, createRandomSoybeanPurchase);


// --- Mock Data for Soybean Sales ---
export const createRandomSoybeanSale = (): SoybeanSale => {
    const quantity = faker.number.int({ min: 1, max: 20 });
    const rate = faker.number.int({ min: 5000, max: 7500 });
    return {
        S_NO: faker.number.int({ min: 1, max: 10000 }),
        NAME_0F_BUYER: faker.person.fullName(),
        DATE_OF_SALE: faker.date.recent({ days: 90 }),
        PRODUCT: 'SOYABIN SEED',
        QUANTITY: quantity,
        RATE: rate,
        TOTAL_PRICE: quantity * rate,
        PAYMENT_STATUS: faker.helpers.arrayElement(['PAID', 'PENDING'] as const),
    };
};
export const mockSoybeanSales: SoybeanSale[] = Array.from({ length: 18 }, createRandomSoybeanSale);


// --- Mock Data for Purchases ---
export const createRandomPurchase = (): Purchase => {
    return {
        S_NO: faker.number.int({ min: 1, max: 10000 }),
        NAME_OF_SELLER: faker.company.name(),
        MO_NO: faker.phone.number(),
        PURCHASE_DATE: faker.date.recent({ days: 90 }),
        PRODUCT: faker.commerce.productMaterial(),
        AMOUNT: faker.number.int({ min: 500, max: 25000 }),
    };
};
export const mockPurchases: Purchase[] = Array.from({ length: 14 }, createRandomPurchase);
