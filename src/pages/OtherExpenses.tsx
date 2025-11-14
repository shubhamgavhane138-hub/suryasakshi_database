import React, { useState, useMemo, useContext } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '../components/ui/Dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '../components/ui/DropdownMenu';
import { PlusCircle, MoreHorizontal, Search, Download } from 'lucide-react';
import { formatCurrency, exportToCsv } from '../lib/utils';
import { OtherExpense } from '../types';
import { DataContext } from '../context/DataContext';
import { DateContext } from '../context/DateContext';
import { useAuth } from '../context/AuthContext';
import MonthSelector from '../components/MonthSelector';
import YearSelector from '../components/YearSelector';

const OtherExpensesPage: React.FC = () => {
  const dataContext = useContext(DataContext);
  const dateContext = useContext(DateContext);
  const { user } = useAuth();

  if (!dataContext || !dateContext || !user) return <div>Loading...</div>;

  const { isLoading, otherExpenses, addOtherExpense, updateOtherExpense, deleteOtherExpense } = dataContext;
  const { selectedYear, selectedMonth } = dateContext;

  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState<Partial<OtherExpense> | null>(null);

  const filteredExpenses = useMemo(() => {
    return otherExpenses.filter(e => {
        const expenseDate = new Date(e.date_of_expenses);
        const isSameYear = expenseDate.getFullYear() === selectedYear;
        const isSameMonth = selectedMonth === 12 || expenseDate.getMonth() === selectedMonth;
        const matchesSearch = e.expense_name.toLowerCase().includes(searchTerm.toLowerCase());
        return isSameYear && isSameMonth && matchesSearch;
    });
  }, [otherExpenses, searchTerm, selectedYear, selectedMonth]);

  const handleSave = async () => {
    if (currentExpense) {
      const updatedExpense = {
          ...currentExpense,
          date_of_expenses: currentExpense.date_of_expenses ? new Date(currentExpense.date_of_expenses).toISOString() : new Date().toISOString(),
      };
      try {
        if (currentExpense.id) {
            await updateOtherExpense({ ...updatedExpense } as OtherExpense);
        } else {
            await addOtherExpense(updatedExpense);
        }
        setIsDialogOpen(false);
        setCurrentExpense(null);
      } catch (error) {
        console.error("Failed to save expense:", error);
      }
    }
  };

  const handleAddNew = () => {
    setCurrentExpense({
        date_of_expenses: new Date().toISOString().split('T')[0],
        amount: 0,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (expense: OtherExpense) => {
    setCurrentExpense({
        ...expense,
        date_of_expenses: new Date(expense.date_of_expenses).toISOString().split('T')[0]
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
        try {
            await deleteOtherExpense(id);
        } catch (error) {
            console.error("Failed to delete expense:", error);
        }
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setCurrentExpense(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) || 0 : value }));
  };

  const handleDownload = () => {
    const monthName = selectedMonth === 12 ? 'Full-Year' : new Date(0, selectedMonth).toLocaleString('default', { month: 'long' });
    const filename = `other-expenses-report-${monthName}-${selectedYear}.csv`;
    
    const headers = [
        { key: 'id', label: 'ID' },
        { key: 'expense_name', label: 'Expense Name' },
        { key: 'date_of_expenses', label: 'Date' },
        { key: 'amount', label: 'Amount' },
    ] as const;

    const dataToExport = filteredExpenses.map(e => ({
        ...e,
        date_of_expenses: new Date(e.date_of_expenses).toLocaleDateString('en-IN'),
    }));

    exportToCsv(filename, dataToExport, headers);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-full">Loading data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Other Expenses</h2>
        <div className="flex items-center gap-2">
            <YearSelector />
            <MonthSelector />
            <Button variant="outline" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" /> Download
            </Button>
            <Button onClick={handleAddNew}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Expense
            </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Other Expenses</CardTitle>
          <CardDescription>Track miscellaneous business expenses for the selected period.</CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input 
              placeholder="Search by expense name..." 
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
                  <th scope="col" className="px-6 py-3">Expense Name</th>
                  <th scope="col" className="px-6 py-3">Date</th>
                  <th scope="col" className="px-6 py-3 text-right">Amount</th>
                  <th scope="col" className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((expense) => (
                  <tr key={expense.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{expense.id}</td>
                    <td className="px-6 py-4">{expense.expense_name}</td>
                    <td className="px-6 py-4">{new Date(expense.date_of_expenses).toLocaleDateString('en-IN')}</td>
                    <td className="px-6 py-4 text-right font-medium">{formatCurrency(expense.amount)}</td>
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
                                <DropdownMenuItem onClick={() => handleEdit(expense)}>Edit</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(expense.id)}>Delete</DropdownMenuItem>
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
            <DialogTitle>{currentExpense?.id ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="expense_name" className="text-right">Expense Name</Label>
              <Input id="expense_name" name="expense_name" value={currentExpense?.expense_name || ''} onChange={handleFormChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date_of_expenses" className="text-right">Date</Label>
              <Input id="date_of_expenses" name="date_of_expenses" type="date" value={currentExpense?.date_of_expenses || ''} onChange={handleFormChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">Amount</Label>
              <Input id="amount" name="amount" type="number" value={currentExpense?.amount || ''} onChange={handleFormChange} className="col-span-3" />
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

export default OtherExpensesPage;
