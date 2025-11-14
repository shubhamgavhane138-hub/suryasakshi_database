import React, { useContext, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { DataContext } from '../../context/DataContext';
import { DateContext } from '../../context/DateContext';

const COLORS = ['#16a34a', '#f97316'];
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent === 0) return null;

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize="12px" fontWeight="bold">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const SalesPieChart: React.FC = () => {
    const dataContext = useContext(DataContext);
    const dateContext = useContext(DateContext);

    if (!dataContext || !dateContext) return <div>Loading...</div>;

    const { silageSales, soybeanSales } = dataContext;
    const { selectedYear, selectedMonth } = dateContext;

    const pieData = useMemo(() => {
        const isYearlyView = selectedMonth === 12;

        const filterSales = (sales: any[], dateKey: string) => {
            return sales.filter(s => {
                const saleDate = new Date(s[dateKey]);
                const isSameYear = saleDate.getFullYear() === selectedYear;
                const isSameMonth = isYearlyView || saleDate.getMonth() === selectedMonth;
                return isSameYear && isSameMonth;
            });
        };

        const silageTotal = filterSales(silageSales, 'date_of_perchase').reduce((sum, s) => sum + s.total_amount, 0);
        const soybeanTotal = filterSales(soybeanSales, 'date_of_sale').reduce((sum, s) => sum + s.total_price, 0);

        return [
            { name: 'Silage Sales', value: silageTotal },
            { name: 'Soybean Sales', value: soybeanTotal },
        ].filter(item => item.value > 0);

    }, [silageSales, soybeanSales, selectedYear, selectedMonth]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Sales by Product</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                    {pieData.length > 0 ? (
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderCustomizedLabel}
                                outerRadius={120}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value)}
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                    backdropFilter: 'blur(5px)',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '0.5rem',
                                }}
                            />
                            <Legend />
                        </PieChart>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            No sales data for this period.
                        </div>
                    )}
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default SalesPieChart;
