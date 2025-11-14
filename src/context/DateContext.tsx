import React, { createContext, useState, ReactNode } from 'react';

interface DateContextType {
    selectedYear: number;
    setSelectedYear: (year: number) => void;
    selectedMonth: number; // 0-11 for months, 12 for "Full Year"
    setSelectedMonth: (month: number) => void;
}

export const DateContext = createContext<DateContextType | undefined>(undefined);

export const DateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

    return (
        <DateContext.Provider value={{ selectedYear, setSelectedYear, selectedMonth, setSelectedMonth }}>
            {children}
        </DateContext.Provider>
    );
};
