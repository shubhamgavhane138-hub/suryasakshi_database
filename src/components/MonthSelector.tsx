import React, { useContext } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/Select';
import { DateContext } from '../context/DateContext';

const MonthSelector: React.FC = () => {
    const dateContext = useContext(DateContext);

    if (!dateContext) {
        throw new Error("MonthSelector must be used within a DateProvider");
    }

    const { selectedMonth, setSelectedMonth } = dateContext;

    const months = Array.from({ length: 12 }, (_, i) => {
        const date = new Date(0, i, 1);
        return {
            value: i.toString(),
            label: date.toLocaleString('default', { month: 'long' }),
        };
    });

    const handleMonthChange = (monthValue: string) => {
        setSelectedMonth(parseInt(monthValue, 10));
    };

    return (
        <Select
            value={selectedMonth.toString()}
            onValueChange={handleMonthChange}
        >
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a period" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="12">Full Year</SelectItem>
                {months.map(month => (
                    <SelectItem key={month.value} value={month.value}>
                        {month.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default MonthSelector;
