import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function exportToCsv<T extends Record<string, any>>(filename: string, data: T[], headers: { key: keyof T, label: string }[]) {
    if (!data || data.length === 0) {
        alert("No data available to export for the selected period.");
        return;
    }

    const columnHeaders = headers.map(h => h.label).join(',');
    const rows = data.map(row => {
        return headers.map(header => {
            const value = row[header.key];
            const stringValue = String(value ?? '').replace(/"/g, '""');
            return `"${stringValue}"`;
        }).join(',');
    }).join('\n');

    const csvContent = `${columnHeaders}\n${rows}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
