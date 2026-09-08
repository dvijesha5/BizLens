import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  growth?: number;
  icon?: React.ReactNode;
  subtitle?: string;
  badgeText?: string;
  accentColor?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  growth,
  icon,
  subtitle,
  badgeText,
  accentColor = '#6366f1'
}) => {
  const isPositive = growth !== undefined && growth >= 0;

  return (
    <div className="glass-card flex flex-col gap-3" style={{ padding: '1.25rem 1.5rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: accentColor }} />
      <div className="flex items-center justify-between">
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{title}</span>
        {icon && (
          <div style={{ background: `${accentColor}20`, padding: '0.45rem', borderRadius: '8px', color: accentColor }}>
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between" style={{ marginTop: '0.25rem' }}>
        <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>{value}</span>

        {growth !== undefined && (
          <div className="badge badge-indigo">
            {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            <span>{Math.abs(growth)}%</span>
          </div>
        )}

        {badgeText && (
          <div className="badge badge-indigo">
            <span>{badgeText}</span>
          </div>
        )}
      </div>

      {subtitle && (
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{subtitle}</span>
      )}
    </div>
  );
};
