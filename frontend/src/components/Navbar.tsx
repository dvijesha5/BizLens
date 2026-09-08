import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBusiness } from '../context/BusinessContext';
import { Plus, LogOut, User as UserIcon, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BrandLogo } from './BrandLogo';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { businesses, activeBusiness, setActiveBusinessId, createBusiness } = useBusiness();
  const [showNewBizModal, setShowNewBizModal] = useState(false);
  const [bizName, setBizName] = useState('');
  const [bizIndustry, setBizIndustry] = useState('Retail');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bizName) return;
    await createBusiness(bizName, bizIndustry);
    setBizName('');
    setShowNewBizModal(false);
  };

  return (
    <header className="glass-card flex items-center justify-between" style={{ padding: '0.85rem 2rem', borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}>
      <div className="flex items-center gap-4">
        <Link to="/dashboard" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
          <BrandLogo />
        </Link>

        {/* Business Selector Switcher */}
        {activeBusiness && (
          <div className="flex items-center gap-2" style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '0.35rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Business:</span>
            <select
              value={activeBusiness.id}
              onChange={(e) => setActiveBusinessId(Number(e.target.value))}
              style={{ background: 'transparent', color: '#fff', border: 'none', fontWeight: 600, fontSize: '0.875rem', outline: 'none', cursor: 'pointer' }}
            >
              {businesses.map((b) => (
                <option key={b.id} value={b.id} style={{ background: '#111827', color: '#fff' }}>
                  {b.name} ({b.role})
                </option>
              ))}
            </select>
            <button onClick={() => setShowNewBizModal(true)} title="Add Business" style={{ color: 'var(--accent-indigo-light)' }}>
              <Plus size={16} />
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <Link to="/upload" className="btn btn-primary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
          <Upload size={14} /> Upload CSV Data
        </Link>

        <div className="flex items-center gap-3" style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '1rem' }}>
          <div className="flex items-center gap-2">
            <div style={{ background: 'rgba(99, 102, 241, 0.2)', padding: '0.4rem', borderRadius: '50%', color: 'var(--accent-indigo-light)' }}>
              <UserIcon size={16} />
            </div>
            <div className="flex flex-col" style={{ lineHeight: 1.2 }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user?.full_name || user?.username}</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{user?.email}</span>
            </div>
          </div>
          <button onClick={logout} className="btn btn-secondary" style={{ padding: '0.45rem', borderRadius: '8px' }} title="Logout">
            <LogOut size={16} color="var(--text-secondary)" />
          </button>
        </div>
      </div>

      {/* Create New Business Modal */}
      {showNewBizModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-card" style={{ padding: '2rem', width: '100%', maxWidth: '400px', background: '#111827' }}>
            <h3 style={{ marginBottom: '1rem' }}>Register New Business</h3>
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Business Name</label>
                <input type="text" value={bizName} onChange={(e) => setBizName(e.target.value)} required className="input-field" placeholder="e.g. Apex Retail Ltd" />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Industry</label>
                <input type="text" value={bizIndustry} onChange={(e) => setBizIndustry(e.target.value)} className="input-field" placeholder="e.g. E-Commerce" />
              </div>
              <div className="flex justify-between gap-3" style={{ marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowNewBizModal(false)} className="btn btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn btn-primary flex-1">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
