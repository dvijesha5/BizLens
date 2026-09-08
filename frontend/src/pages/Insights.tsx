import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useBusiness } from '../context/BusinessContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Sparkles, MessageSquare, Send, ArrowDownRight, ArrowUpRight, HelpCircle } from 'lucide-react';
import { RootCauseAnalysis } from '../types';

export const Insights: React.FC = () => {
  const { activeBusiness } = useBusiness();
  const [rootCause, setRootCause] = useState<RootCauseAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  // Ask Business Query state
  const [query, setQuery] = useState('');
  const [asking, setAsking] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ query: string; answer: string; time: string }>>([
    {
      query: 'Why did revenue fall recently?',
      answer: 'System calculated period-over-period variance across product catalog and regional channels.',
      time: 'Default'
    }
  ]);

  useEffect(() => {
    const fetchRootCause = async () => {
      if (!activeBusiness) return;
      try {
        setLoading(true);
        const res = await api.get('/analytics/root-cause/');
        setRootCause(res.data);
      } catch (err) {
        console.error('Failed to load root cause analysis', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRootCause();
  }, [activeBusiness]);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userQ = query;
    setQuery('');
    setAsking(true);

    try {
      const res = await api.post('/insights/ask/', { query: userQ });
      setChatHistory((prev) => [
        { query: userQ, answer: res.data.answer, time: new Date().toLocaleTimeString() },
        ...prev
      ]);
    } catch (err) {
      console.error('Failed to ask business question', err);
    } finally {
      setAsking(false);
    }
  };

  if (loading) return <LoadingSpinner message="Calculating statistical variance and root cause insights..." />;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 style={{ fontSize: '1.75rem' }}>AI & Statistical Root-Cause Engine</h1>
        <p className="text-secondary" style={{ fontSize: '0.875rem' }}>Automated variance explanations and conversational natural-language business query interface</p>
      </div>

      {/* Root-Cause Banner */}
      {rootCause && rootCause.has_data ? (
        <div className="glass-card flex flex-col gap-4" style={{ padding: '2rem', border: '1px solid rgba(99, 102, 241, 0.4)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', padding: '0.5rem', borderRadius: '8px' }}>
                <Sparkles size={22} color="#fff" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem' }}>Period-over-Period Revenue Diagnosis</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Comparing {rootCause.current_period} vs {rootCause.previous_period}</span>
              </div>
            </div>
            <div className={`badge ${rootCause.revenue_change_amount! < 0 ? 'badge-rose' : 'badge-emerald'}`} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
              {rootCause.revenue_change_amount! < 0 ? <ArrowDownRight size={18} /> : <ArrowUpRight size={18} />}
              <span>{rootCause.revenue_change_percentage}% Delta</span>
            </div>
          </div>

          <div style={{ padding: '1.25rem', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '10px', borderLeft: '4px solid var(--accent-indigo)' }}>
            <h4 style={{ fontSize: '1.05rem', color: 'var(--accent-indigo-light)', marginBottom: '0.4rem' }}>{rootCause.headline}</h4>
            <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)' }}>{rootCause.most_significant_factor}</p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Primary Contributing Factors</h4>
            <ul className="flex flex-col gap-2" style={{ listStyle: 'none' }}>
              {rootCause.key_takeaways?.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2" style={{ fontSize: '0.9rem', background: 'rgba(255,255,255,0.03)', padding: '0.6rem 0.8rem', borderRadius: '6px' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-indigo)' }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          {rootCause?.message || 'Upload at least 2 consecutive months of CSV sales data to activate period-over-period revenue diagnosis.'}
        </div>
      )}

      {/* "Ask Your Business" Conversational Interface */}
      <div className="glass-card flex flex-col gap-4" style={{ padding: '2rem' }}>
        <div className="flex items-center gap-2">
          <MessageSquare size={22} color="var(--accent-indigo-light)" />
          <h3>Ask Your Business</h3>
        </div>
        <p className="text-secondary" style={{ fontSize: '0.875rem' }}>Ask natural-language questions about sales, revenue decline, product profitability, or customer churn.</p>

        {/* Question Form */}
        <form onSubmit={handleAsk} className="flex gap-3">
          <input
            type="text"
            className="input-field flex-1"
            placeholder="e.g. Why did revenue fall? Which product made the most profit? Which customers are at risk?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" disabled={asking || !query.trim()} className="btn btn-primary">
            <Send size={16} /> Ask
          </button>
        </form>

        {/* Shortcut Question Chips */}
        <div className="flex gap-2" style={{ marginTop: '0.25rem', flexWrap: 'wrap' }}>
          <button onClick={() => setQuery('Why did revenue fall?')} className="btn btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem' }}>
            <HelpCircle size={14} /> Why did revenue fall?
          </button>
          <button onClick={() => setQuery('Which product made the most profit?')} className="btn btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem' }}>
            <HelpCircle size={14} /> Which product made the most profit?
          </button>
          <button onClick={() => setQuery('Which customers are at risk?')} className="btn btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem' }}>
            <HelpCircle size={14} /> Which customers are at risk?
          </button>
        </div>

        {/* Conversation Stream */}
        <div className="flex flex-col gap-4" style={{ marginTop: '1rem' }}>
          {chatHistory.map((item, idx) => (
            <div key={idx} className="flex flex-col gap-2" style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div className="flex items-center justify-between">
                <span style={{ fontWeight: 700, color: 'var(--accent-indigo-light)', fontSize: '0.95rem' }}>Q: "{item.query}"</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.time}</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
