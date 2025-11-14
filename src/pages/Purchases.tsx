import React, { useState, useMemo, useContext } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '../components/ui/Dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '../components/ui/DropdownMenu';
import { PlusCircle, MoreHorizontal, Search } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { Purchase } from '../types';
import { DataContext } from '../context/DataContext';
import { DateContext } from '../context/DateContext';
import MonthSelector from '../components/MonthSelector';
import YearSelector from '../components/YearSelector';

const PurchasesPage: React.FC = () => {
  const dataContext = useContext(DataContext);
  const dateContext = useContext(DateContext);

  if (!dataContext || !dateContext) return <div>Loading...</div>;

  const { purchases, addPurchase, updatePurchase, deletePurchase } = dataContext;
  const { selectedYear, selectedMonth } = dateContext;

  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPurchase, setCurrentPurchase] = useState<Partial<Purchase> | null>(null);

  const filteredPurchases = useMemo(() => {
    return purchases.filter(p => {
        const purchaseDate = new Date(p.PURCHASE_DATE);
        const isSameYear = purchaseDate.getFullYear() === selectedYear;
        const isSameMonth = selectedMonth === 12 || purchaseDate.getMonth() === selectedMonth;
        const matchesSearch = p.NAME_OF_SELLER.toLowerCase().includes(searchTerm.toLowerCase()) || p.PRODUCT.toLowerCase().includes(searchTerm.toLowerCase());
        return isSameYear && isSameMonth && matchesSearch;
    });
  }, [purchases, searchTerm, selectedYear, selectedMonth]);

  const handleSave = () => {
    if (currentPurchase) {
      const updatedPurchase = {
          ...currentPurchase,
          PURCHASE_DATE: currentPurchase.PURCHASE_DATE ? new Date(currentPurchase.PURCHASE_DATE) : new Date(),
      };
      if (currentPurchase.S_NO) {
        updatePurchase({ ...updatedPurchase } as Purchase);
      } else {
        addPurchase(updatedPurchase);
      }
      setIsDialogOpen(false);
      setCurrentPurchase(null);
    }
  };

  const handleAddNew = () => {
    setCurrentPurchase({
        PURCHASE_DATE: new Date(),
        AMOUNT: 0,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (purchase: Purchase) => {
    setCurrentPurchase(purchase);
    setIsDialogOpen(true);
  };

  const handleDelete = (s_no: number) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
        deletePurchase(s_no);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    let processedValue: string | number | Date = value;
    if (type === 'number') {
        processedValue = parseFloat(value) || 0;
    } else if (type === 'date') {
        processedValue = new Date(value);
    }
    setCurrentPurchase(prev => ({ ...prev, [name]: processedValue }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">General Purchases</h2>
        <div className="flex items-center gap-2">
            <YearSelector />
            <MonthSelector />
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
                  <th scope="col" className="px-6 py-3">S.No</th>
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
                  <tr key={purchase.S_NO} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{purchase.S_NO}</td>
                    <td className="px-6 py-4">{purchase.NAME_OF_SELLER}</td>
                    <td className="px-6 py-4">{purchase.MO_NO}</td>
                    <td className="px-6 py-4">{purchase.PRODUCT}</td>
                    <td className="px-6 py-4">{new Date(purchase.PURCHASE_DATE).toLocaleDateString('en-IN')}</td>
                    <td className="px-6 py-4 text-right font-medium">{formatCurrency(purchase.AMOUNT)}</td>
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
                                <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(purchase.S_NO)}>Delete</DropdownMenuItem>
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
            <DialogTitle>{currentPurchase?.S_NO ? 'Edit Purchase' : 'Add New Purchase'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="NAME_OF_SELLER" className="text-right">Seller Name</Label>
              <Input id="NAME_OF_SELLER" name="NAME_OF_SELLER" value={currentPurchase?.NAME_OF_SELLER || ''} onChange={handleFormChange} className="col-span-3" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="MO_NO" className="text-right">Mobile No.</Label>
              <Input id="MO_NO" name="MO_NO" value={currentPurchase?.MO_NO || ''} onChange={handleFormChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="PURCHASE_DATE" className="text-right">Date</Label>
              <Input id="PURCHASE_DATE" name="PURCHASE_DATE" type="date" value={currentPurchase?.PURCHASE_DATE ? new Date(currentPurchase.PURCHASE_DATE).toISOString().split('T')[0] : ''} onChange={handleFormChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="PRODUCT" className="text-right">Product</Label>              <Input id="PRODUCT" name="PRODUCT" value={currentPurchase?.PRODUCT || ''} onChange={handleFormChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="AMOUNT" className="text-right">Amount</Label>
              <Input id="AMOUNT" name="AMOUNT" type="number" value={currentPurchase?.AMOUNT || ''} onChange={handleFormChange} className="col-span-3" />
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
