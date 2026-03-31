import { useCallback, useEffect, useState } from 'react'

interface ResourceService<TItem, TCreate, TUpdate, TFilter extends Record<string, string | number | undefined>> {
  list: (filters?: TFilter) => Promise<TItem[]>
  create: (payload: TCreate) => Promise<TItem>
  update: (payload: TUpdate) => Promise<TItem>
}

export function useResource<TItem, TCreate, TUpdate, TFilter extends Record<string, string | number | undefined> = Record<string, string | number | undefined>>(
  service: ResourceService<TItem, TCreate, TUpdate, TFilter>,
  initialFilter?: TFilter,
) {
  const [items, setItems] = useState<TItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  const refresh = useCallback(
    async (filters?: TFilter) => {
      setLoading(true)
      setError('')
      try {
        const data = await service.list(filters ?? initialFilter)
        setItems(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Gagal memuat data')
      } finally {
        setLoading(false)
      }
    },
    [service, initialFilter],
  )

  const create = useCallback(
    async (payload: TCreate) => {
      await service.create(payload)
      await refresh()
    },
    [service, refresh],
  )

  const update = useCallback(
    async (payload: TUpdate) => {
      await service.update(payload)
      await refresh()
    },
    [service, refresh],
  )

  useEffect(() => {
    void refresh(initialFilter)
  }, [initialFilter, refresh])

  return { items, loading, error, refresh, create, update }
}
