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
import { SilageSale, PaymentStatus } from '../types';
import { DataContext } from '../context/DataContext';
import { DateContext } from '../context/DateContext';
import MonthSelector from '../components/MonthSelector';
import YearSelector from '../components/YearSelector';

const SilageSales: React.FC = () => {
  const dataContext = useContext(DataContext);
  const dateContext = useContext(DateContext);

  if (!dataContext || !dateContext) return <div>Loading...</div>;

  const { silageSales, addSilageSale, updateSilageSale, deleteSilageSale } = dataContext;
  const { selectedYear, selectedMonth } = dateContext;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentSale, setCurrentSale] = useState<Partial<SilageSale> | null>(null);

  const filteredSales = useMemo(() => {
    return silageSales.filter(sale => {
      const saleDate = new Date(sale.DATE_OF_PERCHASE);
      const isSameYear = saleDate.getFullYear() === selectedYear;
      const isSameMonth = selectedMonth === 12 || saleDate.getMonth() === selectedMonth;
      const matchesSearch = sale.NAME_OF_BUYER.toLowerCase().includes(searchTerm.toLowerCase()) || sale.INVOICE_NO.toString().includes(searchTerm);
      return isSameYear && isSameMonth && matchesSearch;
    });
  }, [silageSales, searchTerm, selectedYear, selectedMonth]);

  const handleSave = () => {
    if (currentSale) {
      const weight = currentSale.WEIGHT_KG || 0;
      const rate = currentSale.RATE || 0;
      const totalAmount = weight * rate;
      const updatedSale = {
        ...currentSale,
        TOTAL_AMOUNT: totalAmount,
        PAID_AMOUNT: currentSale.PAYMENT_STATUS === 'PENDING' ? 0 : currentSale.PAID_AMOUNT ?? totalAmount,
        DATE_OF_PERCHASE: currentSale.DATE_OF_PERCHASE ? new Date(currentSale.DATE_OF_PERCHASE) : new Date(),
      };

      if (currentSale.S_NO) {
        updateSilageSale({ ...updatedSale } as SilageSale);
      } else {
        addSilageSale(updatedSale);
      }
      setIsDialogOpen(false);
      setCurrentSale(null);
    }
  };

  const handleAddNew = () => {
    setCurrentSale({
        DATE_OF_PERCHASE: new Date(),
        PAYMENT_STATUS: 'PENDING',
        WEIGHT_KG: 0,
        RATE: 0,
        PAID_AMOUNT: 0,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (sale: SilageSale) => {
    setCurrentSale(sale);
    setIsDialogOpen(true);
  };

  const handleDelete = (s_no: number) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
        deleteSilageSale(s_no);
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
    setCurrentSale(prev => ({ ...prev, [name]: processedValue }));
  };

  const handleSelectChange = (value: PaymentStatus) => {
    setCurrentSale(prev => ({...prev, PAYMENT_STATUS: value}));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Silage Sales</h2>
        <div className="flex items-center gap-2">
            <YearSelector />
            <MonthSelector />
            <Button onClick={handleAddNew}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Sale
            </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Silage Sales</CardTitle>
          <CardDescription>Manage and track all silage sales for the selected period.</CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input 
              placeholder="Search by buyer or invoice..." 
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
                  <th scope="col" className="px-6 py-3">Invoice</th>
                  <th scope="col" className="px-6 py-3">Buyer Name</th>
                  <th scope="col" className="px-6 py-3">Mobile No</th>
                  <th scope="col" className="px-6 py-3">Date</th>
                  <th scope="col" className="px-6 py-3">Weight (KG)</th>
                  <th scope="col" className="px-6 py-3">Rate</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                  <th scope="col" className="px-6 py-3 text-right">Total Amount</th>
                  <th scope="col" className="px-6 py-3 text-right">Paid Amount</th>
                  <th scope="col" className="px-6 py-3">Address</th>
                  <th scope="col" className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map((sale) => (
                  <tr key={sale.S_NO} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">#{sale.INVOICE_NO}</td>
                    <td className="px-6 py-4">{sale.NAME_OF_BUYER}</td>
                    <td className="px-6 py-4">{sale.MOB_NO}</td>
                    <td className="px-6 py-4">{new Date(sale.DATE_OF_PERCHASE).toLocaleDateString('en-IN')}</td>
                    <td className="px-6 py-4">{sale.WEIGHT_KG.toFixed(2)}</td>
                    <td className="px-6 py-4">{formatCurrency(sale.RATE)}</td>
                    <td className="px-6 py-4">
                      <span className={cn('px-2 py-1 text-xs font-medium rounded-full', {
                        'bg-green-100 text-green-800': sale.PAYMENT_STATUS === 'CASH' || sale.PAYMENT_STATUS === 'ONLINE' || sale.PAYMENT_STATUS === 'PAID',
                        'bg-yellow-100 text-yellow-800': sale.PAYMENT_STATUS === 'PENDING',
                      })}>
                        {sale.PAYMENT_STATUS}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium">{formatCurrency(sale.TOTAL_AMOUNT)}</td>
                    <td className="px-6 py-4 text-right font-medium">{formatCurrency(sale.PAID_AMOUNT)}</td>
                    <td className="px-6 py-4 truncate max-w-xs">{sale.ADDRESS}</td>
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
                                <DropdownMenuItem onClick={() => handleEdit(sale)}>Edit</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(sale.S_NO)}>Delete</DropdownMenuItem>
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
            <DialogTitle>{currentSale?.S_NO ? 'Edit Sale' : 'Add New Sale'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="NAME_OF_BUYER" className="text-right">Buyer Name</Label>
              <Input id="NAME_OF_BUYER" name="NAME_OF_BUYER" value={currentSale?.NAME_OF_BUYER || ''} onChange={handleFormChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="MOB_NO" className="text-right">Mobile No.</Label>
              <Input id="MOB_NO" name="MOB_NO" value={currentSale?.MOB_NO || ''} onChange={handleFormChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="DATE_OF_PERCHASE" className="text-right">Date</Label>
              <Input id="DATE_OF_PERCHASE" name="DATE_OF_PERCHASE" type="date" value={currentSale?.DATE_OF_PERCHASE ? new Date(currentSale.DATE_OF_PERCHASE).toISOString().split('T')[0] : ''} onChange={handleFormChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ADDRESS" className="text-right">Address</Label>
              <Input id="ADDRESS" name="ADDRESS" value={currentSale?.ADDRESS || ''} onChange={handleFormChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="WEIGHT_KG" className="text-right">Weight (KG)</Label>
              <Input id="WEIGHT_KG" name="WEIGHT_KG" type="number" value={currentSale?.WEIGHT_KG || ''} onChange={handleFormChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="RATE" className="text-right">Rate</Label>
              <Input id="RATE" name="RATE" type="number" value={currentSale?.RATE || ''} onChange={handleFormChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="TOTAL_AMOUNT" className="text-right">Total Amount</Label>
                <Input 
                    id="TOTAL_AMOUNT" 
                    name="TOTAL_AMOUNT" 
                    value={formatCurrency((currentSale?.WEIGHT_KG || 0) * (currentSale?.RATE || 0))} 
                    className="col-span-3" 
                    disabled 
                />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="PAID_AMOUNT" className="text-right">Paid Amount</Label>
              <Input id="PAID_AMOUNT" name="PAID_AMOUNT" type="number" value={currentSale?.PAID_AMOUNT || ''} onChange={handleFormChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="PAYMENT_STATUS" className="text-right">Status</Label>
                <Select onValueChange={handleSelectChange} value={currentSale?.PAYMENT_STATUS || ''}>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="CASH">Cash</SelectItem>
                        <SelectItem value="ONLINE">Online</SelectItem>
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

export default SilageSales;
