import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to authenticate. Please check your credentials.');
    }
  };

  return (
    <div className="flex items-center justify-center" style={{ minHeight: '100vh', padding: '1rem' }}>
      <div className="glass-card flex flex-col gap-6" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem 2rem' }}>
        <div className="flex flex-col items-center gap-2" style={{ textAlign: 'center' }}>
          <BrandLogo compact light />
          <h2 style={{ fontSize: '1.75rem', marginTop: '0.5rem' }}>Welcome to BizLens</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Sign in to your Small Business Intelligence Dashboard</p>
        </div>

        {error && (
          <div className="badge badge-rose" style={{ padding: '0.6rem 0.8rem', width: '100%', justifyContent: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-field" placeholder="owner@business.com" />
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="input-field" placeholder="••••••••" />
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem', marginTop: '0.5rem' }}>
            <LogIn size={18} /> Sign In
          </button>
        </form>

        <div className="flex justify-center gap-2" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <span>Don't have an account?</span>
          <Link to="/register" style={{ color: 'var(--accent-indigo)', fontWeight: 600 }}>Create Business Account</Link>
        </div>
      </div>
    </div>
  );
};
