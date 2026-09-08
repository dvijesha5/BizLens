import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useBusiness } from '../context/BusinessContext';
import { QualityBadge } from '../components/QualityBadge';
import { Upload as UploadIcon, FileSpreadsheet, CheckCircle, AlertCircle, FileText, Download } from 'lucide-react';
import { Dataset } from '../types';

export const Upload: React.FC = () => {
  const { activeBusiness } = useBusiness();
  const [file, setFile] = useState<File | null>(null);
  const [datasetType, setDatasetType] = useState<'SALES' | 'EXPENSES'>('SALES');
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<Dataset | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<Dataset[]>([]);

  const fetchHistory = async () => {
    if (!activeBusiness) return;
    try {
      const res = await api.get('/uploads/');
      setHistory(res.data);
    } catch (err) {
      console.error('Failed to load dataset history', err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [activeBusiness]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('dataset_type', datasetType);

    try {
      const res = await api.post('/uploads/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(res.data.dataset);
      setFile(null);
      fetchHistory();
    } catch (err: any) {
      setError(err.response?.data?.error || 'CSV upload processing failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 style={{ fontSize: '1.75rem' }}>Data Upload & Cleaning Pipeline</h1>
        <p className="text-secondary" style={{ fontSize: '0.875rem' }}>Upload raw sales or expense CSV files. Pandas will automatically validate, clean, deduplicate, and store your records.</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Upload Form Area */}
        <div className="glass-card flex flex-col gap-4" style={{ padding: '2rem' }}>
          <div className="flex items-center gap-2">
            <FileSpreadsheet size={22} color="var(--accent-indigo-light)" />
            <h3>Upload CSV File</h3>
          </div>

          {error && (
            <div className="badge badge-rose flex items-center gap-2" style={{ padding: '0.75rem', width: '100%' }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleUpload} className="flex flex-col gap-4">
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>Dataset Type</label>
              <select value={datasetType} onChange={(e: any) => setDatasetType(e.target.value)} className="input-field">
                <option value="SALES">Sales Transactions CSV</option>
                <option value="EXPENSES">Expenses CSV</option>
              </select>
            </div>

            {/* Drag & Drop File Zone */}
            <div 
              style={{
                border: '2px dashed var(--border-active)',
                borderRadius: '12px',
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                background: 'rgba(99, 102, 241, 0.04)',
                cursor: 'pointer'
              }}
              onClick={() => document.getElementById('csv-input')?.click()}
            >
              <UploadIcon size={36} color="var(--accent-indigo-light)" style={{ margin: '0 auto 0.75rem auto' }} />
              <p style={{ fontWeight: 600, color: '#fff' }}>{file ? file.name : 'Click or Drag CSV file here'}</p>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>
                Supports columns: Date, Product, Customer, Region, Quantity, Revenue
              </span>
              <input id="csv-input" type="file" accept=".csv" onChange={handleFileChange} style={{ display: 'none' }} />
            </div>

            <button type="submit" disabled={!file || uploading} className="btn btn-primary" style={{ padding: '0.8rem' }}>
              {uploading ? 'Processing & Cleaning CSV with Pandas...' : 'Import & Clean Data'}
            </button>
          </form>
        </div>

        {/* Data Quality Report Modal / Card */}
        <div className="glass-card flex flex-col gap-4" style={{ padding: '2rem' }}>
          <h3>Data Quality & Import Report</h3>
          {result ? (
            <div className="flex flex-col gap-4" style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle size={20} color="var(--accent-emerald)" />
                  <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--accent-emerald)' }}>Import Completed</span>
                </div>
                <QualityBadge score={result.quality_score} />
              </div>

              <div className="grid grid-cols-2 gap-3" style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                <div className="flex justify-between" style={{ padding: '0.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '6px' }}>
                  <span className="text-secondary">Records Uploaded:</span>
                  <span style={{ fontWeight: 700 }}>{result.total_records.toLocaleString()}</span>
                </div>
                <div className="flex justify-between" style={{ padding: '0.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '6px' }}>
                  <span className="text-secondary">Valid Imported:</span>
                  <span style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>{result.valid_records.toLocaleString()}</span>
                </div>
                <div className="flex justify-between" style={{ padding: '0.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '6px' }}>
                  <span className="text-secondary">Duplicates Dropped:</span>
                  <span style={{ fontWeight: 700, color: 'var(--accent-amber)' }}>{result.duplicates_removed}</span>
                </div>
                <div className="flex justify-between" style={{ padding: '0.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '6px' }}>
                  <span className="text-secondary">Missing Values Cleaned:</span>
                  <span style={{ fontWeight: 700, color: 'var(--accent-amber)' }}>{result.missing_handled}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2" style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <FileText size={40} />
              <p>Upload a CSV file to view real-time Pandas cleaning stats and Data Quality Score.</p>
            </div>
          )}
        </div>
      </div>

      {/* Dataset Upload History */}
      <div className="glass-card flex flex-col gap-4" style={{ padding: '1.5rem' }}>
        <h3>Dataset Import History</h3>
        <table className="custom-table">
          <thead>
            <tr>
              <th>File Name</th>
              <th>Type</th>
              <th>Status</th>
              <th>Total Rows</th>
              <th>Valid Rows</th>
              <th>Quality Score</th>
              <th>Uploaded Date</th>
            </tr>
          </thead>
          <tbody>
            {history.map((ds) => (
              <tr key={ds.id}>
                <td style={{ fontWeight: 600 }}>{ds.file_name}</td>
                <td><span className="badge badge-indigo">{ds.dataset_type}</span></td>
                <td><span className={`badge ${ds.status === 'COMPLETED' ? 'badge-emerald' : 'badge-rose'}`}>{ds.status}</span></td>
                <td>{ds.total_records}</td>
                <td style={{ fontWeight: 700 }}>{ds.valid_records}</td>
                <td><QualityBadge score={ds.quality_score} /></td>
                <td>{new Date(ds.uploaded_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
