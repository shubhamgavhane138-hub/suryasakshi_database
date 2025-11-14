import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card';
import { recentTransactions } from '../lib/mockData';
import { cn, formatCurrency } from '../lib/utils';

const RecentTransactions: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>You made {recentTransactions.length} transactions this month.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Invoice</th>
                <th scope="col" className="px-6 py-3">Customer</th>
                <th scope="col" className="px-6 py-3">Date</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((transaction) => (
                <tr key={transaction.invoice} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{transaction.invoice}</td>
                  <td className="px-6 py-4">{transaction.customer}</td>
                  <td className="px-6 py-4">{transaction.date}</td>
                  <td className="px-6 py-4">
                    <span className={cn('px-2 py-1 text-xs font-medium rounded-full', {
                      'bg-green-100 text-green-800': transaction.status === 'Paid',
                      'bg-yellow-100 text-yellow-800': transaction.status === 'Pending',
                      'bg-red-100 text-red-800': transaction.status === 'Overdue',
                    })}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium">{formatCurrency(transaction.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
