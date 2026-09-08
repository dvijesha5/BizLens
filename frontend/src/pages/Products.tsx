import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useBusiness } from '../context/BusinessContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Package, Award, DollarSign } from 'lucide-react';

export const Products: React.FC = () => {
  const { activeBusiness } = useBusiness();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!activeBusiness) return;
      try {
        setLoading(true);
        const res = await api.get('/analytics/products/');
        setData(res.data);
      } catch (err) {
        console.error('Failed to load product analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [activeBusiness]);

  if (loading || !data) return <LoadingSpinner message="Evaluating product profitability matrix..." />;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 style={{ fontSize: '1.75rem' }}>Product Performance & Profitability</h1>
        <p className="text-secondary" style={{ fontSize: '0.875rem' }}>Catalog-level revenue breakdown, unit volume sold, and average price realization</p>
      </div>

      <div className="glass-card flex flex-col gap-4" style={{ padding: '1.5rem' }}>
        <div className="flex items-center gap-2">
          <Package size={20} color="var(--accent-indigo-light)" />
          <h3>Product Catalog Profit Matrix</h3>
        </div>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Total Revenue</th>
              <th>Units Sold</th>
              <th>Order Count</th>
              <th>Avg Price / Unit</th>
              <th>Revenue Share</th>
            </tr>
          </thead>
          <tbody>
            {data.top_products.map((prod: any) => (
              <tr key={prod.name}>
                <td style={{ fontWeight: 700 }}>{prod.name}</td>
                <td style={{ fontWeight: 700, color: 'var(--accent-indigo-light)' }}>₹{prod.revenue.toLocaleString()}</td>
                <td>{prod.quantity}</td>
                <td>{prod.orders}</td>
                <td>₹{prod.avg_price.toLocaleString()}</td>
                <td><span className="badge badge-indigo">{prod.share_percentage}%</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
