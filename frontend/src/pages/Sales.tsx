import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useBusiness } from '../context/BusinessContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { KPICard } from '../components/KPICard';
import { TrendingUp, ShoppingBag, MapPin, DollarSign } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts';

export const Sales: React.FC = () => {
  const { activeBusiness } = useBusiness();
  const [salesData, setSalesData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      if (!activeBusiness) return;
      try {
        setLoading(true);
        const res = await api.get('/analytics/sales/');
        setSalesData(res.data);
      } catch (err) {
        console.error('Failed to load sales analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, [activeBusiness]);

  if (loading || !salesData) return <LoadingSpinner message="Loading sales performance metrics..." />;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 style={{ fontSize: '1.75rem' }}>Sales Analytics & Revenue Performance</h1>
        <p className="text-secondary" style={{ fontSize: '0.875rem' }}>Detailed breakdown of order transactions, growth rates, and regional contributions</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <KPICard title="Total Sales Revenue" value={`₹${salesData.total_revenue.toLocaleString()}`} growth={salesData.growth_percentage} icon={<TrendingUp size={20} />} accentColor="#6366f1" />
        <KPICard title="Total Orders Executed" value={salesData.total_orders.toLocaleString()} icon={<ShoppingBag size={20} />} accentColor="#10b981" />
        <KPICard title="Average Order Value (AOV)" value={`₹${salesData.average_order_value.toLocaleString()}`} icon={<DollarSign size={20} />} accentColor="#f59e0b" />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="glass-card flex flex-col gap-4" style={{ padding: '1.5rem' }}>
          <h3>Monthly Revenue Trajectory</h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData.monthly_trend}>
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip contentStyle={{ background: '#111827', borderRadius: '8px' }} formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" fill="rgba(99, 102, 241, 0.2)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card flex flex-col gap-4" style={{ padding: '1.5rem' }}>
          <h3>Regional Revenue Breakdown</h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData.regional_breakdown}>
                <XAxis dataKey="region" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip contentStyle={{ background: '#111827', borderRadius: '8px' }} formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#38bdf8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
