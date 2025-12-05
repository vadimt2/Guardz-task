'use client';

import type { PaginatedEntitiesResponse } from './types';
import { useEntities, useEntityFilters } from './hooks';
import {
  SearchControls,
  ResultsCount,
  ErrorBanner,
  EntityListContent,
} from './components';

type EntityListProps = {
  initialPage: PaginatedEntitiesResponse;
};

export function EntityList({ initialPage }: EntityListProps) {
  const filters = useEntityFilters();
  const entities = useEntities(initialPage);

  const handleSearchChange = (value: string) => {
    filters.setSearch(value);
    entities.refresh(filters.sort, value || undefined);
  };

  const handleSortChange = (value: typeof filters.sort) => {
    filters.setSort(value);
    entities.refresh(value, filters.search || undefined);
  };

  const handleClearSearch = () => {
    filters.clearSearch();
    entities.refresh(filters.sort);
  };

  return (
    <div className="space-y-3">
      <SearchControls
        search={filters.search}
        sort={filters.sort}
        isPending={entities.isPending}
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
      />

      <ResultsCount
        count={entities.displayItems.length}
        search={filters.search}
        hasMore={entities.displayHasMore}
      />

      {entities.state.error && <ErrorBanner message={entities.state.error} />}

      <EntityListContent
        items={entities.displayItems}
        search={filters.search}
        isPending={entities.isPending}
        isStale={filters.isSearchStale || entities.isPending}
        hasMore={entities.displayHasMore}
        optimisticSearch={filters.optimisticSearch}
        onClearSearch={handleClearSearch}
        onLoadMore={() => entities.loadMore(filters.sort, filters.search || undefined)}
      />
    </div>
  );
}

export { EntityListSkeleton } from './components';
