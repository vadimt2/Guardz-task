'use client';

import { startTransition, useOptimistic } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { SortOption } from '../types';

export function useEntityFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get('search') || '';
  const sort = (searchParams.get('sort') as SortOption) || 'newest';

  const [optimisticSearch, setOptimisticSearch] = useOptimistic(search);

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    value ? params.set(key, value) : params.delete(key);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const setSearch = (value: string) => {
    startTransition(() => {
      setOptimisticSearch(value);
      updateParam('search', value || null);
    });
  };

  const setSort = (value: SortOption) => {
    updateParam('sort', value === 'newest' ? null : value);
  };

  const clearSearch = () => {
    updateParam('search', null);
  };

  return {
    search,
    sort,
    optimisticSearch,
    setSearch,
    setSort,
    clearSearch,
    isSearchStale: optimisticSearch !== search,
  };
}
