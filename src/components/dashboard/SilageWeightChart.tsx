import React, { useContext, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { DataContext } from '../../context/DataContext';
import { DateContext } from '../../context/DateContext';

const SilageWeightChart: React.FC = () => {
    const dataContext = useContext(DataContext);
    const dateContext = useContext(DateContext);
    if (!dataContext || !dateContext) return <div>Loading...</div>;

    const { silageSales } = dataContext;
    const { selectedYear } = dateContext;

    const chartData = useMemo(() => {
        const yearData = Array(12).fill(0).map((_, i) => ({
            name: new Date(0, i).toLocaleString('default', { month: 'short' }),
            "Weight (Tons)": 0,
        }));

        const filteredSales = silageSales.filter(sale => new Date(sale.DATE_OF_PERCHASE).getFullYear() === selectedYear);

        filteredSales.forEach(sale => {
            const month = new Date(sale.DATE_OF_PERCHASE).getMonth();
            const weightInTons = sale.WEIGHT_KG / 1000;
            yearData[month]["Weight (Tons)"] += weightInTons;
        });
        
        return yearData.map(d => ({ ...d, "Weight (Tons)": parseFloat(d["Weight (Tons)"].toFixed(2)) }));

    }, [silageSales, selectedYear]);

    return (
        <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
                <CardTitle>Silage Sales Overview ({selectedYear})</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value} T`} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                backdropFilter: 'blur(5px)',
                                border: '1px solid #e2e8f0',
                                borderRadius: '0.5rem',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                            }}
                        />
                        <Legend />
                        <Bar dataKey="Weight (Tons)" fill="#16a34a" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default SilageWeightChart;
