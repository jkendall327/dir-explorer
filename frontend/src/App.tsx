import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { http } from './lib/http'

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

  return (
    <div style={{ padding: 24, fontFamily: 'system-ui' }}>
      <h1>React ↔ Rust (REST)</h1>
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
