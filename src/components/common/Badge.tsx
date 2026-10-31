import React from 'react';

interface BadgeProps {
  status: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, className = '' }) => {
  let colorStyles = 'bg-slate-100 text-slate-700 border-slate-300';

  const normalized = status.toLowerCase();

  if (normalized === 'available' || normalized === 'active' || normalized === 'passed' || normalized === 'running') {
    colorStyles = 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
  } else if (normalized === 'failed' || normalized === 'terminated' || normalized === 'stopped') {
    colorStyles = 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800';
  } else if (normalized === 'creating' || normalized === 'pending acceptance' || normalized === 'pending') {
    colorStyles = 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
  } else if (normalized === 'not created' || normalized === 'not started') {
    colorStyles = 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
  } else if (normalized === 'deleted') {
    colorStyles = 'bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700';
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorStyles} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-80" />
      {status}
    </span>
  );
};
