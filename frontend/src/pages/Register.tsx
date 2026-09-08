import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBusiness } from '../context/BusinessContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';

export const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [bizName, setBizName] = useState('');
  const [error, setError] = useState('');

  const { register } = useAuth();
  const { createBusiness } = useBusiness();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await register(username || email.split('@')[0], email, password, fullName);
      if (bizName) {
        await createBusiness(bizName, 'Retail');
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please check form fields.');
    }
  };

  return (
    <div className="flex items-center justify-center" style={{ minHeight: '100vh', padding: '1rem' }}>
      <div className="glass-card flex flex-col gap-6" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem 2rem' }}>
        <div className="flex flex-col items-center gap-2" style={{ textAlign: 'center' }}>
          <BrandLogo compact light />
          <h2 style={{ fontSize: '1.75rem', marginTop: '0.5rem' }}>Create Account</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Get started with your BizLens SaaS Account</p>
        </div>

        {error && (
          <div className="badge badge-rose" style={{ padding: '0.6rem 0.8rem', width: '100%', justifyContent: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>Full Name</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="input-field" placeholder="John Doe" />
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-field" placeholder="owner@business.com" />
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="input-field" placeholder="••••••••" />
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>Business Name</label>
            <input type="text" value={bizName} onChange={(e) => setBizName(e.target.value)} required className="input-field" placeholder="e.g. Dvijesha Fashion Store" />
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem', marginTop: '0.5rem' }}>
            <UserPlus size={18} /> Register Business
          </button>
        </form>

        <div className="flex justify-center gap-2" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <span>Already have an account?</span>
          <Link to="/login" style={{ color: 'var(--accent-indigo)', fontWeight: 600 }}>Sign In</Link>
        </div>
      </div>
    </div>
  );
};
