export interface Transaction {
  invoice: string;
  customer: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
}

export interface StatCardData {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: React.ElementType;
}
