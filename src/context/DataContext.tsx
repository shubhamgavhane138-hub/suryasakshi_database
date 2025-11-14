import React, { createContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { 
    SilageSale, MaizePurchase, OtherExpense, SoybeanPurchase, SoybeanSale, Purchase, ActivityLog,
    NewSilageSale, NewMaizePurchase, NewOtherExpense, NewSoybeanPurchase, NewSoybeanSale, NewPurchase
} from '../types';

interface DataContextType {
    isLoading: boolean;
    silageSales: SilageSale[];
    addSilageSale: (sale: Partial<NewSilageSale>, user: string) => Promise<void>;
    updateSilageSale: (sale: SilageSale, user: string) => Promise<void>;
    deleteSilageSale: (id: number, user: string) => Promise<void>;

    maizePurchases: MaizePurchase[];
    addMaizePurchase: (purchase: Partial<NewMaizePurchase>, user: string) => Promise<void>;
    updateMaizePurchase: (purchase: MaizePurchase, user: string) => Promise<void>;
    deleteMaizePurchase: (id: number, user: string) => Promise<void>;

    otherExpenses: OtherExpense[];
    addOtherExpense: (expense: Partial<NewOtherExpense>, user: string) => Promise<void>;
    updateOtherExpense: (expense: OtherExpense, user: string) => Promise<void>;
    deleteOtherExpense: (id: number, user: string) => Promise<void>;

    soybeanPurchases: SoybeanPurchase[];
    addSoybeanPurchase: (purchase: Partial<NewSoybeanPurchase>, user: string) => Promise<void>;
    updateSoybeanPurchase: (purchase: SoybeanPurchase, user: string) => Promise<void>;
    deleteSoybeanPurchase: (id: number, user: string) => Promise<void>;

    soybeanSales: SoybeanSale[];
    addSoybeanSale: (sale: Partial<NewSoybeanSale>, user: string) => Promise<void>;
    updateSoybeanSale: (sale: SoybeanSale, user: string) => Promise<void>;
    deleteSoybeanSale: (id: number, user: string) => Promise<void>;

    purchases: Purchase[];
    addPurchase: (purchase: Partial<NewPurchase>, user: string) => Promise<void>;
    updatePurchase: (purchase: Purchase, user: string) => Promise<void>;
    deletePurchase: (id: number, user: string) => Promise<void>;

    activities: ActivityLog[];
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [silageSales, setSilageSales] = useState<SilageSale[]>([]);
    const [maizePurchases, setMaizePurchases] = useState<MaizePurchase[]>([]);
    const [otherExpenses, setOtherExpenses] = useState<OtherExpense[]>([]);
    const [soybeanPurchases, setSoybeanPurchases] = useState<SoybeanPurchase[]>([]);
    const [soybeanSales, setSoybeanSales] = useState<SoybeanSale[]>([]);
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [activities, setActivities] = useState<ActivityLog[]>([]);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [
                silageSalesRes,
                maizePurchasesRes,
                otherExpensesRes,
                soybeanPurchasesRes,
                soybeanSalesRes,
                purchasesRes,
                activitiesRes
            ] = await Promise.all([
                supabase.from('silage_sales').select('*').order('date_of_perchase', { ascending: false }),
                supabase.from('maize_purchases').select('*').order('date_of_purchase', { ascending: false }),
                supabase.from('other_expenses').select('*').order('date_of_expenses', { ascending: false }),
                supabase.from('soybean_purchases').select('*').order('date_of_purchase', { ascending: false }),
                supabase.from('soybean_sales').select('*').order('date_of_sale', { ascending: false }),
                supabase.from('purchases').select('*').order('purchase_date', { ascending: false }),
                supabase.from('activity_log').select('*').order('created_at', { ascending: false }).limit(50)
            ]);

            if (silageSalesRes.error) throw silageSalesRes.error;
            setSilageSales(silageSalesRes.data || []);

            if (maizePurchasesRes.error) throw maizePurchasesRes.error;
            setMaizePurchases(maizePurchasesRes.data || []);

            if (otherExpensesRes.error) throw otherExpensesRes.error;
            setOtherExpenses(otherExpensesRes.data || []);
            
            if (soybeanPurchasesRes.error) throw soybeanPurchasesRes.error;
            setSoybeanPurchases(soybeanPurchasesRes.data || []);

            if (soybeanSalesRes.error) throw soybeanSalesRes.error;
            setSoybeanSales(soybeanSalesRes.data || []);

            if (purchasesRes.error) throw purchasesRes.error;
            setPurchases(purchasesRes.data || []);

            if (activitiesRes.error) throw activitiesRes.error;
            setActivities(activitiesRes.data || []);

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const addActivity = async (user_name: string, action: 'created' | 'updated' | 'deleted', target: string) => {
        const { data, error } = await supabase.from('activity_log').insert([{ user_name, action, target }]).select();
        if (error) {
            console.error("Error adding activity:", error);
        } else if (data) {
            setActivities(prev => [data[0], ...prev].slice(0, 50));
        }
    };
    
    // Silage Sales
    const addSilageSale = async (sale: Partial<NewSilageSale>, user: string) => {
        const { data, error } = await supabase.from('silage_sales').insert([sale]).select();
        if (error) throw error;
        if (data) {
            setSilageSales(prev => [data[0], ...prev]);
            await addActivity(user, 'created', `Silage Sale #${data[0].invoice_no}`);
        }
    };
    const updateSilageSale = async (updatedSale: SilageSale, user: string) => {
        const { id, ...rest } = updatedSale;
        const { data, error } = await supabase.from('silage_sales').update(rest).eq('id', id).select();
        if (error) throw error;
        if (data) {
            setSilageSales(prev => prev.map(s => s.id === id ? data[0] : s));
            await addActivity(user, 'updated', `Silage Sale #${data[0].invoice_no}`);
        }
    };
    const deleteSilageSale = async (id: number, user: string) => {
        const saleToDelete = silageSales.find(s => s.id === id);
        if (!saleToDelete) return;
        const { error } = await supabase.from('silage_sales').delete().eq('id', id);
        if (error) throw error;
        setSilageSales(prev => prev.filter(s => s.id !== id));
        await addActivity(user, 'deleted', `Silage Sale #${saleToDelete.invoice_no}`);
    };

    // Maize Purchases
    const addMaizePurchase = async (purchase: Partial<NewMaizePurchase>, user: string) => {
        const { data, error } = await supabase.from('maize_purchases').insert([purchase]).select();
        if (error) throw error;
        if (data) {
            setMaizePurchases(prev => [data[0], ...prev]);
            await addActivity(user, 'created', `Maize Purchase from ${data[0].name_of_farmer}`);
        }
    };
    const updateMaizePurchase = async (updatedPurchase: MaizePurchase, user: string) => {
        const { id, ...rest } = updatedPurchase;
        const { data, error } = await supabase.from('maize_purchases').update(rest).eq('id', id).select();
        if (error) throw error;
        if (data) {
            setMaizePurchases(prev => prev.map(p => p.id === id ? data[0] : p));
            await addActivity(user, 'updated', `Maize Purchase from ${data[0].name_of_farmer}`);
        }
    };
    const deleteMaizePurchase = async (id: number, user: string) => {
        const itemToDelete = maizePurchases.find(p => p.id === id);
        if (!itemToDelete) return;
        const { error } = await supabase.from('maize_purchases').delete().eq('id', id);
        if (error) throw error;
        setMaizePurchases(prev => prev.filter(p => p.id !== id));
        await addActivity(user, 'deleted', `Maize Purchase from ${itemToDelete.name_of_farmer}`);
    };

    // Other Expenses
    const addOtherExpense = async (expense: Partial<NewOtherExpense>, user: string) => {
        const { data, error } = await supabase.from('other_expenses').insert([expense]).select();
        if (error) throw error;
        if (data) {
            setOtherExpenses(prev => [data[0], ...prev]);
            await addActivity(user, 'created', `Expense: ${data[0].expense_name}`);
        }
    };
    const updateOtherExpense = async (updatedExpense: OtherExpense, user: string) => {
        const { id, ...rest } = updatedExpense;
        const { data, error } = await supabase.from('other_expenses').update(rest).eq('id', id).select();
        if (error) throw error;
        if (data) {
            setOtherExpenses(prev => prev.map(e => e.id === id ? data[0] : e));
            await addActivity(user, 'updated', `Expense: ${data[0].expense_name}`);
        }
    };
    const deleteOtherExpense = async (id: number, user: string) => {
        const itemToDelete = otherExpenses.find(e => e.id === id);
        if (!itemToDelete) return;
        const { error } = await supabase.from('other_expenses').delete().eq('id', id);
        if (error) throw error;
        setOtherExpenses(prev => prev.filter(e => e.id !== id));
        await addActivity(user, 'deleted', `Expense: ${itemToDelete.expense_name}`);
    };

    // Soybean Purchases
    const addSoybeanPurchase = async (purchase: Partial<NewSoybeanPurchase>, user: string) => {
        const { data, error } = await supabase.from('soybean_purchases').insert([purchase]).select();
        if (error) throw error;
        if (data) {
            setSoybeanPurchases(prev => [data[0], ...prev]);
            await addActivity(user, 'created', `Soybean Purchase from ${data[0].name_of_seller}`);
        }
    };
    const updateSoybeanPurchase = async (updatedPurchase: SoybeanPurchase, user: string) => {
        const { id, ...rest } = updatedPurchase;
        const { data, error } = await supabase.from('soybean_purchases').update(rest).eq('id', id).select();
        if (error) throw error;
        if (data) {
            setSoybeanPurchases(prev => prev.map(p => p.id === id ? data[0] : p));
            await addActivity(user, 'updated', `Soybean Purchase from ${data[0].name_of_seller}`);
        }
    };
    const deleteSoybeanPurchase = async (id: number, user: string) => {
        const itemToDelete = soybeanPurchases.find(p => p.id === id);
        if (!itemToDelete) return;
        const { error } = await supabase.from('soybean_purchases').delete().eq('id', id);
        if (error) throw error;
        setSoybeanPurchases(prev => prev.filter(p => p.id !== id));
        await addActivity(user, 'deleted', `Soybean Purchase from ${itemToDelete.name_of_seller}`);
    };

    // Soybean Sales
    const addSoybeanSale = async (sale: Partial<NewSoybeanSale>, user: string) => {
        const { data, error } = await supabase.from('soybean_sales').insert([sale]).select();
        if (error) throw error;
        if (data) {
            setSoybeanSales(prev => [data[0], ...prev]);
            await addActivity(user, 'created', `Soybean Sale #${data[0].invoice_no}`);
        }
    };
    const updateSoybeanSale = async (updatedSale: SoybeanSale, user: string) => {
        const { id, ...rest } = updatedSale;
        const { data, error } = await supabase.from('soybean_sales').update(rest).eq('id', id).select();
        if (error) throw error;
        if (data) {
            setSoybeanSales(prev => prev.map(s => s.id === id ? data[0] : s));
            await addActivity(user, 'updated', `Soybean Sale #${data[0].invoice_no}`);
        }
    };
    const deleteSoybeanSale = async (id: number, user: string) => {
        const itemToDelete = soybeanSales.find(s => s.id === id);
        if (!itemToDelete) return;
        const { error } = await supabase.from('soybean_sales').delete().eq('id', id);
        if (error) throw error;
        setSoybeanSales(prev => prev.filter(s => s.id !== id));
        await addActivity(user, 'deleted', `Soybean Sale #${itemToDelete.invoice_no}`);
    };

    // General Purchases
    const addPurchase = async (purchase: Partial<NewPurchase>, user: string) => {
        const { data, error } = await supabase.from('purchases').insert([purchase]).select();
        if (error) throw error;
        if (data) {
            setPurchases(prev => [data[0], ...prev]);
            await addActivity(user, 'created', `Purchase of ${data[0].product}`);
        }
    };
    const updatePurchase = async (updatedPurchase: Purchase, user: string) => {
        const { id, ...rest } = updatedPurchase;
        const { data, error } = await supabase.from('purchases').update(rest).eq('id', id).select();
        if (error) throw error;
        if (data) {
            setPurchases(prev => prev.map(p => p.id === id ? data[0] : p));
            await addActivity(user, 'updated', `Purchase of ${data[0].product}`);
        }
    };
    const deletePurchase = async (id: number, user: string) => {
        const itemToDelete = purchases.find(p => p.id === id);
        if (!itemToDelete) return;
        const { error } = await supabase.from('purchases').delete().eq('id', id);
        if (error) throw error;
        setPurchases(prev => prev.filter(p => p.id !== id));
        await addActivity(user, 'deleted', `Purchase of ${itemToDelete.product}`);
    };

    const value = {
        isLoading,
        silageSales, addSilageSale, updateSilageSale, deleteSilageSale,
        maizePurchases, addMaizePurchase, updateMaizePurchase, deleteMaizePurchase,
        otherExpenses, addOtherExpense, updateOtherExpense, deleteOtherExpense,
        soybeanPurchases, addSoybeanPurchase, updateSoybeanPurchase, deleteSoybeanPurchase,
        soybeanSales, addSoybeanSale, updateSoybeanSale, deleteSoybeanSale,
        purchases, addPurchase, updatePurchase, deletePurchase,
        activities,
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
