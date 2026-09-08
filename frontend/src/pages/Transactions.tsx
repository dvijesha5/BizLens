import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useBusiness } from '../context/BusinessContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ListOrdered, Search, Filter } from 'lucide-react';
import { Sale } from '../types';

export const Transactions: React.FC = () => {
  const { activeBusiness } = useBusiness();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('');

  useEffect(() => {
    const fetchSales = async () => {
      if (!activeBusiness) return;
      try {
        setLoading(true);
        const res = await api.get('/sales/');
        setSales(res.data);
      } catch (err) {
        console.error('Failed to load transaction data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, [activeBusiness]);

  if (loading) return <LoadingSpinner message="Fetching sales transaction history..." />;

  const filteredSales = sales.filter((s) => {
    const matchesSearch =
      s.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.customer_code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = !regionFilter || s.region.toLowerCase() === regionFilter.toLowerCase();
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 style={{ fontSize: '1.75rem' }}>Sales Transaction Ledger</h1>
        <p className="text-secondary" style={{ fontSize: '0.875rem' }}>Complete transactional records ingested and stored in database</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card flex items-center justify-between gap-4" style={{ padding: '1rem 1.5rem' }}>
        <div className="flex items-center gap-3 flex-1">
          <Search size={18} color="var(--text-secondary)" />
          <input
            type="text"
            className="input-field"
            placeholder="Search by product or customer code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} color="var(--text-secondary)" />
          <select
            className="input-field"
            style={{ width: '160px' }}
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
          >
            <option value="">All Regions</option>
            <option value="Ahmedabad">Ahmedabad</option>
            <option value="Surat">Surat</option>
            <option value="Vadodara">Vadodara</option>
            <option value="Mumbai">Mumbai</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Product</th>
              <th>Customer</th>
              <th>Region</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total Revenue</th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.slice(0, 50).map((sale) => (
              <tr key={sale.id}>
                <td>{sale.date}</td>
                <td style={{ fontWeight: 600 }}>{sale.product_name}</td>
                <td><span className="badge badge-indigo">{sale.customer_code}</span></td>
                <td>{sale.region}</td>
                <td>{sale.quantity}</td>
                <td>₹{sale.unit_price}</td>
                <td style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>₹{sale.total_amount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredSales.length === 0 && (
          <div className="flex justify-center" style={{ padding: '2rem', color: 'var(--text-muted)' }}>
            No matching transactions found.
          </div>
        )}
      </div>
    </div>
  );
};
