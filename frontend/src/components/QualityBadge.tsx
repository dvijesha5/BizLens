import React from 'react';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

interface QualityBadgeProps {
  score: number;
}

export const QualityBadge: React.FC<QualityBadgeProps> = ({ score }) => {
  let badgeClass = 'badge-emerald';
  let Icon = ShieldCheck;

  if (score < 80) {
    badgeClass = 'badge-rose';
    Icon = AlertTriangle;
  } else if (score < 95) {
    badgeClass = 'badge-amber';
  }

  return (
    <span className={`badge ${badgeClass}`}>
      <Icon size={14} />
      Quality Score: {score}%
    </span>
  );
};
