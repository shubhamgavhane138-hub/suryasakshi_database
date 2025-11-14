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
import { SilageSale, PaymentStatus } from '../types';
import { DataContext } from '../context/DataContext';
import { DateContext } from '../context/DateContext';
import { useAuth } from '../context/AuthContext';
import MonthSelector from '../components/MonthSelector';
import YearSelector from '../components/YearSelector';

const SilageSales: React.FC = () => {
  const dataContext = useContext(DataContext);
  const dateContext = useContext(DateContext);
  const { user } = useAuth();

  if (!dataContext || !dateContext || !user) return <div>Loading...</div>;

  const { isLoading, silageSales, addSilageSale, updateSilageSale, deleteSilageSale } = dataContext;
  const { selectedYear, selectedMonth } = dateContext;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentSale, setCurrentSale] = useState<Partial<SilageSale> | null>(null);

  const filteredSales = useMemo(() => {
    return silageSales.filter(sale => {
      const saleDate = new Date(sale.date_of_perchase);
      const isSameYear = saleDate.getFullYear() === selectedYear;
      const isSameMonth = selectedMonth === 12 || saleDate.getMonth() === selectedMonth;
      const matchesSearch = sale.name_of_buyer.toLowerCase().includes(searchTerm.toLowerCase()) || sale.invoice_no.toString().includes(searchTerm);
      return isSameYear && isSameMonth && matchesSearch;
    });
  }, [silageSales, searchTerm, selectedYear, selectedMonth]);

  const handleSave = async () => {
    if (currentSale) {
      const weight = currentSale.weight_kg || 0;
      const rate = currentSale.rate || 0;
      const totalAmount = weight * rate;
      const updatedSale = {
        ...currentSale,
        total_amount: totalAmount,
        paid_amount: currentSale.payment_status === 'PENDING' ? 0 : currentSale.paid_amount ?? totalAmount,
        date_of_perchase: currentSale.date_of_perchase ? new Date(currentSale.date_of_perchase).toISOString() : new Date().toISOString(),
      };

      try {
        if (currentSale.id) {
            await updateSilageSale({ ...updatedSale } as SilageSale);
        } else {
            await addSilageSale(updatedSale);
        }
        setIsDialogOpen(false);
        setCurrentSale(null);
      } catch (error) {
        console.error("Failed to save sale:", error);
      }
    }
  };

  const handleAddNew = () => {
    setCurrentSale({
        date_of_perchase: new Date().toISOString().split('T')[0],
        payment_status: 'PENDING',
        weight_kg: 0,
        rate: 0,
        paid_amount: 0,
        product: 'SILAGE',
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (sale: SilageSale) => {
    setCurrentSale({
        ...sale,
        date_of_perchase: new Date(sale.date_of_perchase).toISOString().split('T')[0]
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
        try {
            await deleteSilageSale(id);
        } catch (error) {
            console.error("Failed to delete sale:", error);
        }
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setCurrentSale(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) || 0 : value }));
  };

  const handleSelectChange = (value: PaymentStatus) => {
    setCurrentSale(prev => ({...prev, payment_status: value}));
  };

  const handleDownload = () => {
    const monthName = selectedMonth === 12 ? 'Full-Year' : new Date(0, selectedMonth).toLocaleString('default', { month: 'long' });
    const filename = `silage-sales-report-${monthName}-${selectedYear}.csv`;
    
    const headers = [
        { key: 'invoice_no', label: 'Invoice No' },
        { key: 'name_of_buyer', label: 'Buyer Name' },
        { key: 'mob_no', label: 'Mobile No' },
        { key: 'date_of_perchase', label: 'Date' },
        { key: 'weight_kg', label: 'Weight (KG)' },
        { key: 'rate', label: 'Rate' },
        { key: 'total_amount', label: 'Total Amount' },
        { key: 'paid_amount', label: 'Paid Amount' },
        { key: 'payment_status', label: 'Payment Status' },
        { key: 'address', label: 'Address' },
    ] as const;

    const dataToExport = filteredSales.map(sale => ({
        ...sale,
        date_of_perchase: new Date(sale.date_of_perchase).toLocaleDateString('en-IN'),
    }));

    exportToCsv(filename, dataToExport, headers);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-full">Loading data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Silage Sales</h2>
        <div className="flex items-center gap-2">
            <YearSelector />
            <MonthSelector />
            <Button variant="outline" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" /> Download
            </Button>
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
                  <tr key={sale.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">#{sale.invoice_no}</td>
                    <td className="px-6 py-4">{sale.name_of_buyer}</td>
                    <td className="px-6 py-4">{sale.mob_no}</td>
                    <td className="px-6 py-4">{new Date(sale.date_of_perchase).toLocaleDateString('en-IN')}</td>
                    <td className="px-6 py-4">{sale.weight_kg.toFixed(2)}</td>
                    <td className="px-6 py-4">{formatCurrency(sale.rate)}</td>
                    <td className="px-6 py-4">
                      <span className={cn('px-2 py-1 text-xs font-medium rounded-full', {
                        'bg-green-100 text-green-800': sale.payment_status === 'CASH' || sale.payment_status === 'ONLINE',
                        'bg-yellow-100 text-yellow-800': sale.payment_status === 'PENDING',
                      })}>
                        {sale.payment_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium">{formatCurrency(sale.total_amount)}</td>
                    <td className="px-6 py-4 text-right font-medium">{formatCurrency(sale.paid_amount)}</td>
                    <td className="px-6 py-4 truncate max-w-xs">{sale.address}</td>
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
                                <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(sale.id)}>Delete</DropdownMenuItem>
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
            <DialogTitle>{currentSale?.id ? 'Edit Sale' : 'Add New Sale'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name_of_buyer" className="text-right">Buyer Name</Label>
              <Input id="name_of_buyer" name="name_of_buyer" value={currentSale?.name_of_buyer || ''} onChange={handleFormChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="invoice_no" className="text-right">Invoice No.</Label>
              <Input id="invoice_no" name="invoice_no" type="number" value={currentSale?.invoice_no || ''} onChange={handleFormChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="mob_no" className="text-right">Mobile No.</Label>
              <Input id="mob_no" name="mob_no" value={currentSale?.mob_no || ''} onChange={handleFormChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date_of_perchase" className="text-right">Date</Label>
              <Input id="date_of_perchase" name="date_of_perchase" type="date" value={currentSale?.date_of_perchase || ''} onChange={handleFormChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">Address</Label>
              <Input id="address" name="address" value={currentSale?.address || ''} onChange={handleFormChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="weight_kg" className="text-right">Weight (KG)</Label>
              <Input id="weight_kg" name="weight_kg" type="number" value={currentSale?.weight_kg || ''} onChange={handleFormChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rate" className="text-right">Rate</Label>
              <Input id="rate" name="rate" type="number" value={currentSale?.rate || ''} onChange={handleFormChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="total_amount" className="text-right">Total Amount</Label>
                <Input 
                    id="total_amount" 
                    name="total_amount" 
                    value={formatCurrency((currentSale?.weight_kg || 0) * (currentSale?.rate || 0))} 
                    className="col-span-3" 
                    disabled 
                />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="paid_amount" className="text-right">Paid Amount</Label>
              <Input id="paid_amount" name="paid_amount" type="number" value={currentSale?.paid_amount || ''} onChange={handleFormChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="payment_status" className="text-right">Status</Label>
                <Select onValueChange={handleSelectChange} value={currentSale?.payment_status || ''}>
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
