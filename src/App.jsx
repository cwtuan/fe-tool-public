import { useState, useId, useTransition, use } from 'react'
import './App.css'

function ResourceDisplay({ resource }) {
  const data = use(resource)
  return <p>Loaded: {data}</p>
}

function createResource(value) {
  let status = 'pending'
  let result
  const promise = new Promise((resolve) =>
    setTimeout(() => {
      status = 'success'
      result = `Data for "${value}" fetched at ${new Date().toLocaleTimeString()}`
      resolve()
    }, 500)
  )
  return {
    read() {
      if (status === 'pending') throw promise
      if (status === 'success') return result
    }
  }
}

function App() {
  const [query, setQuery] = useState('')
  const [isPending, startTransition] = useTransition()
  const id = useId()
  const [resource, setResource] = useState(null)

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
    startTransition(() => {
      setResource(createResource(query || 'default'))
    })
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
      {resource && <ResourceDisplay resource={resource} />}
    </div>
  )
}

export default App