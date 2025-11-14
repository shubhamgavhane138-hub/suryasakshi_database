import React from 'react';
import Card from '../ui/Card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  change: number;
  changeType?: 'increase' | 'decrease';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, change }) => {
  const changeType = change >= 0 ? 'increase' : 'decrease';
  return (
    <Card>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <Icon className="h-6 w-6 text-gray-400" />
      </div>
      <div className="mt-2">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        <div className="flex items-center text-sm mt-1">
          {changeType === 'increase' ? (
            <ArrowUpRight className="h-4 w-4 text-green-500" />
          ) : (
            <ArrowDownRight className="h-4 w-4 text-red-500" />
          )}
          <span className={`ml-1 font-semibold ${changeType === 'increase' ? 'text-green-500' : 'text-red-500'}`}>
            {Math.abs(change)}%
          </span>
          <span className="ml-1 text-gray-500">vs last month</span>
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
