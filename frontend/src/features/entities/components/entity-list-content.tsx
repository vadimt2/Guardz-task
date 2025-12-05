'use client';

import { LuSearch, LuInbox } from 'react-icons/lu';
import type { EntityResponse } from '../types';
import { EntityCard, EntityCardSkeleton } from './entity-card';
import { VirtualList } from './virtual-list';
import { EmptyState } from './empty-state';

type EntityListContentProps = {
  items: EntityResponse[];
  search: string;
  isPending: boolean;
  isStale: boolean;
  hasMore: boolean;
  optimisticSearch: string;
  onClearSearch: () => void;
  onLoadMore: () => void;
};

export function EntityListContent({
  items,
  search,
  isPending,
  isStale,
  hasMore,
  optimisticSearch,
  onClearSearch,
  onLoadMore,
}: EntityListContentProps) {
  if (isPending && items.length === 0) {
    return (
      <div className="pt-2">
        <EntityListSkeleton />
      </div>
    );
  }

  if (items.length === 0) {
    return search ? (
      <EmptyState
        icon={<LuSearch />}
        title="No results"
        subtitle={`Nothing matches "${search}"`}
        action={
          <button
            onClick={onClearSearch}
            className="mt-3 px-4 py-2 bg-zinc-900 text-white text-sm rounded-lg"
          >
            Clear
          </button>
        }
      />
    ) : (
      <EmptyState
        icon={<LuInbox />}
        title="No entities yet"
        subtitle="Submit one to get started"
      />
    );
  }

  return (
    <VirtualList
      items={items}
      getKey={(entity) => entity.id}
      renderItem={(entity) => (
        <EntityCard entity={entity} highlight={optimisticSearch} />
      )}
      isStale={isStale}
      hasMore={hasMore}
      onLoadMore={onLoadMore}
      isLoadingMore={isPending}
    />
  );
}

export function EntityListSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <div className="h-10 flex-1 sm:max-w-xs bg-zinc-200 rounded-lg animate-pulse" />
        <div className="h-10 w-28 bg-zinc-200 rounded-lg animate-pulse" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 4 }, (_, i) => (
          <EntityCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
