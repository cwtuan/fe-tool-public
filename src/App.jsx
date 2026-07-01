import { useState, useId, useTransition, use, Suspense, useMemo } from 'react'
import './App.css'

function DataFetcher({ query }) {
  const dataPromise = useMemo(
    () => new Promise(resolve =>
      setTimeout(() =>
        resolve(`Result for "${query}" — ${new Date().toLocaleTimeString()}`),
        1000
      )
    ),
    [query]
  )
  const data = use(dataPromise)
  return <p>{data}</p>
}

function App() {
  const [count, setCount] = useState(0)
  const [query, setQuery] = useState('')
  const [isPending, startTransition] = useTransition()
  const id = useId()
  const [fetchKey, setFetchKey] = useState(0)

  const items = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape']
  const filtered = items.filter(i => i.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="App">
      <h1>React 19 Demo</h1>

      <label htmlFor={id}>Search: </label>
      <input
        id={id}
        value={query}
        onChange={e => startTransition(() => setQuery(e.target.value))}
      />

      {isPending ? <p>Filtering...</p> : (
        <ul>{filtered.map(i => <li key={i}>{i}</li>)}</ul>
      )}

      <p>
        Count: {count}
        <button onClick={() => setCount(c => c + 1)}>+</button>
      </p>

      <button onClick={() => startTransition(() => setFetchKey(k => k + 1))}>
        Fetch with use()
      </button>

      <Suspense fallback={<p>Loading data...</p>}>
        <DataFetcher key={fetchKey} query={query || 'default'} />
      </Suspense>
    </div>
  )
}

export default App
