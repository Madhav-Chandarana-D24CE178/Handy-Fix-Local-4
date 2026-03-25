import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  subtitle: string;
  ctaLabel?: string;
  onCta?: () => void;
}

export const EmptyState = ({ icon, title, subtitle, ctaLabel, onCta }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-[60px] px-5 text-center">
      {icon || (
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      )}
      <h3 className="font-heading font-extrabold text-[20px] text-foreground mb-2">{title}</h3>
      <p className="text-[13px] text-muted-foreground max-w-xs mb-6">{subtitle}</p>
      {ctaLabel && onCta && (
        <button 
          onClick={onCta}
          className="bg-primary text-primary-foreground font-heading font-bold py-3 px-6 rounded-full hover:opacity-90 transition-opacity"
        >
          {ctaLabel}
        </button>
      )}
    </div>
  )
}
