import React, { useState, useMemo, useContext } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '../components/ui/Dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '../components/ui/DropdownMenu';
import { PlusCircle, MoreHorizontal, Search, ArrowLeft, Download } from 'lucide-react';
import { formatCurrency, exportToCsv } from '../lib/utils';
import { Purchase } from '../types';
import { DataContext } from '../context/DataContext';
import { DateContext } from '../context/DateContext';
import { useAuth } from '../context/AuthContext';
import MonthSelector from '../components/MonthSelector';
import YearSelector from '../components/YearSelector';
import { useNavigate } from 'react-router-dom';

const PurchasesPage: React.FC = () => {
  const dataContext = useContext(DataContext);
  const dateContext = useContext(DateContext);
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!dataContext || !dateContext || !user) return <div>Loading...</div>;

  const { isLoading, purchases, addPurchase, updatePurchase, deletePurchase } = dataContext;
  const { selectedYear, selectedMonth } = dateContext;

  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPurchase, setCurrentPurchase] = useState<Partial<Purchase> | null>(null);

  const filteredPurchases = useMemo(() => {
    return purchases.filter(p => {
        const purchaseDate = new Date(p.purchase_date);
        const isSameYear = purchaseDate.getFullYear() === selectedYear;
        const isSameMonth = selectedMonth === 12 || purchaseDate.getMonth() === selectedMonth;
        const matchesSearch = p.name_of_seller.toLowerCase().includes(searchTerm.toLowerCase()) || p.product.toLowerCase().includes(searchTerm.toLowerCase());
        return isSameYear && isSameMonth && matchesSearch;
    });
  }, [purchases, searchTerm, selectedYear, selectedMonth]);

  const handleSave = async () => {
    if (currentPurchase) {
      const updatedPurchase = {
          ...currentPurchase,
          purchase_date: currentPurchase.purchase_date ? new Date(currentPurchase.purchase_date).toISOString() : new Date().toISOString(),
      };
      try {
        if (currentPurchase.id) {
            await updatePurchase({ ...updatedPurchase } as Purchase);
        } else {
            await addPurchase(updatedPurchase);
        }
        setIsDialogOpen(false);
        setCurrentPurchase(null);
      } catch (error) {
        console.error("Failed to save purchase:", error);
      }
    }
  };

  const handleAddNew = () => {
    setCurrentPurchase({
        purchase_date: new Date().toISOString().split('T')[0],
        amount: 0,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (purchase: Purchase) => {
    setCurrentPurchase({
        ...purchase,
        purchase_date: new Date(purchase.purchase_date).toISOString().split('T')[0]
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
        try {
            await deletePurchase(id);
        } catch (error) {
            console.error("Failed to delete purchase:", error);
        }
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setCurrentPurchase(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) || 0 : value }));
  };

  const handleDownload = () => {
    const monthName = selectedMonth === 12 ? 'Full-Year' : new Date(0, selectedMonth).toLocaleString('default', { month: 'long' });
    const filename = `general-purchases-report-${monthName}-${selectedYear}.csv`;
    
    const headers = [
        { key: 'id', label: 'ID' },
        { key: 'name_of_seller', label: 'Seller Name' },
        { key: 'mo_no', label: 'Mobile No' },
        { key: 'product', label: 'Product' },
        { key: 'purchase_date', label: 'Date' },
        { key: 'amount', label: 'Amount' },
    ] as const;

    const dataToExport = filteredPurchases.map(p => ({
        ...p,
        purchase_date: new Date(p.purchase_date).toLocaleDateString('en-IN'),
    }));

    exportToCsv(filename, dataToExport, headers);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-full">Loading data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back</span>
            </Button>
            <h2 className="text-3xl font-bold tracking-tight">General Purchases</h2>
        </div>
        <div className="flex items-center gap-2">
            <YearSelector />
            <MonthSelector />
            <Button variant="outline" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" /> Download
            </Button>
            <Button onClick={handleAddNew}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Purchase
            </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All General Purchases</CardTitle>
          <CardDescription>Track all general product and supply purchases for the selected period.</CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input 
              placeholder="Search by seller or product..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">ID</th>
                  <th scope="col" className="px-6 py-3">Seller Name</th>
                  <th scope="col" className="px-6 py-3">Mobile No</th>
                  <th scope="col" className="px-6 py-3">Product</th>
                  <th scope="col" className="px-6 py-3">Date</th>
                  <th scope="col" className="px-6 py-3 text-right">Amount</th>
                  <th scope="col" className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPurchases.map((purchase) => (
                  <tr key={purchase.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{purchase.id}</td>
                    <td className="px-6 py-4">{purchase.name_of_seller}</td>
                    <td className="px-6 py-4">{purchase.mo_no}</td>
                    <td className="px-6 py-4">{purchase.product}</td>
                    <td className="px-6 py-4">{new Date(purchase.purchase_date).toLocaleDateString('en-IN')}</td>
                    <td className="px-6 py-4 text-right font-medium">{formatCurrency(purchase.amount)}</td>
                    <td className="px-6 py-4 text-center">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleEdit(purchase)}>Edit</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(purchase.id)}>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{currentPurchase?.id ? 'Edit Purchase' : 'Add New Purchase'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name_of_seller" className="text-right">Seller Name</Label>
              <Input id="name_of_seller" name="name_of_seller" value={currentPurchase?.name_of_seller || ''} onChange={handleFormChange} className="col-span-3" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="mo_no" className="text-right">Mobile No.</Label>
              <Input id="mo_no" name="mo_no" value={currentPurchase?.mo_no || ''} onChange={handleFormChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="purchase_date" className="text-right">Date</Label>
              <Input id="purchase_date" name="purchase_date" type="date" value={currentPurchase?.purchase_date || ''} onChange={handleFormChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="product" className="text-right">Product</Label>              <Input id="product" name="product" value={currentPurchase?.product || ''} onChange={handleFormChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">Amount</Label>
              <Input id="amount" name="amount" type="number" value={currentPurchase?.amount || ''} onChange={handleFormChange} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="secondary">Cancel</Button>
            </DialogClose>
            <Button type="submit" onClick={handleSave}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PurchasesPage;
