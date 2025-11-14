import React, { useState, useMemo, useContext } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '../components/ui/Dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '../components/ui/DropdownMenu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select';
import { PlusCircle, MoreHorizontal, Search, Download } from 'lucide-react';
import { formatCurrency, cn, exportToCsv } from '../lib/utils';
import { SoybeanPurchase } from '../types';
import { DataContext } from '../context/DataContext';
import { DateContext } from '../context/DateContext';
import { useAuth } from '../context/AuthContext';
import MonthSelector from '../components/MonthSelector';
import YearSelector from '../components/YearSelector';

const SoybeanPurchasePage: React.FC = () => {
  const dataContext = useContext(DataContext);
  const dateContext = useContext(DateContext);
  const { user } = useAuth();

  if (!dataContext || !dateContext || !user) return <div>Loading...</div>;

  const { isLoading, soybeanPurchases, addSoybeanPurchase, updateSoybeanPurchase, deleteSoybeanPurchase } = dataContext;
  const { selectedYear, selectedMonth } = dateContext;

  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPurchase, setCurrentPurchase] = useState<Partial<SoybeanPurchase> | null>(null);

  const filteredPurchases = useMemo(() => {
    return soybeanPurchases.filter(p => {
        const purchaseDate = new Date(p.date_of_purchase);
        const isSameYear = purchaseDate.getFullYear() === selectedYear;
        const isSameMonth = selectedMonth === 12 || purchaseDate.getMonth() === selectedMonth;
        const matchesSearch = p.name_of_seller.toLowerCase().includes(searchTerm.toLowerCase());
        return isSameYear && isSameMonth && matchesSearch;
    });
  }, [soybeanPurchases, searchTerm, selectedYear, selectedMonth]);

  const handleSave = async () => {
    if (currentPurchase) {
        const weight = currentPurchase.weight_quintal || 0;
        const rate = currentPurchase.rate || 0;
        const updatedPurchase = {
            ...currentPurchase,
            total_price: weight * rate,
            date_of_purchase: currentPurchase.date_of_purchase ? new Date(currentPurchase.date_of_purchase).toISOString() : new Date().toISOString(),
        };
      try {
        if (currentPurchase.id) {
            await updateSoybeanPurchase({ ...updatedPurchase } as SoybeanPurchase);
        } else {
            await addSoybeanPurchase(updatedPurchase);
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
        date_of_purchase: new Date().toISOString().split('T')[0],
        payment_status: 'PENDING',
        weight_quintal: 0,
        rate: 0,
        product: 'SOYABIN',
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (purchase: SoybeanPurchase) => {
    setCurrentPurchase({
        ...purchase,
        date_of_purchase: new Date(purchase.date_of_purchase).toISOString().split('T')[0]
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
        try {
            await deleteSoybeanPurchase(id);
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
    const filename = `soybean-purchase-report-${monthName}-${selectedYear}.csv`;
    
    const headers = [
        { key: 'id', label: 'ID' },
        { key: 'name_of_seller', label: 'Seller Name' },
        { key: 'date_of_purchase', label: 'Date' },
        { key: 'weight_quintal', label: 'Weight (Quintal)' },
        { key: 'rate', label: 'Rate' },
        { key: 'total_price', label: 'Total Price' },
        { key: 'payment_status', label: 'Payment Status' },
    ] as const;

    const dataToExport = filteredPurchases.map(p => ({
        ...p,
        date_of_purchase: new Date(p.date_of_purchase).toLocaleDateString('en-IN'),
    }));

    exportToCsv(filename, dataToExport, headers);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-full">Loading data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Soybean Purchase</h2>
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
          <CardTitle>All Soybean Purchases</CardTitle>
          <CardDescription>Manage all raw soybean purchases for the selected period.</CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input 
              placeholder="Search by seller name..." 
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
                  <th scope="col" className="px-6 py-3">Date</th>
                  <th scope="col" className="px-6 py-3">Weight (Quintal)</th>
                  <th scope="col" className="px-6 py-3">Rate</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                  <th scope="col" className="px-6 py-3 text-right">Total Price</th>
                  <th scope="col" className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPurchases.map((purchase) => (
                  <tr key={purchase.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{purchase.id}</td>
                    <td className="px-6 py-4">{purchase.name_of_seller}</td>
                    <td className="px-6 py-4">{new Date(purchase.date_of_purchase).toLocaleDateString('en-IN')}</td>
                    <td className="px-6 py-4">{purchase.weight_quintal.toFixed(2)}</td>
                    <td className="px-6 py-4">{formatCurrency(purchase.rate)}</td>
                    <td className="px-6 py-4">
                      <span className={cn('px-2 py-1 text-xs font-medium rounded-full', {
                        'bg-green-100 text-green-800': purchase.payment_status === 'PAID',
                        'bg-yellow-100 text-yellow-800': purchase.payment_status === 'PENDING',
                      })}>
                        {purchase.payment_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium">{formatCurrency(purchase.total_price)}</td>
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
              <Label htmlFor="date_of_purchase" className="text-right">Date</Label>
              <Input id="date_of_purchase" name="date_of_purchase" type="date" value={currentPurchase?.date_of_purchase || ''} onChange={handleFormChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="weight_quintal" className="text-right">Weight (Qtl)</Label>
              <Input id="weight_quintal" name="weight_quintal" type="number" value={currentPurchase?.weight_quintal || ''} onChange={handleFormChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rate" className="text-right">Rate</Label>
              <Input id="rate" name="rate" type="number" value={currentPurchase?.rate || ''} onChange={handleFormChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="total_price" className="text-right">Total Price</Label>
                <Input 
                    id="total_price" 
                    name="total_price" 
                    value={formatCurrency((currentPurchase?.weight_quintal || 0) * (currentPurchase?.rate || 0))} 
                    className="col-span-3" 
                    disabled 
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="payment_status" className="text-right">Status</Label>
                <Select onValueChange={(v) => setCurrentPurchase(p => ({...p, payment_status: v as 'PAID' | 'PENDING'}))} value={currentPurchase?.payment_status || ''}>
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

export default SoybeanPurchasePage;
