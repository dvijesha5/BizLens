import React from 'react';

interface BrandLogoProps {
  compact?: boolean;
  light?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ compact = false, light = false }) => (
  <span className={`brand-lockup ${compact ? 'brand-lockup-compact' : ''} ${light ? 'brand-lockup-light' : ''}`} aria-label="BizLens">
    <span className="brand-logo-mark" aria-hidden="true">
      <span className="brand-logo-letter">B</span>
      <span className="brand-logo-lens" />
    </span>
    {!compact && <span className="brand-logo-name">BizLens</span>}
  </span>
);
