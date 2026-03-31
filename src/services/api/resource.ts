import { apiClient } from './client'

export interface ResourceService<TItem, TCreate, TUpdate, TFilter extends Record<string, string | number | undefined>> {
  list: (filters?: TFilter) => Promise<TItem[]>
  create: (payload: TCreate) => Promise<TItem>
  update: (payload: TUpdate) => Promise<TItem>
  remove: (payload: Partial<TUpdate>) => Promise<TItem>
}

type InputObject = Record<string, string | number | boolean | undefined>

export function createResourceService<TItem, TCreate extends InputObject, TUpdate extends InputObject, TFilter extends Record<string, string | number | undefined> = Record<string, string | number | undefined>>(
  resource: string,
): ResourceService<TItem, TCreate, TUpdate, TFilter> {
  return {
    list: (filters) => apiClient.get<TItem[]>(resource, 'list', filters),
    create: (payload) => apiClient.post<TItem>(resource, 'create', payload),
    update: (payload) => apiClient.post<TItem>(resource, 'update', payload),
    remove: (payload) => apiClient.post<TItem>(resource, 'delete', payload),
  }
}
