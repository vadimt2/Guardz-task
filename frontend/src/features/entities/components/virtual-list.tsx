'use client';

import { useEffect, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { LuChevronUp } from 'react-icons/lu';

const ROW_HEIGHT = 116;
const OVERSCAN = 5;

type VirtualListProps<T> = {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  getKey: (item: T) => string;
  height?: number;
  isStale?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
};

export function VirtualList<T>({
  items,
  renderItem,
  getKey,
  height = 500,
  isStale,
  hasMore,
  onLoadMore,
  isLoadingMore,
}: VirtualListProps<T>) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: OVERSCAN,
  });

  const virtualItems = virtualizer.getVirtualItems();

  useEffect(() => {
    if (!onLoadMore || !hasMore || isLoadingMore) {
      return;
    }

    const lastItem = virtualItems[virtualItems.length - 1];

    if (lastItem && lastItem.index >= items.length - 5) {
      onLoadMore();
    }
  }, [virtualItems, hasMore, isLoadingMore, items.length, onLoadMore]);

  const scrollToTop = () => scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="relative group">
      <ScrollArea.Root
        className={`rounded-xl ${isStale ? 'opacity-60' : ''}`}
        style={{ height }}
        type="always"
      >
        <ScrollArea.Viewport ref={scrollRef} className="h-full w-full">
          <div
            className="relative w-full"
            style={{ height: virtualizer.getTotalSize() }}
          >
            {virtualItems.map((virtualRow) => {
              const item = items[virtualRow.index];
              return (
                <div
                  key={getKey(item)}
                  className="absolute top-0 left-0 w-full pb-3 pr-3"
                  style={{
                    height: virtualRow.size,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  {renderItem(item)}
                </div>
              );
            })}
          </div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar
          orientation="vertical"
          className="flex select-none touch-none p-0.5 bg-zinc-100/80 hover:bg-zinc-200 w-2.5 rounded-full"
          forceMount
        >
          <ScrollArea.Thumb className="flex-1 bg-zinc-400 rounded-full relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-11 before:min-h-11" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>

      {isLoadingMore && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white/90 border border-zinc-200 px-3 py-1 text-xs text-zinc-600 shadow-sm">
          Loading more...
        </div>
      )}

      <button
        onClick={scrollToTop}
        className="absolute bottom-4 right-4 p-2 bg-zinc-900 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-zinc-800"
        aria-label="Scroll to top"
      >
        <LuChevronUp className="w-5 h-5" />
      </button>
    </div>
  );
}
