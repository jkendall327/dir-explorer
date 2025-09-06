import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { http, API_BASE } from './lib/http'

type Item = { id: number; name: string }

export default function App() {
  const qc = useQueryClient()
  const items = useQuery({
    queryKey: ['items'],
    queryFn: () => http<Item[]>('/items'),
  })

  const addItem = useMutation({
    mutationFn: (name: string) =>
      http<Item>('/items', { method: 'POST', body: JSON.stringify({ name }) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['items'] }),
  })

  const health = useQuery({
    queryKey: ['health'],
    queryFn: () =>
      fetch(`${API_BASE}/health`).then(res => {
        if (!res.ok) throw new Error('unhealthy')
        return res.text()
      }),
    refetchInterval: 5000,
    retry: false,
  })

  return (
    <div style={{ padding: 24, fontFamily: 'system-ui' }}>
      <h1>React ↔ Rust (REST)</h1>
      {health.isLoading ? (
        <p>Checking backend…</p>
      ) : (
        <p style={{ color: health.isError ? 'red' : 'green' }}>
          {health.isError ? 'Backend unhealthy' : 'Backend healthy'}
        </p>
      )}
      <button
        onClick={() => addItem.mutate(`Item ${Date.now()}`)}
        disabled={addItem.isPending}
      >
        Add Item
      </button>

      {items.isLoading && <p>Loading…</p>}
      {items.error && <p>Error: {(items.error as Error).message}</p>}
      <ul>
        {items.data?.map(i => <li key={i.id}>{i.name}</li>)}
      </ul>
    </div>
  )
}
