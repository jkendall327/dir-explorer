import { useQuery } from '@tanstack/react-query'
import { API_BASE } from './lib/http'

export default function App() {
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
    </div>
  )
}
