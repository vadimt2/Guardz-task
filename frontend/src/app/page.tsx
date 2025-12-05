import { EntityList } from '@/features/entities/entity-list';
import { getEntitiesPaginated } from '@/lib/entities';
import type { PaginatedEntitiesResponse, SortOption } from '@/features/entities/types';
import { EntityForm } from '@/features/entities/entity-form';

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Home({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;

  let initialPage: PaginatedEntitiesResponse = {
    items: [],
    hasMore: false,
    nextOffset: null,
  };
  let loadError: string | null = null;

  const rawSort = Array.isArray(resolvedSearchParams?.sort) ? resolvedSearchParams?.sort[0] : resolvedSearchParams?.sort;
  const rawSearch = Array.isArray(resolvedSearchParams?.search) ? resolvedSearchParams?.search[0] : resolvedSearchParams?.search;

  const sort: SortOption = rawSort === 'oldest' ? 'oldest' : 'newest';
  const search = rawSearch || '';

  try {
    initialPage = await getEntitiesPaginated({
      order: sort,
      search: search || undefined,
    });
  } catch (error) {
    loadError = error instanceof Error ? error.message : 'Failed to load entities';
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-50 via-white to-zinc-100 text-zinc-900">
      <main className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-14">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Entities</p>
          <h1 className="text-3xl font-semibold leading-tight text-zinc-900">Submit and review entities</h1>
          <p className="max-w-2xl text-sm text-zinc-600">
            Send data to the NestJS backend and see the latest submissions.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <div className="flex items-center">
              <h2 className="text-lg font-semibold text-zinc-900">Latest submissions</h2>
            </div>
            {loadError ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                {loadError}
              </div>
            ) : (
              <EntityList initialPage={initialPage} />
            )}
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-zinc-900">Create entity</h2>
            <EntityForm />
          </div>
        </section>
      </main>
    </div>
  );
}
