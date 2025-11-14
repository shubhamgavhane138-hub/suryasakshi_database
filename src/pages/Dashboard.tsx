import React from 'react';
import DashboardStats from '../components/DashboardStats';
import MonthSelector from '../components/MonthSelector';
import SilageWeightChart from '../components/dashboard/SilageWeightChart';
import SalesPieChart from '../components/dashboard/SalesPieChart';
import YearSelector from '../components/YearSelector';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center gap-2">
            <YearSelector />
            <MonthSelector />
        </div>
      </div>
      <DashboardStats />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <SilageWeightChart />
        <SalesPieChart />
      </div>
    </div>
  );
};

export default Dashboard;
