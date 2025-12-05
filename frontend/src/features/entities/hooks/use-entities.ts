'use client';

import { startTransition, useActionState } from 'react';
import { fetchEntitiesAction } from '@/actions/entities';
import type { EntityResponse, PaginatedEntitiesResponse, SortOption } from '../types';

const PAGE_SIZE = 20;

export type EntitiesState = {
  items: EntityResponse[];
  hasMore: boolean;
  nextOffset: number | null;
  error: string | null;
  fetchedOffsets: Set<number>;
};

type EntitiesAction =
  | { type: 'refresh'; order: SortOption; search?: string }
  | { type: 'loadMore'; order: SortOption; search?: string };

async function entitiesReducer(
  state: EntitiesState,
  action: EntitiesAction
): Promise<EntitiesState> {
  const { type, order, search } = action;
  const offset = type === 'loadMore' ? (state.nextOffset ?? 0) : 0;

  if (type === 'loadMore' && state.fetchedOffsets.has(offset)) {
    return state;
  }

  try {
    const page = await fetchEntitiesAction({
      offset,
      limit: PAGE_SIZE,
      order,
      search: search || undefined,
    });

    if (type === 'loadMore') {
      const existing = new Set(state.items.map((e) => e.id));
      const merged = [...state.items, ...page.items.filter((item) => !existing.has(item.id))];
      return {
        items: merged,
        hasMore: page.hasMore,
        nextOffset: page.nextOffset,
        error: null,
        fetchedOffsets: new Set([...state.fetchedOffsets, offset]),
      };
    }

    return {
      items: page.items,
      hasMore: page.hasMore,
      nextOffset: page.nextOffset,
      error: null,
      fetchedOffsets: new Set([0]),
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load entities';
    if (type === 'loadMore') {
      return { ...state, error: message };
    }
    return {
      items: [],
      hasMore: false,
      nextOffset: null,
      error: message,
      fetchedOffsets: new Set([0]),
    };
  }
}

export function useEntities(initialPage: PaginatedEntitiesResponse) {
  const initialState: EntitiesState = {
    items: initialPage.items,
    hasMore: initialPage.hasMore,
    nextOffset: initialPage.nextOffset,
    error: null,
    fetchedOffsets: new Set([0]),
  };

  const [state, dispatch, isPending] = useActionState(entitiesReducer, initialState);

  const refresh = (order: SortOption, search?: string) => {
    startTransition(() => {
      dispatch({ type: 'refresh', order, search });
    });
  };

  const loadMore = (order: SortOption, search?: string) => {
    if (!state.hasMore || isPending || state.nextOffset === null) {
      return;
    }
    startTransition(() => {
      dispatch({ type: 'loadMore', order, search });
    });
  };

  return {
    state,
    isPending,
    refresh,
    loadMore,
    displayItems: state.items.length > 0 ? state.items : initialPage.items,
    displayHasMore: state.items.length > 0 ? state.hasMore : initialPage.hasMore,
  };
}
