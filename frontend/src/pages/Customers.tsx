import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useBusiness } from '../context/BusinessContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { KPICard } from '../components/KPICard';
import { Users, UserCheck, ShieldAlert, Award } from 'lucide-react';

export const Customers: React.FC = () => {
  const { activeBusiness } = useBusiness();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      if (!activeBusiness) return;
      try {
        setLoading(true);
        const res = await api.get('/analytics/customers/');
        setData(res.data);
      } catch (err) {
        console.error('Failed to load customer analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, [activeBusiness]);

  if (loading || !data) return <LoadingSpinner message="Performing customer RFM segmentation..." />;

  const { total_customers, average_customer_spend, retention_rate, segmentation_summary, customer_segments } = data;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 style={{ fontSize: '1.75rem' }}>Customer Intelligence & RFM Segmentation</h1>
        <p className="text-secondary" style={{ fontSize: '0.875rem' }}>Classify customer loyalty (VIP, High Value, At-Risk, Churned) based on purchasing history</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <KPICard title="Total Customer Base" value={total_customers.toString()} icon={<Users size={20} />} accentColor="#6366f1" />
        <KPICard title="Customer Retention Rate" value={`${retention_rate}%`} icon={<UserCheck size={20} />} accentColor="#10b981" />
        <KPICard title="Average Spend per Customer" value={`₹${average_customer_spend.toLocaleString()}`} icon={<Award size={20} />} accentColor="#f59e0b" />
      </div>

      {/* Segmentation Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="glass-card flex flex-col gap-1" style={{ padding: '1rem', borderLeft: '4px solid #10b981' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>🏆 VIP Clients</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{segmentation_summary['VIP']}</span>
        </div>
        <div className="glass-card flex flex-col gap-1" style={{ padding: '1rem', borderLeft: '4px solid #6366f1' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>💎 High Value</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{segmentation_summary['High Value']}</span>
        </div>
        <div className="glass-card flex flex-col gap-1" style={{ padding: '1rem', borderLeft: '4px solid #f59e0b' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>⚠️ At Risk</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{segmentation_summary['At Risk']}</span>
        </div>
        <div className="glass-card flex flex-col gap-1" style={{ padding: '1rem', borderLeft: '4px solid #ef4444' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>❌ Churned</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{segmentation_summary['Churned']}</span>
        </div>
      </div>

      {/* Customer Tiers Tables */}
      {Object.entries(customer_segments).map(([tier, custs]: [string, any]) => {
        if (custs.length === 0) return null;
        return (
          <div key={tier} className="glass-card flex flex-col gap-3" style={{ padding: '1.25rem 1.5rem' }}>
            <h3 style={{ fontSize: '1rem' }}>Tier: {tier} ({custs.length})</h3>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Customer Code</th>
                  <th>Region</th>
                  <th>Total Spend</th>
                  <th>Orders</th>
                  <th>Last Purchase</th>
                </tr>
              </thead>
              <tbody>
                {custs.map((c: any) => (
                  <tr key={c.customer_code}>
                    <td style={{ fontWeight: 600 }}>{c.customer_code}</td>
                    <td>{c.region}</td>
                    <td style={{ fontWeight: 700, color: 'var(--accent-indigo-light)' }}>₹{c.total_spend.toLocaleString()}</td>
                    <td>{c.order_count}</td>
                    <td>{c.last_purchase}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
};
