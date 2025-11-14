import { faker } from '@faker-js/faker';
import { DollarSign, ShoppingBag, Wallet, ShoppingCart } from 'lucide-react';
import { Transaction, StatCardData } from './types';
import { SilageSale, MaizePurchase, OtherExpense, SoybeanPurchase, SoybeanSale, Purchase, ActivityLog } from '../types';

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
    id: faker.number.int({ min: 1, max: 10000 }),
    name_of_buyer: faker.person.fullName(),
    mob_no: faker.phone.number(),
    date_of_perchase: faker.date.recent({ days: 90 }).toISOString(),
    product: 'SILAGE',
    weight_kg: weight,
    rate: rate,
    total_amount: totalAmount,
    payment_status: paymentStatus,
    paid_amount: paymentStatus === 'PENDING' ? 0 : totalAmount,
    invoice_no: faker.number.int({ min: 1000, max: 9999 }),
    address: faker.location.streetAddress(),
  };
};

export const mockSilageSales: SilageSale[] = Array.from({ length: 15 }, createRandomSilageSale).sort((a,b) => new Date(b.date_of_perchase).getTime() - new Date(a.date_of_perchase).getTime());

// --- Mock Data for Maize Purchase ---
export const createRandomMaizePurchase = (): MaizePurchase => {
  const weight = faker.number.float({ min: 100, max: 1000, precision: 2 });
  const rate = faker.number.float({ min: 1.5, max: 3, precision: 2 });
  
  return {
    id: faker.number.int({ min: 1, max: 10000 }),
    name_of_farmer: faker.person.fullName(),
    date_of_purchase: faker.date.recent({ days: 90 }).toISOString(),
    address: faker.location.streetAddress(),
    product: 'MAIZE',
    weight_kg: weight,
    rate: rate,
    total_amount: weight * rate,
    payment_status: faker.helpers.arrayElement(['PAID', 'PENDING'] as const),
  };
};

export const mockMaizePurchases: MaizePurchase[] = Array.from({ length: 12 }, createRandomMaizePurchase).sort((a,b) => new Date(b.date_of_purchase).getTime() - new Date(a.date_of_purchase).getTime());


// --- Mock Data for Other Expenses ---
export const createRandomOtherExpense = (): OtherExpense => {
    return {
        id: faker.number.int({ min: 1, max: 10000 }),
        expense_name: faker.commerce.productName(),
        date_of_expenses: faker.date.recent({ days: 90 }).toISOString(),
        amount: faker.number.float({ min: 100, max: 5000, precision: 2 }),
    };
};
export const mockOtherExpenses: OtherExpense[] = Array.from({ length: 10 }, createRandomOtherExpense).sort((a,b) => new Date(b.date_of_expenses).getTime() - new Date(a.date_of_expenses).getTime());


// --- Mock Data for Soybean Purchase ---
export const createRandomSoybeanPurchase = (): SoybeanPurchase => {
    const weight = faker.number.float({ min: 1, max: 10, precision: 2 });
    const rate = faker.number.int({ min: 4000, max: 6000 });
    return {
        id: faker.number.int({ min: 1, max: 10000 }),
        name_of_seller: faker.person.fullName(),
        date_of_purchase: faker.date.recent({ days: 90 }).toISOString(),
        product: 'SOYABIN',
        weight_quintal: weight,
        rate: rate,
        total_price: weight * rate,
        payment_status: faker.helpers.arrayElement(['PAID', 'PENDING'] as const),
    };
};
export const mockSoybeanPurchases: SoybeanPurchase[] = Array.from({ length: 8 }, createRandomSoybeanPurchase).sort((a,b) => new Date(b.date_of_purchase).getTime() - new Date(a.date_of_purchase).getTime());


// --- Mock Data for Soybean Sales ---
export const createRandomSoybeanSale = (): SoybeanSale => {
    const quantity = faker.number.int({ min: 1, max: 20 });
    const rate = faker.number.int({ min: 5000, max: 7500 });
    return {
        id: faker.number.int({ min: 1, max: 10000 }),
        invoice_no: faker.number.int({ min: 1000, max: 9999 }),
        name_of_buyer: faker.person.fullName(),
        date_of_sale: faker.date.recent({ days: 90 }).toISOString(),
        product: 'SOYABIN SEED',
        quantity: quantity,
        rate: rate,
        total_price: quantity * rate,
        payment_status: faker.helpers.arrayElement(['PAID', 'PENDING'] as const),
    };
};
export const mockSoybeanSales: SoybeanSale[] = Array.from({ length: 18 }, createRandomSoybeanSale).sort((a,b) => new Date(b.date_of_sale).getTime() - new Date(a.date_of_sale).getTime());


// --- Mock Data for Purchases ---
export const createRandomPurchase = (): Purchase => {
    return {
        id: faker.number.int({ min: 1, max: 10000 }),
        name_of_seller: faker.company.name(),
        mo_no: faker.phone.number(),
        purchase_date: faker.date.recent({ days: 90 }).toISOString(),
        product: faker.commerce.productMaterial(),
        amount: faker.number.int({ min: 500, max: 25000 }),
    };
};
export const mockPurchases: Purchase[] = Array.from({ length: 14 }, createRandomPurchase).sort((a,b) => new Date(b.purchase_date).getTime() - new Date(a.purchase_date).getTime());

// --- Mock Data for Activity Log ---
export const createRandomActivity = (): ActivityLog => {
    const action = faker.helpers.arrayElement(['created', 'updated', 'deleted'] as const);
    const targetType = faker.helpers.arrayElement(['Silage Sale', 'Maize Purchase', 'Expense', 'Soybean Sale', 'Purchase']);
    return {
        id: faker.number.int(),
        user_name: faker.helpers.arrayElement(['SHUBHAM', 'ABHISHEK', 'PRASHANT', 'OM', 'RAMESHWAR']),
        action: action,
        target: `${targetType} #${faker.string.numeric(4)}`,
        created_at: faker.date.recent({ days: 7 }).toISOString(),
    };
};
export const mockActivities: ActivityLog[] = Array.from({ length: 15 }, createRandomActivity)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
