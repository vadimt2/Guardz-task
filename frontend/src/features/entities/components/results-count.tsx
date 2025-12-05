type ResultsCountProps = {
  count: number;
  search: string;
  hasMore: boolean;
};

export function ResultsCount({ count, search, hasMore }: ResultsCountProps) {
  if (search) {
    return (
      <p className="text-xs text-zinc-500">
        {count} results for "{search}"
      </p>
    );
  }

  return (
    <p className="text-xs text-zinc-500">
      Showing {count}{hasMore ? '+' : ''} entities
    </p>
  );
}
