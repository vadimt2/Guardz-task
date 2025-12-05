import { CreateEntityRequest, EntityResponse, PaginatedEntitiesResponse } from '@/types/entities';

const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!NEXT_PUBLIC_API_BASE_URL) {
  throw new Error('API_BASE_URL is not defined');
}

const ENTITIES_ENDPOINT = `${NEXT_PUBLIC_API_BASE_URL}/entities`;
const PAGINATED_ENTITIES_ENDPOINT = `${ENTITIES_ENDPOINT}/paginated`;

type ApiError = {
  message?: string;
  errors?: string[];
};

async function parseOrThrow(response: Response) {
  const errorBody = (await response.json().catch(() => ({}))) as ApiError;
  const message =
    errorBody.message || response.statusText || 'Unexpected server error';
  const validation = errorBody.errors?.join(', ');
  throw new Error(validation ? `${message}: ${validation}` : message);
}

type PaginatedQuery = {
  offset?: number;
  limit?: number;
  order?: 'newest' | 'oldest';
  search?: string;
};

export async function getEntitiesPaginated(
  params: PaginatedQuery = {},
): Promise<PaginatedEntitiesResponse> {
  const url = new URL(PAGINATED_ENTITIES_ENDPOINT);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  const response = await fetch(url.toString(), {
    method: 'GET',
    next: { tags: ['entities'] },
  });

  if (!response.ok) {
    await parseOrThrow(response);
  }

  return response.json() as Promise<PaginatedEntitiesResponse>;
}

export async function getEntities(): Promise<EntityResponse[]> {
  const response = await fetch(ENTITIES_ENDPOINT, {
    method: 'GET',
    next: { tags: ['entities'] },
  });

  if (!response.ok) {
    await parseOrThrow(response);
  }

  return response.json() as Promise<EntityResponse[]>;
}

export async function createEntity(
  data: CreateEntityRequest
): Promise<EntityResponse> {
  const response = await fetch(ENTITIES_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    await parseOrThrow(response);
  }

  return response.json() as Promise<EntityResponse>;
}
