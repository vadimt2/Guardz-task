import type { EntityResponse } from '../types';

type EntityCardProps = {
  entity: EntityResponse;
  highlight?: string;
};

export function EntityCard({ entity, highlight }: EntityCardProps) {
  return (
    <div className="flex flex-col justify-between h-full p-4 bg-white rounded-xl border border-zinc-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
      <h3 className="text-base font-semibold text-zinc-900">
        <Highlight text={entity.something} term={highlight} />
      </h3>
      <div className="mt-3 space-y-1 text-xs text-zinc-500">
        <p className="font-mono">
          <Highlight text={entity.id} term={highlight} />
        </p>
        <p>{new Date(entity.createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
}

export function EntityCardSkeleton() {
  return (
    <div className="flex flex-col justify-between h-full p-4 bg-white rounded-xl border border-zinc-200 shadow-sm">
      <div className="h-5 w-3/4 bg-zinc-200 rounded animate-pulse" />
      <div className="mt-3 space-y-1">
        <div className="h-3 w-20 bg-zinc-200 rounded animate-pulse" />
        <div className="h-3 w-32 bg-zinc-200 rounded animate-pulse" />
      </div>
    </div>
  );
}

function Highlight({ text, term }: { text: string; term?: string }) {
  if (!term) return <>{text}</>;

  const parts = text.split(new RegExp(`(${term})`, 'gi'));

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === term.toLowerCase() ? (
          <mark key={i} className="bg-yellow-200">{part}</mark>
        ) : (
          part
        )
      )}
    </>
  );
}
