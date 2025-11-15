import React, { createContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { 
    SilageSale, MaizePurchase, OtherExpense, SoybeanPurchase, SoybeanSale, Purchase, ActivityLog,
    NewSilageSale, NewMaizePurchase, NewOtherExpense, NewSoybeanPurchase, NewSoybeanSale, NewPurchase
} from '../types';
import { useAuth } from './AuthContext';

interface DataContextType {
    isLoading: boolean;
    silageSales: SilageSale[];
    addSilageSale: (sale: Partial<NewSilageSale>, invoiceFile?: File | null) => Promise<void>;
    updateSilageSale: (sale: SilageSale, invoiceFile?: File | null) => Promise<void>;
    deleteSilageSale: (id: number) => Promise<void>;

    maizePurchases: MaizePurchase[];
    addMaizePurchase: (purchase: Partial<NewMaizePurchase>, billFile?: File | null) => Promise<void>;
    updateMaizePurchase: (purchase: MaizePurchase, billFile?: File | null) => Promise<void>;
    deleteMaizePurchase: (id: number) => Promise<void>;

    otherExpenses: OtherExpense[];
    addOtherExpense: (expense: Partial<NewOtherExpense>) => Promise<void>;
    updateOtherExpense: (expense: OtherExpense) => Promise<void>;
    deleteOtherExpense: (id: number) => Promise<void>;

    soybeanPurchases: SoybeanPurchase[];
    addSoybeanPurchase: (purchase: Partial<NewSoybeanPurchase>) => Promise<void>;
    updateSoybeanPurchase: (purchase: SoybeanPurchase) => Promise<void>;
    deleteSoybeanPurchase: (id: number) => Promise<void>;

    soybeanSales: SoybeanSale[];
    addSoybeanSale: (sale: Partial<NewSoybeanSale>) => Promise<void>;
    updateSoybeanSale: (sale: SoybeanSale) => Promise<void>;
    deleteSoybeanSale: (id: number) => Promise<void>;

    purchases: Purchase[];
    addPurchase: (purchase: Partial<NewPurchase>) => Promise<void>;
    updatePurchase: (purchase: Purchase) => Promise<void>;
    deletePurchase: (id: number) => Promise<void>;

    activities: ActivityLog[];
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { isAuthenticated, user } = useAuth();
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
            const responses = await Promise.all([
                supabase.from('silage_sales').select('*').order('date_of_perchase', { ascending: false }),
                supabase.from('maize_purchases').select('*').order('date_of_purchase', { ascending: false }),
                supabase.from('other_expenses').select('*').order('date_of_expenses', { ascending: false }),
                supabase.from('soybean_purchases').select('*').order('date_of_purchase', { ascending: false }),
                supabase.from('soybean_sales').select('*').order('date_of_sale', { ascending: false }),
                supabase.from('purchases').select('*').order('purchase_date', { ascending: false }),
                supabase.from('activities').select('*').order('created_at', { ascending: false }).limit(50),
            ]);

            const [
                silageSalesRes, maizePurchasesRes, otherExpensesRes,
                soybeanPurchasesRes, soybeanSalesRes, purchasesRes, activitiesRes
            ] = responses;

            if (silageSalesRes.data) setSilageSales(silageSalesRes.data);
            if (maizePurchasesRes.data) setMaizePurchases(maizePurchasesRes.data);
            if (otherExpensesRes.data) setOtherExpenses(otherExpensesRes.data);
            if (soybeanPurchasesRes.data) setSoybeanPurchases(soybeanPurchasesRes.data);
            if (soybeanSalesRes.data) setSoybeanSales(soybeanSalesRes.data);
            if (purchasesRes.data) setPurchases(purchasesRes.data);
            if (activitiesRes.data) setActivities(activitiesRes.data);

            responses.forEach(res => {
                if (res.error) console.error("Error fetching data:", res.error);
            });

        } catch (error) {
            console.error("A general error occurred while fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            fetchData();
        } else {
            // Clear data on logout
            setSilageSales([]);
            setMaizePurchases([]);
            setOtherExpenses([]);
            setSoybeanPurchases([]);
            setSoybeanSales([]);
            setPurchases([]);
            setActivities([]);
            setIsLoading(false);
        }
    }, [isAuthenticated, fetchData]);

    const addActivity = useCallback(async (user_name: string, action: 'created' | 'updated' | 'deleted', target: string) => {
        const { data, error } = await supabase.from('activities').insert({ user_name, action, target }).select();
        if (error) {
            console.error('Error adding activity:', error);
        } else if (data) {
            setActivities(prev => [data[0], ...prev].slice(0, 50));
        }
    }, []);

    // --- Custom CRUD for Silage Sales with File Upload ---
    const addSilageSale = async (sale: Partial<NewSilageSale>, invoiceFile?: File | null) => {
        if (!user) throw new Error("User not authenticated.");
        
        const saleToInsert: Partial<SilageSale> = { ...sale, user_id: user.id, invoice_pdf_url: null };

        if (invoiceFile) {
            const filePath = `public/${user.id}/${Date.now()}-${invoiceFile.name}`;
            const { error: uploadError } = await supabase.storage.from('invoices').upload(filePath, invoiceFile);
            if (uploadError) throw uploadError;
            
            const { data: urlData } = supabase.storage.from('invoices').getPublicUrl(filePath);
            saleToInsert.invoice_pdf_url = urlData.publicUrl;
        }

        const { data, error } = await supabase.from('silage_sales').insert(saleToInsert).select().single();
        if (error) throw error;
        if (data) {
            setSilageSales(prev => [data, ...prev]);
            await addActivity(user.email || 'Unknown User', 'created', `Silage Sale #${data.invoice_no}`);
        }
    };

    const updateSilageSale = async (sale: SilageSale, invoiceFile?: File | null) => {
        if (!user) throw new Error("User not authenticated.");
        
        const saleToUpdate = { ...sale };

        if (invoiceFile) {
            const filePath = `public/${user.id}/${sale.id}-${invoiceFile.name}`;
            const { error: uploadError } = await supabase.storage.from('invoices').upload(filePath, invoiceFile, { upsert: true });
            if (uploadError) throw uploadError;
            
            const { data: urlData } = supabase.storage.from('invoices').getPublicUrl(filePath);
            saleToUpdate.invoice_pdf_url = urlData.publicUrl;
        }

        const { data, error } = await supabase.from('silage_sales').update(saleToUpdate).eq('id', sale.id).select().single();
        if (error) throw error;
        if (data) {
            setSilageSales(prev => prev.map(i => (i.id === sale.id ? data : i)));
            await addActivity(user.email || 'Unknown User', 'updated', `Silage Sale #${data.invoice_no}`);
        }
    };

    const deleteSilageSale = async (id: number) => {
        if (!user) throw new Error("User not authenticated.");
        
        const { data: itemToDelete, error: fetchError } = await supabase.from('silage_sales').select('invoice_no, invoice_pdf_url').eq('id', id).single();
        if (fetchError || !itemToDelete) throw fetchError || new Error("Item not found");

        if (itemToDelete.invoice_pdf_url) {
            const path = new URL(itemToDelete.invoice_pdf_url).pathname.split('/invoices/').pop();
            if (path) {
                const { error: deleteFileError } = await supabase.storage.from('invoices').remove([`public/${path}`]);
                if (deleteFileError) console.error("Failed to delete invoice file:", deleteFileError);
            }
        }

        const { error } = await supabase.from('silage_sales').delete().eq('id', id);
        if (error) throw error;
        
        setSilageSales(prev => prev.filter(i => i.id !== id));
        await addActivity(user.email || 'Unknown User', 'deleted', `Silage Sale #${itemToDelete.invoice_no}`);
    };

    // --- Custom CRUD for Maize Purchases with File Upload ---
    const addMaizePurchase = async (purchase: Partial<NewMaizePurchase>, billFile?: File | null) => {
        if (!user) throw new Error("User not authenticated.");
        
        const purchaseToInsert: Partial<MaizePurchase> = { ...purchase, user_id: user.id, bill_pdf_url: null };

        if (billFile) {
            const filePath = `public/${user.id}/${Date.now()}-${billFile.name}`;
            const { error: uploadError } = await supabase.storage.from('bills').upload(filePath, billFile);
            if (uploadError) throw uploadError;
            
            const { data: urlData } = supabase.storage.from('bills').getPublicUrl(filePath);
            purchaseToInsert.bill_pdf_url = urlData.publicUrl;
        }

        const { data, error } = await supabase.from('maize_purchases').insert(purchaseToInsert).select().single();
        if (error) throw error;
        if (data) {
            setMaizePurchases(prev => [data, ...prev]);
            await addActivity(user.email || 'Unknown User', 'created', `Maize Purchase from ${data.name_of_farmer}`);
        }
    };

    const updateMaizePurchase = async (purchase: MaizePurchase, billFile?: File | null) => {
        if (!user) throw new Error("User not authenticated.");
        
        const purchaseToUpdate = { ...purchase };

        if (billFile) {
            const filePath = `public/${user.id}/${purchase.id}-${billFile.name}`;
            const { error: uploadError } = await supabase.storage.from('bills').upload(filePath, billFile, { upsert: true });
            if (uploadError) throw uploadError;
            
            const { data: urlData } = supabase.storage.from('bills').getPublicUrl(filePath);
            purchaseToUpdate.bill_pdf_url = urlData.publicUrl;
        }

        const { data, error } = await supabase.from('maize_purchases').update(purchaseToUpdate).eq('id', purchase.id).select().single();
        if (error) throw error;
        if (data) {
            setMaizePurchases(prev => prev.map(i => (i.id === purchase.id ? data : i)));
            await addActivity(user.email || 'Unknown User', 'updated', `Maize Purchase from ${data.name_of_farmer}`);
        }
    };

    const deleteMaizePurchase = async (id: number) => {
        if (!user) throw new Error("User not authenticated.");
        
        const { data: itemToDelete, error: fetchError } = await supabase.from('maize_purchases').select('name_of_farmer, bill_pdf_url').eq('id', id).single();
        if (fetchError || !itemToDelete) throw fetchError || new Error("Item not found");

        if (itemToDelete.bill_pdf_url) {
            const path = new URL(itemToDelete.bill_pdf_url).pathname.split('/bills/').pop();
            if (path) {
                const { error: deleteFileError } = await supabase.storage.from('bills').remove([`public/${path}`]);
                if (deleteFileError) console.error("Failed to delete bill file:", deleteFileError);
            }
        }

        const { error } = await supabase.from('maize_purchases').delete().eq('id', id);
        if (error) throw error;
        
        setMaizePurchases(prev => prev.filter(i => i.id !== id));
        await addActivity(user.email || 'Unknown User', 'deleted', `Maize Purchase from ${itemToDelete.name_of_farmer}`);
    };

    // --- Generic CRUD Factory for other tables ---
    const createCRUD = <T extends {id: number}, U>(
        tableName: string, 
        setter: React.Dispatch<React.SetStateAction<T[]>>,
        targetName: (item: any) => string
    ) => {
        const addItem = async (item: U) => {
            if (!user) throw new Error("User not authenticated for add operation.");
            const itemWithUser = { ...item, user_id: user.id };
            const { data, error } = await supabase.from(tableName).insert(itemWithUser).select();
            if (error) throw error;
            if (data?.[0]) {
                setter(prev => [data[0], ...prev]);
                await addActivity(user.email || 'Unknown User', 'created', targetName(data[0]));
            }
        };
        const updateItem = async (item: T) => {
            if (!user) throw new Error("User not authenticated for update operation.");
            const { data, error } = await supabase.from(tableName).update(item).eq('id', item.id).select();
            if (error) throw error;
            if (data?.[0]) {
                setter(prev => prev.map(i => i.id === item.id ? data[0] : i));
                await addActivity(user.email || 'Unknown User', 'updated', targetName(data[0]));
            }
        };
        const deleteItem = async (id: number) => {
            if (!user) throw new Error("User not authenticated for delete operation.");
            const { data: itemToDelete, error: fetchError } = await supabase.from(tableName).select('*').eq('id', id).single();
            if (fetchError || !itemToDelete) throw fetchError || new Error("Item not found");

            const { error } = await supabase.from(tableName).delete().eq('id', id);
            if (error) throw error;
            
            setter(prev => prev.filter(i => i.id !== id));
            await addActivity(user.email || 'Unknown User', 'deleted', targetName(itemToDelete));
        };
        return { addItem, updateItem, deleteItem };
    };

    const expenseCRUD = createCRUD<OtherExpense, Partial<NewOtherExpense>>('other_expenses', setOtherExpenses, item => `Expense: ${item.expense_name}`);
    const soybeanPurchaseCRUD = createCRUD<SoybeanPurchase, Partial<NewSoybeanPurchase>>('soybean_purchases', setSoybeanPurchases, item => `Soybean Purchase from ${item.name_of_seller}`);
    const soybeanSaleCRUD = createCRUD<SoybeanSale, Partial<NewSoybeanSale>>('soybean_sales', setSoybeanSales, item => `Soybean Sale #${item.invoice_no}`);
    const purchaseCRUD = createCRUD<Purchase, Partial<NewPurchase>>('purchases', setPurchases, item => `Purchase of ${item.product}`);

    const value = {
        isLoading,
        silageSales, addSilageSale, updateSilageSale, deleteSilageSale,
        maizePurchases, addMaizePurchase, updateMaizePurchase, deleteMaizePurchase,
        otherExpenses, addOtherExpense: expenseCRUD.addItem, updateOtherExpense: expenseCRUD.updateItem, deleteOtherExpense: expenseCRUD.deleteItem,
        soybeanPurchases, addSoybeanPurchase: soybeanPurchaseCRUD.addItem, updateSoybeanPurchase: soybeanPurchaseCRUD.updateItem, deleteSoybeanPurchase: soybeanPurchaseCRUD.deleteItem,
        soybeanSales, addSoybeanSale: soybeanSaleCRUD.addItem, updateSoybeanSale: soybeanSaleCRUD.updateItem, deleteSoybeanSale: soybeanSaleCRUD.deleteItem,
        purchases, addPurchase: purchaseCRUD.addItem, updatePurchase: purchaseCRUD.updateItem, deletePurchase: purchaseCRUD.deleteItem,
        activities,
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
