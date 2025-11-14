import React, { useState, useMemo, useContext } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '../components/ui/Dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '../components/ui/DropdownMenu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select';
import { PlusCircle, MoreHorizontal, Search } from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';
import { MaizePurchase } from '../types';
import { DataContext } from '../context/DataContext';
import { DateContext } from '../context/DateContext';
import MonthSelector from '../components/MonthSelector';
import YearSelector from '../components/YearSelector';

const MaizePurchasePage: React.FC = () => {
  const dataContext = useContext(DataContext);
  const dateContext = useContext(DateContext);

  if (!dataContext || !dateContext) return <div>Loading...</div>;

  const { maizePurchases, addMaizePurchase, updateMaizePurchase, deleteMaizePurchase } = dataContext;
  const { selectedYear, selectedMonth } = dateContext;

  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPurchase, setCurrentPurchase] = useState<Partial<MaizePurchase> | null>(null);

  const filteredPurchases = useMemo(() => {
    return maizePurchases.filter(p => {
        const purchaseDate = new Date(p.DATE_OF_PURCHASE);
        const isSameYear = purchaseDate.getFullYear() === selectedYear;
        const isSameMonth = selectedMonth === 12 || purchaseDate.getMonth() === selectedMonth;
        const matchesSearch = p.NAME_OF_FARMER.toLowerCase().includes(searchTerm.toLowerCase());
        return isSameYear && isSameMonth && matchesSearch;
    });
  }, [maizePurchases, searchTerm, selectedYear, selectedMonth]);

  const handleSave = () => {
    if (currentPurchase) {
      const weight = currentPurchase.WEIGHT_KG || 0;
      const rate = currentPurchase.RATE_MAIZE || 0;
      const updatedPurchase = {
        ...currentPurchase,
        TOTAL_AMOUNT: weight * rate,
        DATE_OF_PURCHASE: currentPurchase.DATE_OF_PURCHASE ? new Date(currentPurchase.DATE_OF_PURCHASE) : new Date(),
      };

      if (currentPurchase.S_NO) {
        updateMaizePurchase({ ...updatedPurchase } as MaizePurchase);
      } else {
        addMaizePurchase(updatedPurchase);
      }
      setIsDialogOpen(false);
      setCurrentPurchase(null);
    }
  };

  const handleAddNew = () => {
    setCurrentPurchase({
        DATE_OF_PURCHASE: new Date(),
        PAYMENT_STATUS: 'PENDING',
        WEIGHT_KG: 0,
        RATE_MAIZE: 0,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (purchase: MaizePurchase) => {
    setCurrentPurchase(purchase);
    setIsDialogOpen(true);
  };

  const handleDelete = (s_no: number) => {
     if (window.confirm('Are you sure you want to delete this record?')) {
        deleteMaizePurchase(s_no);
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
        <h2 className="text-3xl font-bold tracking-tight">Maize Purchase</h2>
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
          <CardTitle>All Maize Purchases</CardTitle>
          <CardDescription>Manage all maize purchases from farmers for the selected period.</CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input 
              placeholder="Search by farmer name..." 
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
                  <th scope="col" className="px-6 py-3">Farmer Name</th>
                  <th scope="col" className="px-6 py-3">Date</th>
                  <th scope="col" className="px-6 py-3">Address</th>
                  <th scope="col" className="px-6 py-3">Weight (KG)</th>
                  <th scope="col" className="px-6 py-3">Rate</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                  <th scope="col" className="px-6 py-3 text-right">Total Amount</th>
                  <th scope="col" className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPurchases.map((purchase) => (
                  <tr key={purchase.S_NO} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{purchase.S_NO}</td>
                    <td className="px-6 py-4">{purchase.NAME_OF_FARMER}</td>
                    <td className="px-6 py-4">{new Date(purchase.DATE_OF_PURCHASE).toLocaleDateString('en-IN')}</td>
                    <td className="px-6 py-4 truncate max-w-xs">{purchase.ADDRESS}</td>
                    <td className="px-6 py-4">{purchase.WEIGHT_KG.toFixed(2)}</td>
                    <td className="px-6 py-4">{formatCurrency(purchase.RATE_MAIZE)}</td>
                    <td className="px-6 py-4">
                      <span className={cn('px-2 py-1 text-xs font-medium rounded-full', {
                        'bg-green-100 text-green-800': purchase.PAYMENT_STATUS === 'PAID',
                        'bg-yellow-100 text-yellow-800': purchase.PAYMENT_STATUS === 'PENDING',
                      })}>
                        {purchase.PAYMENT_STATUS}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium">{formatCurrency(purchase.TOTAL_AMOUNT)}</td>
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
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{currentPurchase?.S_NO ? 'Edit Purchase' : 'Add New Purchase'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="NAME_OF_FARMER" className="text-right">Farmer Name</Label>
              <Input id="NAME_OF_FARMER" name="NAME_OF_FARMER" value={currentPurchase?.NAME_OF_FARMER || ''} onChange={handleFormChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="DATE_OF_PURCHASE" className="text-right">Date</Label>
              <Input id="DATE_OF_PURCHASE" name="DATE_OF_PURCHASE" type="date" value={currentPurchase?.DATE_OF_PURCHASE ? new Date(currentPurchase.DATE_OF_PURCHASE).toISOString().split('T')[0] : ''} onChange={handleFormChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ADDRESS" className="text-right">Address</Label>
              <Input id="ADDRESS" name="ADDRESS" value={currentPurchase?.ADDRESS || ''} onChange={handleFormChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="WEIGHT_KG" className="text-right">Weight (KG)</Label>
              <Input id="WEIGHT_KG" name="WEIGHT_KG" type="number" value={currentPurchase?.WEIGHT_KG || ''} onChange={handleFormChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="RATE_MAIZE" className="text-right">Rate</Label>
              <Input id="RATE_MAIZE" name="RATE_MAIZE" type="number" value={currentPurchase?.RATE_MAIZE || ''} onChange={handleFormChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="TOTAL_AMOUNT" className="text-right">Total Amount</Label>
                <Input 
                    id="TOTAL_AMOUNT" 
                    name="TOTAL_AMOUNT" 
                    value={formatCurrency((currentPurchase?.WEIGHT_KG || 0) * (currentPurchase?.RATE_MAIZE || 0))} 
                    className="col-span-3" 
                    disabled 
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="PAYMENT_STATUS" className="text-right">Status</Label>
                <Select onValueChange={(v) => setCurrentPurchase(p => ({...p, PAYMENT_STATUS: v as 'PAID' | 'PENDING'}))} value={currentPurchase?.PAYMENT_STATUS || ''}>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="PAID">Paid</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                    </SelectContent>
                </Select>
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

export default MaizePurchasePage;
