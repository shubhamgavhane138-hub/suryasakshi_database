import React, { useState, useMemo, useContext } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '../components/ui/Dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '../components/ui/DropdownMenu';
import { PlusCircle, MoreHorizontal, Search } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { OtherExpense } from '../types';
import { DataContext } from '../context/DataContext';
import { DateContext } from '../context/DateContext';
import MonthSelector from '../components/MonthSelector';
import YearSelector from '../components/YearSelector';

const OtherExpensesPage: React.FC = () => {
  const dataContext = useContext(DataContext);
  const dateContext = useContext(DateContext);

  if (!dataContext || !dateContext) return <div>Loading...</div>;

  const { otherExpenses, addOtherExpense, updateOtherExpense, deleteOtherExpense } = dataContext;
  const { selectedYear, selectedMonth } = dateContext;

  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState<Partial<OtherExpense> | null>(null);

  const filteredExpenses = useMemo(() => {
    return otherExpenses.filter(e => {
        const expenseDate = new Date(e.DATE_OF_EXPENSES);
        const isSameYear = expenseDate.getFullYear() === selectedYear;
        const isSameMonth = selectedMonth === 12 || expenseDate.getMonth() === selectedMonth;
        const matchesSearch = e.EXPENSE_NAME.toLowerCase().includes(searchTerm.toLowerCase());
        return isSameYear && isSameMonth && matchesSearch;
    });
  }, [otherExpenses, searchTerm, selectedYear, selectedMonth]);

  const handleSave = () => {
    if (currentExpense) {
      const updatedExpense = {
          ...currentExpense,
          DATE_OF_EXPENSES: currentExpense.DATE_OF_EXPENSES ? new Date(currentExpense.DATE_OF_EXPENSES) : new Date(),
      };
      if (currentExpense.S_NO) {
        updateOtherExpense({ ...updatedExpense } as OtherExpense);
      } else {
        addOtherExpense(updatedExpense);
      }
      setIsDialogOpen(false);
      setCurrentExpense(null);
    }
  };

  const handleAddNew = () => {
    setCurrentExpense({
        DATE_OF_EXPENSES: new Date(),
        AMOUNT: 0,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (expense: OtherExpense) => {
    setCurrentExpense(expense);
    setIsDialogOpen(true);
  };

  const handleDelete = (s_no: number) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
        deleteOtherExpense(s_no);
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
    setCurrentExpense(prev => ({ ...prev, [name]: processedValue }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Other Expenses</h2>
        <div className="flex items-center gap-2">
            <YearSelector />
            <MonthSelector />
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
                  <th scope="col" className="px-6 py-3">S.No</th>
                  <th scope="col" className="px-6 py-3">Expense Name</th>
                  <th scope="col" className="px-6 py-3">Date</th>
                  <th scope="col" className="px-6 py-3 text-right">Amount</th>
                  <th scope="col" className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((expense) => (
                  <tr key={expense.S_NO} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{expense.S_NO}</td>
                    <td className="px-6 py-4">{expense.EXPENSE_NAME}</td>
                    <td className="px-6 py-4">{new Date(expense.DATE_OF_EXPENSES).toLocaleDateString('en-IN')}</td>
                    <td className="px-6 py-4 text-right font-medium">{formatCurrency(expense.AMOUNT)}</td>
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
                                <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(expense.S_NO)}>Delete</DropdownMenuItem>
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
            <DialogTitle>{currentExpense?.S_NO ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="EXPENSE_NAME" className="text-right">Expense Name</Label>
              <Input id="EXPENSE_NAME" name="EXPENSE_NAME" value={currentExpense?.EXPENSE_NAME || ''} onChange={handleFormChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="DATE_OF_EXPENSES" className="text-right">Date</Label>
              <Input id="DATE_OF_EXPENSES" name="DATE_OF_EXPENSES" type="date" value={currentExpense?.DATE_OF_EXPENSES ? new Date(currentExpense.DATE_OF_EXPENSES).toISOString().split('T')[0] : ''} onChange={handleFormChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="AMOUNT" className="text-right">Amount</Label>
              <Input id="AMOUNT" name="AMOUNT" type="number" value={currentExpense?.AMOUNT || ''} onChange={handleFormChange} className="col-span-3" />
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
