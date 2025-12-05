import type { ReactNode } from 'react';

type EmptyStateProps = {
  icon: ReactNode;
  title: string;
  subtitle: string;
  action?: ReactNode;
};

export function EmptyState({ icon, title, subtitle, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 rounded-2xl border border-dashed border-zinc-200 bg-white/60 text-center">
      <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mb-3 text-zinc-400 text-2xl">
        {icon}
      </div>
      <p className="text-sm font-medium text-zinc-700">{title}</p>
      <p className="text-xs text-zinc-500 mt-1">{subtitle}</p>
      {action}
    </div>
  );
}
