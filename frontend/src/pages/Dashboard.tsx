import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useBusiness } from '../context/BusinessContext';
import { KPICard } from '../components/KPICard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { 
  TrendingUp, 
  Receipt, 
  DollarSign, 
  Users, 
  Sparkles, 
  ArrowRight, 
  Package, 
  MapPin 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar 
} from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#a855f7'];

export const Dashboard: React.FC = () => {
  const { activeBusiness } = useBusiness();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!activeBusiness) return;
      try {
        setLoading(true);
        const res = await api.get('/analytics/dashboard/');
        setData(res.data);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [activeBusiness]);

  if (loading || !data) return <LoadingSpinner message="Calculating business intelligence metrics..." />;

  const { kpis, revenue_trend, expense_categories, top_products, regional_sales, root_cause } = data;

  const formatCurrency = (val: number) => {
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)}L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(1)}K`;
    return `₹${val.toLocaleString()}`;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ fontSize: '1.75rem' }}>{activeBusiness?.name} Dashboard</h1>
          <p className="text-secondary" style={{ fontSize: '0.875rem' }}>Overview of revenue, expenses, profitability, and data insights</p>
        </div>
        <Link to="/upload" className="btn btn-secondary flex items-center gap-2">
          <Sparkles size={16} color="var(--accent-indigo-light)" /> Import New Dataset
        </Link>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-4 gap-4">
        <KPICard title="Total Revenue" value={formatCurrency(kpis.revenue)} growth={kpis.revenue_growth} icon={<TrendingUp size={20} />} accentColor="#285c63" />
        <KPICard title="Total Expenses" value={formatCurrency(kpis.expenses)} growth={kpis.expense_growth} icon={<Receipt size={20} />} accentColor="#285c63" />
        <KPICard title="Net Profit" value={formatCurrency(kpis.profit)} subtitle={`Profit Margin: ${kpis.profit_margin}%`} icon={<DollarSign size={20} />} accentColor="#285c63" />
        <KPICard title="Total Customers" value={kpis.customers.toLocaleString()} subtitle={`${kpis.orders} Transactions`} icon={<Users size={20} />} accentColor="#285c63" />
      </div>

      {/* Root-Cause Insight Banner ("Why Did Revenue Fall?") */}
      {root_cause && root_cause.has_data && (
        <div className="glass-card" style={{ padding: '1.25rem 1.5rem', background: '#e9f0ed', border: '1px solid #bdd2ca' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '0.5rem' }}>
            <div className="flex items-center gap-2">
              <div style={{ background: '#d0e3dc', padding: '0.4rem', borderRadius: '8px', color: 'var(--accent-indigo)' }}>
                <Sparkles size={18} />
              </div>
              <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>Automated Business Insight</span>
            </div>
            <Link to="/insights" className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}>
              Deep Analysis <ArrowRight size={14} />
            </Link>
          </div>
          <p style={{ fontWeight: 600, color: 'var(--accent-indigo)', marginBottom: '0.5rem' }}>{root_cause.headline}</p>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{root_cause.most_significant_factor}</p>
        </div>
      )}

      {/* Main Charts Row */}
      <div className="grid grid-cols-3 gap-6">
        {/* Revenue Trend Area Chart (2 cols) */}
        <div className="glass-card flex flex-col gap-4" style={{ gridColumn: 'span 2', padding: '1.5rem' }}>
          <div className="flex items-center justify-between">
            <h3 style={{ fontSize: '1.1rem' }}>Revenue & Trend Performance</h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Monthly aggregate (INR)</span>
          </div>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenue_trend}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} tickLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickFormatter={formatCurrency} tickLine={false} />
                <Tooltip 
                  contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                  formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Breakdown Donut Chart (1 col) */}
        <div className="glass-card flex flex-col gap-4" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem' }}>Expense Breakdown</h3>
          <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={expense_categories} dataKey="amount" nameKey="category" cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4}>
                  {expense_categories.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, 'Amount']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col gap-2" style={{ marginTop: '0.5rem' }}>
            {expense_categories.slice(0, 4).map((cat: any, idx: number) => (
              <div key={cat.category} className="flex items-center justify-between" style={{ fontSize: '0.825rem' }}>
                <div className="flex items-center gap-2">
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS[idx % COLORS.length] }} />
                  <span className="text-secondary">{cat.category}</span>
                </div>
                <span style={{ fontWeight: 600 }}>{cat.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Top Products & Regional Breakdown */}
      <div className="grid grid-cols-2 gap-6">
        {/* Top Products Table */}
        <div className="glass-card flex flex-col gap-4" style={{ padding: '1.5rem' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package size={18} color="var(--accent-indigo-light)" />
              <h3 style={{ fontSize: '1.1rem' }}>Top Revenue Products</h3>
            </div>
            <Link to="/products" className="text-muted" style={{ fontSize: '0.8rem' }}>View All</Link>
          </div>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty Sold</th>
                <th>Revenue</th>
                <th>Share</th>
              </tr>
            </thead>
            <tbody>
              {top_products.map((prod: any) => (
                <tr key={prod.name}>
                  <td style={{ fontWeight: 600 }}>{prod.name}</td>
                  <td>{prod.quantity}</td>
                  <td style={{ fontWeight: 700, color: 'var(--accent-indigo-light)' }}>₹{prod.revenue.toLocaleString()}</td>
                  <td><span className="badge badge-indigo">{prod.share_percentage}%</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Regional Sales Bar Chart */}
        <div className="glass-card flex flex-col gap-4" style={{ padding: '1.5rem' }}>
          <div className="flex items-center gap-2">
            <MapPin size={18} color="var(--accent-emerald)" />
            <h3 style={{ fontSize: '1.1rem' }}>Sales by Region</h3>
          </div>
          <div style={{ width: '100%', height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regional_sales}>
                <XAxis dataKey="region" stroke="#6b7280" fontSize={12} tickLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickFormatter={formatCurrency} tickLine={false} />
                <Tooltip contentStyle={{ background: '#111827', borderRadius: '8px' }} formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
