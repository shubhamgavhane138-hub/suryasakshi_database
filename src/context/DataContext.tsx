import React, { createContext, useState, ReactNode } from 'react';
import { 
    mockSilageSales, createRandomSilageSale,
    mockMaizePurchases, createRandomMaizePurchase,
    mockOtherExpenses, createRandomOtherExpense,
    mockSoybeanPurchases, createRandomSoybeanPurchase,
    mockSoybeanSales, createRandomSoybeanSale,
    mockPurchases, createRandomPurchase
} from '../lib/mockData';
import { SilageSale, MaizePurchase, OtherExpense, SoybeanPurchase, SoybeanSale, Purchase } from '../types';

interface DataContextType {
    silageSales: SilageSale[];
    addSilageSale: (sale: Partial<SilageSale>) => void;
    updateSilageSale: (sale: SilageSale) => void;
    deleteSilageSale: (id: number) => void;

    maizePurchases: MaizePurchase[];
    addMaizePurchase: (purchase: Partial<MaizePurchase>) => void;
    updateMaizePurchase: (purchase: MaizePurchase) => void;
    deleteMaizePurchase: (id: number) => void;

    otherExpenses: OtherExpense[];
    addOtherExpense: (expense: Partial<OtherExpense>) => void;
    updateOtherExpense: (expense: OtherExpense) => void;
    deleteOtherExpense: (id: number) => void;

    soybeanPurchases: SoybeanPurchase[];
    addSoybeanPurchase: (purchase: Partial<SoybeanPurchase>) => void;
    updateSoybeanPurchase: (purchase: SoybeanPurchase) => void;
    deleteSoybeanPurchase: (id: number) => void;

    soybeanSales: SoybeanSale[];
    addSoybeanSale: (sale: Partial<SoybeanSale>) => void;
    updateSoybeanSale: (sale: SoybeanSale) => void;
    deleteSoybeanSale: (id: number) => void;

    purchases: Purchase[];
    addPurchase: (purchase: Partial<Purchase>) => void;
    updatePurchase: (purchase: Purchase) => void;
    deletePurchase: (id: number) => void;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [silageSales, setSilageSales] = useState<SilageSale[]>(mockSilageSales);
    const [maizePurchases, setMaizePurchases] = useState<MaizePurchase[]>(mockMaizePurchases);
    const [otherExpenses, setOtherExpenses] = useState<OtherExpense[]>(mockOtherExpenses);
    const [soybeanPurchases, setSoybeanPurchases] = useState<SoybeanPurchase[]>(mockSoybeanPurchases);
    const [soybeanSales, setSoybeanSales] = useState<SoybeanSale[]>(mockSoybeanSales);
    const [purchases, setPurchases] = useState<Purchase[]>(mockPurchases);

    // Silage Sales CRUD
    const addSilageSale = (sale: Partial<SilageSale>) => {
        const newSale = { ...createRandomSilageSale(), ...sale, S_NO: Date.now() } as SilageSale;
        setSilageSales(prev => [newSale, ...prev]);
    };
    const updateSilageSale = (updatedSale: SilageSale) => {
        setSilageSales(prev => prev.map(s => s.S_NO === updatedSale.S_NO ? updatedSale : s));
    };
    const deleteSilageSale = (id: number) => {
        setSilageSales(prev => prev.filter(s => s.S_NO !== id));
    };

    // Maize Purchases CRUD
    const addMaizePurchase = (purchase: Partial<MaizePurchase>) => {
        const newPurchase = { ...createRandomMaizePurchase(), ...purchase, S_NO: Date.now() } as MaizePurchase;
        setMaizePurchases(prev => [newPurchase, ...prev]);
    };
    const updateMaizePurchase = (updatedPurchase: MaizePurchase) => {
        setMaizePurchases(prev => prev.map(p => p.S_NO === updatedPurchase.S_NO ? updatedPurchase : p));
    };
    const deleteMaizePurchase = (id: number) => {
        setMaizePurchases(prev => prev.filter(p => p.S_NO !== id));
    };

    // Other Expenses CRUD
    const addOtherExpense = (expense: Partial<OtherExpense>) => {
        const newExpense = { ...createRandomOtherExpense(), ...expense, S_NO: Date.now() } as OtherExpense;
        setOtherExpenses(prev => [newExpense, ...prev]);
    };
    const updateOtherExpense = (updatedExpense: OtherExpense) => {
        setOtherExpenses(prev => prev.map(e => e.S_NO === updatedExpense.S_NO ? updatedExpense : e));
    };
    const deleteOtherExpense = (id: number) => {
        setOtherExpenses(prev => prev.filter(e => e.S_NO !== id));
    };

    // Soybean Purchases CRUD
    const addSoybeanPurchase = (purchase: Partial<SoybeanPurchase>) => {
        const newPurchase = { ...createRandomSoybeanPurchase(), ...purchase, S_NO: Date.now() } as SoybeanPurchase;
        setSoybeanPurchases(prev => [newPurchase, ...prev]);
    };
    const updateSoybeanPurchase = (updatedPurchase: SoybeanPurchase) => {
        setSoybeanPurchases(prev => prev.map(p => p.S_NO === updatedPurchase.S_NO ? updatedPurchase : p));
    };
    const deleteSoybeanPurchase = (id: number) => {
        setSoybeanPurchases(prev => prev.filter(p => p.S_NO !== id));
    };

    // Soybean Sales CRUD
    const addSoybeanSale = (sale: Partial<SoybeanSale>) => {
        const newSale = { ...createRandomSoybeanSale(), ...sale, S_NO: Date.now() } as SoybeanSale;
        setSoybeanSales(prev => [newSale, ...prev]);
    };
    const updateSoybeanSale = (updatedSale: SoybeanSale) => {
        setSoybeanSales(prev => prev.map(s => s.S_NO === updatedSale.S_NO ? updatedSale : s));
    };
    const deleteSoybeanSale = (id: number) => {
        setSoybeanSales(prev => prev.filter(s => s.S_NO !== id));
    };

    // General Purchases CRUD
    const addPurchase = (purchase: Partial<Purchase>) => {
        const newPurchase = { ...createRandomPurchase(), ...purchase, S_NO: Date.now() } as Purchase;
        setPurchases(prev => [newPurchase, ...prev]);
    };
    const updatePurchase = (updatedPurchase: Purchase) => {
        setPurchases(prev => prev.map(p => p.S_NO === updatedPurchase.S_NO ? updatedPurchase : p));
    };
    const deletePurchase = (id: number) => {
        setPurchases(prev => prev.filter(p => p.S_NO !== id));
    };

    const value = {
        silageSales, addSilageSale, updateSilageSale, deleteSilageSale,
        maizePurchases, addMaizePurchase, updateMaizePurchase, deleteMaizePurchase,
        otherExpenses, addOtherExpense, updateOtherExpense, deleteOtherExpense,
        soybeanPurchases, addSoybeanPurchase, updateSoybeanPurchase, deleteSoybeanPurchase,
        soybeanSales, addSoybeanSale, updateSoybeanSale, deleteSoybeanSale,
        purchases, addPurchase, updatePurchase, deletePurchase,
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
