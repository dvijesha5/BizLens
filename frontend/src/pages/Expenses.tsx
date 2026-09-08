import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useBusiness } from '../context/BusinessContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { KPICard } from '../components/KPICard';
import { Receipt, DollarSign, PieChart as PieIcon } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#6366f1', '#a855f7'];

export const Expenses: React.FC = () => {
  const { activeBusiness } = useBusiness();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      if (!activeBusiness) return;
      try {
        setLoading(true);
        const res = await api.get('/analytics/expenses/');
        setData(res.data);
      } catch (err) {
        console.error('Failed to load expense analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, [activeBusiness]);

  if (loading || !data) return <LoadingSpinner message="Loading expense analysis..." />;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 style={{ fontSize: '1.75rem' }}>Expense Analytics & Cost Control</h1>
        <p className="text-secondary" style={{ fontSize: '0.875rem' }}>Monitor operational expenditure, category distribution, and profit margin impact</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <KPICard title="Total Expenses" value={`₹${data.total_expenses.toLocaleString()}`} growth={data.expense_growth_percentage} icon={<Receipt size={20} />} accentColor="#ef4444" />
        <KPICard title="Net Profit" value={`₹${data.net_profit.toLocaleString()}`} icon={<DollarSign size={20} />} accentColor="#10b981" />
        <KPICard title="Profit Margin" value={`${data.profit_margin}%`} icon={<PieIcon size={20} />} accentColor="#6366f1" />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="glass-card flex flex-col gap-4" style={{ padding: '1.5rem' }}>
          <h3>Category Distribution</h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.category_breakdown} dataKey="amount" nameKey="category" cx="50%" cy="50%" outerRadius={90}>
                  {data.category_breakdown.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#111827', borderRadius: '8px' }} formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, 'Amount']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card flex flex-col gap-4" style={{ padding: '1.5rem' }}>
          <h3>Category Spending Summary</h3>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Total Spent</th>
                <th>Share %</th>
              </tr>
            </thead>
            <tbody>
              {data.category_breakdown.map((cat: any, idx: number) => (
                <tr key={cat.category}>
                  <td className="flex items-center gap-2">
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[idx % COLORS.length] }} />
                    <span style={{ fontWeight: 600 }}>{cat.category}</span>
                  </td>
                  <td style={{ fontWeight: 700 }}>₹{cat.amount.toLocaleString()}</td>
                  <td><span className="badge badge-amber">{cat.percentage}%</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
