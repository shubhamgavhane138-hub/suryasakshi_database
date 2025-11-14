import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../ui/Card';

const data = [
  { name: 'Silage', value: 4567 },
  { name: 'Maize', value: 2400 },
  { name: 'Soybean Seed', value: 1890 },
];

const COLORS = ['#4f46e5', '#818cf8', '#a5b4fc'];

const RevenueChart: React.FC = () => {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue by Product</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default RevenueChart;
