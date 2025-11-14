import React, { useContext } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/Select';
import { DateContext } from '../context/DateContext';

const YearSelector: React.FC = () => {
    const dateContext = useContext(DateContext);

    if (!dateContext) {
        throw new Error("YearSelector must be used within a DateProvider");
    }

    const { selectedYear, setSelectedYear } = dateContext;

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i); // Current year and 4 previous years

    const handleYearChange = (yearValue: string) => {
        setSelectedYear(parseInt(yearValue, 10));
    };

    return (
        <Select
            value={selectedYear.toString()}
            onValueChange={handleYearChange}
        >
            <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select a year" />
            </SelectTrigger>
            <SelectContent>
                {years.map(year => (
                    <SelectItem key={year} value={year.toString()}>
                        {year}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default YearSelector;
