import {
  useState,
  useId,
  useEffect,
  useTransition,
  useActionState,
  useOptimistic,
  use
} from 'react'
import './App.css'

function ResourceDisplay({ dataPromise }) {
  const data = use(dataPromise)
  return <p>Loaded: {data}</p>
}

function createResource(value) {
  return new Promise((resolve) =>
    setTimeout(
      () => resolve(`Data for "${value}" fetched at ${new Date().toLocaleTimeString()}`),
      500
    )
  )
}

let nextId = 0

async function submitName(_previousState, formData) {
  const name = formData.get('name')
  await new Promise(resolve => setTimeout(resolve, 700))
  if (!name) {
    return { error: 'Name is required', entry: null }
  }
  return { error: null, entry: { id: nextId++, label: `Hello, ${name}!` } }
}

function OptimisticForm() {
  const [state, formAction, isPending] = useActionState(submitName, {
    error: null,
    entry: null
  })
  const [entries, setEntries] = useState([])
  const [optimisticEntries, addOptimisticEntry] = useOptimistic(
    entries,
    (current, label) => [...current, { id: `optimistic-${label}`, label }]
  )

  useEffect(() => {
    if (state.entry) {
      setEntries(current => [...current, state.entry])
    }
  }, [state])

  const handleSubmit = formData => {
    const name = formData.get('name')
    if (name) {
      addOptimisticEntry(name)
    }
    formAction(formData)
  }

  const handleReset = () => setEntries([])

  return (
    <section>
      <h2>useActionState + useOptimistic</h2>
      <form action={handleSubmit}>
        <input type="text" name="name" placeholder="Your name..." />
        <button type="submit" disabled={isPending}>
          {isPending ? 'Greeting...' : 'Greet'}
        </button>
        <button type="button" onClick={handleReset}>
          Clear
        </button>
      </form>
      {state.error && <p style={{ color: 'crimson' }}>{state.error}</p>}
      <ul>
        {optimisticEntries.map(entry => (
          <li key={entry.id}>{entry.label}</li>
        ))}
      </ul>
    </section>
  )
}

function App() {
  const [query, setQuery] = useState('')
  const [isPending, startTransition] = useTransition()
  const id = useId()
  const [dataPromise, setDataPromise] = useState(null)

  const items = Array.from({ length: 1000 }, (_, i) => `Item ${i + 1}`)

  const filteredItems = items.filter(item =>
    item.toLowerCase().includes(query.toLowerCase())
  )

  const handleChange = (e) => {
    startTransition(() => {
      setQuery(e.target.value)
    })
  }

  const handleFetch = () => {
    setDataPromise(createResource(query || 'default'))
  }

  return (
    <div className="App">
      <h1>React 19 Features Demo</h1>
      <div>
        <label htmlFor={id}>Search items: </label>
        <input
          id={id}
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Type to filter..."
        />
        <button onClick={handleFetch} style={{ marginLeft: '10px' }}>
          Fetch Data
        </button>
        <label htmlFor={`${id}-checkbox`} style={{ marginLeft: '20px' }}>
          <input id={`${id}-checkbox`} type="checkbox" />
          Option {id}
        </label>
      </div>
      {isPending ? (
        <p>Loading...</p>
      ) : (
        <ul style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {filteredItems.slice(0, 50).map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}
      <p>Total matches: {filteredItems.length}</p>
      {dataPromise && <ResourceDisplay dataPromise={dataPromise} />}
      <OptimisticForm />
    </div>
  )
}

export default App