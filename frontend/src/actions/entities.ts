"use server";

import { revalidateTag, updateTag } from 'next/cache';
import { redirect } from 'next/navigation';

import { createEntity, getEntitiesPaginated } from '@/lib/entities';
import { CreateEntityRequest, PaginatedEntitiesResponse } from '@/types/entities';
import type { SortOption } from '@/features/entities/types';

type ActionState = {
  message?: string;
  error?: string;
};

export async function createEntityAction(
  search: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const something = (formData.get('something') as string | null)?.trim() || '';

  if (!something) {
    return { error: 'Please enter a value.' };
  }

  const payload: CreateEntityRequest = { something };

  try {
    await createEntity(payload);
    updateTag('entities');
    revalidateTag('entities', 'default');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create entity';
    return { error: message };
  }

  const params = new URLSearchParams();
  if (search) params.set('search', search);
  const query = params.toString();
  redirect(query ? `/?${query}` : '/');
}

export async function fetchEntitiesAction(params: {
  offset?: number;
  limit?: number;
  order?: SortOption;
  search?: string;
}): Promise<PaginatedEntitiesResponse> {
  return getEntitiesPaginated(params);
}
