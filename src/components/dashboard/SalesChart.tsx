import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../ui/Card';

const data = [
  { name: 'Jan', Sales: 4000 },
  { name: 'Feb', Sales: 3000 },
  { name: 'Mar', Sales: 5000 },
  { name: 'Apr', Sales: 4500 },
  { name: 'May', Sales: 6000 },
  { name: 'Jun', Sales: 5500 },
];

const SalesChart: React.FC = () => {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Sales Overview</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: '#6b7280' }} fontSize={12} />
          <YAxis tick={{ fill: '#6b7280' }} fontSize={12} />
          <Tooltip cursor={{fill: 'rgba(79, 70, 229, 0.1)'}}/>
          <Legend />
          <Bar dataKey="Sales" fill="#4f46e5" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default SalesChart;
