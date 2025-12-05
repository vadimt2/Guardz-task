import { PaginatedResponse } from "./pagination";

export interface CreateEntityRequest {
  something: string;
}

export interface EntityResponse {
  id: string;
  something: string;
  createdAt: string;
  updatedAt: string;
}

export type PaginatedEntitiesResponse = PaginatedResponse<EntityResponse>;
