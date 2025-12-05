'use client';

import { LuSearch, LuLoader } from 'react-icons/lu';
import type { SortOption } from '../types';

type SearchControlsProps = {
  search: string;
  sort: SortOption;
  isPending: boolean;
  onSearchChange: (value: string) => void;
  onSortChange: (value: SortOption) => void;
};

export function SearchControls({
  search,
  sort,
  isPending,
  onSearchChange,
  onSortChange,
}: SearchControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1 sm:max-w-xs">
        <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          type="search"
          defaultValue={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search..."
          className="w-full h-10 pl-9 pr-9 rounded-lg border border-zinc-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-200"
        />
        {isPending && (
          <LuLoader className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 animate-spin" />
        )}
      </div>
      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        className="h-10 px-3 rounded-lg border border-zinc-200 bg-white text-sm"
      >
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
      </select>
    </div>
  );
}
