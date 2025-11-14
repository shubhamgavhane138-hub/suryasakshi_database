import React, { useContext, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { cn, formatCurrency } from '../lib/utils';
import { ArrowUp, ArrowDown, Leaf, Wheat, Wallet } from 'lucide-react';
import { DataContext } from '../context/DataContext';
import { DateContext } from '../context/DateContext';

const DashboardStats: React.FC = () => {
  const dataContext = useContext(DataContext);
  const dateContext = useContext(DateContext);

  if (!dataContext || !dateContext) {
    return <div>Loading...</div>;
  }

  const { silageSales, maizePurchases, otherExpenses } = dataContext;
  const { selectedYear, selectedMonth } = dateContext;

  const stats = useMemo(() => {
    const isYearlyView = selectedMonth === 12;

    const calculateTotals = (month: number | null, year: number) => {
        const filterByDate = (items: any[], dateKey: string) => {
            return items.filter(item => {
                const itemDate = new Date(item[dateKey]);
                const isSameYear = itemDate.getFullYear() === year;
                const isSameMonth = month === null || itemDate.getMonth() === month;
                return isSameYear && isSameMonth;
            });
        };

        const currentSilageSales = filterByDate(silageSales, 'date_of_perchase');
        const totalSilageWeight = currentSilageSales.reduce((sum, s) => sum + s.weight_kg, 0);
        const totalSilageAmount = currentSilageSales.reduce((sum, s) => sum + s.total_amount, 0);

        const currentMaizePurchases = filterByDate(maizePurchases, 'date_of_purchase');
        const totalMaizeWeight = currentMaizePurchases.reduce((sum, p) => sum + p.weight_kg, 0);
        const totalMaizeAmount = currentMaizePurchases.reduce((sum, p) => sum + p.total_amount, 0);
        
        const currentOtherExpenses = filterByDate(otherExpenses, 'date_of_expenses');
        const totalExpensesAmount = currentOtherExpenses.reduce((sum, e) => sum + e.amount, 0);

        return { totalSilageWeight, totalSilageAmount, totalMaizeWeight, totalMaizeAmount, totalExpensesAmount };
    };

    const currentTotals = calculateTotals(isYearlyView ? null : selectedMonth, selectedYear);
    
    let prevTotals;
    if (isYearlyView) {
        prevTotals = calculateTotals(null, selectedYear - 1);
    } else {
        const prevMonthDate = new Date(selectedYear, selectedMonth - 1, 1);
        prevTotals = calculateTotals(prevMonthDate.getMonth(), prevMonthDate.getFullYear());
    }

    const getChange = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        if (current === 0 && previous > 0) return -100;
        return ((current - previous) / previous) * 100;
    };

    return [
      { title: 'Silage Sales', amount: formatCurrency(currentTotals.totalSilageAmount), secondaryValue: `${currentTotals.totalSilageWeight.toFixed(2)} kg`, change: getChange(currentTotals.totalSilageAmount, prevTotals.totalSilageAmount), icon: Leaf },
      { title: 'Maize Purchase', amount: formatCurrency(currentTotals.totalMaizeAmount), secondaryValue: `${currentTotals.totalMaizeWeight.toFixed(2)} kg`, change: getChange(currentTotals.totalMaizeAmount, prevTotals.totalMaizeAmount), icon: Wheat },
      { title: 'Other Expenses', amount: formatCurrency(currentTotals.totalExpensesAmount), secondaryValue: null, change: getChange(currentTotals.totalExpensesAmount, prevTotals.totalExpensesAmount), icon: Wallet },
    ];
  }, [selectedYear, selectedMonth, silageSales, maizePurchases, otherExpenses]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => {
        const changeType = stat.change >= 0 ? 'increase' : 'decrease';
        const comparisonText = selectedMonth === 12 ? 'from last year' : 'from last month';
        
        const isPurchaseOrExpense = ['Maize Purchase', 'Other Expenses'].includes(stat.title);
        // For purchases/expenses, an increase is "bad" (red), a decrease is "good" (green)
        const finalChangeType = isPurchaseOrExpense ? (changeType === 'increase' ? 'decrease' : 'increase') : changeType;

        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.amount}</div>
              {stat.secondaryValue && <p className="text-xs text-gray-500">{stat.secondaryValue}</p>}
              <p className="text-xs text-gray-500 flex items-center mt-1">
                <span className={cn('flex items-center', finalChangeType === 'increase' ? 'text-green-600' : 'text-red-600')}>
                  {changeType === 'increase' ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                  {`${Math.abs(stat.change).toFixed(1)}%`} {comparisonText}
                </span>
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardStats;
