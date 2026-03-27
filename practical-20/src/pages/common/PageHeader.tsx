import React from 'react';

export const PageHeader: React.FC<{
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}> = ({ title, subtitle, actions }) => {
  return (
    <div className="mb-8">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">{title}</h1>
          {subtitle ? <p className="mt-2 text-sm text-white/60 leading-relaxed">{subtitle}</p> : null}
        </div>
        {actions && (
          <div className="flex items-center space-x-3">
            {actions}
          </div>
        )}
      </div>
      
      {subtitle && (
        <div className="mt-4 w-full h-px bg-gradient-to-r from-transparent via-teal-400/40 to-transparent" />
      )}
    </div>
  );
};
